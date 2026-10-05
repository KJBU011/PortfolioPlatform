# Portfolio Platform (monorepo)

체험형 멤버십 포트폴리오 — `client/`와 `server/`로 분리.

```
portfolio/
  client/   Vue 3 + Vite + TS (포트 :2782)
  server/   Spring Boot 3.5 + Java 17 (포트 :3000)
```

## 실행

```bash
# 터미널 1 — backend
cd server
.\mvnw.cmd spring-boot:run

# 터미널 2 — frontend
cd client
npm install
npm run dev      # http://localhost:2782
```

client의 `/api/*`는 Vite proxy로 `http://localhost:3000`에 연결된다.

## 구성

| 경로 | 설명 |
|---|---|
| `/` | 플랫폼 소개 랜딩 |
| `/u/아이디` | 멤버 개인 포트폴리오 |
| `/explore` | 멤버 목록 |
| `/login` · `/admin` | 이메일 로그인 · 내 포트폴리오 편집 |
| `POST /api/contact` | 문의 접수 (메일 미설정 시 서버 로그) |
| `GET /api/demo-links/check?url=` | 외부 데모 URL 생존 확인 |
| `GET /actuator/health` | 서버 헬스 |

DB/Auth는 Supabase 클라우드. 상세 설정은 `client/README.md`, `server/README.md` 참고.
