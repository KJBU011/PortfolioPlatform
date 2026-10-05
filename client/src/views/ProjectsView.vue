<script setup lang="ts">
import { ref, computed } from 'vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import ProjectCard from '@/components/common/ProjectCard.vue'
import { projectFilters } from '@/data/projects'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()
const projects = computed(() => store.blocks.projects)

const active = ref<(typeof projectFilters)[number]>('전체')

const filtered = computed(() =>
  active.value === '전체' ? projects.value : projects.value.filter((p) => p.category === active.value),
)

function count(f: (typeof projectFilters)[number]) {
  return f === '전체' ? projects.value.length : projects.value.filter((p) => p.category === f).length
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-28">
    <SectionTitle
      eyebrow="Projects"
      title="프로젝트"
      desc="Filter를 클릭하면 카드가 실제로 필터링됩니다. 각 카드는 독립 상세 페이지(/projects/:slug)로 연결됩니다."
    />

    <div class="mt-6 flex flex-wrap gap-2">
      <button
        v-for="f in projectFilters"
        :key="f"
        :class="[
          'rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors',
          active === f
            ? 'border-[#2563EB] bg-[#2563EB] text-white'
            : 'border-[#E2E8F0] bg-white text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB]',
        ]"
        @click="active = f"
      >
        {{ f }} <span :class="['ml-1 text-[12px]', active === f ? 'text-blue-100' : 'text-slate-400']">{{ count(f) }}</span>
      </button>
    </div>

    <div class="mt-7 grid gap-5 md:grid-cols-2">
      <ProjectCard v-for="p in filtered" :key="p.slug" :project="p" />
    </div>

    <div v-if="filtered.length === 0" class="mt-10 rounded-[16px] border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-[14px] text-[#64748B]">
      해당 카테고리의 프로젝트가 없습니다.
    </div>

    <div class="mt-10 rounded-[16px] border border-[#E2E8F0] bg-white p-6 text-[13.5px] leading-relaxed text-[#64748B]">
      <span class="font-bold text-slate-800">새 프로젝트 추가 방법:</span>
      <span class="font-mono"> src/data/projects.ts</span>의
      <span class="font-mono">projects</span> 배열에 객체 1개를 추가하면 목록·필터·상세 페이지에 자동 반영됩니다.
      외부 Demo URL은 <span class="font-mono">links[].url</span>만 교체하면 됩니다.
    </div>
  </div>
</template>
