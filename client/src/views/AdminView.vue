<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  LogIn, LogOut, Save, Plus, Trash2, RefreshCw, Upload, Download, Star,
  Database, FolderKanban, Layers, History, Globe, MonitorPlay, AtSign,
} from 'lucide-vue-next'
import type { Session } from '@supabase/supabase-js'
import type { Project, ProjectCategory, ProjectLink, StackGroup, TimelineItem, DemoType } from '@/types/project'
import { interestOptions } from '@/data/profile'
import { usePortfolioStore, ownerUsername } from '@/stores/portfolio'
import {
  getSession, onAuthChange, signOut, fetchMyPortfolio, updatePassword,
  isUsernameTaken, setMyUsername, isSupabaseConfigured, type MyPortfolioRow,
} from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { writeOverride, clearAllOverrides, pushToSupabase, type ContentKey } from '@/lib/content'
import type { DemoDetection, DemoAlert } from '@/data/demo'

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
const store = usePortfolioStore()

// ─── 세션 ───
const session = ref<Session | null>(null)
const myRow = ref<MyPortfolioRow | null>(null)
const checking = ref(true)
const claimName = ref('')
const displayName = ref('')
const claimMsg = ref('')

onMounted(async () => {
  session.value = await getSession()
  checking.value = false
  onAuthChange(async (s) => {
    session.value = s
    if (s) await loadMine()
    else myRow.value = null
  })
  if (session.value) await loadMine()
})

async function loadMine() {
  if (!session.value) return
  myRow.value = await fetchMyPortfolio(session.value.user.id)
  if (myRow.value) {
    // 내 행 데이터를 에디터+스토어에 반영 (이탈 시 주인 데이터로 복원됨)
    store.blocks = { ...clone(store.blocks), ...clone(myRow.value.data) } as typeof store.blocks
    store.markCustom()
    resetEditors()
  }
}

const USER_RE = /^[a-z0-9-]{3,20}$/
async function claim() {
  claimMsg.value = ''
  const uname = claimName.value.trim().toLowerCase()
  if (!USER_RE.test(uname)) {
    claimMsg.value = '아이디는 3~20자 영문소문자·숫자·하이픈만 가능합니다.'
    return
  }
  if (!supabase || !session.value) return
  if (await isUsernameTaken(uname)) {
    claimMsg.value = '이미 사용 중인 아이디입니다.'
    return
  }
  // 현재 화면의 콘텐츠를 초기 템플릿으로 내 행 생성 (mock 개인정보는 비워서 시작)
  const tpl = JSON.parse(JSON.stringify(store.blocks))
  tpl.siteConfig = {
    ...tpl.siteConfig,
    name: '', email: '', github: '', linkedin: '',
    resumeUrl: '', heroImage: '', profileImage: '',
  }
  const { error } = await supabase.from('portfolios').insert({
    user_id: session.value.user.id,
    username: uname,
    display_name: displayName.value.trim() || uname,
    data: tpl,
  })
  if (error) {
    claimMsg.value = `생성 실패: ${error.message}`
    return
  }
  await loadMine()
  setMyUsername(uname)
  flash(`/${uname} 생성됨 — 이제 자유롭게 편집하세요.`)
}

async function logout() {
  await signOut()
  session.value = null
  myRow.value = null
}

// ─── 탭 ───
const tabs = [
  { id: 'site', label: '사이트 설정', icon: Globe },
  { id: 'projects', label: '프로젝트', icon: FolderKanban },
  { id: 'stacks', label: '기술 스택', icon: Layers },
  { id: 'career', label: '경력·활동', icon: History },
  { id: 'demo', label: '데모 데이터', icon: MonitorPlay },
  { id: 'sync', label: '동기화', icon: Database },
] as const
type TabId = (typeof tabs)[number]['id']
const tab = ref<TabId>('site')

// ─── 토스트 ───
const toast = ref('')
const toastErr = ref(false)
let toastTimer: number | undefined
function flash(msg: string, err = false) {
  toast.value = msg
  toastErr.value = err
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 3500)
}

// ─── 프로젝트 편집 ───
const categories: ProjectCategory[] = ['AI / Computer Vision', 'Backend / Platform', 'Data / Monitoring']
const editing = ref<Project[]>(clone(store.blocks.projects))
const selectedSlug = ref(editing.value[0]?.slug ?? '')
const cur = computed(() => editing.value.find((p) => p.slug === selectedSlug.value))
const newSlug = ref('')
const jsonError = ref('')

const linksJson = computed({
  get: () => JSON.stringify(cur.value?.links ?? [], null, 2),
  set: (raw: string) => {
    try { if (cur.value) cur.value.links = JSON.parse(raw); jsonError.value = '' }
    catch { jsonError.value = 'links JSON 파싱 실패' }
  },
})
const featuresJson = computed({
  get: () => JSON.stringify(cur.value?.features ?? [], null, 2),
  set: (raw: string) => {
    try { if (cur.value) cur.value.features = JSON.parse(raw); jsonError.value = '' }
    catch { jsonError.value = 'features JSON 파싱 실패' }
  },
})
const pipelineJson = computed({
  get: () => JSON.stringify(cur.value?.pipeline ?? [], null, 2),
  set: (raw: string) => {
    try { if (cur.value) cur.value.pipeline = JSON.parse(raw); jsonError.value = '' }
    catch { jsonError.value = 'pipeline JSON 파싱 실패' }
  },
})
const versionsJson = computed({
  get: () => JSON.stringify(cur.value?.versions ?? [], null, 2),
  set: (raw: string) => {
    try { if (cur.value) cur.value.versions = JSON.parse(raw); jsonError.value = '' }
    catch { jsonError.value = 'versions JSON 파싱 실패' }
  },
})
const failuresJson = computed({
  get: () => JSON.stringify(cur.value?.failureCases ?? [], null, 2),
  set: (raw: string) => {
    try { if (cur.value) cur.value.failureCases = JSON.parse(raw); jsonError.value = '' }
    catch { jsonError.value = 'failureCases JSON 파싱 실패' }
  },
})
const tagsCsv = computed({
  get: () => (cur.value?.tags ?? []).join(', '),
  set: (raw: string) => { if (cur.value) cur.value.tags = raw.split(',').map((s) => s.trim()).filter(Boolean) },
})
const galleryCsv = computed({
  get: () => (cur.value?.gallery ?? []).join(', '),
  set: (raw: string) => { if (cur.value) cur.value.gallery = raw.split(',').map((s) => s.trim()) },
})

function addProject() {
  const slug = newSlug.value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  if (!slug) return flash('새 slug를 입력하세요.', true)
  if (editing.value.some((p) => p.slug === slug)) return flash('이미 존재하는 slug입니다.', true)
  editing.value.push({
    slug, category: categories[0], title: '새 프로젝트', short: '', description: '',
    tags: [], thumbnail: '', period: '', team: '', role: '', purpose: '',
    links: [], features: [], pipeline: [], versions: [], failureCases: [],
    failureMessage: '', gallery: [], featured: false,
  })
  selectedSlug.value = slug
  newSlug.value = ''
  flash(`프로젝트 추가됨: ${slug}`)
}

function deleteProject() {
  if (!cur.value) return
  if (!window.confirm(`'${cur.value.title}'을(를) 삭제할까요?`)) return
  editing.value = editing.value.filter((p) => p.slug !== selectedSlug.value)
  selectedSlug.value = editing.value[0]?.slug ?? ''
  flash('삭제됨 — 저장 버튼을 눌러 반영하세요.')
}

// ─── 프로젝트 등록 마법사 (기본 정보 → 데모 연결 → 확인) ───
const wizardOpen = ref(false)
const wstep = ref(1)
const werr = ref('')
const wform = ref({
  title: '', slug: '', category: categories[0] as ProjectCategory,
  short: '', description: '', tags: '', period: '', team: '', role: '', purpose: '',
  demoType: 'internal' as DemoType, demoUrl: '',
})

function openWizard() {
  wform.value = {
    title: '', slug: '', category: categories[0],
    short: '', description: '', tags: '', period: '', team: '', role: '', purpose: '',
    demoType: 'internal', demoUrl: '',
  }
  wstep.value = 1
  werr.value = ''
  wizardOpen.value = true
}

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
}

function validUrl(u: string) {
  try {
    const x = new URL(u)
    return x.protocol === 'http:' || x.protocol === 'https:'
  } catch {
    return false
  }
}

function wizardNext() {
  werr.value = ''
  if (wstep.value === 1) {
    if (!wform.value.title.trim()) return (werr.value = '프로젝트 제목을 입력하세요.')
    const slug = slugify(wform.value.slug || wform.value.title)
    if (!slug) return (werr.value = 'slug를 만들 수 없습니다. 영문으로 입력하세요.')
    if (editing.value.some((p) => p.slug === slug)) return (werr.value = '이미 존재하는 slug입니다.')
    wform.value.slug = slug
  }
  if (wstep.value === 2) {
    const { demoType, demoUrl } = wform.value
    if ((demoType === 'external' || demoType === 'huggingface') && !validUrl(demoUrl.trim())) {
      return (werr.value = '올바른 https URL을 입력하세요.')
    }
    if (demoType === 'huggingface' && !demoUrl.includes('huggingface.co/spaces/')) {
      return (werr.value = 'Hugging Face Spaces 주소 형태가 아닙니다. (예: https://huggingface.co/spaces/아이디/앱)')
    }
  }
  wstep.value += 1
}

function wizardSave() {
  const f = wform.value
  const links: ProjectLink[] = []
  if (f.demoType === 'external' && f.demoUrl.trim()) {
    links.push({ label: 'Live Demo', url: f.demoUrl.trim(), kind: 'live' })
  }
  if (f.demoType === 'huggingface' && f.demoUrl.trim()) {
    links.push({ label: 'AI Demo (Hugging Face)', url: f.demoUrl.trim(), kind: 'ai-demo' })
  }
  editing.value.push({
    slug: f.slug, category: f.category, title: f.title.trim(), short: f.short.trim(),
    description: f.description.trim(),
    tags: f.tags.split(',').map((s) => s.trim()).filter(Boolean),
    thumbnail: '', period: f.period.trim(), team: f.team.trim(), role: f.role.trim(),
    purpose: f.purpose.trim(), links,
    demoType: f.demoType === 'none' ? 'none' : f.demoType,
    demoUrl: f.demoUrl.trim() || undefined,
    features: [], pipeline: [], versions: [], failureCases: [],
    failureMessage: '', gallery: [], featured: false,
  })
  selectedSlug.value = f.slug
  wizardOpen.value = false
  flash(`등록됨: ${f.slug} — 상단의 전체 저장 버튼을 눌러 반영하세요.`)
}

// ─── 스택 / 경력 편집 ───
interface StackItemEdit { text: string; on: boolean }
interface StackEdit { category: string; icon: string; items: StackItemEdit[]; newItem: string }
function toStackEdits(groups: StackGroup[]): StackEdit[] {
  return clone(groups).map((g) => ({
    category: g.category, icon: g.icon,
    items: g.items.map((t) => ({ text: t, on: true })), newItem: '',
  }))
}
const stackEdits = ref<StackEdit[]>(toStackEdits(store.blocks.stackGroups))

interface CareerEdit { period: string; title: string; org: string; description: string; tagsCsv: string; current: boolean }
const careerEdits = ref<CareerEdit[]>(
  clone(store.blocks.timeline).map((t) => ({ period: t.period, title: t.title, org: t.org, description: t.description, tagsCsv: (t.tags ?? []).join(', '), current: !!t.current })),
)

// ─── 사이트 설정 편집 (통계는 자동 유도라 직접 입력 없음) ───
const siteEdit = ref<Record<string, string>>(Object.fromEntries(Object.entries(clone(store.blocks.siteConfig)).map(([k, v]) => [k, String(v ?? '')])))
const interestsEdit = ref(clone(store.blocks.interests).map((i) => ({ ...i })))
const quoteEdit = ref({ ...clone(store.blocks.valuesQuote) })

function hasInterest(title: string) {
  return interestsEdit.value.some((i) => i.title === title)
}
function toggleInterest(opt: { icon: string; title: string; desc: string }) {
  const i = interestsEdit.value.findIndex((x) => x.title === opt.title)
  if (i >= 0) interestsEdit.value.splice(i, 1)
  else interestsEdit.value.push({ ...opt })
}

// ─── 사이트 이미지 업로드 (Supabase Storage: profile-images/{user_id}/{profile|hero}) ───
const uploading = ref(false)
const uploadMsg = ref('')
const uploadErr = ref(false)

async function uploadSiteImage(e: Event, siteKey: 'profileImage' | 'heroImage', storageName: 'profile' | 'hero') {
  uploadMsg.value = ''
  uploadErr.value = false
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!session.value || !supabase) {
    uploadMsg.value = '로그인이 필요합니다.'
    uploadErr.value = true
    return
  }
  if (!file.type.startsWith('image/')) {
    uploadMsg.value = '이미지 파일만 올릴 수 있습니다.'
    uploadErr.value = true
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    uploadMsg.value = '5MB 이하만 올릴 수 있습니다.'
    uploadErr.value = true
    return
  }
  uploading.value = true
  try {
    const path = `${session.value.user.id}/${storageName}`
    const { error } = await supabase.storage
      .from('profile-images')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw error
    const { data } = supabase.storage.from('profile-images').getPublicUrl(path)
    siteEdit.value[siteKey] = `${data.publicUrl}?t=${Date.now()}`
    uploadMsg.value = '업로드됨 — 상단의 전체 저장 버튼을 눌러 반영하세요.'
  } catch (err) {
    uploadErr.value = true
    const msg = (err as Error).message ?? ''
    uploadMsg.value = /bucket|Bucket|not found/i.test(msg)
      ? '저장소 미설정 — supabase/migrations/20260214000000_profile_images_bucket.sql을 대시보드 SQL Editor에서 1회 실행하세요.'
      : `업로드 실패: ${msg}`
  } finally {
    uploading.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

function uploadProfileImage(e: Event) {
  return uploadSiteImage(e, 'profileImage', 'profile')
}

function uploadHeroImage(e: Event) {
  return uploadSiteImage(e, 'heroImage', 'hero')
}

// ─── 데모 데이터 편집 ───
const detEdits = ref<DemoDetection[]>(clone(store.blocks.demoDetections))
const alertEdits = ref<DemoAlert[]>(clone(store.blocks.demoAlerts))
const hourlyCsv = ref(store.blocks.demoHourlyCounts.join(', '))

function resetEditors() {
  editing.value = clone(store.blocks.projects)
  selectedSlug.value = editing.value[0]?.slug ?? ''
  stackEdits.value = toStackEdits(store.blocks.stackGroups)
  careerEdits.value = clone(store.blocks.timeline).map((t) => ({ period: t.period, title: t.title, org: t.org, description: t.description, tagsCsv: (t.tags ?? []).join(', '), current: !!t.current }))
  siteEdit.value = Object.fromEntries(Object.entries(clone(store.blocks.siteConfig)).map(([k, v]) => [k, String(v ?? '')]))
  interestsEdit.value = clone(store.blocks.interests).map((i) => ({ ...i }))
  quoteEdit.value = { ...clone(store.blocks.valuesQuote) }
  detEdits.value = clone(store.blocks.demoDetections)
  alertEdits.value = clone(store.blocks.demoAlerts)
  hourlyCsv.value = store.blocks.demoHourlyCounts.join(', ')
}

// ─── 저장 (내 portfolios 행 + 주인 호환용 content_blocks) ───
function collectBlocks() {
  return {
    projects: editing.value,
    stackGroups: stackEdits.value.map((g): StackGroup => ({
      category: g.category, icon: g.icon,
      items: g.items.filter((i) => i.on).map((i) => i.text.trim()).filter(Boolean),
    })),
    timeline: careerEdits.value.map((t): TimelineItem => ({
      period: t.period, title: t.title, org: t.org, description: t.description,
      tags: t.tagsCsv.split(',').map((s) => s.trim()).filter(Boolean), current: t.current,
    })),
    siteConfig: siteEdit.value,
    summaryStats: clone(store.blocks.summaryStats),
    interests: interestsEdit.value,
    valuesQuote: quoteEdit.value,
    demoDetections: detEdits.value,
    demoAlerts: alertEdits.value,
    demoHourlyCounts: hourlyCsv.value.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n)),
  }
}

async function persist(showMsg: string) {
  if (!session.value || !myRow.value) return flash('로그인이 필요합니다.', true)
  const data = collectBlocks()
  // 화면 스토어에도 즉시 반영 (내 페이지 미리보기와 일치)
  store.blocks = clone(data) as typeof store.blocks
  const r = await store.saveMine(session.value.user.id, myRow.value.username, myRow.value.display_name)
  // 루트(/) 호환: 설정된 주인 본인의 저장일 때만 기존 content_blocks에도 미러링.
  // 타 멤버의 저장이 원래 페이지를 덮어쓰지 않게 하기 위함.
  const mineName = myRow.value.username.toLowerCase()
  const isOwnerEdit = !!ownerUsername && mineName === ownerUsername.toLowerCase()
  if (r.ok && isOwnerEdit) {
    for (const [k, v] of Object.entries(data)) writeOverride(k as ContentKey, v)
    await pushToSupabase(data as Record<ContentKey, unknown>)
  }
  flash(r.ok ? showMsg : r.message, !r.ok)
}

async function saveAll() {
  if (jsonError.value) return flash(jsonError.value, true)
  await persist('전체 저장됨 — 내 공개 페이지에 즉시 반영됩니다.')
}

// ─── 동기화 ───
const syncMsg = ref('')
const newPw = ref('')
const pwMsg = ref('')
async function changePassword() {
  pwMsg.value = ''
  if (newPw.value.length < 6) {
    pwMsg.value = '6자 이상 입력하세요.'
    return
  }
  const r = await updatePassword(newPw.value)
  pwMsg.value = r.message
  if (r.ok) newPw.value = ''
}
async function doPull() {
  await loadMine()
  syncMsg.value = myRow.value ? '내 데이터를 불러와 에디터에 반영했습니다.' : '저장된 내 포트폴리오가 없습니다.'
}
async function doReset() {
  if (!window.confirm('브라우저에 저장한 기존 수정분을 지울까요? (Supabase 데이터는 유지)')) return
  clearAllOverrides()
  window.location.reload()
}

const inputCls = 'mt-1 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-[13.5px] outline-none focus:border-[#2563EB] focus:bg-white'
const labelCls = 'block text-[12.5px] font-bold text-slate-700'
const jsonCls = 'mt-1 w-full rounded-[10px] border border-[#E2E8F0] bg-[#0F172A] p-3 font-mono text-[12px] leading-relaxed text-slate-200 outline-none focus:border-[#2563EB]'

function reloadPage() {
  window.location.reload()
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-28">
    <div v-if="checking" class="py-20 text-center text-[14px] text-[#64748B]">확인 중…</div>

    <!-- 미로그인 -->
    <div v-else-if="!session" class="mx-auto max-w-md rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center">
      <LogIn :size="28" class="mx-auto text-[#2563EB]" />
      <h1 class="mt-3 text-[20px] font-bold">내 포트폴리오 관리</h1>
      <p class="mt-1 text-[13.5px] text-[#64748B]">각자 자신의 포트폴리오를 만들고 편집할 수 있습니다.</p>
      <RouterLink to="/login" class="mt-5 inline-block rounded-[12px] bg-[#2563EB] px-6 py-2.5 text-[14px] font-semibold text-white">
        이메일로 로그인
      </RouterLink>
    </div>

    <!-- 로그인済 · 아이디 미보유 → 생성 -->
    <div v-else-if="!myRow" class="mx-auto max-w-md rounded-[16px] border border-[#E2E8F0] bg-white p-8">
      <AtSign :size="28" class="mx-auto text-[#2563EB]" />
      <h1 class="mt-3 text-center text-[20px] font-bold">내 포트폴리오 만들기</h1>
      <p class="mt-1 text-center text-[13.5px] text-[#64748B]">공개 주소가 <span class="font-mono font-bold text-slate-800">/u/아이디</span> 가 됩니다. 현재 사이트 내용이 초기 템플릿으로 복사됩니다.</p>
      <label :class="labelCls" class="mt-5">사용자 아이디<input v-model="claimName" placeholder="yourname" :class="inputCls" class="font-mono" /></label>
      <label :class="labelCls" class="mt-3">표시 이름<input v-model="displayName" placeholder="홍길동" :class="inputCls" /></label>
      <button class="mt-4 w-full rounded-[12px] bg-[#2563EB] px-5 py-2.5 text-[14px] font-semibold text-white" @click="claim">만들기</button>
      <p v-if="claimMsg" class="mt-3 text-center text-[13px] font-medium text-red-600">{{ claimMsg }}</p>
      <button class="mt-4 w-full text-[12.5px] text-slate-400" @click="logout">로그아웃</button>
    </div>

    <div v-else>
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-[13px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">Admin · /u/{{ myRow.username }}</p>
          <h1 class="mt-1 text-[26px] font-bold tracking-tight">내 포트폴리오 편집</h1>
          <p class="mt-1 text-[13.5px] text-[#64748B]">
            {{ session?.user.email }} 로 로그인 중 ·
            <RouterLink :to="`/u/${myRow.username}`" class="font-semibold text-[#2563EB]">내 공개 페이지 보기 →</RouterLink>
          </p>
        </div>
        <div class="flex gap-2">
          <button class="inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-5 py-2 text-[13px] font-semibold text-white" @click="saveAll">
            <Save :size="14" /> 전체 저장
          </button>
          <button class="inline-flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-slate-700" @click="reloadPage()">
            <RefreshCw :size="14" /> 새로고침
          </button>
          <button class="inline-flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-slate-500" @click="logout()">
            <LogOut :size="14" /> 로그아웃
          </button>
        </div>
      </div>

      <div class="nice-scroll mt-5 flex gap-2 overflow-x-auto">
        <button
          v-for="t in tabs" :key="t.id"
          :class="['inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold', tab === t.id ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-[#E2E8F0] bg-white text-slate-600']"
          @click="tab = t.id"
        >
          <component :is="t.icon" :size="14" /> {{ t.label }}
        </button>
      </div>

      <!-- ═══ 프로젝트 ═══ -->
      <section v-if="tab === 'projects'" class="mt-5">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-[#2563EB]/20 bg-[#EFF6FF] px-5 py-4">
          <div>
            <p class="text-[14.5px] font-bold text-slate-900">프로젝트 등록</p>
            <p class="text-[12.5px] text-slate-600">기본 정보 → 데모 연결(URL) → 확인 3단계. 파일 업로드 없이 URL 등록으로 끝납니다.</p>
          </div>
          <button class="inline-flex items-center gap-1.5 rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-[13.5px] font-semibold text-white" @click="openWizard">
            <Plus :size="15" /> 새 프로젝트 등록
          </button>
        </div>
        <div class="grid gap-5 lg:grid-cols-[240px_1fr]">
        <div v-if="editing.length === 0" class="rounded-[14px] border border-dashed border-[#CBD5E1] bg-white p-8 text-center text-[13.5px] text-[#64748B] lg:col-span-2">
          등록된 프로젝트가 없습니다. 위 등록 버튼으로 추가한 뒤 상단의 전체 저장을 누르세요.
        </div>
        <template v-else>
        <div class="rounded-[14px] border border-[#E2E8F0] bg-white p-3">
          <p class="px-2 pb-1 text-[11.5px] font-bold text-slate-400">★ = Home 주요 프로젝트에 노출</p>
          <div v-for="p in editing" :key="p.slug" class="flex items-center gap-1">
            <button
              :class="['block w-full rounded-[10px] px-3 py-2.5 text-left text-[13.5px] font-semibold', selectedSlug === p.slug ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'text-slate-700 hover:bg-slate-50']"
              @click="selectedSlug = p.slug"
            >
              {{ p.title }}
              <span class="block font-mono text-[11px] font-normal text-slate-400">{{ p.slug }}</span>
            </button>
            <button
              :title="p.featured ? '주요 프로젝트 해제' : '주요 프로젝트로 지정'"
              :class="['shrink-0 rounded-[10px] border p-2', p.featured ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-[#E2E8F0] text-slate-300 hover:text-amber-400']"
              @click="p.featured = !p.featured"
            >
              <Star :size="16" :fill="p.featured ? 'currentColor' : 'none'" />
            </button>
          </div>
          <div class="mt-2 flex gap-1.5 border-t border-slate-100 pt-2">
            <input v-model="newSlug" placeholder="새 slug" :class="inputCls" class="mt-0" />
            <button class="shrink-0 rounded-[10px] bg-[#0F172A] px-3 text-white" @click="addProject" title="추가"><Plus :size="16" /></button>
          </div>
        </div>

        <div v-if="cur" class="rounded-[14px] border border-[#E2E8F0] bg-white p-6">
          <div class="flex items-center justify-between">
            <h2 class="font-mono text-[13px] text-[#64748B]">/{{ cur.slug }}</h2>
            <button class="inline-flex items-center gap-1.5 rounded-[10px] border border-red-200 px-3 py-1.5 text-[12.5px] font-semibold text-red-600" @click="deleteProject">
              <Trash2 :size="14" /> 삭제
            </button>
          </div>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <label :class="labelCls">제목<input v-model="cur.title" :class="inputCls" /></label>
            <label :class="labelCls">카테고리
              <select v-model="cur.category" :class="inputCls">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </label>
            <label :class="labelCls" class="md:col-span-2">짧은 설명<input v-model="cur.short" :class="inputCls" /></label>
            <label :class="labelCls" class="md:col-span-2">상세 설명<textarea v-model="cur.description" rows="3" :class="inputCls" /></label>
            <label :class="labelCls">태그 (쉼표 구분)<input v-model="tagsCsv" :class="inputCls" /></label>
            <label :class="labelCls">썸네일 URL<input v-model="cur.thumbnail" :class="inputCls" /></label>
            <label :class="labelCls">기간<input v-model="cur.period" :class="inputCls" /></label>
            <label :class="labelCls">개발 인원<input v-model="cur.team" :class="inputCls" /></label>
            <label :class="labelCls" class="md:col-span-2">주요 역할<input v-model="cur.role" :class="inputCls" /></label>
            <label :class="labelCls" class="md:col-span-2">개발 목적<textarea v-model="cur.purpose" rows="2" :class="inputCls" /></label>
            <label :class="labelCls">갤러리 (쉼표 구분 URL)<input v-model="galleryCsv" :class="inputCls" /></label>
            <label class="flex items-center gap-2 text-[13px] font-bold text-slate-700">
              <input v-model="cur.featured" type="checkbox" class="h-4 w-4 accent-[#2563EB]" /> Home 주요 프로젝트에 노출
            </label>
            <label :class="labelCls">데모 연결 방식
              <select v-model="cur.demoType" :class="inputCls">
                <option value="internal">내장 Live Demo 탭</option>
                <option value="external">외부 URL</option>
                <option value="huggingface">Hugging Face 임베드</option>
                <option value="none">없음</option>
              </select>
            </label>
            <label :class="labelCls">데모 URL<input v-model="cur.demoUrl" placeholder="https://… (external/huggingface일 때)" :class="inputCls" /></label>
          </div>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <label :class="labelCls">links (JSON)<textarea v-model="linksJson" rows="5" :class="jsonCls" spellcheck="false" /></label>
            <label :class="labelCls">features (JSON)<textarea v-model="featuresJson" rows="5" :class="jsonCls" spellcheck="false" /></label>
            <label :class="labelCls">pipeline (JSON)<textarea v-model="pipelineJson" rows="5" :class="jsonCls" spellcheck="false" /></label>
            <label :class="labelCls">versions (JSON)<textarea v-model="versionsJson" rows="5" :class="jsonCls" spellcheck="false" /></label>
            <label :class="labelCls" class="md:col-span-2">failureCases (JSON)<textarea v-model="failuresJson" rows="4" :class="jsonCls" spellcheck="false" /></label>
            <label :class="labelCls" class="md:col-span-2">실패 분석 강조 문구<textarea v-model="cur.failureMessage" rows="2" :class="inputCls" /></label>
          </div>
          <p v-if="jsonError" class="mt-3 text-[13px] font-semibold text-red-600">{{ jsonError }}</p>
          <p class="mt-4 text-[12.5px] text-[#64748B]">저장은 상단의 전체 저장 버튼으로 — 프로젝트가 0개여도 저장됩니다.</p>
        </div>
        </template>
        </div>
      </section>

      <!-- ═══ 등록 마법사 모달 ═══ -->
      <div v-if="wizardOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" @click.self="wizardOpen = false">
        <div class="nice-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 md:p-8">
          <div class="flex items-center justify-between">
            <h2 class="text-[18px] font-bold">새 프로젝트 등록</h2>
            <button class="rounded-[8px] px-2 py-1 text-slate-400 hover:bg-slate-100" @click="wizardOpen = false">✕</button>
          </div>
          <div class="mt-3 flex gap-1.5">
            <span v-for="n in 3" :key="n" :class="['h-1.5 flex-1 rounded-full', wstep >= n ? 'bg-[#2563EB]' : 'bg-slate-200']" />
          </div>
          <p class="mt-2 text-[12.5px] font-semibold text-[#2563EB]">
            {{ wstep === 1 ? '1/3 기본 정보' : wstep === 2 ? '2/3 데모 연결' : '3/3 확인' }}
          </p>

          <!-- Step 1 -->
          <div v-if="wstep === 1" class="mt-4 grid gap-3 md:grid-cols-2">
            <label :class="labelCls" class="md:col-span-2">프로젝트 제목 *<input v-model="wform.title" placeholder="예: CCTV 기반 차량 관제 시스템" :class="inputCls" /></label>
            <label :class="labelCls">slug (주소, 영문·자동 생성)<input v-model="wform.slug" placeholder="비워두면 제목에서 생성" :class="inputCls" class="font-mono" /></label>
            <label :class="labelCls">카테고리
              <select v-model="wform.category" :class="inputCls">
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
            </label>
            <label :class="labelCls" class="md:col-span-2">짧은 설명<input v-model="wform.short" placeholder="카드에 보이는 한 줄" :class="inputCls" /></label>
            <label :class="labelCls" class="md:col-span-2">상세 설명<textarea v-model="wform.description" rows="3" placeholder="상세 페이지 상단에 보이는 설명" :class="inputCls" /></label>
            <label :class="labelCls">태그 (쉼표 구분)<input v-model="wform.tags" placeholder="YOLO, OCR, Vue" :class="inputCls" /></label>
            <label :class="labelCls">기간<input v-model="wform.period" placeholder="2024.03 — 2024.11" :class="inputCls" /></label>
            <label :class="labelCls">개발 인원<input v-model="wform.team" placeholder="4인 (AI 2 · Backend 1 · Frontend 1)" :class="inputCls" /></label>
            <label :class="labelCls">주요 역할<input v-model="wform.role" placeholder="AI Pipeline · Backend API 설계" :class="inputCls" /></label>
            <label :class="labelCls" class="md:col-span-2">개발 목적<textarea v-model="wform.purpose" rows="2" :class="inputCls" /></label>
          </div>

          <!-- Step 2 -->
          <div v-if="wstep === 2" class="mt-4">
            <p :class="labelCls">데모 연결 방식</p>
            <div class="mt-2 grid gap-2 sm:grid-cols-2">
              <button
                v-for="o in [
                  { v: 'internal', t: '내장 Live Demo', d: '플랫폼의 샘플 대시보드 탭 사용' },
                  { v: 'external', t: '외부 URL', d: '배포된 데모로 새창 연결' },
                  { v: 'huggingface', t: 'Hugging Face', d: 'Spaces를 페이지에 임베드' },
                  { v: 'none', t: '없음', d: '나중에 연결' },
                ]" :key="o.v"
                :class="['rounded-[12px] border p-4 text-left', wform.demoType === o.v ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] hover:border-[#93C5FD]']"
                @click="wform.demoType = o.v as DemoType"
              >
                <span class="block text-[14px] font-bold" :class="wform.demoType === o.v ? 'text-[#1D4ED8]' : 'text-slate-800'">{{ o.t }}</span>
                <span class="mt-0.5 block text-[12.5px] text-[#64748B]">{{ o.d }}</span>
              </button>
            </div>
            <div v-if="wform.demoType === 'external' || wform.demoType === 'huggingface'" class="mt-3">
              <label :class="labelCls">데모 URL *
                <input
                  v-model="wform.demoUrl"
                  :placeholder="wform.demoType === 'huggingface' ? 'https://huggingface.co/spaces/아이디/앱이름' : 'https://demo.example.com/my-app'"
                  :class="inputCls" class="font-mono"
                />
              </label>
              <div v-if="wform.demoType === 'huggingface' && validUrl(wform.demoUrl.trim())" class="mt-3 overflow-hidden rounded-[12px] border border-[#E2E8F0]">
                <p class="bg-[#F8FAFC] px-3 py-2 text-[12px] font-bold text-slate-600">임베드 미리보기</p>
                <iframe :src="wform.demoUrl.trim()" title="preview" class="aspect-[16/9] w-full bg-white" loading="lazy" />
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div v-if="wstep === 3" class="mt-4 rounded-[12px] bg-[#F8FAFC] p-5 text-[13.5px] leading-relaxed">
            <p><span class="font-bold">제목:</span> {{ wform.title }}</p>
            <p class="font-mono text-[12.5px] text-[#64748B]">/u/{{ myRow?.username }}/projects/{{ wform.slug }}</p>
            <p class="mt-1"><span class="font-bold">카테고리:</span> {{ wform.category }}</p>
            <p><span class="font-bold">데모:</span>
              {{ wform.demoType === 'internal' ? '내장 Live Demo' : wform.demoType === 'none' ? '없음' : wform.demoUrl }}
            </p>
            <p class="mt-2 text-[12.5px] text-[#64748B]">저장 후 상세 파이프라인·성능표·ERD는 목록의 JSON 편집으로 이어서 채울 수 있습니다.</p>
          </div>

          <p v-if="werr" class="mt-3 text-[13px] font-semibold text-red-600">{{ werr }}</p>
          <div class="mt-5 flex justify-between">
            <button v-if="wstep > 1" class="rounded-[10px] border border-[#E2E8F0] px-5 py-2.5 text-[13.5px] font-semibold" @click="wstep -= 1; werr = ''">이전</button>
            <span v-else />
            <button v-if="wstep < 3" class="rounded-[10px] bg-[#2563EB] px-6 py-2.5 text-[13.5px] font-semibold text-white" @click="wizardNext">다음</button>
            <button v-else class="inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-6 py-2.5 text-[13.5px] font-semibold text-white" @click="wizardSave">
              <Save :size="15" /> 등록하기
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ 기술 스택 ═══ -->
      <section v-if="tab === 'stacks'" class="mt-5 rounded-[14px] border border-[#E2E8F0] bg-white p-6">
        <p class="mb-4 text-[13px] text-[#64748B]">체크된 항목만 사이트에 표시됩니다. 체크 해제는 숨김(삭제 아님)이라 언제든 복구됩니다.</p>
        <div v-for="(g, i) in stackEdits" :key="i" class="mb-3 rounded-[12px] border border-slate-100 p-4">
          <div class="grid gap-2 md:grid-cols-[180px_140px_1fr_auto]">
            <input v-model="g.category" :class="inputCls" class="mt-0" placeholder="카테고리" />
            <select v-model="g.icon" :class="inputCls" class="mt-0">
              <option value="monitor">monitor</option><option value="server">server</option>
              <option value="brain">brain</option><option value="database">database</option>
              <option value="container">container</option>
            </select>
            <div class="flex gap-1.5">
              <input v-model="g.newItem" :class="inputCls" class="mt-0 flex-1" placeholder="새 기술 추가 후 +"
                @keyup.enter="() => { if (g.newItem.trim()) { g.items.push({ text: g.newItem.trim(), on: true }); g.newItem = '' } }" />
              <button class="shrink-0 rounded-[10px] bg-[#0F172A] px-3 text-white" title="추가"
                @click="() => { if (g.newItem.trim()) { g.items.push({ text: g.newItem.trim(), on: true }); g.newItem = '' } }">
                <Plus :size="15" />
              </button>
            </div>
            <button class="rounded-[10px] border border-red-200 px-3 text-red-600" @click="stackEdits.splice(i, 1)"><Trash2 :size="15" /></button>
          </div>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <label
              v-for="(it, j) in g.items" :key="j"
              :class="['inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-[13px] font-semibold', it.on ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]' : 'border-[#E2E8F0] text-slate-400']"
            >
              <input v-model="it.on" type="checkbox" class="h-3.5 w-3.5 accent-[#2563EB]" />
              <input v-model="it.text" class="w-24 bg-transparent outline-none" />
              <span class="cursor-pointer text-slate-300 hover:text-red-500" @click.prevent="g.items.splice(j, 1)">✕</span>
            </label>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="inline-flex items-center gap-1.5 rounded-[10px] border border-[#E2E8F0] px-4 py-2 text-[13px] font-semibold" @click="stackEdits.push({ category: '새 분야', icon: 'monitor', items: [], newItem: '' })">
            <Plus :size="14" /> 분야 추가
          </button>
        </div>
      </section>

      <!-- ═══ 경력 ═══ -->
      <section v-if="tab === 'career'" class="mt-5 rounded-[14px] border border-[#E2E8F0] bg-white p-6">
        <div v-for="(t, i) in careerEdits" :key="i" class="mb-3 rounded-[12px] border border-slate-100 p-4">
          <div class="grid gap-2 md:grid-cols-[160px_1fr_160px_auto]">
            <input v-model="t.period" :class="inputCls" class="mt-0" placeholder="2024 — 현재" />
            <input v-model="t.title" :class="inputCls" class="mt-0" placeholder="제목" />
            <input v-model="t.org" :class="inputCls" class="mt-0" placeholder="소속" />
            <button class="rounded-[10px] border border-red-200 px-3 text-red-600" @click="careerEdits.splice(i, 1)"><Trash2 :size="15" /></button>
          </div>
          <textarea v-model="t.description" rows="2" :class="inputCls" placeholder="설명" />
          <div class="mt-2 flex items-center gap-3">
            <input v-model="t.tagsCsv" :class="inputCls" class="mt-0 flex-1" placeholder="태그 (쉼표 구분)" />
            <label class="flex shrink-0 items-center gap-1.5 text-[12.5px] font-bold"><input v-model="t.current" type="checkbox" class="accent-[#2563EB]" /> 현재</label>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="inline-flex items-center gap-1.5 rounded-[10px] border border-[#E2E8F0] px-4 py-2 text-[13px] font-semibold" @click="careerEdits.unshift({ period: '', title: '새 활동', org: '', description: '', tagsCsv: '', current: false })">
            <Plus :size="14" /> 항목 추가
          </button>
        </div>
      </section>

      <!-- ═══ 사이트 설정 ═══ -->
      <section v-if="tab === 'site'" class="mt-5 grid gap-5 lg:grid-cols-2">
        <div class="rounded-[14px] border border-[#E2E8F0] bg-white p-6">
          <h2 class="text-[15px] font-bold">기본 정보 · 링크</h2>
          <p class="mt-1 text-[12.5px] text-[#64748B]">값이 있으면 그 값이, 비어 있으면 아래 양식대로 입력하세요.</p>
          <div class="mt-3 grid gap-3">
            <label :class="labelCls">이름 (네브바·푸터에 표시)<input v-model="siteEdit.name" placeholder="홍길동" :class="inputCls" /></label>
            <label :class="labelCls">직함 한 줄<input v-model="siteEdit.role" placeholder="AI · Backend Developer" :class="inputCls" /></label>
            <label :class="labelCls">이메일<input v-model="siteEdit.email" placeholder="you@example.com" :class="inputCls" /></label>
            <label :class="labelCls">GitHub URL<input v-model="siteEdit.github" placeholder="https://github.com/아이디" :class="inputCls" /></label>
            <label :class="labelCls">LinkedIn URL<input v-model="siteEdit.linkedin" placeholder="https://www.linkedin.com/in/아이디" :class="inputCls" /></label>
            <label :class="labelCls">이력서 URL<input v-model="siteEdit.resumeUrl" placeholder="이력서 PDF 링크 (없으면 #)" :class="inputCls" /></label>
          </div>
          <h2 class="mt-6 text-[15px] font-bold">홈 히어로 문구</h2>
          <p class="mt-1 text-[12.5px] text-[#64748B]">비워두면 기본 템플릿 문구가 표시됩니다.</p>
          <div class="mt-3 grid gap-3">
            <label :class="labelCls">첫째 줄<input v-model="siteEdit.heroTitleA" placeholder="AI와 데이터를" :class="inputCls" /></label>
            <label :class="labelCls">둘째 줄 (파란 강조)<input v-model="siteEdit.heroTitleB" placeholder="실제 서비스로 연결하는" :class="inputCls" /></label>
            <label :class="labelCls">셋째 줄<input v-model="siteEdit.heroTitleC" placeholder="개발자" :class="inputCls" /></label>
            <label :class="labelCls">부제목 한 줄<input v-model="siteEdit.heroSub" placeholder="Computer Vision · Backend · Data Pipeline · Web Application" :class="inputCls" /></label>
          </div>
          <h2 class="mt-6 text-[15px] font-bold">홈 히어로 이미지</h2>
          <div class="mt-3">
            <img
              v-if="siteEdit.heroImage"
              :src="siteEdit.heroImage"
              alt="히어로 미리보기"
              class="aspect-[16/9] w-full rounded-[12px] border border-[#E2E8F0] object-cover"
            />
            <div v-else class="flex aspect-[16/9] w-full items-center justify-center rounded-[12px] bg-[#F1F5F9] text-[12px] text-slate-400">
              없음 — 기본 CCTV 목업이 표시됩니다
            </div>
            <div class="mt-2 flex items-center gap-2">
              <label class="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white">
                {{ uploading ? '업로드 중…' : '이미지 업로드' }}
                <input type="file" accept="image/*" class="hidden" :disabled="uploading" @change="uploadHeroImage" />
              </label>
              <button
                v-if="siteEdit.heroImage"
                class="rounded-[10px] border border-[#E2E8F0] px-4 py-2 text-[13px] font-semibold text-slate-500"
                @click="siteEdit.heroImage = ''"
              >
                지우기
              </button>
            </div>
          </div>
            <div>
              <span :class="labelCls">프로필 이미지</span>
              <div class="mt-1 flex items-center gap-3">
                <img
                  v-if="siteEdit.profileImage"
                  :src="siteEdit.profileImage"
                  alt="프로필 미리보기"
                  class="h-16 w-16 rounded-[12px] border border-[#E2E8F0] object-cover"
                />
                <span v-else class="flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#F1F5F9] text-[11px] text-slate-400">없음</span>
                <div class="flex-1">
                  <label class="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white">
                    {{ uploading ? '업로드 중…' : '이미지 업로드' }}
                    <input type="file" accept="image/*" class="hidden" :disabled="uploading" @change="uploadProfileImage" />
                  </label>
                  <p class="mt-1 text-[11.5px] text-slate-400">jpg/png/webp, 5MB 이하. 본인 저장소에만 저장됨</p>
                </div>
              </div>
              <p v-if="uploadMsg" class="mt-1.5 text-[12.5px] font-medium" :class="uploadErr ? 'text-red-600' : 'text-emerald-600'">{{ uploadMsg }}</p>
              <label :class="labelCls" class="mt-2">또는 직접 URL 입력<input v-model="siteEdit.profileImage" placeholder="https://… (비워두면 플레이스홀더 표시)" :class="inputCls" /></label>
            </div>
          <h2 class="mt-6 text-[15px] font-bold">가치관 문구</h2>
          <textarea v-model="quoteEdit.text" rows="3" placeholder="어떤 개발자가 되고 싶은지 한두 문장으로" :class="inputCls" />
          <input v-model="quoteEdit.author" :class="inputCls" placeholder="서명 (예: 홍길동)" />
        </div>
        <div class="rounded-[14px] border border-[#E2E8F0] bg-white p-6">
          <h2 class="text-[15px] font-bold">주요 관심 분야 선택</h2>
          <p class="mt-1 text-[12.5px] text-[#64748B]">체크한 분야가 About과 Home 통계에 표시됩니다.</p>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              v-for="o in interestOptions" :key="o.title"
              :class="['rounded-[12px] border p-3.5 text-left', hasInterest(o.title) ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] hover:border-[#93C5FD]']"
              @click="toggleInterest(o)"
            >
              <span class="flex items-center gap-2 text-[13.5px] font-bold" :class="hasInterest(o.title) ? 'text-[#1D4ED8]' : 'text-slate-700'">
                <span :class="['flex h-4 w-4 items-center justify-center rounded border', hasInterest(o.title) ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-slate-300 text-transparent']">✓</span>
                {{ o.title }}
              </span>
              <span class="mt-1 block text-[12px] leading-relaxed text-[#64748B]">{{ o.desc }}</span>
            </button>
          </div>
          <div v-if="interestsEdit.length" class="mt-3">
            <p class="text-[12.5px] font-bold text-slate-700">선택된 분야 설명 수정</p>
            <div v-for="(it, i) in interestsEdit" :key="i" class="mt-2 rounded-[10px] border border-slate-100 p-3">
              <p class="text-[13px] font-bold">{{ it.title }}</p>
              <textarea v-model="it.desc" rows="2" :class="inputCls" placeholder="설명" />
            </div>
          </div>
        </div>
        <div class="lg:col-span-2">
          <p class="text-[12.5px] text-[#64748B]">저장은 상단의 전체 저장 버튼으로.</p>
        </div>
      </section>

      <!-- ═══ 데모 데이터 ═══ -->
      <section v-if="tab === 'demo'" class="mt-5 grid gap-5 lg:grid-cols-2">
        <div class="rounded-[14px] border border-[#E2E8F0] bg-white p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-[15px] font-bold">탐지 피드</h2>
            <button class="inline-flex items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-3 py-1.5 text-[12px] font-semibold" @click="detEdits.push({ id: Date.now(), plate: '', cctv: '', time: '', confidence: 0.9, wanted: false, type: '', color: '' })">
              <Plus :size="13" /> 추가
            </button>
          </div>
          <div v-for="(d, i) in detEdits" :key="d.id" class="mt-2 grid grid-cols-[1fr_1fr_auto] gap-1.5 rounded-[10px] border border-slate-100 p-2.5">
            <input v-model="d.plate" :class="inputCls" class="mt-0" placeholder="번호판" />
            <input v-model="d.cctv" :class="inputCls" class="mt-0" placeholder="CCTV" />
            <button class="rounded-[8px] border border-red-200 px-2 text-red-600" @click="detEdits.splice(i, 1)"><Trash2 :size="13" /></button>
            <input v-model="d.time" :class="inputCls" class="mt-0" placeholder="시간" />
            <input v-model.number="d.confidence" type="number" step="0.01" min="0" max="1" :class="inputCls" class="mt-0" placeholder="신뢰도" />
            <label class="flex items-center gap-1 text-[12px] font-bold"><input v-model="d.wanted" type="checkbox" class="accent-red-500" /> 수배</label>
            <input v-model="d.type" :class="inputCls" class="mt-0" placeholder="차종" />
            <input v-model="d.color" :class="inputCls" class="mt-0" placeholder="색상" />
          </div>
        </div>
        <div>
          <div class="rounded-[14px] border border-[#E2E8F0] bg-white p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-[15px] font-bold">알림</h2>
              <button class="inline-flex items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-3 py-1.5 text-[12px] font-semibold" @click="alertEdits.push({ id: Date.now(), level: '정보', message: '', time: '' })">
                <Plus :size="13" /> 추가
              </button>
            </div>
            <div v-for="(a, i) in alertEdits" :key="a.id" class="mt-2 flex gap-1.5">
              <select v-model="a.level" :class="inputCls" class="mt-0 w-24 shrink-0">
                <option>긴급</option><option>주의</option><option>정보</option>
              </select>
              <input v-model="a.message" :class="inputCls" class="mt-0 flex-1" placeholder="메시지" />
              <input v-model="a.time" :class="inputCls" class="mt-0 w-24" placeholder="시간" />
              <button class="rounded-[8px] border border-red-200 px-2 text-red-600" @click="alertEdits.splice(i, 1)"><Trash2 :size="13" /></button>
            </div>
            <h2 class="mt-5 text-[15px] font-bold">시간대별 탐지량 (쉼표 구분 숫자)</h2>
            <input v-model="hourlyCsv" :class="inputCls" />
          </div>
        </div>
      </section>

      <!-- ═══ 동기화 ═══ -->
      <section v-if="tab === 'sync'" class="mt-5 rounded-[14px] border border-[#E2E8F0] bg-white p-6">
        <h2 class="text-[15px] font-bold">동기화</h2>
        <p class="mt-1 text-[13.5px] text-[#64748B]">저장은 내 portfolios 행에 즉시 반영됩니다. 아래는 다시 불러오기·초기화용입니다.</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button class="inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-[13.5px] font-semibold text-white" @click="doPull">
            <Download :size="15" /> 내 데이터 다시 불러오기
          </button>
          <button class="inline-flex items-center gap-2 rounded-[10px] border border-red-200 px-5 py-2.5 text-[13.5px] font-semibold text-red-600" @click="doReset">
            <Trash2 :size="15" /> 브라우저 캐시 초기화
          </button>
        </div>
        <p v-if="syncMsg" class="mt-3 text-[13.5px] font-medium text-slate-700">{{ syncMsg }}</p>
        <h2 class="mt-8 text-[15px] font-bold">비밀번호 변경</h2>
        <p class="mt-1 text-[13px] text-[#64748B]">운영자가 임시 비번을 만들어줬다면 여기서 본인 비번으로 바꾸세요.</p>
        <form class="mt-2 flex max-w-md gap-2" @submit.prevent="changePassword">
          <input v-model="newPw" type="password" minlength="6" placeholder="새 비밀번호 (6자 이상)" :class="inputCls" class="mt-0 flex-1" />
          <button class="shrink-0 rounded-[10px] bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white">변경</button>
        </form>
        <p v-if="pwMsg" class="mt-2 text-[13px] font-medium text-slate-700">{{ pwMsg }}</p>
        <p class="mt-4 flex items-center gap-1.5 text-[12.5px] text-slate-400">
          <Upload :size="13" /> 최초 마이그레이션: npm run supabase:seed (mock → content_blocks)
        </p>
      </section>

      <!-- 토스트 -->
      <div v-if="toast" :class="['fixed bottom-6 left-1/2 -translate-x-1/2 rounded-[12px] px-5 py-3 text-[13.5px] font-semibold text-white shadow-xl', toastErr ? 'bg-red-600' : 'bg-[#0F172A]']">
        {{ toast }}
      </div>
    </div>
  </div>
</template>
