import { computed } from 'vue'
import { useRoute } from 'vue-router'

/** /u/:username 하위에서는 모든 내부 링크 앞에 /u/:username을 붙인다 */
export function useLinkBase() {
  const route = useRoute()
  const base = computed(() => {
    const m = route.path.match(/^\/u\/([^/]+)/)
    return m ? `/u/${m[1]}` : ''
  })
  const link = (p: string) => `${base.value}${p === '/' ? '' : p}` || '/'
  return { base, link }
}
