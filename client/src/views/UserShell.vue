<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { UserX } from 'lucide-vue-next'
import { usePortfolioStore } from '@/stores/portfolio'

const route = useRoute()
const store = usePortfolioStore()
const username = computed(() => route.params.username as string)
</script>

<template>
  <div v-if="store.loading" class="mx-auto max-w-3xl px-5 pt-36 text-center">
    <p class="text-[15px] text-[#64748B]">포트폴리오를 불러오는 중…</p>
  </div>
  <div v-else-if="!store.userFound" class="mx-auto max-w-xl px-5 pt-36 text-center">
    <UserX :size="36" class="mx-auto text-slate-300" />
    <h1 class="mt-4 text-[22px] font-bold">@{{ username }} 님의 포트폴리오를 찾을 수 없습니다</h1>
    <p class="mt-2 text-[14px] text-[#64748B]">아이디를 확인하거나 다른 멤버를 둘러보세요.</p>
    <RouterLink to="/explore" class="mt-6 inline-block rounded-[12px] bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white">
      멤버 둘러보기
    </RouterLink>
  </div>
  <RouterView v-else />
</template>
