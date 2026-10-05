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
  columns: { name: string; type: string; pk?: boolean; fk?: boolean }[]
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
