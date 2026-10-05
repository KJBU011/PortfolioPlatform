import type { TimelineItem } from '@/types/project'
import { readOverride } from '@/lib/content'

const defaultTimeline: TimelineItem[] = [
  {
    period: '2024 — 현재',
    title: 'AI 관제 · MRO 프로젝트 개발',
    org: 'Personal / Team Projects',
    description:
      'CCTV 차량 관제, ToolTrace(MRO Tool Control), 예지보전 시스템 등 AI 모델을 실제 서비스로 연결하는 프로젝트를 진행.',
    tags: ['YOLO', 'FastAPI', 'Spring Boot', 'Vue'],
    current: true,
  },
  {
    period: '2023',
    title: 'Backend · Data Pipeline 학습 및 구축',
    org: 'Study / Side Project',
    description:
      'Spring Boot API 설계, PostgreSQL/PostGIS 공간 데이터 처리, Python 데이터 파이프라인과 리포트 자동화를 학습.',
    tags: ['Spring Boot', 'PostgreSQL', 'Python'],
  },
  {
    period: '2022',
    title: 'Computer Vision 입문',
    org: 'Study',
    description: 'OpenCV, PyTorch 기초와 객체 탐지(YOLO) 실습. 데이터 증강과 Hard Sample 분석의 중요성을 체감.',
    tags: ['PyTorch', 'YOLO', 'OpenCV'],
  },
]

export const timeline: TimelineItem[] = readOverride('timeline', defaultTimeline)
