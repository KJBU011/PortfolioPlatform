<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mx-auto max-w-xl px-5 pt-36 text-center">
    <p class="font-mono text-[15px] font-bold text-[#2563EB]">404</p>
    <h1 class="mt-2 text-[26px] font-bold">페이지를 찾을 수 없습니다</h1>
    <RouterLink to="/" class="mt-6 inline-block rounded-[12px] bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white">홈으로 돌아가기</RouterLink>
  </div>
</template>
