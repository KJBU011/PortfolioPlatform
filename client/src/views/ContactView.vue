<script setup lang="ts">
import { ref, computed } from 'vue'
import { Mail, Github, Linkedin, Copy, Check, Send } from 'lucide-vue-next'
import SectionTitle from '@/components/common/SectionTitle.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { useSiteStore } from '@/stores/site'

const store = usePortfolioStore()
const siteConfig = computed(() => store.blocks.siteConfig)

const site = useSiteStore()
const name = ref('')
const email = ref('')
const message = ref('')
const sent = ref(false)
const sentMsg = ref('')

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(siteConfig.value.email)
  } catch { /* clipboard 미지원 환경 무시 */ }
  site.markCopied()
}

async function submit() {
  // Spring Boot가 떠 있으면 POST /api/contact, 없으면 mock 접수
  sentMsg.value = ''
  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value, message: message.value }),
    })
    const body = await r.json()
    if (!r.ok || !body.ok) throw new Error(body.message || '전송 실패')
    sentMsg.value = body.message || '접수되었습니다.'
  } catch {
    sentMsg.value = '접수되었습니다 (서버 미연결 — mock). server를 기동하면 실제 전송됩니다.'
  }
  sent.value = true
  setTimeout(() => (sent.value = false), 5000)
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-28">
    <SectionTitle eyebrow="Contact" title="연락하기" desc="협업 · 채용 · 프로젝트 문의 모두 환영합니다." />

    <div class="mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="flex flex-col gap-3">
        <button @click="copyEmail" class="flex items-center gap-4 rounded-[16px] border border-[#E2E8F0] bg-white p-5 text-left hover:border-[#2563EB]">
          <span class="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]"><Mail :size="20" /></span>
          <span class="flex-1">
            <span class="block text-[12.5px] font-semibold text-[#64748B]">Email {{ site.emailCopied ? '· 복사됨!' : '· 클릭하여 복사' }}</span>
            <span class="block font-mono text-[14.5px] font-semibold text-slate-900">{{ siteConfig.email }}</span>
          </span>
          <Copy v-if="!site.emailCopied" :size="16" class="text-slate-400" />
          <Check v-else :size="16" class="text-emerald-500" />
        </button>
        <a :href="siteConfig.github" target="_blank" rel="noreferrer" class="flex items-center gap-4 rounded-[16px] border border-[#E2E8F0] bg-white p-5 hover:border-[#2563EB]">
          <span class="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0F172A] text-white"><Github :size="20" /></span>
          <span>
            <span class="block text-[12.5px] font-semibold text-[#64748B]">GitHub</span>
            <span class="block text-[14.5px] font-semibold text-slate-900">{{ siteConfig.github.replace('https://', '') }}</span>
          </span>
        </a>
        <a :href="siteConfig.linkedin" target="_blank" rel="noreferrer" class="flex items-center gap-4 rounded-[16px] border border-[#E2E8F0] bg-white p-5 hover:border-[#2563EB]">
          <span class="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0077B5] text-white"><Linkedin :size="20" /></span>
          <span>
            <span class="block text-[12.5px] font-semibold text-[#64748B]">LinkedIn</span>
            <span class="block text-[14.5px] font-semibold text-slate-900">{{ siteConfig.linkedin.replace('https://', '') }}</span>
          </span>
        </a>
        <div class="rounded-[14px] bg-[#0F172A] p-5 text-[13px] leading-relaxed text-slate-300">
          URL은 <span class="font-mono text-white">src/data/profile.ts → siteConfig</span>에서 수정 가능합니다.
        </div>
      </div>

      <form @submit.prevent="submit" class="rounded-[16px] border border-[#E2E8F0] bg-white p-6 md:p-8">
        <label class="block text-[13.5px] font-bold text-slate-800">이름<input v-model="name" required placeholder="홍길동" class="mt-1.5 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white" /></label>
        <label class="mt-4 block text-[13.5px] font-bold text-slate-800">이메일<input v-model="email" type="email" required placeholder="you@company.com" class="mt-1.5 w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white" /></label>
        <label class="mt-4 block text-[13.5px] font-bold text-slate-800">메시지<textarea v-model="message" required rows="5" placeholder="프로젝트 협업 / 채용 문의 등 자유롭게 남겨주세요." class="mt-1.5 w-full resize-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white" /></label>
        <button type="submit" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#2563EB] px-5 py-3 text-[14.5px] font-semibold text-white hover:bg-[#1D4ED8]">
          <Send :size="16" /> 메시지 보내기
        </button>
        <p v-if="sent" class="mt-3 rounded-[10px] bg-emerald-50 px-4 py-2.5 text-[13.5px] font-medium text-emerald-700">
          {{ sentMsg }}
        </p>
        <p class="mt-3 text-[12.5px] text-[#64748B]">server(Spring Boot, :8081)가 떠 있으면 실제 접수, 없으면 mock으로 동작합니다.</p>
      </form>
    </div>
  </div>
</template>
