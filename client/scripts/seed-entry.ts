// 시드용 진입점 — esbuild로 번들되어 node에서 실행됨.
// (브라우저가 아니라 window/localStorage가 없어 기본 mock 값이 export됨)
import { projects } from '@/data/projects'
import { stackGroups } from '@/data/stacks'
import { timeline } from '@/data/timeline'
import { siteConfig, summaryStats, interests, valuesQuote } from '@/data/profile'
import { demoDetections, demoAlerts, demoHourlyCounts } from '@/data/demo'

export const snapshot = {
  projects,
  stackGroups,
  timeline,
  siteConfig,
  summaryStats,
  interests,
  valuesQuote,
  demoDetections,
  demoAlerts,
  demoHourlyCounts,
}
