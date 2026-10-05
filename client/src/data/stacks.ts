import type { StackGroup } from '@/types/project'
import { readOverride } from '@/lib/content'

// Stack 데이터는 /admin 또는 이 파일에서 수정 — Home/Skills 페이지에 자동 반영
const defaultStacks: StackGroup[] = [
  { category: 'Frontend', icon: 'monitor', items: ['Vue', 'React', 'TypeScript'] },
  { category: 'Backend', icon: 'server', items: ['Java', 'Spring Boot', 'Python', 'FastAPI'] },
  { category: 'AI / Data', icon: 'brain', items: ['PyTorch', 'YOLO', 'OpenCV', 'Pandas'] },
  { category: 'Database', icon: 'database', items: ['PostgreSQL', 'PostGIS', 'Redis'] },
  { category: 'Infra / DevOps', icon: 'container', items: ['Docker', 'Linux', 'Git', 'GitHub Actions'] },
]

export const stackGroups: StackGroup[] = readOverride('stackGroups', defaultStacks)
