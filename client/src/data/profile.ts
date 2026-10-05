// ─── 사이트 전역 설정: /admin에서 직접 수정 가능 (없으면 아래 기본값) ───
import { readOverride } from '@/lib/content'

const defaultSiteConfig = {
  name: 'YourName',
  role: 'AI · Backend Developer',
  heroTitleA: 'AI와 데이터를',
  heroTitleB: '실제 서비스로 연결하는',
  heroTitleC: '개발자',
  heroSub: 'Computer Vision · Backend · Data Pipeline · Web Application',
  email: 'hello@example.com',
  github: 'https://github.com/yourname',
  linkedin: 'https://www.linkedin.com/in/yourname',
  resumeUrl: '#',
  // Hero 우측 / About 프로필 이미지: 나중에 URL만 교체
  heroImage: '',
  profileImage: '',
}

export const siteConfig = readOverride('siteConfig', defaultSiteConfig)

const defaultSummaryStats = [
  { value: '3+', label: '주요 프로젝트', sub: 'AI · Backend 실전 경험' },
  { value: 'AI · Backend', label: '주요 관심 분야', sub: 'CV · Platform · Data' },
  { value: '10+', label: '사용한 기술 스택', sub: 'Frontend ~ Infra' },
  { value: 'Always', label: '성장하는 개발자', sub: '문제 해결 중심' },
]

export const summaryStats = readOverride('summaryStats', defaultSummaryStats)

const defaultInterests = [
  {
    icon: 'eye',
    title: 'AI / Computer Vision',
    desc: 'YOLO · OCR · Tracking을 실제 CCTV·MRO 현장에 적용합니다.',
  },
  {
    icon: 'server',
    title: 'Backend',
    desc: 'Spring Boot · FastAPI로 안정적인 API와 파이프라인을 만듭니다.',
  },
  {
    icon: 'database',
    title: '데이터 기반 서비스',
    desc: '수집 → 적재 → 분석 → 리포트까지 이어지는 흐름을 설계합니다.',
  },
  {
    icon: 'radar',
    title: '관제·산업 시스템',
    desc: 'GIS · 대시보드 · 알림으로 현장에서 쓸 수 있는 관제를 지향합니다.',
  },
]

export const interests = readOverride('interests', defaultInterests)

const defaultValuesQuote = {
  text: '기술을 통해 실제 문제를 해결하고,\n사람들에게 도움이 되는 서비스를 만드는 개발자가 되고 싶습니다.',
  author: 'Developer Values',
}

export const valuesQuote = readOverride('valuesQuote', defaultValuesQuote)

// 관심 분야 후보 (/admin 사이트 설정에서 체크박스로 선택)
export const interestOptions = [
  { icon: 'eye', title: 'AI / Computer Vision', desc: 'YOLO · OCR · Tracking을 실제 현장에 적용합니다.' },
  { icon: 'server', title: 'Backend', desc: 'Spring Boot · FastAPI로 안정적인 API와 파이프라인을 만듭니다.' },
  { icon: 'database', title: '데이터 기반 서비스', desc: '수집 → 적재 → 분석 → 리포트까지 이어지는 흐름을 설계합니다.' },
  { icon: 'radar', title: '관제·산업 시스템', desc: 'GIS · 대시보드 · 알림으로 현장에서 쓸 수 있는 관제를 지향합니다.' },
  { icon: 'monitor', title: 'Frontend', desc: 'Vue · React로 관제 대시보드를 만듭니다.' },
  { icon: 'refresh', title: 'MLOps', desc: '실험 관리와 Hard Sample 재학습 루프를 운영합니다.' },
  { icon: 'container', title: '클라우드·인프라', desc: 'Docker 기반으로 배포하고 운영합니다.' },
  { icon: 'activity', title: '데이터 파이프라인', desc: '센서·로그 수집부터 자동 리포트까지 연결합니다.' },
]
