import { supabase, isSupabaseConfigured } from './supabase'
import type { Session } from '@supabase/supabase-js'

export interface MyPortfolioRow {
  user_id: string
  username: string
  display_name: string
  data: Record<string, unknown>
  updated_at: string
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(cb: (session: Session | null) => void) {
  if (!supabase) return { data: { subscription: { unsubscribe() {} } } }
  return supabase.auth.onAuthStateChange((_e, session) => cb(session))
}

/** 매직링크 발송 — 콜백 주소는 /auth/callback */
export async function signInWithEmail(email: string): Promise<{ ok: boolean; message: string }> {
  if (!supabase) return { ok: false, message: 'Supabase 미설정' }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) {
    const rateLimited = error.message.toLowerCase().includes('rate limit')
    return {
      ok: false,
      message: rateLimited
        ? '이메일 발송 한도 초과 (시간당 제한). 약 1시간 후 다시 시도하거나, 아래 비밀번호 로그인을 이용하세요.'
        : `발송 실패: ${error.message}`,
    }
  }
  return { ok: true, message: '로그인 링크를 이메일로 보냈습니다. 메일함을 확인하세요.' }
}

/** 비밀번호 로그인 — 대시보드에서 만든 계정용 (이메일 발송 없음, 한도와 무관) */
export async function signInWithPassword(email: string, password: string): Promise<{ ok: boolean; message: string }> {
  if (!supabase) return { ok: false, message: 'Supabase 미설정' }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error ? { ok: false, message: `로그인 실패: ${error.message}` } : { ok: true, message: '로그인 성공' }
}

/** 직접 회원가입 — Dashboard > Authentication > Providers > Email에서
 *  "Confirm email"을 OFF해야 이메일 없이 즉시 가입됨 (ON이면 확인 메일 발송됨) */
export async function signUpWithPassword(email: string, password: string): Promise<{ ok: boolean; message: string }> {
  if (!supabase) return { ok: false, message: 'Supabase 미설정' }
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { ok: false, message: `가입 실패: ${error.message}` }
  return data.session
    ? { ok: true, message: '가입 완료 — 바로 로그인되었습니다.' }
    : { ok: true, message: '가입됨 — 이메일 확인 후 로그인하세요. (바로 쓰려면 Confirm email OFF 필요)' }
}

/** 로그인 중 비밀번호 변경 — 본인이 직접 비번을 정/바꿀 때 */
export async function updatePassword(newPassword: string): Promise<{ ok: boolean; message: string }> {
  if (!supabase) return { ok: false, message: 'Supabase 미설정' }
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return error ? { ok: false, message: `변경 실패: ${error.message}` } : { ok: true, message: '비밀번호를 변경했습니다.' }
}

export async function signOut(): Promise<void> {
  await supabase?.auth.signOut()
  clearMyUsername()
}

const MY_NAME_KEY = 'pp:my-username'

/** 내 아이디 캐시 (네브바 관리 메뉴 표시용) */
export function getMyUsername(): string {
  try {
    return localStorage.getItem(MY_NAME_KEY) || ''
  } catch {
    return ''
  }
}

export function setMyUsername(username: string): void {
  try {
    localStorage.setItem(MY_NAME_KEY, username.toLowerCase())
  } catch { /* 무시 */ }
}

export function clearMyUsername(): void {
  try {
    localStorage.removeItem(MY_NAME_KEY)
  } catch { /* 무시 */ }
}

/** 로그인 직후 이동 위치: 포트폴리오가 있으면 내 홈페이지, 없으면 /admin(생성) */
export async function postLoginTarget(): Promise<string> {
  const s = await getSession()
  if (!s) return '/login'
  const row = await fetchMyPortfolio(s.user.id)
  if (row) {
    setMyUsername(row.username)
    return `/u/${row.username}`
  }
  clearMyUsername()
  return '/admin'
}

/** /auth/callback에서 호출 — 메일 링크의 code를 세션으로 교환 */
export async function exchangeCodeForSession(): Promise<boolean> {
  if (!supabase) return false
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
    if (!error) return true
  } catch { /* 구버전 폴백 */ }
  const { data } = await supabase.auth.getSession()
  return !!data.session
}

export async function fetchPortfolioByUsername(username: string): Promise<MyPortfolioRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('portfolios')
    .select('user_id, username, display_name, data, updated_at')
    .eq('username', username.toLowerCase())
    .maybeSingle()
  if (error || !data) return null
  return data as MyPortfolioRow
}

export async function fetchMyPortfolio(userId: string): Promise<MyPortfolioRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('portfolios')
    .select('user_id, username, display_name, data, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data) return null
  return data as MyPortfolioRow
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  if (!supabase) return false
  const { data } = await supabase.from('portfolios').select('username').eq('username', username).maybeSingle()
  return !!data
}

export interface MemberHead {
  username: string
  display_name: string
  updated_at: string
  avatar: string
}

export async function listPortfolios(): Promise<MemberHead[]> {
  if (!supabase) return []
  const res = await supabase
    .from('portfolios')
    .select('username, display_name, updated_at, avatar:data->siteConfig->>profileImage')
    .order('updated_at', { ascending: false })
    .limit(100)
  if (res.error) {
    // 구버전 PostgREST 대비 폴백
    const fb = await supabase
      .from('portfolios')
      .select('username, display_name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(100)
    return ((fb.data ?? []) as any[]).map((r) => ({ ...r, avatar: '' }))
  }
  return ((res.data ?? []) as any[]).map((r) => ({ ...r, avatar: r.avatar ?? '' }))
}

/** 랜딩 통계·쇼케이스용 (프로젝트 수 계산 포함) */
export interface PortfolioPreview {
  username: string
  display_name: string
  updated_at: string
  projectCount: number
  featuredCount: number
  tags: string[]
  avatar: string
}

export async function listPortfolioPreviews(): Promise<PortfolioPreview[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('portfolios')
    .select('username, display_name, updated_at, data')
    .order('updated_at', { ascending: false })
    .limit(24)
  return ((data ?? []) as MyPortfolioRow[]).map((r) => {
    const d = (r.data ?? {}) as Record<string, any>
    const projects: any[] = Array.isArray(d.projects) ? d.projects : []
    const siteConfig: any = (d.siteConfig ?? {}) as any
    const tagFreq = new Map<string, number>()
    for (const p of projects) {
      for (const t of (p.tags ?? []) as string[]) tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1)
    }
    return {
      username: r.username,
      display_name: r.display_name,
      updated_at: r.updated_at,
      projectCount: projects.length,
      featuredCount: projects.filter((p) => p.featured).length,
      tags: [...tagFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t),
      avatar: typeof siteConfig.profileImage === 'string' ? siteConfig.profileImage : '',
    }
  })
}

export { isSupabaseConfigured }
