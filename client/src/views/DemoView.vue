<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, Cctv, BellRing, Car, Route as RouteIcon, TriangleAlert, Info } from 'lucide-vue-next'
import { demoTabs } from '@/data/demo'
import { usePortfolioStore } from '@/stores/portfolio'
import { useLinkBase } from '@/composables/useLinkBase'

const route = useRoute()
const store = usePortfolioStore()
const { link } = useLinkBase()
const slug = computed(() => route.params.slug as string)
const project = computed(() => store.projectBySlug(slug.value))
const demoDetections = computed(() => store.blocks.demoDetections)
const demoAlerts = computed(() => store.blocks.demoAlerts)
const demoHourlyCounts = computed(() => store.blocks.demoHourlyCounts)

const tab = ref<(typeof demoTabs)[number]>('관제 대시보드')
const selectedId = ref(1)
const selected = computed(() => demoDetections.value.find((d) => d.id === selectedId.value) ?? demoDetections.value[0])
const maxCount = computed(() => Math.max(...demoHourlyCounts.value, 1))

function levelClass(level: string) {
  if (level === '긴급') return 'bg-red-100 text-red-700'
  if (level === '주의') return 'bg-amber-100 text-amber-700'
  return 'bg-sky-100 text-sky-700'
}
</script>

<template>
  <div class="bg-[#0B1220] pt-16">
    <div class="mx-auto max-w-6xl px-5 pb-10 pt-8">
      <RouterLink :to="link(`/projects/${slug}`)" class="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-white">
        <ArrowLeft :size="14" /> {{ project?.title ?? '프로젝트' }}
      </RouterLink>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <h1 class="text-[24px] font-extrabold tracking-tight text-white md:text-[28px]">Live Demo</h1>
        <span class="rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-slate-300">Portfolio Demo</span>
      </div>
      <p class="mt-2 flex max-w-3xl items-start gap-2 text-[13px] leading-relaxed text-slate-400">
        <Info :size="15" class="mt-0.5 shrink-0" />
        <span>실제 운영 시스템이 아닌 포트폴리오 시연용 화면입니다. 탐지 데이터는 샘플 데이터입니다. 추후 FastAPI AI Server 실시간 스트림으로 교체됩니다.</span>
      </p>

      <!-- 탭 -->
      <div class="mt-6 flex flex-wrap gap-2">
        <button
          v-for="t in demoTabs"
          :key="t"
          :class="[
            'rounded-[10px] px-4 py-2 text-[13.5px] font-semibold transition-colors',
            tab === t ? 'bg-[#2563EB] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20',
          ]"
          @click="tab = t"
        >
          {{ t }}
        </button>
      </div>

      <!-- ═══ 관제 대시보드 ═══ -->
      <div v-if="tab === '관제 대시보드'" class="mt-5 grid gap-4 lg:grid-cols-[240px_1fr_260px]">
        <!-- 좌: 탐지 피드 -->
        <div class="overflow-hidden rounded-[14px] border border-white/10 bg-white/[0.04]">
          <p class="border-b border-white/10 px-4 py-2.5 font-mono text-[11.5px] font-bold text-slate-400">탐지 피드 · {{ demoDetections.length }}건</p>
          <ul class="nice-scroll max-h-[520px] divide-y divide-white/5 overflow-y-auto">
            <li v-for="d in demoDetections" :key="d.id">
              <button
                :class="['flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors', selectedId === d.id ? 'bg-[#2563EB]/20' : 'hover:bg-white/5']"
                @click="selectedId = d.id"
              >
                <span class="flex h-11 w-14 shrink-0 items-center justify-center rounded-[8px] bg-[#16233D] font-mono text-[10px] text-slate-400">IMG</span>
                <span class="min-w-0">
                  <span class="flex items-center gap-1.5 text-[13px] font-bold text-white">
                    {{ d.plate }}
                    <span v-if="d.wanted" class="rounded bg-red-500/20 px-1.5 text-[10px] font-bold text-red-400">수배</span>
                  </span>
                  <span class="block truncate font-mono text-[10.5px] text-slate-400">{{ d.cctv }}</span>
                  <span class="block font-mono text-[10.5px] text-slate-500">{{ d.time }}</span>
                </span>
              </button>
            </li>
          </ul>
        </div>

        <!-- 중: 지도 + 경로 -->
        <div class="overflow-hidden rounded-[14px] border border-white/10 bg-[#E8EEF5]">
          <div class="relative min-h-[380px] lg:min-h-[520px]" style="background-image: linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px); background-size: 30px 30px">
            <svg viewBox="0 0 400 420" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
              <path d="M40 370 C 110 310, 130 250, 190 230 S 300 150, 350 60" fill="none" stroke="#2563EB" stroke-width="4" stroke-dasharray="9 6" />
              <circle cx="40" cy="370" r="8" fill="#2563EB" stroke="#fff" stroke-width="2" />
              <circle cx="190" cy="230" r="8" fill="#2563EB" stroke="#fff" stroke-width="2" />
              <circle cx="350" cy="60" r="10" fill="#EF4444" stroke="#fff" stroke-width="2" />
            </svg>
            <span class="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#0F172A]/90 px-3 py-1.5 font-mono text-[11px] text-white">
              <Cctv :size="13" /> {{ selected.plate }} 이동 경로
            </span>
            <span class="absolute bottom-3 left-3 rounded-[10px] bg-[#0F172A]/90 px-3.5 py-2 font-mono text-[11px] leading-relaxed text-slate-300">
              CCTV-01 → CCTV-04 → CCTV-09<br />예측 다음 출현: CCTV-09 (78%)
            </span>
          </div>
        </div>

        <!-- 우: 차량 상세 + 시간대 차트 -->
        <div class="flex flex-col gap-4">
          <div class="rounded-[14px] border border-white/10 bg-white/[0.04] p-4">
            <div class="flex h-24 items-center justify-center rounded-[10px] bg-[#16233D] font-mono text-[11px] text-slate-500">차량 이미지</div>
            <p class="mt-3 text-center font-mono text-[19px] font-bold tracking-wider text-white">{{ selected.plate }}</p>
            <dl class="mt-3 space-y-1.5 text-[12.5px]">
              <div class="flex justify-between"><dt class="text-slate-400">차종</dt><dd class="text-white">{{ selected.type }}</dd></div>
              <div class="flex justify-between"><dt class="text-slate-400">색상</dt><dd class="text-white">{{ selected.color }}</dd></div>
              <div class="flex justify-between"><dt class="text-slate-400">신뢰도</dt><dd class="font-mono font-bold text-emerald-400">{{ selected.confidence.toFixed(2) }}</dd></div>
              <div class="flex justify-between"><dt class="text-slate-400">CCTV</dt><dd class="text-white">{{ selected.cctv }}</dd></div>
            </dl>
          </div>
          <div class="rounded-[14px] border border-white/10 bg-white/[0.04] p-4">
            <p class="font-mono text-[11.5px] font-bold text-slate-400">시간대별 탐지량</p>
            <div class="mt-3 flex h-20 items-end gap-1">
              <div v-for="(c, i) in demoHourlyCounts" :key="i" class="flex-1 rounded-sm bg-[#2563EB]" :style="{ height: `${(c / maxCount) * 100}%` }" :title="`${c}건`" />
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ 차량 탐지 ═══ -->
      <div v-if="tab === '차량 탐지'" class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="d in demoDetections"
          :key="d.id"
          class="rounded-[14px] border border-white/10 bg-white/[0.04] p-4 text-left hover:border-[#2563EB]"
          @click="selectedId = d.id; tab = '관제 대시보드'"
        >
          <div class="flex h-28 items-center justify-center rounded-[10px] bg-[#16233D] font-mono text-[11px] text-slate-500">CCTV 스냅샷</div>
          <p class="mt-3 flex items-center gap-2 font-mono text-[15px] font-bold text-white">
            <Car :size="16" class="text-[#60A5FA]" /> {{ d.plate }}
            <span v-if="d.wanted" class="rounded bg-red-500/20 px-1.5 text-[10px] font-bold text-red-400">수배</span>
          </p>
          <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div class="h-full rounded-full bg-emerald-400" :style="{ width: `${d.confidence * 100}%` }" />
          </div>
          <p class="mt-1.5 flex justify-between font-mono text-[11px] text-slate-400"><span>{{ d.cctv }}</span><span>{{ d.confidence.toFixed(2) }}</span></p>
        </button>
      </div>

      <!-- ═══ 경로 추적 ═══ -->
      <div v-if="tab === '경로 추적'" class="mt-5 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div class="rounded-[14px] border border-white/10 bg-[#E8EEF5] p-5">
          <p class="flex items-center gap-2 text-[14px] font-bold text-slate-900"><RouteIcon :size="16" class="text-[#2563EB]" /> {{ selected.plate }} — CCTV 간 이동 경로</p>
          <div class="relative ml-2 mt-5 border-l-2 border-[#2563EB]/40">
            <div v-for="(d, i) in demoDetections.slice(0, 4)" :key="d.id" class="relative mb-5 pl-6">
              <span class="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#2563EB] ring-4 ring-[#2563EB]/20" />
              <p class="text-[13.5px] font-bold text-slate-900">{{ d.cctv }}</p>
              <p class="font-mono text-[12px] text-slate-500">{{ d.time }} · 신뢰도 {{ d.confidence.toFixed(2) }}</p>
              <p v-if="i === 0" class="mt-1 inline-block rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11.5px] font-bold text-[#1D4ED8]">다음 출현 예측: CCTV-09 (78%)</p>
            </div>
          </div>
        </div>
        <div class="rounded-[14px] border border-white/10 bg-white/[0.04] p-5 text-[13px] leading-relaxed text-slate-300">
          <p class="font-bold text-white">PostGIS 반경 조회 (Demo)</p>
          <p class="mt-2 font-mono text-[12px] text-slate-400">ST_DWithin(geom, %s, 1500)</p>
          <p class="mt-3">수배 차량 기준 반경 1.5km 내 CCTV 4대 — 관제 알림 발송 완료.</p>
        </div>
      </div>

      <!-- ═══ 알림 ═══ -->
      <div v-if="tab === '알림'" class="mt-5 flex flex-col gap-3">
        <div v-for="a in demoAlerts" :key="a.id" class="flex items-start gap-3 rounded-[14px] border border-white/10 bg-white/[0.04] px-5 py-4">
          <BellRing :size="18" class="mt-0.5 shrink-0 text-amber-400" />
          <div class="flex-1">
            <p class="text-[14px] font-medium text-white">{{ a.message }}</p>
            <p class="mt-0.5 font-mono text-[11.5px] text-slate-500">{{ a.time }}</p>
          </div>
          <span :class="['rounded-full px-2.5 py-1 text-[11.5px] font-bold', levelClass(a.level)]">{{ a.level }}</span>
        </div>
        <p class="flex items-center gap-1.5 text-[12.5px] text-slate-500"><TriangleAlert :size="13" /> 알림 dispatch API: POST /api/alerts/dispatch (연동 예정)</p>
      </div>
    </div>
  </div>
</template>
