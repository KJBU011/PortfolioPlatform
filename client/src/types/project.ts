// ─── 공용 타입 ──────────────────────────────────────────────
export type ProjectCategory = 'AI / Computer Vision' | 'Backend / Platform' | 'Data / Monitoring'

export type DemoType = 'internal' | 'external' | 'huggingface' | 'none'

export interface ProjectLink {
  label: string
  url: string
  kind: 'live' | 'ai-demo' | 'github' | 'docs' | 'video'
}

export interface ProjectFeature {
  icon: string
  title: string
  description: string
}

export interface PipelineStep {
  title: string
  subtitle: string
  accent?: boolean
}

export interface ModelVersion {
  version: string
  change: string
  accuracy: string
  note?: string
}

export interface ErdTable {
  name: string
  comment: string
  columns: { name: string; type: string; pk?: boolean; fk?: boolean; uk?: boolean }[]
}

/** 상세 페이지 섹션 표시 설정 */
export type DetailSectionKey = 'overview' | 'features' | 'pipeline' | 'system' | 'erd'

/** 시스템 아키텍처 직접 배치: 행 목록, 행 안 노드는 좌→우로 연결 표시 */
export interface ArchNode {
  icon: string
  title: string
  subtitle: string
  accent?: boolean
}

export interface ArchRow {
  nodes: ArchNode[]
}

export interface Project {
  slug: string
  category: ProjectCategory
  title: string
  short: string
  description: string
  tags: string[]
  thumbnail: string // 나중에 실제 이미지 URL로 교체
  period: string
  team: string
  role: string
  purpose: string
  links: ProjectLink[]
  /** 데모 연결 방식: internal=내장 Live Demo 탭, external=외부 URL, huggingface=HF 임베드, none=없음 */
  demoType?: DemoType
  demoUrl?: string
  features: ProjectFeature[]
  pipeline: PipelineStep[]
  versions: ModelVersion[]
  failureCases: { cause: string; detail: string }[]
  failureMessage: string
  gallery: string[]
  featured?: boolean
  /** 시스템 아키텍처 직접 배치 (비어 있으면 이미지·기본 다이어그램으로 폴백) */
  architecture: ArchRow[]
  /** 시스템 아키텍처: 직접 배치가 비어 있을 때 이미지로 대체, 둘 다 비면 기본 다이어그램 */
  architectureImage: string
  /** 상세 페이지 섹션별 표시 여부 (키 누락 시 표시로 간주) */
  sectionVisibility: Record<DetailSectionKey, boolean>
  /** ERD: 비어 있으면 기본(cctvErd) 표시, 있으면 해당 테이블로 렌더링 */
  erdTables: ErdTable[]
  /** 커스텀 ERD일 때 관계 메모 (빈 값이면 숨김) */
  erdNote: string
}

export interface StackGroup {
  category: string
  items: string[]
  icon: string
}

export interface TimelineItem {
  period: string
  title: string
  org: string
  description: string
  tags?: string[]
  current?: boolean
}
