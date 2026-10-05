<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { BookOpen, Terminal, KeyRound, Camera, Lightbulb, ArrowRight } from 'lucide-vue-next'
import SectionTitle from '@/components/common/SectionTitle.vue'
import ImagePlaceholder from '@/components/common/ImagePlaceholder.vue'
import { deployGuide } from '@/data/guide'
</script>

<template>
  <div class="mx-auto max-w-4xl px-5 pt-28">
    <SectionTitle
      eyebrow="Guide"
      title="멤버 배포 가이드"
      desc="내 프로젝트를 세상에 공개하고 포트폴리오에 등록하는 순서. 사진 자리는 semi 배포하면서 찍어서 채우는 중입니다."
    />

    <div class="relative ml-2 mt-10 border-l-2 border-[#E2E8F0]">
      <section v-for="s in deployGuide" :key="s.no" class="relative mb-6 pl-8">
        <span class="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] font-mono text-[13px] font-bold text-white">
          {{ s.no }}
        </span>
        <div class="rounded-[16px] border border-[#E2E8F0] bg-white p-6">
          <h2 class="flex items-center gap-2 text-[17px] font-bold"><BookOpen :size="17" class="text-[#2563EB]" /> {{ s.title }}</h2>
          <p class="mt-2 text-[14px] leading-relaxed text-[#475569]">{{ s.desc }}</p>

          <div v-if="s.commands?.length" class="mt-3 overflow-x-auto rounded-[12px] bg-[#0F172A] p-4">
            <p class="mb-2 flex items-center gap-1.5 font-mono text-[11px] text-slate-400"><Terminal :size="13" /> 명령어·설정</p>
            <pre class="font-mono text-[12.5px] leading-relaxed text-slate-200">{{ s.commands.join('\n') }}</pre>
          </div>

          <div v-if="s.env?.length" class="mt-3 overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
            <table class="w-full min-w-[480px] text-left text-[13px]">
              <thead>
                <tr class="bg-[#F8FAFC] text-[12px] uppercase tracking-wider text-[#64748B]">
                  <th class="px-4 py-2.5 font-bold">환경변수</th>
                  <th class="px-4 py-2.5 font-bold">값 예시</th>
                  <th class="px-4 py-2.5 font-bold">어디서</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="e in s.env" :key="e.key">
                  <td class="px-4 py-2.5 font-mono text-[12.5px] font-bold text-slate-900">{{ e.key }}</td>
                  <td class="px-4 py-2.5 font-mono text-[12.5px] text-slate-600">{{ e.value }}</td>
                  <td class="px-4 py-2.5 text-slate-600">{{ e.note }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-3">
            <img
              v-if="s.image"
              :src="s.image"
              :alt="s.imageCaption ?? s.title"
              class="w-full rounded-[12px] border border-[#E2E8F0]"
            />
            <div v-else class="rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-center">
              <Camera :size="22" class="mx-auto text-slate-300" />
              <p class="mt-2 text-[13px] font-semibold text-slate-600">스크린샷 자리: {{ s.imageCaption ?? '화면 캡처' }}</p>
              <p class="text-[12px] text-slate-400">data/guide.ts의 image에 경로만 넣으면 표시됩니다</p>
            </div>
          </div>

          <p v-if="s.tip" class="mt-3 flex items-start gap-2 rounded-[12px] bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-800">
            <Lightbulb :size="15" class="mt-0.5 shrink-0" /> {{ s.tip }}
          </p>
        </div>
      </section>
    </div>

    <div class="mt-8 flex flex-col items-start gap-4 rounded-[16px] bg-[#0F172A] p-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-[19px] font-bold text-white">배포가 끝났다면</h3>
        <p class="mt-1 text-[14px] text-slate-300">프로젝트 등록 마법사에서 외부 URL로 연결하세요.</p>
      </div>
      <RouterLink to="/admin" class="inline-flex shrink-0 items-center gap-2 rounded-[12px] bg-[#2563EB] px-5 py-3 text-[14px] font-semibold text-white">
        프로젝트 등록하기 <ArrowRight :size="16" />
      </RouterLink>
    </div>

    <p class="mt-6 flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
      <KeyRound :size="13" /> API 키·DB 비밀번호는 절대 캡처에 포함하지 마세요.
    </p>
  </div>
</template>
