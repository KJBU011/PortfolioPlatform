// ─── Live Demo (08번 화면)용 샘플 데이터 ─────────────────────
// /admin에서 직접 수정 가능. Supabase 설정 시 클라우드 값 우선.
import { readOverride } from '@/lib/content'

export interface DemoDetection {
  id: number
  plate: string
  cctv: string
  time: string
  confidence: number
  wanted: boolean
  type: string
  color: string
}

const defaultDetections: DemoDetection[] = [
  { id: 1, plate: '12가 3456', cctv: 'CCTV-04 · 강남대로', time: '2026-09-12 09:24:15', confidence: 0.97, wanted: true, type: '세단', color: '흰색' },
  { id: 2, plate: '34나 7890', cctv: 'CCTV-02 · 테헤란로', time: '2026-09-12 09:21:03', confidence: 0.94, wanted: false, type: 'SUV', color: '검정' },
  { id: 3, plate: '56다 1234', cctv: 'CCTV-07 · 올림픽로', time: '2026-09-12 09:18:44', confidence: 0.91, wanted: false, type: '트럭', color: '파랑' },
  { id: 4, plate: '78라 5678', cctv: 'CCTV-01 · 한강대로', time: '2026-09-12 09:15:29', confidence: 0.89, wanted: true, type: '세단', color: '회색' },
  { id: 5, plate: '90마 2345', cctv: 'CCTV-05 · 반포대로', time: '2026-09-12 09:11:52', confidence: 0.93, wanted: false, type: '밴', color: '흰색' },
  { id: 6, plate: '13바 6789', cctv: 'CCTV-03 · 동작대로', time: '2026-09-12 09:08:17', confidence: 0.87, wanted: false, type: 'SUV', color: '빨강' },
]

export const demoDetections: DemoDetection[] = readOverride('demoDetections', defaultDetections)

export interface DemoAlert {
  id: number
  level: '긴급' | '주의' | '정보'
  message: string
  time: string
}

const defaultAlerts: DemoAlert[] = [
  { id: 1, level: '긴급', message: '수배 차량 12가 3456 — CCTV-04 인근에서 탐지', time: '09:24:15' },
  { id: 2, level: '주의', message: 'CCTV-07 저화질 구간 — 신뢰도 0.87 이하 3건', time: '09:18:44' },
  { id: 3, level: '정보', message: '경로 예측 갱신 — 12가 3456 다음 출현: CCTV-09 (확률 78%)', time: '09:25:02' },
]

export const demoAlerts: DemoAlert[] = readOverride('demoAlerts', defaultAlerts)

const defaultHourlyCounts = [12, 19, 9, 24, 31, 27, 18, 22, 15, 29, 35, 26]

export const demoHourlyCounts: number[] = readOverride('demoHourlyCounts', defaultHourlyCounts)

export const demoTabs = ['관제 대시보드', '차량 탐지', '경로 추적', '알림'] as const
