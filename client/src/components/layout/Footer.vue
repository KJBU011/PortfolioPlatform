<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Github, Linkedin, Mail } from 'lucide-vue-next'
import { usePortfolioStore } from '@/stores/portfolio'
import { useLinkBase } from '@/composables/useLinkBase'

const route = useRoute()
const store = usePortfolioStore()
const { link } = useLinkBase()
const siteConfig = computed(() => store.blocks.siteConfig)
const routeUser = computed(() => route.path.match(/^\/u\/([^/]+)/)?.[1] ?? '')
const brandName = computed(() => {
  if (route.path === '/') return 'Portfolio Platform'
  return siteConfig.value.name || routeUser.value || 'Portfolio'
})
const isLanding = computed(() => route.path === '/')
</script>

<template>
  <footer class="mt-20 border-t border-[#E2E8F0] bg-white">
    <div class="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <div class="flex items-center gap-2.5">
          <img
            v-if="!isLanding && siteConfig.profileImage"
            :src="siteConfig.profileImage"
            alt="프로필"
            class="h-8 w-8 rounded-[10px] border border-[#E2E8F0] object-cover"
          />
          <span v-else class="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#2563EB] text-sm font-bold text-white">P</span>
          <span class="text-[17px] font-bold text-slate-900">{{ brandName }}</span>
        </div>
        <!-- 시작 화면(랜딩)용 구성 -->
        <template v-if="isLanding">
          <p class="mt-3 max-w-sm text-[14px] leading-relaxed text-[#64748B]">
            직접 체험하는 포트폴리오를 위한 멤버십 플랫폼.
            데모·아키텍처·AI 파이프라인까지 공개하는 공간입니다.
          </p>
          <RouterLink to="/login" class="mt-4 inline-block rounded-[10px] bg-[#0F172A] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#1e293b]">
            내 포트폴리오 만들기
          </RouterLink>
        </template>
        <!-- 개인 포트폴리오 화면용 구성 (유지) -->
        <template v-else>
          <p class="mt-3 max-w-sm text-[14px] leading-relaxed text-[#64748B]">
            읽는 포트폴리오가 아니라 직접 체험할 수 있는 포트폴리오 플랫폼. AI · Backend · Data 프로젝트의 Demo와
            아키텍처를 공개합니다.
          </p>
          <div class="mt-4 flex gap-2">
            <a :href="siteConfig.github" target="_blank" rel="noreferrer" class="rounded-[10px] border border-[#E2E8F0] p-2.5 text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB]" aria-label="GitHub">
              <Github :size="18" />
            </a>
            <a :href="siteConfig.linkedin" target="_blank" rel="noreferrer" class="rounded-[10px] border border-[#E2E8F0] p-2.5 text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB]" aria-label="LinkedIn">
              <Linkedin :size="18" />
            </a>
            <a :href="`mailto:${siteConfig.email}`" class="rounded-[10px] border border-[#E2E8F0] p-2.5 text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB]" aria-label="Email">
              <Mail :size="18" />
            </a>
          </div>
        </template>
      </div>
      <div v-if="isLanding">
        <p class="text-[13px] font-bold uppercase tracking-wider text-slate-400">시작하기</p>
        <div class="mt-3 flex flex-col gap-2 text-[14px]">
          <RouterLink to="/explore" class="text-slate-600 hover:text-[#2563EB]">멤버 둘러보기</RouterLink>
          <RouterLink to="/login" class="text-slate-600 hover:text-[#2563EB]">로그인</RouterLink>
          <RouterLink to="/admin" class="text-slate-600 hover:text-[#2563EB]">내 포트폴리오 만들기</RouterLink>
        </div>
      </div>
      <div v-else>
        <p class="text-[13px] font-bold uppercase tracking-wider text-slate-400">Menu</p>
        <div class="mt-3 flex flex-col gap-2 text-[14px]">
          <RouterLink :to="link('/')" class="text-slate-600 hover:text-[#2563EB]">Home</RouterLink>
          <RouterLink :to="link('/about')" class="text-slate-600 hover:text-[#2563EB]">About</RouterLink>
          <RouterLink :to="link('/projects')" class="text-slate-600 hover:text-[#2563EB]">Projects</RouterLink>
          <RouterLink :to="link('/skills')" class="text-slate-600 hover:text-[#2563EB]">Skills</RouterLink>
          <RouterLink :to="link('/contact')" class="text-slate-600 hover:text-[#2563EB]">Contact</RouterLink>
        </div>
      </div>
      <div v-if="isLanding">
        <p class="text-[13px] font-bold uppercase tracking-wider text-slate-400">플랫폼</p>
        <div class="mt-3 flex flex-col gap-2 text-[14px]">
          <a href="/#features" class="text-slate-600 hover:text-[#2563EB]">기능 살펴보기</a>
          <a href="/#start" class="text-slate-600 hover:text-[#2563EB]">시작 방법</a>
          <RouterLink to="/guide" class="text-slate-600 hover:text-[#2563EB]">배포 가이드</RouterLink>
        </div>
      </div>
      <div v-else>
        <p class="text-[13px] font-bold uppercase tracking-wider text-slate-400">Demo Links</p>
        <div class="mt-3 flex flex-col gap-2 text-[14px] text-slate-600">
          <span>Hugging Face Spaces (AI Demo)</span>
          <span>Live Demo URL (외부 서비스)</span>
          <span>Spring Boot API (연동 예정)</span>
        </div>
      </div>
    </div>
    <div class="border-t border-[#E2E8F0]">
      <div class="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 text-[13px] text-[#64748B] md:flex-row md:items-center md:justify-between">
        <span>© 2026 {{ brandName }}. Built with Vue 3 · Vite · TypeScript.</span>
        <span>Supabase 기반 멤버십 포트폴리오 플랫폼</span>
      </div>
    </div>
  </footer>
</template>
