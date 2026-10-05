import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Project, StackGroup, TimelineItem } from '@/types/project'
import type { DemoDetection, DemoAlert } from '@/data/demo'
// 초기값 = 기존 effective 데이터 (localStorage 수정분 병합済)
import { projects as effProjects } from '@/data/projects'
import { stackGroups as effStacks } from '@/data/stacks'
import { timeline as effTimeline } from '@/data/timeline'
import {
  siteConfig as effSite, summaryStats as effStats,
  interests as effInterests, valuesQuote as effQuote,
} from '@/data/profile'
import {
  demoDetections as effDets, demoAlerts as effAlerts,
  demoHourlyCounts as effHourly,
} from '@/data/demo'

export interface PortfolioBlocks {
  projects: Project[]
  stackGroups: StackGroup[]
  timeline: TimelineItem[]
  siteConfig: typeof effSite
  summaryStats: typeof effStats
  interests: typeof effInterests
  valuesQuote: typeof effQuote
  demoDetections: DemoDetection[]
  demoAlerts: DemoAlert[]
  demoHourlyCounts: number[]
}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

function defaultBlocks(): PortfolioBlocks {
  return {
    projects: clone(effProjects),
    stackGroups: clone(effStacks),
    timeline: clone(effTimeline),
    siteConfig: clone(effSite),
    summaryStats: clone(effStats),
    interests: clone(effInterests),
    valuesQuote: clone(effQuote),
    demoDetections: clone(effDets),
    demoAlerts: clone(effAlerts),
    demoHourlyCounts: clone(effHourly),
  }
}

/** 행 data(JSON)를 현재 블록 구조에 안전 병합 (키 누락 대비) */
function mergeBlocks(data: Record<string, unknown> | null | undefined): PortfolioBlocks {
  const base = defaultBlocks()
  if (!data) return base
  const out = { ...base } as PortfolioBlocks
  for (const k of Object.keys(base) as (keyof PortfolioBlocks)[]) {
    if (data[k] !== undefined) (out as unknown as Record<string, unknown>)[k] = data[k]
  }
  return out
}

export const ownerUsername = (import.meta.env.VITE_OWNER_USERNAME as string | undefined) || ''

export const usePortfolioStore = defineStore('portfolio', () => {
  const blocks = ref<PortfolioBlocks>(defaultBlocks())
  const homeCache = clone(blocks.value) // 루트 기본 스냅샷 (localStorage 병합済)
  const mode = ref<'owner' | 'user'>('owner')
  const username = ref<string>('') // user 모드일 때 대상
  const userFound = ref(true)
  const loading = ref(false)
  const loadedKey = ref('') // 'owner' | 'user:<name>' | 'mine' — 현재 blocks 주인이 누구인지

  /** 루트(/) 사이트용: 주인 행이 있으면 그것을, 없으면 기본 스냅샷으로 복원 */
  async function ensureOwner() {
    if (loadedKey.value === 'owner') return
    loadedKey.value = 'owner'
    mode.value = 'owner'
    if (!isSupabaseConfigured || !supabase || !ownerUsername) {
      blocks.value = clone(homeCache)
      return
    }
    try {
      const { data } = await supabase
        .from('portfolios')
        .select('data')
        .eq('username', ownerUsername.toLowerCase())
        .maybeSingle()
      blocks.value = data?.data
        ? mergeBlocks(data.data as Record<string, unknown>)
        : clone(homeCache)
    } catch {
      blocks.value = clone(homeCache)
    }
  }

  /** /u/:username 용 */
  async function loadUser(name: string) {
    const uname = name.toLowerCase()
    mode.value = 'user'
    username.value = uname
    if (loadedKey.value === `user:${uname}`) return
    if (!isSupabaseConfigured || !supabase) {
      // Supabase 미설정: 주인과 같은 사람으로 간주하고 기본값 표시
      userFound.value = true
      loadedKey.value = `user:${uname}`
      return
    }
    loading.value = true
    try {
      const { data } = await supabase
        .from('portfolios')
        .select('data')
        .eq('username', uname)
        .maybeSingle()
      if (data?.data) {
        blocks.value = mergeBlocks(data.data as Record<string, unknown>)
        userFound.value = true
      } else {
        userFound.value = false
      }
      loadedKey.value = `user:${uname}`
    } catch {
      userFound.value = false
    } finally {
      loading.value = false
    }
  }

  /** Admin에서 내 행을 에디터에 올렸을 때 — 이탈 시 주인 데이터로 복원되게 표시 */
  function markCustom() {
    loadedKey.value = 'mine'
  }

  /** 내 행 저장 (Admin) */
  async function saveMine(userId: string, uname: string, displayName: string): Promise<{ ok: boolean; message: string }> {
    if (!isSupabaseConfigured || !supabase) return { ok: false, message: 'Supabase 미설정' }
    const { error } = await supabase.from('portfolios').upsert(
      {
        user_id: userId,
        username: uname.toLowerCase(),
        display_name: displayName,
        data: JSON.parse(JSON.stringify(blocks.value)),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    if (error) return { ok: false, message: `저장 실패: ${error.message}` }
    return { ok: true, message: `/${uname} 에 저장했습니다.` }
  }

  function projectBySlug(slug: string): Project | undefined {
    return blocks.value.projects.find((p) => p.slug === slug)
  }

  return {
    blocks, mode, username, userFound, loading,
    ensureOwner, loadUser, saveMine, markCustom, projectBySlug,
  }
})
