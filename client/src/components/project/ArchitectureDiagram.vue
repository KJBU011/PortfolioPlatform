<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowDown, ArrowRight, Cctv, BrainCircuit, Database, Server, LayoutDashboard,
  Monitor, Cloud, Container, Plug, Bell, Activity, Wrench, Globe, Cpu, Smartphone,
} from 'lucide-vue-next'
import type { ArchRow } from '@/types/project'

const props = defineProps<{ rows?: ArchRow[] }>()

const iconMap: Record<string, any> = {
  cctv: Cctv, brain: BrainCircuit, database: Database, server: Server, dashboard: LayoutDashboard,
  monitor: Monitor, cloud: Cloud, container: Container, plug: Plug, bell: Bell,
  activity: Activity, wrench: Wrench, globe: Globe, cpu: Cpu, mobile: Smartphone,
}

/** 빈 행 제외 — 하나라도 노드가 있어야 직접 배치 모드 */
const activeRows = computed(() => (props.rows ?? []).filter((r) => (r.nodes ?? []).length > 0))
const hasCustom = computed(() => activeRows.value.length > 0)
</script>

<template>
  <!-- 직접 배치 모드: 행은 위→아래, 행 안 노드는 좌→우로 연결 -->
  <div v-if="hasCustom" class="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 md:p-7">
    <template v-for="(row, ri) in activeRows" :key="ri">
      <div v-if="ri > 0" class="flex justify-center py-1.5 text-[#2563EB]"><ArrowDown :size="20" /></div>
      <div class="flex flex-col items-stretch gap-2 md:flex-row">
        <template v-for="(n, ni) in row.nodes" :key="ni">
          <div v-if="ni > 0" class="flex items-center justify-center text-[#2563EB]">
            <ArrowRight :size="20" class="rotate-90 md:rotate-0" />
          </div>
          <div
            :class="[
              'flex flex-1 items-center gap-3 rounded-[12px] border px-4 py-3.5',
              n.accent ? 'border-2 border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white',
            ]"
          >
            <component :is="iconMap[n.icon] ?? Monitor" :size="22" :class="['shrink-0', n.accent ? 'text-[#2563EB]' : 'text-slate-700']" />
            <div>
              <p :class="['text-[14px] font-bold', n.accent ? 'text-[#1D4ED8]' : 'text-slate-900']">{{ n.title || '제목 없음' }}</p>
              <p class="font-mono text-[11px] text-[#64748B]">{{ n.subtitle }}</p>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>

  <!-- 기본(CCTV) 다이어그램 -->
  <div v-else class="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 md:p-7">
    <!-- 상단: CCTV → AI Server → PostgreSQL (07번 화면) -->
    <div class="grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <div class="flex items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3.5">
        <Cctv :size="22" class="shrink-0 text-slate-700" />
        <div>
          <p class="text-[14px] font-bold text-slate-900">CCTV</p>
          <p class="font-mono text-[11px] text-[#64748B]">영상 스트림</p>
        </div>
      </div>
      <div class="flex items-center justify-center text-[#2563EB]"><ArrowRight :size="20" class="rotate-90 md:rotate-0" /></div>
      <div class="rounded-[12px] border-2 border-[#2563EB] bg-[#EFF6FF] px-4 py-3.5">
        <div class="flex items-center gap-3">
          <BrainCircuit :size="22" class="shrink-0 text-[#2563EB]" />
          <div>
            <p class="text-[14px] font-bold text-[#1D4ED8]">AI Server</p>
            <p class="font-mono text-[11px] text-[#475569]">FastAPI / YOLO / OCR</p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center text-[#2563EB]"><ArrowRight :size="20" class="rotate-90 md:rotate-0" /></div>
      <div class="flex items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3.5">
        <Database :size="22" class="shrink-0 text-slate-700" />
        <div>
          <p class="text-[14px] font-bold text-slate-900">PostgreSQL</p>
          <p class="font-mono text-[11px] text-[#64748B]">PostGIS</p>
        </div>
      </div>
    </div>

    <!-- 연결: DB → API -->
    <div class="grid md:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <div />
      <div />
      <div class="flex justify-center py-2 text-[#2563EB]"><ArrowDown :size="20" /></div>
      <div />
      <div />
    </div>

    <!-- 하단: Spring Boot API ↔ Vue Dashboard -->
    <div class="grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr]">
      <div class="rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3.5 md:col-start-1">
        <div class="flex items-center gap-3">
          <Server :size="22" class="shrink-0 text-emerald-600" />
          <div>
            <p class="text-[14px] font-bold text-emerald-900">Spring Boot API</p>
            <p class="font-mono text-[11px] text-emerald-700">데이터 처리 / 비즈니스 로직</p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center font-bold text-[#2563EB]">↔</div>
      <div class="rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3.5">
        <div class="flex items-center gap-3">
          <LayoutDashboard :size="22" class="shrink-0 text-emerald-600" />
          <div>
            <p class="text-[14px] font-bold text-emerald-900">Vue Dashboard</p>
            <p class="font-mono text-[11px] text-emerald-700">관제 시각화 / 화면 표출</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
