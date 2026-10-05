import type { Project, ErdTable } from '@/types/project'
import { readOverride } from '@/lib/content'

// ─────────────────────────────────────────────────────────────
// Mock data — Backend API 없이 동작.
// 추후 Spring Boot API 연동 시: 이 파일을 API fetch 레이어로 교체하면 됨.
//   GET /api/projects        → Project[]
//   GET /api/projects/:slug  → Project
// 외부 Demo URL은 links[].url 만 교체하면 됨.
// ─────────────────────────────────────────────────────────────

// Mock data — Backend API 없이 동작. /admin에서 직접 수정 가능.
// (Supabase 설정 시 클라우드 값 > localStorage 수정분 > 아래 기본값 순으로 표시)
const defaultProjects: Project[] = [
  {
    slug: 'cctv-vehicle-monitoring',
    category: 'AI / Computer Vision',
    title: 'CCTV 기반 차량 관제 시스템',
    short: '수배 차량 탐지 · 이동 경로 추적·예측 AI 관제 시스템',
    description:
      'CCTV 영상에서 수배 차량을 탐지하고 이동 경로를 추적·예측하는 AI 기반 통합 관제 시스템입니다. YOLO 탐지 → 번호판 검출 → OCR → 식별 → 추적 → DB 적재 → 대시보드까지 하나의 파이프라인으로 연결했습니다.',
    tags: ['YOLO', 'OCR', 'Tracking', 'GIS', 'Spring Boot', 'Vue'],
    thumbnail: '',
    period: '2024.03 — 2024.11 (9개월)',
    team: '4인 (AI 2 · Backend 1 · Frontend 1)',
    role: 'AI Pipeline · Backend API 설계',
    purpose: '관제 요원이 수동으로 모니터링하던 수배 차량 식별을 자동화하고, 이동 경로 예측으로 초동 대응 시간을 단축',
    links: [
      { label: 'Live Demo', url: 'https://demo.example.com/cctv', kind: 'live' },
      { label: 'AI Demo (Hugging Face)', url: 'https://huggingface.co/spaces/yourname/cctv-demo', kind: 'ai-demo' },
      { label: 'GitHub', url: 'https://github.com/yourname/cctv-monitoring', kind: 'github' },
    ],
    features: [
      {
        icon: 'scan-text',
        title: '번호판 자동 인식',
        description: '차량 영역에서 번호판(Plate) 검출 후 OCR로 문자 인식. 야간·저화질 대응 전처리 포함.',
      },
      {
        icon: 'crosshair',
        title: '차량 탐지 및 추적',
        description: 'YOLO 기반 차량 탐지 + Multi-Object Tracking으로 CCTV 간 동일 차량을 연결.',
      },
      {
        icon: 'route',
        title: '이동 경로 예측',
        description: 'CCTV 위치(GIS)와 탐지 이력으로 다음 출현 가능 지점과 시간을 예측.',
      },
      {
        icon: 'bell',
        title: '인근 CCTV 알림',
        description: '수배 차량 등장 시 인근 CCTV 목록과 함께 관제 대시보드에 실시간 알림 발송.',
      },
    ],
    pipeline: [
      { title: 'CCTV 영상 입력', subtitle: 'RTSP / HLS 스트림' },
      { title: 'Vehicle Detection', subtitle: 'YOLO', accent: true },
      { title: 'License Plate Detection', subtitle: 'Plate Detector', accent: true },
      { title: 'OCR', subtitle: 'Plate → Text', accent: true },
      { title: 'Vehicle Identification', subtitle: '번호 매칭 · 수배 DB 조회' },
      { title: 'Tracking', subtitle: 'Multi-CCTV Re-ID' },
      { title: 'Database', subtitle: 'PostgreSQL / PostGIS' },
      { title: 'Dashboard', subtitle: 'Vue · 실시간 관제' },
    ],
    versions: [
      { version: 'V1', change: 'Baseline 모델', accuracy: '81.3%' },
      { version: 'V2', change: '데이터 증강 (야간, Blur, 반사광)', accuracy: '87.6%' },
      { version: 'V3', change: 'Hard Sample 학습', accuracy: '91.2%' },
      { version: 'V4', change: 'OCR Pipeline 개선', accuracy: '94.1%' },
    ],
    failureCases: [
      { cause: '반사광', detail: '주간 직사광선에서 번호판 영역 과노출로 문자 뭉개짐' },
      { cause: 'Motion Blur', detail: '고속 주행 차량 프레임에서 문자 경계 소실' },
      { cause: '낮은 해상도', detail: '원거리 CCTV에서 번호판 픽셀 수 부족' },
      { cause: '기울어진 번호판', detail: '측면 각도 CCTV에서透视 왜곡 발생' },
    ],
    failureMessage:
      '전체 정확도를 단순히 높이기보다 실패한 데이터를 분석하여 Hard Sample을 구축하고 다음 모델 버전에 반영했다.',
    gallery: ['', '', ''],
    featured: true,
  },
  {
    slug: 'tooltrace',
    category: 'AI / Computer Vision',
    title: 'ToolTrace',
    short: 'Vision AI 기반 항공 MRO Tool Control 시스템',
    description:
      '항공 MRO 현장에서 공구 분실·잔류를 방지하는 Vision AI 기반 Tool Control 시스템입니다. 작업 전후 공구 배치 사진을 비교해 누락 공구를 즉시 알려줍니다.',
    tags: ['Computer Vision', 'YOLO', 'MLOps', 'MRO'],
    thumbnail: '',
    period: '2024.06 — 2024.10 (5개월)',
    team: '3인 (AI 1 · Backend 1 · Frontend 1)',
    role: 'AI 모델 · MLOps 파이프라인',
    purpose: '항공 정비 현장의 공구 관리(FOD 방지)를 수기 체크에서 비전 자동화로 전환',
    links: [
      { label: 'Live Demo', url: 'https://demo.example.com/tooltrace', kind: 'live' },
      { label: 'AI Demo (Hugging Face)', url: 'https://huggingface.co/spaces/yourname/tooltrace', kind: 'ai-demo' },
      { label: 'GitHub', url: 'https://github.com/yourname/tooltrace', kind: 'github' },
    ],
    features: [
      { icon: 'wrench', title: '공구 자동 검출', description: 'YOLO 기반 공구 40종 검출. 작업대 배치 사진에서 위치까지 파악.' },
      { icon: 'git-compare', title: '전후 비교 체크', description: '작업 전/후 이미지를 비교해 누락·추가 공구를 하이라이트.' },
      { icon: 'clipboard-check', title: '체크리스트 자동화', description: '검출 결과를 작업 리포트와 연동해 서명·이력 관리.' },
      { icon: 'refresh-cw', title: 'MLOps 재학습', description: '오검출 이미지를 수집해 다음 버전 학습 데이터로 순환.' },
    ],
    pipeline: [
      { title: '작업대 촬영', subtitle: '전 / 후 이미지' },
      { title: 'Tool Detection', subtitle: 'YOLO', accent: true },
      { title: 'Before / After Diff', subtitle: '매칭 · 누락 판정' },
      { title: 'Report', subtitle: '체크리스트 · 알림' },
      { title: 'Database', subtitle: 'PostgreSQL' },
      { title: 'Dashboard', subtitle: 'Vue' },
    ],
    versions: [
      { version: 'V1', change: 'Baseline (20종 공구)', accuracy: '83.5%' },
      { version: 'V2', change: '40종 확장 + 증강', accuracy: '89.2%' },
      { version: 'V3', change: '유사 공구 Hard Sample', accuracy: '93.0%' },
    ],
    failureCases: [
      { cause: '유사 공구 혼동', detail: '형태가 비슷한 드라이버·렌치 간 오분류' },
      { cause: '겹침', detail: '공구가 겹쳐 가려진 경우 미검출' },
    ],
    failureMessage: '현장에서 오검출된 이미지를 곧바로 수집해 Hard Sample으로 재학습하는 루프를 만들었다.',
    gallery: ['', ''],
    featured: true,
  },
  {
    slug: 'predictive-maintenance',
    category: 'Data / Monitoring',
    title: '예지보전 시스템',
    short: '설비 이상 탐지 · 고장 예측 리포트 시스템',
    description:
      '설비 센서 데이터를 기반으로 이상 상태와 고장 가능성을 탐지하고 리포트를 제공하는 시스템입니다. 시계열 이상 탐지와 임계치 룰을 결합했습니다.',
    tags: ['Time Series', 'Anomaly Detection', 'Python', 'Report'],
    thumbnail: '',
    period: '2023.09 — 2024.02 (6개월)',
    team: '2인 (Data 1 · Backend 1)',
    role: '데이터 파이프라인 · 탐지 모델',
    purpose: '사후 정비를 사전 대응으로 전환해 설비 다운타임과 유지보수 비용 절감',
    links: [
      { label: 'Live Demo', url: 'https://demo.example.com/pdm', kind: 'live' },
      { label: 'GitHub', url: 'https://github.com/yourname/pdm', kind: 'github' },
    ],
    features: [
      { icon: 'activity', title: '이상 탐지', description: '진동·온도 시계열에서 정상 범위를 벗어난 구간을 탐지.' },
      { icon: 'trending-up', title: '고장 가능성 스코어', description: '임계치 + 통계 모델로 설비별 위험 점수 산출.' },
      { icon: 'file-text', title: '자동 리포트', description: '일간·주간 리포트를 PDF로 자동 생성해 담당자에게 전달.' },
      { icon: 'bell', title: '알림 연동', description: '위험 임계 초과 시 알림 발송 및 조치 이력 기록.' },
    ],
    pipeline: [
      { title: '센서 수집', subtitle: '진동 · 온도 · 전류' },
      { title: '전처리', subtitle: '결측 · 노이즈 제거', accent: true },
      { title: 'Anomaly Detection', subtitle: '통계 + ML', accent: true },
      { title: 'Scoring', subtitle: '위험 점수' },
      { title: 'Database', subtitle: 'PostgreSQL' },
      { title: 'Report · Dashboard', subtitle: '리포트 · 알림' },
    ],
    versions: [
      { version: 'V1', change: '룰 기반 임계치', accuracy: '78.0% (F1)' },
      { version: 'V2', change: '시계열 모델 도입', accuracy: '86.4% (F1)' },
      { version: 'V3', change: '설비별 적응 임계', accuracy: '90.1% (F1)' },
    ],
    failureCases: [
      { cause: '센서 노이즈', detail: '특정 시간대 반복 노이즈로 오탐 발생' },
      { cause: '계절성', detail: '온도 계절 변동이 이상으로 판정됨' },
    ],
    failureMessage: '단순 임계치를 넘어 설비별 정상 패턴을 학습하도록 개선해 오탐을 줄였다.',
    gallery: ['', ''],
    featured: true,
  },
  {
    slug: 'portfolio-platform',
    category: 'Backend / Platform',
    title: 'Portfolio Platform',
    short: '이 사이트 자체 — 체험형 포트폴리오 플랫폼',
    description:
      '현재 보고 있는 이 사이트 자체도 프로젝트입니다. Vue 3 + Spring Boot + Docker + CI/CD 구조를 목표로, 프로젝트·데모·아키텍처를 한 곳에서 체험할 수 있게 설계했습니다.',
    tags: ['Vue', 'Spring Boot', 'Docker', 'CI/CD'],
    thumbnail: '',
    period: '2024 — 진행 중',
    team: '1인',
    role: '기획 · 설계 · 프론트엔드',
    purpose: '읽는 포트폴리오가 아니라 직접 체험할 수 있는 포트폴리오 플랫폼 구축',
    links: [{ label: 'GitHub', url: 'https://github.com/yourname/portfolio', kind: 'github' }],
    features: [
      { icon: 'layout-dashboard', title: '프로젝트 쇼케이스', description: 'Demo · AI Demo · Architecture를 한 페이지에서 확인.' },
      { icon: 'plug', title: 'API 연동 구조', description: 'mock data → Spring Boot API로 교체 가능한 데이터 레이어.' },
      { icon: 'container', title: 'Docker · CI/CD', description: '빌드·배포 파이프라인을 고려한 구조.' },
      { icon: 'expand', title: '확장성', description: '새 프로젝트 추가는 data 파일 1곳 수정으로 반영.' },
    ],
    pipeline: [
      { title: 'Vue Frontend', subtitle: '이 사이트' },
      { title: 'Spring Boot API', subtitle: '예정', accent: true },
      { title: 'PostgreSQL', subtitle: '예정' },
      { title: 'FastAPI AI Server', subtitle: 'Hugging Face 연동' },
    ],
    versions: [{ version: 'V1', change: 'Frontend + mock data', accuracy: '—' }],
    failureCases: [],
    failureMessage: '',
    gallery: [''],
    featured: false,
  },
]

// Supabase/localStorage 수정분이 있으면 그것을, 없으면 위 기본값을 사용
export const projects: Project[] = readOverride('projects', defaultProjects)

export const projectFilters = ['전체', 'AI / Computer Vision', 'Backend / Platform', 'Data / Monitoring'] as const

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

// ERD — CCTV 프로젝트 기준 샘플 (07번 화면: 면접관이 읽기 쉬운 주요 테이블)
export const cctvErd: ErdTable[] = [
  {
    name: 'cctv',
    comment: 'CCTV 마스터',
    columns: [
      { name: 'cctv_id', type: 'BIGINT', pk: true },
      { name: 'location', type: 'VARCHAR' },
      { name: 'address', type: 'VARCHAR' },
      { name: 'status', type: 'VARCHAR' },
    ],
  },
  {
    name: 'detection_history',
    comment: '탐지 이력',
    columns: [
      { name: 'id', type: 'BIGINT', pk: true },
      { name: 'cctv_id', type: 'BIGINT', fk: true },
      { name: 'vehicle_id', type: 'BIGINT', fk: true },
      { name: 'detect_time', type: 'TIMESTAMPTZ' },
      { name: 'image_url', type: 'TEXT' },
      { name: 'confidence', type: 'FLOAT' },
    ],
  },
  {
    name: 'vehicle',
    comment: '식별 차량',
    columns: [
      { name: 'vehicle_id', type: 'BIGINT', pk: true },
      { name: 'plate_number', type: 'VARCHAR(20)' },
      { name: 'vehicle_type', type: 'VARCHAR' },
      { name: 'color', type: 'VARCHAR' },
      { name: 'status', type: 'VARCHAR' },
    ],
  },
  {
    name: 'wanted_vehicle',
    comment: '수배 차량',
    columns: [
      { name: 'id', type: 'BIGINT', pk: true },
      { name: 'vehicle_id', type: 'BIGINT', fk: true },
      { name: 'reason', type: 'TEXT' },
      { name: 'registered_at', type: 'TIMESTAMPTZ' },
      { name: 'status', type: 'VARCHAR' },
    ],
  },
  {
    name: 'tracking_route',
    comment: '이동 경로',
    columns: [
      { name: 'id', type: 'BIGINT', pk: true },
      { name: 'vehicle_id', type: 'BIGINT', fk: true },
      { name: 'lat', type: 'DOUBLE' },
      { name: 'lng', type: 'DOUBLE' },
      { name: 'detect_time', type: 'TIMESTAMPTZ' },
      { name: 'geom', type: 'GEOMETRY' },
    ],
  },
]

// API (Demo) — 07번 화면 표. Spring Boot 연동 시 실제 엔드포인트로 교체
export const cctvApiDemo = [
  { method: 'GET', path: '/api/vehicles/{id}', desc: '차량 단일 조회' },
  { method: 'GET', path: '/api/tracking/{vehicleId}', desc: '차량 이동 경로 조회' },
  { method: 'GET', path: '/api/cctv/nearby', desc: '인근 CCTV 조회' },
  { method: 'POST', path: '/api/detection', desc: '탐지 데이터 저장 (Demo)' },
]
