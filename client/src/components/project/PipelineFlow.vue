<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown, ArrowRight } from 'lucide-vue-next'
import type { PipelineStep } from '@/types/project'

const props = defineProps<{ steps: PipelineStep[] }>()

const topRow = computed(() => props.steps.slice(0, 4))
// 스네이크 흐름: 아래 행은 역순 배치 — OCR(우상) ↓ Tracking(우하) → … → Dashboard(좌하)
const bottomRow = computed(() => props.steps.slice(4, 8).reverse())
</script>

<template>
  <div>
    <!-- Desktop: 4열 스네이크 그리드 (06번 화면). 4개 이하면 1행 -->
    <div v-if="steps.length <= 4" class="hidden items-stretch gap-0 lg:flex">
      <template v-for="(s, i) in steps" :key="s.title">
        <div
          :class="[
            'flex min-w-0 flex-1 flex-col justify-center rounded-[14px] border px-3 py-4 text-center',
            s.accent ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC]',
          ]"
        >
          <p :class="['text-[13px] font-bold leading-snug', s.accent ? 'text-[#1D4ED8]' : 'text-slate-900']">{{ s.title }}</p>
          <p class="mt-1 font-mono text-[11px] text-[#64748B]">{{ s.subtitle }}</p>
        </div>
        <div v-if="i < steps.length - 1" class="flex items-center px-1.5 text-[#2563EB]">
          <ArrowRight :size="18" />
        </div>
      </template>
    </div>
    <div v-else class="hidden gap-0 lg:block">
      <div class="grid grid-cols-7 items-stretch">
        <template v-for="(s, i) in topRow" :key="s.title">
          <div
            :class="[
              'flex flex-col justify-center rounded-[14px] border px-3 py-4 text-center',
              s.accent ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC]',
            ]"
          >
            <p :class="['text-[13px] font-bold leading-snug', s.accent ? 'text-[#1D4ED8]' : 'text-slate-900']">{{ s.title }}</p>
            <p class="mt-1 font-mono text-[11px] text-[#64748B]">{{ s.subtitle }}</p>
          </div>
          <div v-if="i < 3" class="flex items-center justify-center text-[#2563EB]">
            <ArrowRight :size="18" />
          </div>
        </template>
      </div>
      <div class="grid grid-cols-7 py-1">
        <div class="col-span-6" />
        <div class="flex justify-center text-[#2563EB]"><ArrowDown :size="18" /></div>
      </div>
      <div class="grid grid-cols-7 items-stretch">
        <template v-for="(s, i) in bottomRow" :key="s.title">
          <div
            :class="[
              'flex flex-col justify-center rounded-[14px] border px-3 py-4 text-center',
              s.accent ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC]',
            ]"
          >
            <p :class="['text-[13px] font-bold leading-snug', s.accent ? 'text-[#1D4ED8]' : 'text-slate-900']">{{ s.title }}</p>
            <p class="mt-1 font-mono text-[11px] text-[#64748B]">{{ s.subtitle }}</p>
          </div>
          <div v-if="i < bottomRow.length - 1" class="flex items-center justify-center text-[#2563EB]">
            <ArrowRight :size="18" class="rotate-180" />
          </div>
        </template>
      </div>
    </div>
    <!-- Mobile/Tablet: vertical flow -->
    <div class="flex flex-col gap-0 lg:hidden">
      <template v-for="(s, i) in steps" :key="s.title">
        <div
          :class="[
            'rounded-[14px] border px-4 py-3.5',
            s.accent ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white',
          ]"
        >
          <div class="flex items-center gap-3">
            <span
              :class="[
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                s.accent ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-slate-600',
              ]"
            >
              {{ i + 1 }}
            </span>
            <div>
              <p :class="['text-[14px] font-bold', s.accent ? 'text-[#1D4ED8]' : 'text-slate-900']">{{ s.title }}</p>
              <p class="font-mono text-[12px] text-[#64748B]">{{ s.subtitle }}</p>
            </div>
          </div>
        </div>
        <div v-if="i < steps.length - 1" class="flex justify-start py-1 pl-7 text-[#2563EB]">
          <ArrowDown :size="18" />
        </div>
      </template>
    </div>
  </div>
</template>
