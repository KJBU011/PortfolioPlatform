<script setup lang="ts">
import type { ErdTable } from '@/types/project'
import { KeyRound } from 'lucide-vue-next'

const props = withDefaults(defineProps<{ tables: ErdTable[]; note?: string }>(), { note: undefined })
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <div
      v-for="t in tables"
      :key="t.name"
      class="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white"
    >
      <div class="border-b border-[#E2E8F0] bg-[#0F172A] px-4 py-2.5">
        <p class="font-mono text-[14px] font-bold text-white">{{ t.name }}</p>
        <p class="text-[12px] text-slate-400">{{ t.comment }}</p>
      </div>
      <ul class="divide-y divide-slate-100 px-4 py-1">
        <li v-for="c in t.columns" :key="c.name" class="flex items-center justify-between gap-2 py-1.5">
          <span class="flex items-center gap-1.5 font-mono text-[12.5px] text-slate-800">
            <KeyRound v-if="c.pk || c.fk || c.uk" :size="12" :class="c.pk ? 'text-amber-500' : c.fk ? 'text-[#2563EB]' : 'text-violet-500'" />
            {{ c.name }}
            <span v-if="c.pk" class="rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-700">PK</span>
            <span v-if="c.fk" class="rounded bg-blue-100 px-1 text-[10px] font-bold text-blue-700">FK</span>
            <span v-if="c.uk" class="rounded bg-violet-100 px-1 text-[10px] font-bold text-violet-700">UK</span>
          </span>
          <span class="font-mono text-[11.5px] text-[#64748B]">{{ c.type }}</span>
        </li>
      </ul>
    </div>
  </div>
  <div
    v-if="note !== ''"
    class="mt-4 rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[#475569]"
  >
    <template v-if="note === undefined">
      cctv 1 ── N detection N ── 1 vehicle 1 ── N tracking<br />
      detection 1 ── N alert &nbsp;&nbsp;·&nbsp;&nbsp; PostGIS <span class="text-[#2563EB]">geom</span> 컬럼으로 인근 CCTV 반경 조회
    </template>
    <template v-else>{{ note }}</template>
  </div>
</template>
