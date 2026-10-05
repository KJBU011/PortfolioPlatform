<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import { usePortfolioStore, ownerUsername } from '@/stores/portfolio'
import { pullFromSupabase } from '@/lib/content'

// 주인 데이터 보장 + (owner 미지정 시) 기존 content_blocks 동기화 유지
onMounted(async () => {
  try {
    await usePortfolioStore().ensureOwner()
    if (!ownerUsername && sessionStorage.getItem('pp:synced') !== '1') {
      const r = await pullFromSupabase()
      if (r.ok) {
        sessionStorage.setItem('pp:synced', '1')
        if (r.changed) window.location.reload()
      }
    }
  } catch { /* 오프라인/미설정 시 mock으로 계속 */ }
})
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-900">
    <Navbar />
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
