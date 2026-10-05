<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { exchangeCodeForSession, postLoginTarget } from '@/lib/auth'

const router = useRouter()
const msg = ref('로그인 처리 중…')

onMounted(async () => {
  const ok = await exchangeCodeForSession()
  if (ok) {
    router.replace(await postLoginTarget())
  } else {
    msg.value = '로그인에 실패했습니다. 링크가 만료되었을 수 있으니 /login에서 다시 시도하세요.'
  }
})
</script>

<template>
  <div class="mx-auto max-w-md px-5 pt-36 text-center">
    <p class="text-[14.5px] font-medium text-slate-700">{{ msg }}</p>
  </div>
</template>
