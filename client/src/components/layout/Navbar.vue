<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, X, Settings2, ChevronLeft } from 'lucide-vue-next'
import { usePortfolioStore } from '@/stores/portfolio'
import { getMyUsername, onAuthChange, getSession, signOut } from '@/lib/auth'

const route = useRoute()
const router = useRouter()
const store = usePortfolioStore()
const siteConfig = computed(() => store.blocks.siteConfig)
const open = ref(false)
const scrolled = ref(false)
const isLanding = computed(() => route.path === '/')
// 멤버 페이지(/u/아이디...)에서만: 제목·Home은 멤버 홈, 구석에 돌아가기 표시
const isUserPage = computed(() => route.path.startsWith('/u/'))
const routeUser = computed(() => route.path.match(/^\/u\/([^/]+)/)?.[1] ?? '')
// 이름 미설정 시 아이디로 표시 (신규 멤버 빈칸 대응)
const brandName = computed(() => {
  if (isLanding.value) return 'Portfolio Platform'
  return siteConfig.value.name || routeUser.value || 'Portfolio'
})

function goBack() {
  router.push('/')
}

// 랜딩 primary: 로그인済면 내 포트폴리오 홈으로, 아니면 생성 흐름으로
const myPageTarget = computed(() => (myName.value ? `/u/${myName.value}` : '/admin'))
const primaryLabel = computed(() => (myName.value ? '내 포트폴리오 가기' : '내 포트폴리오 만들기'))

// 본인 아이디 (메뉴 맞춤·관리 노출용)
const myName = ref(getMyUsername())
const loggedIn = ref(false)
// /admin·/login에서는 로그인된 내 아이디 기준으로 메뉴 맞춤 (포트폴리오 홈과 일치)
const navBase = computed(() => {
  const m = route.path.match(/^\/u\/([^/]+)/)
  if (m) return `/u/${m[1]}`
  if (myName.value && (route.path === '/admin' || route.path === '/login')) return `/u/${myName.value}`
  return ''
})
const navLink = (p: string) => `${navBase.value}${p === '/' ? '' : p}` || '/'
// 관리 화면에서도 돌아가기 표시
const showBack = computed(() => isUserPage.value || route.path === '/admin')
const showManage = computed(() => {
  const m = route.path.match(/^\/u\/([^/]+)/)
  return !!m && !!myName.value && m[1].toLowerCase() === myName.value.toLowerCase()
})
watch(() => route.path, () => { myName.value = getMyUsername() })
onAuthChange((s) => {
  myName.value = getMyUsername()
  loggedIn.value = !!s
})
async function logout() {
  await signOut()
  loggedIn.value = false
  myName.value = ''
  open.value = false
}

const links = computed(() => [
  { to: navLink('/'), label: 'Home' },
  { to: navLink('/about'), label: 'About' },
  { to: navLink('/projects'), label: 'Projects' },
  { to: navLink('/skills'), label: 'Skills' },
  { to: navLink('/contact'), label: 'Contact' },
])

function isActive(to: string) {
  if (to === navLink('/')) return route.path === to || route.path === `${to}/`
  return route.path === to || route.path.startsWith(to + '/')
}

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  getSession().then((s) => { loggedIn.value = !!s })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-all',
      scrolled ? 'border-[#E2E8F0] shadow-[0_1px_8px_rgba(15,23,42,0.06)]' : 'border-[#E2E8F0]/60',
    ]"
  >
    <nav :class="['mx-auto flex h-16 max-w-6xl items-center justify-between px-5', scrolled ? '' : '']">
      <div class="flex min-w-0 items-center gap-1">
        <RouterLink :to="navLink('/')" class="flex min-w-0 items-center gap-2.5" @click="open = false" title="멤버 홈으로">
          <img
            v-if="!isLanding && siteConfig.profileImage"
            :src="siteConfig.profileImage"
            alt="프로필"
            class="h-8 w-8 shrink-0 rounded-[10px] border border-[#E2E8F0] object-cover"
          />
          <span v-else class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#2563EB] text-sm font-800 font-bold text-white">P</span>
          <span class="truncate text-[17px] font-bold tracking-tight text-slate-900">{{ brandName }}</span>
        </RouterLink>
        <button
          v-if="showBack"
          class="ml-1 inline-flex shrink-0 items-center text-[12.5px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:hidden"
          @click="goBack"
          title="돌아가기"
        >
          <ChevronLeft :size="16" /> 돌아가기
        </button>
      </div>

      <!-- 랜딩 메뉴 -->
      <div v-if="isLanding" class="hidden items-center gap-1 md:flex">
        <a href="#features" class="rounded-[10px] px-3.5 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">기능</a>
        <a href="#start" class="rounded-[10px] px-3.5 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">시작 방법</a>
        <RouterLink to="/guide" class="rounded-[10px] px-3.5 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">배포 가이드</RouterLink>
        <RouterLink to="/explore" class="rounded-[10px] px-3.5 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">멤버 둘러보기</RouterLink>
        <RouterLink :to="myPageTarget" class="ml-2 rounded-[10px] bg-[#2563EB] px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#1D4ED8]">
          {{ primaryLabel }}
        </RouterLink>
        <button
          v-if="loggedIn"
          class="rounded-[10px] px-3 py-2 text-[14px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:hidden"
          @click="logout"
        >
          로그아웃
        </button>
        <RouterLink v-else to="/login" class="rounded-[10px] px-3 py-2 text-[14px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:hidden">로그인</RouterLink>
      </div>

      <div v-else class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :class="[
            'rounded-[10px] px-3.5 py-2 text-[14px] font-medium transition-colors',
            isActive(l.to) ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ]"
        >
          {{ l.label }}
        </RouterLink>
        <button
          v-if="loggedIn"
          class="rounded-[10px] px-3 py-2 text-[14px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:hidden"
          @click="logout"
        >
          로그아웃
        </button>
        <RouterLink
          v-else
          to="/login"
          class="ml-2 rounded-[10px] px-3 py-2 text-[14px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:hidden"
        >
          로그인
        </RouterLink>
      </div>

      <button class="rounded-[10px] p-2 text-slate-700 hover:bg-slate-100 md:hidden" @click="open = !open" aria-label="menu">
        <Menu v-if="!open" :size="22" />
        <X v-else :size="22" />
      </button>
    </nav>

    <div v-if="open" class="border-t border-[#E2E8F0] bg-white/95 px-5 py-3 backdrop-blur-md md:hidden">
      <template v-if="isLanding">
        <a href="#features" class="block rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-slate-700" @click="open = false">기능</a>
        <a href="#start" class="block rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-slate-700" @click="open = false">시작 방법</a>
        <RouterLink to="/guide" class="block rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-slate-700" @click="open = false">배포 가이드</RouterLink>
        <RouterLink to="/explore" class="block rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-slate-700" @click="open = false">멤버 둘러보기</RouterLink>
        <RouterLink :to="myPageTarget" class="mt-1 block rounded-[10px] bg-[#2563EB] px-3 py-2.5 text-center text-[15px] font-semibold text-white" @click="open = false">{{ primaryLabel }}</RouterLink>
        <button v-if="loggedIn" class="block w-full rounded-[10px] px-3 py-2.5 text-left text-[15px] font-medium text-slate-400 hover:text-slate-700" @click="logout">로그아웃</button>
        <RouterLink v-else to="/login" class="block rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-slate-400 hover:text-slate-700" @click="open = false">로그인</RouterLink>
      </template>
      <template v-else>
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :class="[
            'block rounded-[10px] px-3 py-2.5 text-[15px] font-medium',
            isActive(l.to) ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-slate-700',
          ]"
          @click="open = false"
        >
          {{ l.label }}
        </RouterLink>
        <button v-if="loggedIn" class="mt-1 block w-full rounded-[10px] px-3 py-2.5 text-left text-[15px] font-medium text-slate-400 hover:text-slate-700" @click="logout">로그아웃</button>
        <RouterLink v-else to="/login" class="mt-1 block rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-slate-400 hover:text-slate-700" @click="open = false">로그인</RouterLink>
      </template>
    </div>

    <!-- 본인 페이지 전용 관리 플로팅 버튼 (네브바 레이아웃을 밀지 않음) -->
    <!-- Teleport 필수: 헤더의 backdrop-blur가 fixed 기준점을 바꾸기 때문 -->
    <Teleport to="body">
      <RouterLink
        v-if="showManage"
        to="/admin"
        class="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(15,23,42,0.35)] transition-transform hover:scale-105"
      >
        <Settings2 :size="17" /> 관리
      </RouterLink>
    </Teleport>
    <!-- 구석 고정 돌아가기 (넓은 화면 전용 — 좁으면 제목 옆 버튼 사용) -->
    <Teleport to="body">
      <button
        v-if="showBack"
        class="fixed left-4 top-8 z-[60] hidden -translate-y-1/2 items-center text-[12.5px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:inline-flex"
        @click="goBack"
        title="돌아가기"
      >
        <ChevronLeft :size="16" /> 돌아가기
      </button>
    </Teleport>
    <!-- 구석 고정 로그인/로그아웃 (넓은 화면 전용 — 좁으면 네브바 안 버튼 사용) -->
    <Teleport to="body">
      <button
        v-if="loggedIn"
        class="fixed right-4 top-8 z-[60] hidden -translate-y-1/2 rounded-[10px] px-3 py-2 text-[14px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:inline-flex"
        @click="logout"
      >
        로그아웃
      </button>
      <RouterLink
        v-else
        to="/login"
        class="fixed right-4 top-8 z-[60] hidden -translate-y-1/2 rounded-[10px] px-3 py-2 text-[14px] font-medium text-slate-400 hover:text-slate-700 min-[1440px]:inline-flex"
      >
        로그인
      </RouterLink>
    </Teleport>
  </header>
</template>
