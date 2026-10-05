<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; desc?: string; dark?: boolean }>()
</script>

<template>
  <div class="max-w-2xl">
    <p v-if="eyebrow" class="text-[13px] font-bold uppercase tracking-[0.12em] text-[#2563EB]">{{ eyebrow }}</p>
    <h2 :class="['mt-2 text-[26px] font-bold leading-tight tracking-tight md:text-[32px]', dark ? 'text-white' : 'text-slate-900']">
      {{ title }}
    </h2>
    <p v-if="desc" :class="['mt-3 text-[15px] leading-relaxed', dark ? 'text-slate-300' : 'text-[#64748B]']">{{ desc }}</p>
  </div>
</template>
