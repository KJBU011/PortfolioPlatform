<script setup lang="ts">
import { ImageIcon } from 'lucide-vue-next'

defineProps<{
  label?: string
  ratio?: string // tailwind aspect class e.g. "aspect-[16/9]"
  dark?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'flex w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed',
      ratio ?? 'aspect-[16/9]',
      dark ? 'border-white/20 bg-white/5 text-slate-300' : 'border-[#CBD5E1] bg-[#F1F5F9] text-[#64748B]',
    ]"
  >
    <ImageIcon :size="28" class="opacity-60" />
    <span class="px-4 text-center text-[13px] font-medium">{{ label ?? '이미지 URL만 교체하면 표시됩니다' }}</span>
    <span class="rounded-full bg-black/5 px-2.5 py-1 font-mono text-[11px] opacity-70">thumbnail / screenshot</span>
  </div>
</template>
