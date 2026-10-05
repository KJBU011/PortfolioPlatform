<script setup lang="ts">
import { computed } from 'vue'
import { Download, Github, Linkedin, Mail, Quote } from 'lucide-vue-next'
import SectionTitle from '@/components/common/SectionTitle.vue'
import ImagePlaceholder from '@/components/common/ImagePlaceholder.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { Eye, Server, Database, Radar, Monitor, RefreshCw, Container, Activity } from 'lucide-vue-next'

const store = usePortfolioStore()
const siteConfig = computed(() => store.blocks.siteConfig)
const interests = computed(() => store.blocks.interests)
const valuesQuote = computed(() => store.blocks.valuesQuote)
const timeline = computed(() => store.blocks.timeline)

const iconMap: Record<string, any> = {
  eye: Eye, server: Server, database: Database, radar: Radar,
  monitor: Monitor, refresh: RefreshCw, container: Container, activity: Activity,
}
</script>

<template>
  <div class="pt-16">
    <!-- About Me -->
    <section class="mx-auto grid max-w-6xl gap-10 px-5 pb-4 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <SectionTitle eyebrow="About Me" title="문제를 해결하는 서비스 개발자" />
        <p class="mt-4 max-w-xl text-[15px] leading-relaxed text-[#475569]">
          AI 모델의 성능 수치만 높이는 것이 아니라, 모델이 실제 서비스 안에서 어떻게 동작하고
          사용자에게 어떤 가치를 주는지를 중요하게 생각합니다. CCTV 관제, MRO 현장, 설비 데이터까지 —
          현장에서 돌아가는 AI · Backend · Data 파이프라인을 만듭니다.
        </p>
        <div class="mt-6 flex flex-wrap gap-2.5">
          <a :href="siteConfig.resumeUrl" class="inline-flex items-center gap-2 rounded-[12px] bg-[#2563EB] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#1D4ED8]">
            <Download :size="16" /> 이력서 다운로드
          </a>
          <a :href="siteConfig.github" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-800 hover:border-[#2563EB] hover:text-[#2563EB]">
            <Github :size="16" /> GitHub
          </a>
          <a :href="siteConfig.linkedin" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-800 hover:border-[#2563EB] hover:text-[#2563EB]">
            <Linkedin :size="16" /> LinkedIn
          </a>
          <a :href="`mailto:${siteConfig.email}`" class="inline-flex items-center gap-2 rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-2.5 text-[14px] font-semibold text-slate-800 hover:border-[#2563EB] hover:text-[#2563EB]">
            <Mail :size="16" /> Email
          </a>
        </div>
      </div>
      <div class="rounded-[16px] border border-[#E2E8F0] bg-white p-4">
        <ImagePlaceholder v-if="!siteConfig.profileImage" label="Profile Image 영역 (URL 교체 가능)" ratio="aspect-[4/3]" />
        <img v-else :src="siteConfig.profileImage" alt="profile" class="aspect-[4/3] w-full rounded-[12px] object-cover" />
        <div class="flex items-center justify-between px-1 pb-1 pt-3">
          <div>
            <p class="text-[15px] font-bold text-slate-900">{{ siteConfig.name }}</p>
            <p class="text-[13px] text-[#64748B]">{{ siteConfig.role }}</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700">Open to Work</span>
        </div>
      </div>
    </section>

    <!-- 관심 분야 + 경력 및 활동 (02번 화면: 2열) -->
    <section class="mx-auto grid max-w-6xl gap-10 px-5 pt-14 lg:grid-cols-2">
      <div>
        <SectionTitle eyebrow="Interests" title="관심 분야" />
        <div class="mt-6 flex flex-col gap-3">
          <div v-for="it in interests" :key="it.title" class="flex gap-4 rounded-[14px] border border-[#E2E8F0] bg-white p-4">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#2563EB]">
              <component :is="iconMap[it.icon]" :size="20" />
            </span>
            <div>
              <p class="text-[14.5px] font-bold text-slate-900">{{ it.title }}</p>
              <p class="mt-1 text-[13px] leading-relaxed text-[#64748B]">{{ it.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle eyebrow="Journey" title="경력 및 활동" />
        <div class="relative ml-2 mt-8 border-l-2 border-[#E2E8F0]">
          <div v-for="t in timeline" :key="t.title" class="relative mb-7 pl-7">
            <span :class="['absolute -left-[8px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px]', t.current ? 'border-[#2563EB] bg-white' : 'border-[#CBD5E1] bg-white']" />
            <p class="font-mono text-[12px] font-semibold text-[#2563EB]">{{ t.period }}</p>
            <h3 class="mt-0.5 text-[15.5px] font-bold text-slate-900">{{ t.title }}</h3>
            <p class="mt-1 text-[13.5px] leading-relaxed text-[#475569]">{{ t.description }}</p>
            <div v-if="t.tags" class="mt-2 flex flex-wrap gap-1.5">
              <span v-for="tag in t.tags" :key="tag" class="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11.5px] font-medium text-slate-600">#{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 가치관 -->
    <section class="mx-auto max-w-6xl px-5 pt-6">
      <div class="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center md:p-12">
        <Quote :size="28" class="mx-auto text-[#2563EB]" />
        <p class="mx-auto mt-4 max-w-2xl whitespace-pre-line text-[19px] font-bold leading-relaxed tracking-tight text-slate-900 md:text-[22px]">
          "{{ valuesQuote.text }}"
        </p>
        <p class="mt-4 text-[13px] font-semibold uppercase tracking-widest text-[#64748B]">— {{ valuesQuote.author }}</p>
      </div>
    </section>
  </div>
</template>
