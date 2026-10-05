// 멤버 배포 가이드 데이터 — image가 비어 있으면 플레이스홀더가 뜬다.
// 스크린샷이 생기면 image에 URL(또는 /screenshots/xxx.png)만 넣으면 됨.
export interface GuideStep {
  no: string
  title: string
  desc: string
  commands?: string[]
  env?: { key: string; value: string; note: string }[]
  image?: string
  imageCaption?: string
  tip?: string
}

export const deployGuide: GuideStep[] = [
  {
    no: '0',
    title: '준비물',
    desc: 'GitHub, Supabase, Render, Vercel 계정 4개. 전부 무료 티어로 된다. 프로젝트는 Vue + Spring Boot + PostgreSQL 기준 (semi처럼 client/server 분리형).',
    tip: 'Render·Vercel은 GitHub 로그인을 쓰면 리포지토리 연동이 한 번에 된다.',
  },
  {
    no: '1',
    title: '비밀키 코드에서 분리',
    desc: 'application.properties, .env에 박힌 API 키·DB 비밀번호를 전부 환경변수로 바꾼다. semi의 gemini.api.key처럼 하드코딩된 키는 유출된 것으로 보고 재발급이 원칙.',
    commands: [
      '# Before (위험)',
      'gemini.api.key=AQ.Ab8RN6Iy...',
      '',
      '# After',
      'gemini.api.key=${GEMINI_API_KEY:}',
    ],
    tip: '키는 절대 Git에 올리지 않는다. .gitignore에 .env 포함 여부 확인.',
  },
  {
    no: '2',
    title: 'DB를 Supabase로 옮기기',
    desc: 'Supabase 대시보드 → SQL Editor에서 테이블 생성 DDL 실행. 로컬 DDL이 있으면 그대로, 없으면 매퍼/ERD 보고 뽑는다. 연결은 Session Pooler(6543)를 쓴다.',
    env: [
      { key: 'DATABASE_URL', value: 'jdbc:postgresql://aws-0-xx.pooler.supabase.com:6543/postgres', note: 'SQL Editor → Connect → Session pooler' },
      { key: 'DB_USER', value: 'postgres.xxxxx', note: 'pooler 전용 유저명' },
      { key: 'DB_PASSWORD', value: '(DB 비밀번호)', note: '프로젝트 생성 시 설정한 것' },
    ],
    image: '',
    imageCaption: 'Supabase SQL Editor에서 DDL 실행하는 화면',
  },
  {
    no: '3',
    title: '백엔드 Render 배포',
    desc: 'server 폴더를 GitHub에 푸시 → Render Dashboard → New Web Service → 리포지토리 선택. Java 버전은 pom의 java.version과 맞춘다. /actuator/health나 자체 헬스 API가 200을 뱉으면 성공.',
    commands: [
      'Build Command:  ./mvnw -q package -DskipTests',
      'Start Command:  java -jar target/*.jar',
    ],
    env: [
      { key: 'DATABASE_URL / DB_USER / DB_PASSWORD', value: '(2단계와 동일)', note: 'Render Environment에 등록' },
      { key: 'GEMINI_API_KEY', value: '(재발급한 키)', note: 'Render Environment에 등록' },
    ],
    image: '',
    imageCaption: 'Render Web Service 생성 + Environment 등록 화면',
    tip: '무료 티어는 15분 미접속 시 슬립 → 첫 로딩 1분. 시연 전 미리 깨워두기.',
  },
  {
    no: '4',
    title: '프론트 Vercel 배포',
    desc: 'client 폴더를 GitHub에 푸시 → Vercel → New Project → Import. API 호출 주소(axios baseURL 등)가 Render 백엔드를 가리키는지 확인한다.',
    env: [
      { key: 'VITE_API_BASE', value: 'https://xxx.onrender.com', note: '코드가 이 값을 쓰도록 미리 바꿔두기' },
    ],
    image: '',
    imageCaption: 'Vercel Import + 환경변수 등록 화면',
    tip: 'baseURL이 localhost로 하드코딩돼 있으면 배포 후 API가 안 붙는다. 제일 흔한 실수.',
  },
  {
    no: '5',
    title: '포트폴리오에 URL 등록',
    desc: '이 사이트 /admin → 새 프로젝트 등록 → 2단계에서 외부 URL 선택 → 배포된 프론트 주소 붙여넣기. AI 데모가 따로 있으면 Hugging Face Spaces로 임베드.',
    image: '',
    imageCaption: '등록 마법사 2단계(데모 연결) 화면',
    tip: '등록 후 상세 페이지 Live Demo 버튼이 새창 외부 링크로 바뀐다.',
  },
  {
    no: '6',
    title: '운영: 죽은 링크 점검',
    desc: '무료 티어는 잠들고, 키는 만료된다. 배포 URL이 살아 있는지 가끔 확인한다. 서버의 GET /api/demo-links/check?url=… 로 자동 점검도 가능.',
    tip: '면접·시연 당일에는 Render/Vercel을 미리 깨우고 링크를 한 번씩 눌러본다.',
  },
]
