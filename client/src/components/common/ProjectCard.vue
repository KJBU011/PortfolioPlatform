<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import type { Project } from '@/types/project'
import ImagePlaceholder from '@/components/common/ImagePlaceholder.vue'
import { useLinkBase } from '@/composables/useLinkBase'

const props = defineProps<{ project: Project }>()
const { link: linkFn } = useLinkBase()

const tagColor: Record<string, string> = {}

function tagClass(tag: string) {
  void tag
  void tagColor
  return 'rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[12px] font-medium text-[#1D4ED8]'
}

const link = computed(() => linkFn(`/projects/${props.project.slug}`))
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)]"
  >
    <div class="p-3 pb-0">
      <ImagePlaceholder v-if="!project.thumbnail" :label="`${project.title} 썸네일 영역`" ratio="aspect-[16/9]" />
      <img v-else :src="project.thumbnail" :alt="project.title" class="aspect-[16/9] w-full rounded-[12px] object-cover" />
    </div>
    <div class="flex flex-1 flex-col p-5">
      <span class="inline-flex w-fit rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[12px] font-semibold text-[#475569]">
        {{ project.category }}
      </span>
      <h3 class="mt-2.5 text-[18px] font-bold tracking-tight text-slate-900">{{ project.title }}</h3>
      <p class="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-[#64748B]">{{ project.short }}</p>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span v-for="t in project.tags.slice(0, 5)" :key="t" :class="tagClass(t)">#{{ t }}</span>
      </div>
      <RouterLink
    :to="link"
        class="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#2563EB] hover:gap-2.5 hover:text-[#1D4ED8]"
        style="transition: gap .2s"
      >
        프로젝트 보기 <ArrowRight :size="16" />
      </RouterLink>
    </div>
  </article>
</template>
