<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  ArrowLeft, ArrowRight, Play, ExternalLink, Github, Sparkles,
  CheckCircle2, XCircle, TriangleAlert, Info, MonitorPlay,
} from 'lucide-vue-next'
import SectionTitle from '@/components/common/SectionTitle.vue'
import ImagePlaceholder from '@/components/common/ImagePlaceholder.vue'
import PipelineFlow from '@/components/project/PipelineFlow.vue'
import ArchitectureDiagram from '@/components/project/ArchitectureDiagram.vue'
import ErdDiagram from '@/components/project/ErdDiagram.vue'
import { cctvErd, cctvApiDemo } from '@/data/projects'
import { usePortfolioStore } from '@/stores/portfolio'
import { useLinkBase } from '@/composables/useLinkBase'
import {
  ScanText, Crosshair, Route as RouteIcon, Bell, Wrench, GitCompareArrows,
  ClipboardCheck, RefreshCw, Activity, TrendingUp, FileText,
  LayoutDashboard, Plug, Container, Expand, Monitor,
} from 'lucide-vue-next'

const route = useRoute()
const store = usePortfolioStore()
const { link } = useLinkBase()
const slug = computed(() => route.params.slug as string)
const project = computed(() => store.projectBySlug(slug.value))

const iconMap: Record<string, any> = {
  'scan-text': ScanText, crosshair: Crosshair, route: RouteIcon, bell: Bell,
  wrench: Wrench, 'git-compare': GitCompareArrows, 'clipboard-check': ClipboardCheck,
  'refresh-cw': RefreshCw, activity: Activity, 'trending-up': TrendingUp,
  'file-text': FileText, 'layout-dashboard': LayoutDashboard, plug: Plug,
  container: Container, expand: Expand, monitor: Monitor,
}

const allProjects = computed(() => store.blocks.projects)
const demoType = computed(() => project.value?.demoType ?? 'internal')
const demoUrl = computed(() => project.value?.demoUrl ?? '')
/** 외부 데모가 등록되어 있으면 외부로, 아니면 내장 데모 페이지로 */
const demoExternal = computed(() => demoType.value !== 'internal' && demoType.value !== 'none' && !!demoUrl.value)
const demoPath = computed(() => link(`/projects/${slug.value}/demo`))
const idx = computed(() => allProjects.value.findIndex((p) => p.slug === slug.value))
const prev = computed(() => (idx.value > 0 ? allProjects.value[idx.value - 1] : undefined))
const next = computed(() => (idx.value >= 0 && idx.value < allProjects.value.length - 1 ? allProjects.value[idx.value + 1] : undefined))

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'features', label: '핵심 기능' },
  { id: 'pipeline', label: 'AI 파이프라인' },
  { id: 'system', label: '시스템 구조' },
  { id: 'erd', label: 'ERD · API' },
]

function methodClass(m: string) {
  return m === 'GET'
    ? 'bg-sky-100 text-sky-700'
    : m === 'POST'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-amber-100 text-amber-700'
}
</script>

<template>
  <div v-if="!project" class="mx-auto max-w-3xl px-5 pt-32 text-center">
    <p class="text-[20px] font-bold">프로젝트를 찾을 수 없습니다</p>
    <p class="mt-2 font-mono text-[14px] text-[#64748B]">slug: {{ slug }}</p>
    <RouterLink :to="link('/projects')" class="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-[#2563EB] px-5 py-2.5 text-[14px] font-semibold text-white">
      <ArrowLeft :size="16" /> 목록으로 돌아가기
    </RouterLink>
  </div>

  <div v-else class="pt-16">
    <!-- ═══ 04 헤더 (라이트) ═══ -->
    <section class="border-b border-[#E2E8F0] bg-white">
      <div class="mx-auto max-w-6xl px-5 pb-8 pt-10">
        <RouterLink :to="link('/projects')" class="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] hover:text-[#2563EB]">
          <ArrowLeft :size="14" /> Projects
        </RouterLink>
        <h1 class="mt-3 text-[28px] font-extrabold tracking-tight text-slate-900 md:text-[34px]">
          {{ project.title }}
        </h1>
        <p class="mt-2 max-w-2xl whitespace-pre-line text-[14.5px] leading-relaxed text-[#475569]">{{ project.short }}</p>
        <div class="mt-4 flex flex-wrap gap-1.5">
          <span v-for="t in project.tags" :key="t" class="rounded-full bg-[#EFF6FF] px-3 py-1 text-[12.5px] font-semibold text-[#1D4ED8]">#{{ t }}</span>
        </div>

        <!-- 데모 프리뷰: 좌 CCTV + 우 지도 (04번 화면) -->
        <component
          :is="demoExternal ? 'a' : 'RouterLink'"
          :to="demoExternal ? undefined : demoPath"
          :href="demoExternal ? demoUrl : undefined"
          :target="demoExternal ? '_blank' : undefined"
          :rel="demoExternal ? 'noreferrer' : undefined"
          class="group relative mt-6 grid overflow-hidden rounded-[16px] border border-[#E2E8F0] md:grid-cols-[1.2fr_0.8fr]"
        >
          <div class="relative aspect-[16/9] bg-[#081426] md:aspect-auto md:min-h-[300px]" style="background: linear-gradient(180deg, #060D1D 0%, #0B1B33 45%, #101E38 60%, #060B18 60%, #0A1428 100%)">
            <div class="absolute left-[10%] top-[36%] h-[28%] w-[18%] rounded-[4px] border-2 border-red-500">
              <span class="absolute -top-5 left-0 whitespace-nowrap rounded bg-red-500 px-1.5 font-mono text-[10px] font-bold text-white">12가 3456 · 0.97</span>
            </div>
            <div class="absolute left-[45%] top-[44%] h-[22%] w-[13%] rounded-[4px] border-2 border-[#60A5FA]" />
            <span class="absolute left-3 top-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> CCTV-04 · LIVE
            </span>
          </div>
          <div class="relative min-h-[220px] bg-[#E8EEF5] md:min-h-[300px]" style="background-image: linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px); background-size: 28px 28px">
            <svg viewBox="0 0 300 220" class="absolute inset-0 h-full w-full">
              <path d="M30 190 C 80 150, 100 120, 140 110 S 220 70, 260 30" fill="none" stroke="#2563EB" stroke-width="3" stroke-dasharray="7 5" />
              <circle cx="30" cy="190" r="6" fill="#2563EB" />
              <circle cx="140" cy="110" r="6" fill="#2563EB" />
              <circle cx="260" cy="30" r="7" fill="#EF4444" />
            </svg>
            <span class="absolute bottom-3 right-3 rounded-full bg-[#0F172A] px-2.5 py-1 font-mono text-[10.5px] text-white">경로 추적 · 3구간</span>
          </div>
          <span class="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_8px_30px_rgba(37,99,235,0.5)] transition-transform group-hover:scale-105">
              <Play :size="26" class="ml-1" />
            </span>
          </span>
        </component>

        <div class="mt-5 flex flex-wrap gap-2.5">
          <component
            :is="demoExternal ? 'a' : 'RouterLink'"
            :to="demoExternal ? undefined : demoPath"
            :href="demoExternal ? demoUrl : undefined"
            :target="demoExternal ? '_blank' : undefined"
            :rel="demoExternal ? 'noreferrer' : undefined"
            class="inline-flex items-center gap-2 rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#1D4ED8]"
          >
            <MonitorPlay :size="16" /> Live Demo <ExternalLink v-if="demoExternal" :size="14" />
          </component>
          <a
            v-for="l in project.links.filter((x) => x.kind !== 'live')"
            :key="l.label"
            :href="l.url"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-700 hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <component :is="l.kind === 'github' ? Github : l.kind === 'ai-demo' ? Sparkles : ExternalLink" :size="16" /> {{ l.label }}
          </a>
        </div>

        <!-- Hugging Face 임베드 (demoType=huggingface) -->
        <div v-if="demoType === 'huggingface' && demoUrl" class="mt-5 overflow-hidden rounded-[16px] border border-[#E2E8F0]">
          <div class="flex items-center justify-between bg-[#F8FAFC] px-4 py-2.5">
            <span class="flex items-center gap-2 text-[13px] font-bold text-slate-800"><Sparkles :size="15" class="text-[#2563EB]" /> AI Demo 임베드</span>
            <a :href="demoUrl" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2563EB]">새창으로 열기 <ExternalLink :size="13" /></a>
          </div>
          <iframe :src="demoUrl" title="AI Demo" class="aspect-[16/10] w-full bg-white" loading="lazy" />
        </div>
      </div>
      <!-- 섹션 앵커 내비 -->
      <div class="sticky top-16 z-30 border-t border-[#E2E8F0] bg-white/90 backdrop-blur-md">
        <div class="nice-scroll mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-2">
          <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-[#EFF6FF] hover:text-[#2563EB]">
            {{ s.label }}
          </a>
          <component
            :is="demoExternal ? 'a' : 'RouterLink'"
            :to="demoExternal ? undefined : demoPath"
            :href="demoExternal ? demoUrl : undefined"
            :target="demoExternal ? '_blank' : undefined"
            :rel="demoExternal ? 'noreferrer' : undefined"
            class="whitespace-nowrap rounded-full bg-[#0F172A] px-4 py-1.5 text-[13px] font-semibold text-white"
          >
            Live Demo →
          </component>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-6xl space-y-14 px-5 pt-10">
      <!-- ═══ 프로젝트 개요 ═══ -->
      <section id="overview" class="scroll-mt-32 rounded-[16px] border border-[#E2E8F0] bg-white p-6 md:p-8" style="border-radius: 16px">
        <SectionTitle eyebrow="Overview" title="프로젝트 개요" />
        <dl class="mt-6 overflow-hidden rounded-[12px] border border-[#E2E8F0]">
          <div v-for="row in [
            { k: '프로젝트 기간', v: project.period },
            { k: '개발 인원', v: project.team },
            { k: '주요 역할', v: project.role },
            { k: '개발 목적', v: project.purpose },
          ]" :key="row.k" class="grid gap-1 border-b border-[#E2E8F0] last:border-0 sm:grid-cols-[160px_1fr]">
            <dt class="bg-[#F8FAFC] px-5 py-3.5 text-[13px] font-bold text-slate-700">{{ row.k }}</dt>
            <dd class="px-5 py-3.5 text-[14px] leading-relaxed text-slate-900">{{ row.v }}</dd>
          </div>
        </dl>
      </section>

      <!-- ═══ 05 핵심 기능 + 데모 화면 ═══ -->
      <section id="features" class="scroll-mt-32">
        <SectionTitle eyebrow="Features" title="핵심 기능" desc="실제 관제 업무에서 필요한 주요 기능을 구현했습니다." />
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(f, i) in project.features" :key="f.title" class="rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <div class="flex items-center justify-between">
              <span class="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]">
                <component :is="iconMap[f.icon] ?? Monitor" :size="20" />
              </span>
              <span class="font-mono text-[12px] font-bold text-slate-300">0{{ i + 1 }}</span>
            </div>
            <p class="mt-3 text-[15px] font-bold text-slate-900">{{ f.title }}</p>
            <p class="mt-1.5 text-[13px] leading-relaxed text-[#64748B]">{{ f.description }}</p>
          </div>
        </div>
        <h3 class="mt-8 text-[17px] font-bold text-slate-900">데모 화면</h3>
        <div class="mt-3 rounded-[16px] border border-[#E2E8F0] bg-white p-4">
          <component
            :is="demoExternal ? 'a' : 'RouterLink'"
            :to="demoExternal ? undefined : demoPath"
            :href="demoExternal ? demoUrl : undefined"
            :target="demoExternal ? '_blank' : undefined"
            :rel="demoExternal ? 'noreferrer' : undefined"
          >            <ImagePlaceholder label="Dashboard Demo Screenshot — 클릭하면 Live Demo로 이동" ratio="aspect-[21/9]" />
          </component>
          <div class="nice-scroll mt-3 flex gap-3 overflow-x-auto pb-1">
            <div v-for="(g, i) in project.gallery" :key="i" class="w-56 shrink-0">
              <ImagePlaceholder :label="`Thumbnail ${i + 1}`" ratio="aspect-[16/9]" />
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ 06 AI 파이프라인 + 성능 + 실패 분석 ═══ -->
      <section id="pipeline" class="scroll-mt-32 rounded-[16px] border border-[#E2E8F0] bg-white p-6 md:p-8">
        <SectionTitle eyebrow="AI Pipeline" title="AI 모델 파이프라인" desc="차량 탐색부터 번호판 인식까지의 전체 파이프라인을 구축했습니다." />
        <PipelineFlow :steps="project.pipeline" class="mt-6" />

        <div v-if="project.versions.length" class="mt-10">
          <h3 class="text-[17px] font-bold text-slate-900">모델 성능 개선 과정</h3>
          <p class="mt-1 text-[13px] text-[#64748B]">지속적인 실험과 실패 케이스 분석을 통해 정확도를 향상시켰습니다.</p>
          <div class="mt-3 flex items-start gap-2 rounded-[12px] bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-800">
            <Info :size="16" class="mt-0.5 shrink-0" />
            <span>아래 수치는 디자인을 위한 Demo Data이며 실제 측정값이 아닙니다.</span>
          </div>
          <div class="mt-4 overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
            <table class="w-full min-w-[560px] text-left text-[14px]">
              <thead>
                <tr class="bg-[#F8FAFC] text-[12.5px] uppercase tracking-wider text-[#64748B]">
                  <th class="px-5 py-3 font-bold">Version</th>
                  <th class="px-5 py-3 font-bold">개선 사항</th>
                  <th class="px-5 py-3 text-right font-bold">Accuracy</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="v in project.versions" :key="v.version" class="hover:bg-[#F8FAFC]">
                  <td class="px-5 py-3"><span class="font-mono text-[13px] font-bold text-slate-900">{{ v.version }}</span></td>
                  <td class="px-5 py-3 text-slate-700">{{ v.change }}</td>
                  <td class="px-5 py-3 text-right font-mono text-[14px] font-bold text-[#2563EB]">{{ v.accuracy }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="project.failureCases.length" class="mt-10">
          <h3 class="text-[17px] font-bold text-slate-900">실패 사례 분석</h3>
          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <div class="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <p class="flex items-center gap-2 text-[14px] font-bold text-slate-900"><CheckCircle2 :size="17" class="text-emerald-500" /> 정상 인식</p>
              <div class="mt-3 rounded-[10px] bg-[#0F172A] p-4 text-center">
                <p class="font-mono text-[22px] font-bold tracking-widest text-white">12가 3456</p>
                <p class="mt-1 font-mono text-[12px] text-emerald-400">Confidence 0.97</p>
              </div>
            </div>
            <div class="rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              <p class="flex items-center gap-2 text-[14px] font-bold text-slate-900"><XCircle :size="17" class="text-red-500" /> 인식 실패 사례</p>
              <ul class="mt-3 flex flex-col gap-2 text-[13.5px] text-slate-700">
                <li v-for="fc in project.failureCases" :key="fc.cause" class="flex gap-2">
                  <TriangleAlert :size="15" class="mt-0.5 shrink-0 text-amber-500" />
                  <span><span class="font-bold">· {{ fc.cause }}</span> — {{ fc.detail }}</span>
                </li>
              </ul>
            </div>
          </div>
          <blockquote v-if="project.failureMessage" class="mt-5 rounded-[14px] border-l-4 border-[#2563EB] bg-[#EFF6FF] px-6 py-5 text-[15px] font-semibold leading-relaxed text-[#1E3A8A]">
            "{{ project.failureMessage }}"
          </blockquote>
        </div>
      </section>

      <!-- ═══ 07 시스템 아키텍처 ═══ -->
      <section id="system" class="scroll-mt-32 rounded-[16px] border border-[#E2E8F0] bg-white p-6 md:p-8">
        <SectionTitle eyebrow="Architecture" title="시스템 아키텍처" desc="AI, Backend, DB, Frontend가 유기적으로 연결된 구조로 설계했습니다." />
        <ArchitectureDiagram class="mt-6" />
      </section>

      <!-- ═══ 07 ERD + API ═══ -->
      <section id="erd" class="scroll-mt-32 rounded-[16px] border border-[#E2E8F0] bg-white p-6 md:p-8">
        <SectionTitle eyebrow="Database" title="ERD (주요 테이블)" />
        <ErdDiagram :tables="cctvErd" class="mt-6" />

        <h3 class="mt-10 text-[17px] font-bold text-slate-900">API (Demo)</h3>
        <p class="mt-1 text-[13px] text-[#64748B]">실제 운영 API가 아닌 포트폴리오 시연용. 상세한 API 명세는 연동 시 제공됩니다.</p>
        <div class="mt-4 overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
          <table class="w-full min-w-[560px] text-left text-[13.5px]">
            <tbody class="divide-y divide-slate-100">
              <tr v-for="a in cctvApiDemo" :key="a.path" class="hover:bg-[#F8FAFC]">
                <td class="w-20 px-4 py-3"><span :class="['rounded-[6px] px-2 py-1 font-mono text-[11.5px] font-bold', methodClass(a.method)]">{{ a.method }}</span></td>
                <td class="px-4 py-3 font-mono text-[13px] text-slate-900">{{ a.path }}</td>
                <td class="px-4 py-3 text-slate-600">{{ a.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <component
          :is="demoExternal ? 'a' : 'RouterLink'"
          :to="demoExternal ? undefined : demoPath"
          :href="demoExternal ? demoUrl : undefined"
          :target="demoExternal ? '_blank' : undefined"
          :rel="demoExternal ? 'noreferrer' : undefined"
          class="mt-6 flex items-center justify-between rounded-[14px] bg-[#0F172A] px-6 py-5 hover:bg-[#1a2742]"
        >
          <div>
            <p class="text-[15px] font-bold text-white">
              {{ demoExternal ? '외부 Live Demo에서 직접 체험하기 →' : '샘플 데이터로 동작하는 Live Demo 체험하기 →' }}
            </p>
            <p class="mt-0.5 font-mono text-[12px] text-slate-400">{{ demoExternal ? demoUrl : '관제 대시보드 · 차량 탐지 · 경로 추적 · 알림 탭' }}</p>
          </div>
          <MonitorPlay :size="24" class="shrink-0 text-[#60A5FA]" />
        </component>
      </section>

      <!-- 이전/다음 -->
      <nav class="grid gap-3 md:grid-cols-2">
        <RouterLink v-if="prev" :to="link(`/projects/${prev.slug}`)" class="group rounded-[14px] border border-[#E2E8F0] bg-white p-4 hover:border-[#2563EB]">
          <span class="flex items-center gap-1.5 text-[12.5px] font-medium text-[#64748B]"><ArrowLeft :size="14" /> 이전 프로젝트</span>
          <span class="mt-1 block text-[15px] font-bold text-slate-900 group-hover:text-[#2563EB]">{{ prev.title }}</span>
        </RouterLink>
        <div v-else />
        <RouterLink v-if="next" :to="link(`/projects/${next.slug}`)" class="group rounded-[14px] border border-[#E2E8F0] bg-white p-4 text-right hover:border-[#2563EB]">
          <span class="flex items-center justify-end gap-1.5 text-[12.5px] font-medium text-[#64748B]">다음 프로젝트 <ArrowRight :size="14" /></span>
          <span class="mt-1 block text-[15px] font-bold text-slate-900 group-hover:text-[#2563EB]">{{ next.title }}</span>
        </RouterLink>
      </nav>
    </div>
  </div>
</template>
