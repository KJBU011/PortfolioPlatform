# Portfolio Platform — 체험형 멤버십 포트폴리오

"읽는 포트폴리오가 아니라 직접 체험할 수 있는 포트폴리오"를 표방하는 다중 사용자 플랫폼.

- `/` — 플랫폼 소개 랜딩 (멤버 쇼케이스 · 기능 · 시작 방법)
- `/u/아이디` — 각 사용자의 개인 포트폴리오 (Home/About/Projects/상세/Demo)
- `/explore` — 멤버 목록, `/login` — 이메일 로그인, `/admin` — 내 포트폴리오 편집

## 실행

```bash
npm install
npm run dev
```

## 새 프로젝트 추가

`src/data/projects.ts`의 `projects` 배열에 객체 1개를 추가하면
목록 · 필터 · 상세 페이지(`/projects/:slug`)에 자동 반영됩니다.

외부 Demo URL은 `links[].url`만 교체하면 됩니다.

## 다중 사용자 (각자의 포트폴리오)

/u/아이디 형태로 여러 사용자가 각자의 포트폴리오를 올릴 수 있다.

1. **SQL 1회 실행**: Dashboard > SQL Editor에서
   `supabase/migrations/20260212000000_portfolios.sql` 실행 (portfolios 테이블 생성)
2. **Redirect URL 등록**: Dashboard > Authentication > URL Configuration >
   Redirect URLs에 `http://localhost:2782/**` 추가 (배포 후에는 배포 도메인도 추가)
3. 사용자 흐름: `/login`에서 이메일 입력 → 메일 링크 클릭 → `/admin`에서
   아이디 생성(현재 사이트 내용이 초기 템플릿으로 복사됨) → 항목 편집·저장 →
   `/u/아이디`로 공개. 목록은 `/explore`
4. 루트(`/`)는 랜딩으로 고정. 개인 포트폴리오는 `/u/아이디`로만 served.
   레거시 개인 경로(`/about`, `/projects` 등)는 `.env`의 `VITE_OWNER_USERNAME`이
   설정되어 있으면 자동으로 `/u/주인아이디/...`로 합류하고,
   비워두면 기존 content_blocks(mock 동기화) 모드로 그대로 보인다.

RLS: portfolios는 누구나 읽기, 쓰기는 본인 것만(로그인 필수).

## 브라우저에서 직접 수정 (/admin — 로그인 필요)

코드를 열지 않고도 항목별 데이터를 바꿀 수 있다.

1. `npm run dev` 실행 후 `/admin` 접속 (기본 키: `local-admin`)
2. 탭별 편집: 프로젝트(추가·삭제·태그·파이프라인 JSON) / 기술 스택 / 경력·활동 / 사이트 설정(이름·링크·문구) / 데모 데이터
3. 저장 → localStorage에 보관, 새로고침 시 사이트에 반영

Supabase 없이도 바로 동작한다. 초기화는 Admin 동기화 탭의 "로컬 수정분 초기화".

## 로컬 백엔드 (Supabase local, Docker 필요)

```bash
npm install -g supabase   # 최초 1회 (또는 npx supabase)
supabase init             # 최초 1회 (이미 있으면 생략)
supabase start            # 로컬 Postgres + API 기동 (content_blocks 테이블 자동 생성)
```

출력된 `anon key`를 `.env`에 입력 (`.env.example` 참고):

```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_KEY=local-admin
```

`npm run dev` 재시작 후 `/admin` → 동기화 탭 → "전체 업로드 (최초 1회)"를 누르면
현재 데이터가 로컬 Supabase에 저장되고, 이후 모든 접속자가 그 값을 내려받아 본다.
우선순위: Supabase > localStorage 수정분 > mock 기본값.

운영 배포 전에는 `supabase/migrations/*`의 `local dev write` 정책을 삭제하고
쓰기를 인증된 경로로 조일 것.

## 설정 파일 (직접 코드 수정 시)

| 파일 | 용도 |
|---|---|
| `src/data/profile.ts` | 이름 · 이메일 · GitHub · Hero 문구 |
| `src/data/stacks.ts` | 기술 스택 (Home/Skills 자동 반영) |
| `src/data/timeline.ts` | About 경력 타임라인 |
| `src/data/projects.ts` | 프로젝트 전체 + ERD |

## 추후 연동

- `GET /api/projects`, `GET /api/projects/:slug` (Spring Boot + PostgreSQL)
- AI Demo: Hugging Face Spaces URL을 `links`에 연결
- Contact 폼: `POST /api/contact`
