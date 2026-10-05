<script setup lang="ts">
import { ArrowDown, ArrowRight, Cctv, BrainCircuit, Database, Server, LayoutDashboard } from 'lucide-vue-next'
</script>

<template>
  <div class="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 md:p-7">
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
