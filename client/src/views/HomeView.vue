<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, Play, Cctv, ScanSearch, BellRing } from 'lucide-vue-next'
import SectionTitle from '@/components/common/SectionTitle.vue'
import ProjectCard from '@/components/common/ProjectCard.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useLinkBase } from '@/composables/useLinkBase'

const store = usePortfolioStore()
const { link } = useLinkBase()
const siteConfig = computed(() => store.blocks.siteConfig)
// 히어로 문구: 비어 있으면 기본 템플릿 표시
const heroA = computed(() => siteConfig.value.heroTitleA || 'AI와 데이터를')
const heroB = computed(() => siteConfig.value.heroTitleB || '실제 서비스로 연결하는')
const heroC = computed(() => siteConfig.value.heroTitleC || '개발자')
const heroSub = computed(() => siteConfig.value.heroSub || 'Computer Vision · Backend · Data Pipeline · Web Application')
const heroImage = computed(() => siteConfig.value.heroImage || '')
const stackGroups = computed(() => store.blocks.stackGroups)
const featured = computed(() => store.blocks.projects.filter((p) => p.featured).slice(0, 3))

// Home 통계는 직접 입력이 아니라 실제 데이터에서 유도 (4번째 '성장하는 개발자' 삭제)
const stats = computed(() => {
  const featuredCount = store.blocks.projects.filter((p) => p.featured).length
  const interestNames = store.blocks.interests.map((i) => i.title)
  const stackCount = store.blocks.stackGroups.reduce((n, g) => n + g.items.length, 0)
  return [
    { value: String(featuredCount), label: '주요 프로젝트' },
    { value: interestNames.length ? interestNames.join(' · ') : '—', label: '주요 관심 분야' },
    { value: String(stackCount), label: '사용한 기술 스택' },
  ]
})
const topProject = computed(() => store.blocks.projects[0])
</script>

<template>
  <!-- ═══ HERO (01번 화면: 야간 CCTV 관제 배경) ═══ -->
  <section class="relative overflow-hidden bg-[#081426] pt-16">
    <!-- 배경: 그리드 + 블루 글로우 + 도로 라인 -->
    <div
      class="pointer-events-none absolute inset-0"
      style="background-image: radial-gradient(circle at 80% 20%, rgba(37,99,235,0.25), transparent 55%), radial-gradient(circle at 10% 90%, rgba(37,99,235,0.12), transparent 50%)"
    />
    <div class="pointer-events-none absolute inset-0 opacity-[0.12]" style="background-image: linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px); background-size: 44px 44px" />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-40" style="background: linear-gradient(transparent, rgba(37,99,235,0.08))" />
    <div class="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-14 md:pt-20 lg:grid-cols-[1fr_1fr]">
      <div>
        <h1 class="mt-2 text-[34px] font-extrabold leading-[1.18] tracking-tight text-white md:text-[44px]">
          {{ heroA }}<br />
          <span class="text-[#60A5FA]">{{ heroB }}</span><br v-if="heroC" />
          {{ heroC }}
        </h1>
        <p class="mt-5 text-[14px] font-medium tracking-wide text-slate-300 md:text-[15px]">
          {{ heroSub }}
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <RouterLink
            :to="link('/projects')"
            class="inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
          >
            프로젝트 보기
          </RouterLink>
          <RouterLink
            :to="link('/about')"
            class="inline-flex items-center gap-2 rounded-[10px] border border-white/25 bg-transparent px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
          >
            자기소개 보기
          </RouterLink>
        </div>
      </div>

      <!-- 우측: 등록 이미지 우선, 없으면 CCTV 목업 -->
      <div v-if="heroImage" class="overflow-hidden rounded-[16px] border border-white/15">
        <img :src="heroImage" alt="대표 이미지" class="aspect-[16/10] w-full object-cover" />
      </div>
      <div v-else class="relative overflow-hidden rounded-[16px] border border-white/15 bg-[#0B1B33]">
        <div class="flex items-center justify-between px-4 py-2.5">
          <span class="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span class="h-2 w-2 animate-pulse rounded-full bg-red-500" /> CCTV-04 · LIVE 09:24:15
          </span>
          <span class="font-mono text-[11px] text-slate-500">1920×1080</span>
        </div>
        <!-- 야간 도로 시뮬레이션 -->
        <div class="relative aspect-[16/9] overflow-hidden" style="background: linear-gradient(180deg, #060D1D 0%, #0B1B33 45%, #101E38 60%, #060B18 60%, #0A1428 100%)">
          <div class="absolute left-0 right-0 top-[60%] h-[2px] bg-amber-400/40" />
          <div class="absolute left-0 right-0 top-[78%] h-[3px] bg-white/10" />
          <!-- 탐지 박스들 -->
          <div class="absolute left-[12%] top-[38%] h-[26%] w-[16%] rounded-[4px] border-2 border-red-500">
            <span class="absolute -top-5 left-0 whitespace-nowrap rounded bg-red-500 px-1.5 font-mono text-[10px] font-bold text-white">12가 3456 · 0.97</span>
          </div>
          <div class="absolute left-[42%] top-[46%] h-[20%] w-[12%] rounded-[4px] border-2 border-[#60A5FA]">
            <span class="absolute -top-5 left-0 whitespace-nowrap rounded bg-[#2563EB] px-1.5 font-mono text-[10px] font-bold text-white">34나 7890 · 0.94</span>
          </div>
          <div class="absolute left-[68%] top-[42%] h-[22%] w-[13%] rounded-[4px] border-2 border-[#60A5FA]">
            <span class="absolute -top-5 left-0 whitespace-nowrap rounded bg-[#2563EB] px-1.5 font-mono text-[10px] font-bold text-white">56다 1234 · 0.91</span>
          </div>
          <!-- 스캔라인 -->
          <div class="absolute inset-x-0 top-[30%] h-8 bg-gradient-to-b from-transparent via-[#60A5FA]/15 to-transparent" />
        </div>
        <div class="flex items-center gap-4 px-4 py-2.5 font-mono text-[11px] text-slate-400">
          <span class="flex items-center gap-1.5"><ScanSearch :size="13" class="text-[#60A5FA]" /> YOLOv8 · 94.1%</span>
          <span class="flex items-center gap-1.5"><Cctv :size="13" class="text-[#60A5FA]" /> 12ch</span>
          <span class="ml-auto flex items-center gap-1.5 text-amber-400"><BellRing :size="13" /> 수배 2건</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ SUMMARY STATS (01번 화면: 단일 카드 4분할) ═══ -->
  <section class="mx-auto max-w-6xl px-5">
    <div class="grid grid-cols-1 divide-[#E2E8F0] rounded-[16px] border border-[#E2E8F0] bg-white sm:grid-cols-3 sm:divide-x max-sm:divide-y">
      <div v-for="s in stats" :key="s.label" class="px-6 py-5 text-center">
        <p class="truncate text-[22px] font-extrabold tracking-tight text-slate-900" :title="s.value">{{ s.value }}</p>
        <p class="mt-1 text-[12.5px] font-medium text-[#64748B]">{{ s.label }}</p>
      </div>
    </div>
  </section>

  <!-- ═══ 주요 프로젝트 ═══ -->
  <section class="mx-auto max-w-6xl px-5 pt-16">
    <div class="flex items-end justify-between gap-4">
      <SectionTitle eyebrow="Featured" title="주요 프로젝트" desc="카드 클릭 시 Demo · AI 파이프라인 · 아키텍처가 담긴 상세 페이지로 이동합니다." />
      <RouterLink :to="link('/projects')" class="hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] md:inline-flex">
        전체 보기 <ArrowRight :size="16" />
      </RouterLink>
    </div>
    <div v-if="featured.length === 0" class="mt-7 rounded-[16px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
      <p class="text-[14.5px] font-semibold text-slate-800">아직 등록된 주요 프로젝트가 없습니다</p>
      <p class="mt-1 text-[13px] text-[#64748B]">/admin에서 프로젝트에 별(★) 표시를 하면 여기에 표시됩니다.</p>
      <RouterLink :to="link('/projects')" class="mt-4 inline-block rounded-[10px] border border-[#E2E8F0] px-5 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB]">
        전체 프로젝트 보기
      </RouterLink>
    </div>
    <div v-else class="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCard v-for="p in featured" :key="p.slug" :project="p" />
    </div>
  </section>

  <!-- ═══ 기술 스택 ═══ -->
  <section class="mx-auto max-w-6xl px-5 pt-16">
    <SectionTitle eyebrow="Tech Stack" title="기술 스택" desc="data/stacks.ts 한 곳에서 관리 — 수정하면 Home과 Skills 페이지에 자동 반영됩니다." />
    <div class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div v-for="g in stackGroups" :key="g.category" class="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
        <p class="text-[13px] font-bold uppercase tracking-wider text-[#2563EB]">{{ g.category }}</p>
        <div class="mt-3 flex flex-col gap-2">
          <span v-for="item in g.items" :key="item" class="rounded-[10px] bg-[#F1F5F9] px-3 py-2 text-[13.5px] font-semibold text-slate-800">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ CTA ═══ -->
  <section class="mx-auto max-w-6xl px-5 pt-16">
    <div class="flex flex-col items-start gap-5 rounded-[16px] bg-[#0F172A] p-8 md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <h3 class="text-[22px] font-bold tracking-tight text-white">프로젝트의 실제 동작이 궁금하신가요?</h3>
        <p class="mt-2 text-[14.5px] text-slate-300">상세 페이지에서 Live Demo · AI Demo · 시스템 아키텍처를 직접 확인해 보세요.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <RouterLink v-if="topProject" :to="link(`/projects/${topProject.slug}`)" class="inline-flex items-center gap-2 rounded-[12px] bg-[#2563EB] px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-[#1D4ED8]">
          <Play :size="16" /> 대표 프로젝트 체험하기
        </RouterLink>
        <RouterLink :to="link('/contact')" class="inline-flex items-center gap-2 rounded-[12px] border border-white/20 px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-white/10">
          연락하기
        </RouterLink>
      </div>
    </div>
  </section>
</template>
