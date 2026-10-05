<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Users, ArrowRight } from 'lucide-vue-next'
import SectionTitle from '@/components/common/SectionTitle.vue'
import { listPortfolios } from '@/lib/auth'

const users = ref<Awaited<ReturnType<typeof listPortfolios>>>([])
const loading = ref(true)

onMounted(async () => {
  users.value = await listPortfolios()
  loading.value = false
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-28">
    <SectionTitle eyebrow="Members" title="멤버 포트폴리오" desc="이 플랫폼에 공개된 사용자들의 포트폴리오입니다. /admin에서 내 페이지를 만들 수 있습니다." />
    <p v-if="loading" class="mt-8 text-[14px] text-[#64748B]">불러오는 중…</p>
    <div v-else-if="users.length === 0" class="mt-8 rounded-[16px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center">
      <Users :size="28" class="mx-auto text-slate-300" />
      <p class="mt-3 text-[14.5px] font-semibold text-slate-800">아직 공개된 멤버가 없습니다</p>
      <p class="mt-1 text-[13px] text-[#64748B]">/admin에서 로그인하고 사용자 아이디를 만들면 여기에 표시됩니다.</p>
    </div>
    <div v-else class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="u in users" :key="u.username"
        :to="`/u/${u.username}`"
        class="group rounded-[16px] border border-[#E2E8F0] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]"
      >
        <img
          v-if="u.avatar"
          :src="u.avatar"
          :alt="u.display_name || u.username"
          class="h-12 w-12 rounded-[14px] border border-[#E2E8F0] object-cover"
        />
        <span v-else class="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#2563EB] text-[18px] font-bold text-white">
          {{ (u.display_name || u.username).slice(0, 1).toUpperCase() }}
        </span>
        <p class="mt-3 text-[16px] font-bold text-slate-900">{{ u.display_name || u.username }}</p>
        <p class="font-mono text-[12.5px] text-[#2563EB]">/u/{{ u.username }}</p>
        <span class="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-slate-500 group-hover:text-[#2563EB]">
          보러 가기 <ArrowRight :size="15" />
        </span>
      </RouterLink>
    </div>
  </div>
</template>
