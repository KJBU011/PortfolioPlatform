<script setup lang="ts">
import { computed } from 'vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { Monitor, Server, Brain, Database, Container } from 'lucide-vue-next'

const store = usePortfolioStore()
const stackGroups = computed(() => store.blocks.stackGroups)

const iconMap: Record<string, any> = {
  monitor: Monitor, server: Server, brain: Brain, database: Database, container: Container,
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-28">
    <SectionTitle
      eyebrow="Skills"
      title="기술 스택"
      desc="data/stacks.ts에서 카테고리·항목을 수정하면 이 페이지와 Home에 동시 반영됩니다."
    />
    <div class="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="g in stackGroups" :key="g.category" class="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0F172A] text-white">
            <component :is="iconMap[g.icon] ?? Monitor" :size="20" />
          </span>
          <h3 class="text-[16px] font-bold text-slate-900">{{ g.category }}</h3>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="item in g.items" :key="item" class="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-[13.5px] font-semibold text-slate-800">
            {{ item }}
          </span>
        </div>
        <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
          <div class="h-full w-3/4 rounded-full bg-[#2563EB]" />
        </div>
        <p class="mt-2 font-mono text-[11.5px] text-[#64748B]">used in {{ g.items.length }}+ projects</p>
      </div>
    </div>

    <div class="mt-8 rounded-[16px] bg-[#0F172A] p-8 md:p-10">
      <h3 class="text-[20px] font-bold text-white">Backend → AI → Data, 한 흐름으로 다룹니다</h3>
      <p class="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-slate-300">
        Spring Boot API 설계, FastAPI 추론 서버, PostgreSQL/PostGIS 공간 데이터, Vue 대시보드까지.
        각 레이어를 따로가 아니라 파이프라인으로 연결하는 것이 강점입니다.
      </p>
      <div class="mt-5 flex flex-wrap gap-2 font-mono text-[12.5px]">
        <span class="rounded-[8px] bg-white/10 px-3 py-1.5 text-slate-200">CCTV → FastAPI(YOLO/OCR) → PostgreSQL → Spring Boot → Vue</span>
      </div>
    </div>
  </div>
</template>
