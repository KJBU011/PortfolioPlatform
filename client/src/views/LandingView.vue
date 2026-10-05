<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight, MonitorPlay, GitBranch, Layers, Database,
  FlaskConical, Users, LogIn, PlusCircle, MousePointerClick,
} from 'lucide-vue-next'
import { listPortfolioPreviews, type PortfolioPreview } from '@/lib/auth'

const members = ref<PortfolioPreview[]>([])
const loading = ref(true)

onMounted(async () => {
  members.value = await listPortfolioPreviews()
  loading.value = false
})

const memberCount = computed(() => members.value.length)
const projectCount = computed(() => members.value.reduce((n, m) => n + m.projectCount, 0))

const features = [
  { icon: MonitorPlay, title: 'Live Demo 내장', desc: '관제 대시보드·차량 탐지·경로 추적·알림 탭이 들어간 실제 동작 데모. 샘플 데이터로 바로 체험.' },
  { icon: GitBranch, title: 'AI 파이프라인 시각화', desc: 'YOLO → OCR → Tracking → DB → 대시보드 흐름과 버전별 성능 개선 과정을 공개.' },
  { icon: Layers, title: '시스템 아키텍처', desc: 'CCTV → AI Server → PostgreSQL → API → 대시보드 구조를 다이어그램으로 설명.' },
  { icon: Database, title: 'ERD · API 명세', desc: '주요 테이블 관계와 REST 엔드포인트를 면접관이 읽기 쉽게 정리.' },
  { icon: FlaskConical, title: 'Failure Case 분석', desc: '성공 사례와 실패 원인(반사광·Blur 등)을 나란히 보여주는 엔지니어링 기록.' },
  { icon: MousePointerClick, title: '읽기가 아닌 체험', desc: '모든 프로젝트가 데모·코드·구조로 연결되는 체험형 포트폴리오 형식.' },
]

const steps = [
  { n: '01', title: '이메일로 로그인', desc: '/login에서 이메일 입력 → 메일 링크 클릭. 비밀번호 불필요.' },
  { n: '02', title: '/u/아이디 생성', desc: '/admin에서 아이디를 만들면 현재 템플릿이 통째로 복사됨.' },
  { n: '03', title: '편집하고 공개', desc: '프로젝트·스택·경력·데모 데이터를 고치고 저장하면 즉시 공개.' },
]
</script>

<template>
  <!-- ═══ HERO ═══ -->
  <section class="relative overflow-hidden bg-[#081426] pt-16">
    <div
      class="pointer-events-none absolute inset-0"
      style="background-image: radial-gradient(circle at 80% 20%, rgba(37,99,235,0.25), transparent 55%), radial-gradient(circle at 10% 90%, rgba(37,99,235,0.12), transparent 50%)"
    />
    <div class="pointer-events-none absolute inset-0 opacity-[0.12]" style="background-image: linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px); background-size: 44px 44px" />
    <div class="relative mx-auto max-w-6xl px-5 pb-16 pt-14 text-center md:pt-20">
      <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-medium text-slate-300">
        <span class="h-2 w-2 rounded-full bg-emerald-400" /> 멤버십 포트폴리오 플랫폼
      </span>
      <h1 class="mx-auto mt-5 max-w-3xl text-[34px] font-extrabold leading-[1.18] tracking-tight text-white md:text-[52px]">
        읽는 포트폴리오가 아니라<br />
        <span class="text-[#60A5FA]">직접 체험하는</span> 포트폴리오
      </h1>
      <p class="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-slate-300">
        AI · Backend · Data 프로젝트를 Demo와 아키텍처로 증명하는 공간.
        누구나 자신의 페이지를 만들고, 누구나 직접 실행해 볼 수 있다.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <RouterLink to="/explore" class="inline-flex items-center gap-2 rounded-[12px] bg-[#2563EB] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#1D4ED8]">
          멤버 둘러보기 <ArrowRight :size="17" />
        </RouterLink>
        <RouterLink to="/login" class="inline-flex items-center gap-2 rounded-[12px] border border-white/25 px-6 py-3 text-[15px] font-semibold text-white hover:bg-white/10">
          <LogIn :size="17" /> 내 포트폴리오 만들기
        </RouterLink>
      </div>
      <div class="mx-auto mt-10 grid max-w-2xl grid-cols-3 divide-x divide-white/10 rounded-[16px] border border-white/10 bg-white/[0.04]">
        <div class="px-4 py-5">
          <p class="text-[26px] font-extrabold text-white">{{ loading ? '–' : memberCount }}</p>
          <p class="mt-1 text-[12.5px] text-slate-400">공개 멤버</p>
        </div>
        <div class="px-4 py-5">
          <p class="text-[26px] font-extrabold text-white">{{ loading ? '–' : projectCount }}</p>
          <p class="mt-1 text-[12.5px] text-slate-400">공개 프로젝트</p>
        </div>
        <div class="px-4 py-5">
          <p class="text-[26px] font-extrabold text-[#60A5FA]">Live</p>
          <p class="mt-1 text-[12.5px] text-slate-400">데모 체험 가능</p>
        </div>
      </div>
    </div>
    <div class="relative h-8 bg-[#F8FAFC]" style="border-radius: 24px 24px 0 0" />
  </section>

  <!-- ═══ 멤버 쇼케이스 ═══ -->
  <section class="mx-auto max-w-6xl px-5 pt-12">
    <div class="flex items-end justify-between gap-4">
      <div class="max-w-2xl">
        <p class="text-[13px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">Showcase</p>
        <h2 class="mt-2 text-[26px] font-bold tracking-tight md:text-[32px]">공개된 멤버 포트폴리오</h2>
      </div>
      <RouterLink to="/explore" class="hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#2563EB] md:inline-flex">
        전체 보기 <ArrowRight :size="16" />
      </RouterLink>
    </div>
    <p v-if="loading" class="mt-6 text-[14px] text-[#64748B]">불러오는 중…</p>
    <div v-else-if="members.length === 0" class="mt-6 rounded-[16px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
      <Users :size="28" class="mx-auto text-slate-300" />
      <p class="mt-3 text-[14.5px] font-semibold">첫 번째 멤버가 되어 보세요</p>
      <RouterLink to="/login" class="mt-4 inline-block rounded-[12px] bg-[#0F172A] px-5 py-2.5 text-[13.5px] font-semibold text-white">
        내 페이지 만들기
      </RouterLink>
    </div>
    <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="m in members.slice(0, 6)" :key="m.username"
        :to="`/u/${m.username}`"
        class="group rounded-[16px] border border-[#E2E8F0] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="m.avatar"
            :src="m.avatar"
            :alt="m.display_name || m.username"
            class="h-11 w-11 rounded-[12px] border border-[#E2E8F0] object-cover"
          />
          <span v-else class="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#2563EB] text-[17px] font-bold text-white">
            {{ (m.display_name || m.username).slice(0, 1).toUpperCase() }}
          </span>
          <div>
            <p class="text-[15.5px] font-bold text-slate-900">{{ m.display_name || m.username }}</p>
            <p class="font-mono text-[12px] text-[#2563EB]">/u/{{ m.username }}</p>
          </div>
        </div>
        <p class="mt-3 text-[13px] text-[#64748B]">프로젝트 {{ m.projectCount }}개</p>
        <div v-if="m.tags.length" class="mt-2 flex flex-wrap gap-1.5">
          <span v-for="t in m.tags" :key="t" class="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[12px] font-medium text-[#1D4ED8]">#{{ t }}</span>
        </div>
      </RouterLink>
    </div>
  </section>

  <!-- ═══ 플랫폼 구성 요소 ═══ -->
  <section id="features" class="mx-auto max-w-6xl scroll-mt-24 px-5 pt-16">
    <p class="text-[13px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">Inside</p>
    <h2 class="mt-2 max-w-2xl text-[26px] font-bold tracking-tight md:text-[32px]">모든 포트폴리오에 기본 탑재되는 것들</h2>
    <div class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="f in features" :key="f.title" class="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
        <span class="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]">
          <component :is="f.icon" :size="20" />
        </span>
        <p class="mt-3 text-[15.5px] font-bold">{{ f.title }}</p>
        <p class="mt-1.5 text-[13.5px] leading-relaxed text-[#64748B]">{{ f.desc }}</p>
      </div>
    </div>
  </section>

  <!-- ═══ 시작 방법 ═══ -->
  <section id="start" class="mx-auto max-w-6xl scroll-mt-24 px-5 pt-16">
    <p class="text-[13px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">How it works</p>
    <h2 class="mt-2 text-[26px] font-bold tracking-tight md:text-[32px]">3단계로 시작</h2>
    <div class="mt-7 grid gap-4 md:grid-cols-3">
      <div v-for="s in steps" :key="s.n" class="rounded-[16px] bg-[#0F172A] p-6">
        <p class="font-mono text-[13px] font-bold text-[#60A5FA]">{{ s.n }}</p>
        <p class="mt-2 text-[16px] font-bold text-white">{{ s.title }}</p>
        <p class="mt-1.5 text-[13.5px] leading-relaxed text-slate-400">{{ s.desc }}</p>
      </div>
    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="mx-auto max-w-6xl px-5 pt-16">
    <div class="flex flex-col items-start gap-5 rounded-[16px] border border-[#2563EB]/20 bg-gradient-to-br from-[#EFF6FF] to-white p-8 md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <h3 class="flex items-center gap-2 text-[22px] font-bold tracking-tight"><PlusCircle :size="22" class="text-[#2563EB]" /> 당신의 프로젝트를 체험형으로 공개하세요</h3>
        <p class="mt-2 text-[14.5px] text-[#475569]">이메일 로그인 1분, 아이디 생성 즉시 /u/주소로 공개됩니다.</p>
      </div>
      <RouterLink to="/login" class="inline-flex shrink-0 items-center gap-2 rounded-[12px] bg-[#2563EB] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#1D4ED8]">
        <LogIn :size="17" /> 시작하기
      </RouterLink>
    </div>
  </section>
</template>
