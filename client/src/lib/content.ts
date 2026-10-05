import { supabase, isSupabaseConfigured } from './supabase'

// ─── 콘텐츠 동기화 레이어 ─────────────────────────────────────
// 우선순위: Supabase(설정 시) > localStorage(직접 수정분) > mock 기본값
//
// - 데이터 모듈(*.ts)은 모듈 로드 시 readOverride()로 병합된 값을 export.
// - Admin 페이지 저장은 localStorage에 쓰고, Supabase 설정 시 함께 upsert.
// - App.vue 마운트 시 refreshFromSupabase()로 클라우드 값을 내려받아 반영.

const PREFIX = 'pp:content:'

export const CONTENT_KEYS = [
  'projects',
  'stackGroups',
  'timeline',
  'siteConfig',
  'summaryStats',
  'interests',
  'valuesQuote',
  'demoDetections',
  'demoAlerts',
  'demoHourlyCounts',
] as const

export type ContentKey = (typeof CONTENT_KEYS)[number]

function storage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    return null
  }
}

export function readOverride<T>(key: ContentKey, fallback: T): T {
  const s = storage()
  if (!s) return fallback
  try {
    const raw = s.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeOverride(key: ContentKey, value: unknown): void {
  storage()?.setItem(PREFIX + key, JSON.stringify(value))
}

export function clearOverride(key: ContentKey): void {
  storage()?.removeItem(PREFIX + key)
}

export function clearAllOverrides(): void {
  const s = storage()
  if (!s) return
  CONTENT_KEYS.forEach((k) => s.removeItem(PREFIX + k))
}

/** Supabase → localStorage로 내려받기. 변경이 있었으면 true */
export async function pullFromSupabase(): Promise<{ ok: boolean; changed: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, changed: false, message: 'Supabase 미설정 — .env의 VITE_SUPABASE_URL/KEY를 확인하세요.' }
  }
  try {
    const { data, error } = await supabase.from('content_blocks').select('key, data')
    if (error) throw error
    let changed = false
    for (const row of data ?? []) {
      const key = row.key as ContentKey
      if (!CONTENT_KEYS.includes(key)) continue
      const next = JSON.stringify(row.data)
      if (storage()?.getItem(PREFIX + key) !== next) {
        storage()?.setItem(PREFIX + key, next)
        changed = true
      }
    }
    return { ok: true, changed, message: changed ? 'Supabase에서 최신 데이터를 내려받았습니다.' : '이미 최신 상태입니다.' }
  } catch (e) {
    return { ok: false, changed: false, message: `불러오기 실패: ${(e as Error).message}` }
  }
}

/** 현재 effective 데이터를 Supabase에 업로드 */
export async function pushToSupabase(snapshot: Record<ContentKey, unknown>): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: 'Supabase 미설정 — 로컬(localStorage)에만 저장됩니다.' }
  }
  try {
    const rows = CONTENT_KEYS.map((k) => ({ key: k, data: snapshot[k] as object }))
    const { error } = await supabase.from('content_blocks').upsert(rows, { onConflict: 'key' })
    if (error) throw error
    return { ok: true, message: 'Supabase에 저장했습니다.' }
  } catch (e) {
    return { ok: false, message: `Supabase 저장 실패: ${(e as Error).message}` }
  }
}
