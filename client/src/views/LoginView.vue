<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Send, KeyRound } from 'lucide-vue-next'
import { signInWithEmail, signInWithPassword, signUpWithPassword, getSession, postLoginTarget, isSupabaseConfigured } from '@/lib/auth'

const REMEMBER_KEY = 'pp:login-email'

const router = useRouter()
type Mode = 'magic' | 'password' | 'signup'
const mode = ref<Mode>('magic')
const email = ref('')
const rememberEmail = ref(false)

onMounted(() => {
  try {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      email.value = saved
      rememberEmail.value = true
    }
  } catch { /* private mode 등 무시 */ }
})

function persistEmail() {
  try {
    if (rememberEmail.value && email.value.includes('@')) localStorage.setItem(REMEMBER_KEY, email.value.trim())
    else localStorage.removeItem(REMEMBER_KEY)
  } catch { /* 무시 */ }
}
const password = ref('')
const busy = ref(false)
const msg = ref('')
const cooldown = ref(0)
let cooldownTimer: number | undefined

getSession().then(async (s) => { if (s) router.replace(await postLoginTarget()) })

function startCooldown() {
  cooldown.value = 60
  window.clearInterval(cooldownTimer)
  cooldownTimer = window.setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) window.clearInterval(cooldownTimer)
  }, 1000)
}

async function submitMagic() {
  if (!email.value.includes('@')) {
    msg.value = '올바른 이메일을 입력하세요.'
    return
  }
  busy.value = true
  const r = await signInWithEmail(email.value)
  busy.value = false
  msg.value = r.message
  if (r.ok) {
    persistEmail()
    startCooldown() // 연타 방지 (rate limit 예방)
  }
}

async function submitPassword() {
  if (!email.value.includes('@') || !password.value) {
    msg.value = '이메일과 비밀번호를 입력하세요.'
    return
  }
  busy.value = true
  const r = await signInWithPassword(email.value, password.value)
  busy.value = false
  if (r.ok) {
    persistEmail()
    router.replace(await postLoginTarget())
  } else msg.value = r.message
}

async function submitSignup() {
  if (!email.value.includes('@') || password.value.length < 6) {
    msg.value = '이메일과 6자 이상 비밀번호를 입력하세요.'
    return
  }
  busy.value = true
  const r = await signUpWithPassword(email.value, password.value)
  busy.value = false
  msg.value = r.message
  if (r.message.includes('바로 로그인')) {
    persistEmail()
    setTimeout(async () => router.replace(await postLoginTarget()), 800)
  }
}
</script>

<template>
  <div class="mx-auto max-w-md px-5 pt-32">
    <div class="rounded-[16px] border border-[#E2E8F0] bg-white p-8 text-center">
      <Mail :size="28" class="mx-auto text-[#2563EB]" />
      <h1 class="mt-3 text-[20px] font-bold">내 포트폴리오 관리</h1>

      <div class="mt-4 grid grid-cols-3 gap-1 rounded-[12px] bg-[#F1F5F9] p-1 text-[13px] font-semibold">
        <button :class="['rounded-[9px] py-2', mode === 'magic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500']" @click="mode = 'magic'">매직링크</button>
        <button :class="['rounded-[9px] py-2', mode === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500']" @click="mode = 'password'">비밀번호</button>
        <button :class="['rounded-[9px] py-2', mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500']" @click="mode = 'signup'">회원가입</button>
      </div>

      <div v-if="isSupabaseConfigured">
        <form v-if="mode === 'magic'" class="mt-4 flex flex-col gap-2" @submit.prevent="submitMagic">
          <input v-model="email" type="email" required placeholder="you@example.com" class="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none focus:border-[#2563EB] focus:bg-white" />
          <label class="flex items-center gap-2 px-1 text-left text-[12.5px] text-slate-500">
            <input v-model="rememberEmail" type="checkbox" class="h-4 w-4 accent-[#2563EB]" /> 이메일 저장
          </label>
          <button :disabled="busy || cooldown > 0" class="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#2563EB] px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60">
            <Send :size="15" /> {{ cooldown > 0 ? `${cooldown}초 후 재발송 가능` : busy ? '발송 중…' : '로그인 링크 받기' }}
          </button>
          <p class="text-[12px] text-slate-400">링크는 1회만 요청하세요. 연타하면 시간당 발송 한도에 걸립니다.</p>
        </form>

        <form v-if="mode === 'password'" class="mt-4 flex flex-col gap-2" @submit.prevent="submitPassword">
          <input v-model="email" type="email" required placeholder="you@example.com" class="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none focus:border-[#2563EB] focus:bg-white" />
          <input v-model="password" type="password" required placeholder="비밀번호" class="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none focus:border-[#2563EB] focus:bg-white" />
          <label class="flex items-center gap-2 px-1 text-left text-[12.5px] text-slate-500">
            <input v-model="rememberEmail" type="checkbox" class="h-4 w-4 accent-[#2563EB]" /> 이메일 저장
          </label>
          <button :disabled="busy" class="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#0F172A] px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60">
            <KeyRound :size="15" /> {{ busy ? '확인 중…' : '로그인' }}
          </button>
          <p class="text-[12px] text-slate-400">이메일 발송 없이 즉시 로그인. /admin에서 비밀번호를 바꿀 수 있습니다.</p>
        </form>

        <form v-if="mode === 'signup'" class="mt-4 flex flex-col gap-2" @submit.prevent="submitSignup">
          <input v-model="email" type="email" required placeholder="you@example.com" class="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none focus:border-[#2563EB] focus:bg-white" />
          <input v-model="password" type="password" required minlength="6" placeholder="비밀번호 (6자 이상)" class="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-[14px] outline-none focus:border-[#2563EB] focus:bg-white" />
          <label class="flex items-center gap-2 px-1 text-left text-[12.5px] text-slate-500">
            <input v-model="rememberEmail" type="checkbox" class="h-4 w-4 accent-[#2563EB]" /> 이메일 저장
          </label>
          <button :disabled="busy" class="inline-flex items-center justify-center gap-2 rounded-[12px] bg-emerald-600 px-5 py-2.5 text-[14px] font-semibold text-white disabled:opacity-60">
            <KeyRound :size="15" /> {{ busy ? '처리 중…' : '가입하기' }}
          </button>
          <p class="text-[12px] text-slate-400">이메일 확인 없이 바로 가입하려면 대시보드 Authentication → Providers → Email에서 Confirm email을 OFF하세요.</p>
        </form>
      </div>
      <p v-else class="mt-5 rounded-[10px] bg-amber-50 px-4 py-3 text-[13px] text-amber-800">Supabase 미설정 — .env를 먼저 채우세요.</p>
      <p v-if="msg" class="mt-3 text-[13px] font-medium text-slate-700">{{ msg }}</p>
    </div>
  </div>
</template>
