import { defineStore } from 'pinia'
import { ref } from 'vue'

// 전역 상태가 실제로 필요한 것만 Pinia에 둔다 (요구사항 준수).
// - 모바일 메뉴 / 프로젝트 필터 같은 UI 상태는 컴포넌트 로컬로 처리.
// - 여기서는 사이트 전역에서 참조되는 연락처 정도만 예시로 둔다.
export const useSiteStore = defineStore('site', () => {
  const emailCopied = ref(false)

  function markCopied() {
    emailCopied.value = true
    setTimeout(() => (emailCopied.value = false), 2000)
  }

  return { emailCopied, markCopied }
})
