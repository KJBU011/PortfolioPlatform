# portfolio-server

Portfolio Platform backend — Spring Boot 3.5 · Java 17 · 포트 8081.
레이어: `controller` → `service` → `dao`(+ `resources/mappers/*.xml`, MyBatis) → `dto`.

```
com.portfolio
  contact/{controller,service,dao,dto}   문의 접수
  linkcheck/{controller,service,dto}     데모 URL 생존 확인 (DB 없음)
  config/{CorsConfig,PersistenceConfig,DbUrlCondition}
  common/{ApiResponse,GlobalExceptionHandler}
```

## 실행

```bash
.\mvnw.cmd spring-boot:run     # 최초 실행 시 Maven/의존성 자동 다운로드
```

## API

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/contact` | 문의 접수 `{name, email, message}` — `CONTACT_TO` 설정 시 메일 발송, 아니면 로그 |
| GET | `/api/demo-links/check?url=` | 외부 데모 URL 생존 확인 (죽은 링크 감지용) |
| GET | `/actuator/health` | 헬스 |

## 환경변수

| 변수 | 용도 |
|---|---|
| `DATABASE_URL` / `DB_USER` / `DB_PASSWORD` | Supabase Postgres JDBC (비우면 DB 스택 없이 부팅, contact는 로그 적재) |
| `CONTACT_TO` | 문의 수신 메일 (비우면 발송 없이 로그만) |
| `SPRING_MAIL_HOST/PORT/USERNAME/PASSWORD` | SMTP (예: Gmail 앱 비밀번호) |

DB 테이블: `client/supabase/migrations/20260213000000_contact_message.sql`을
Dashboard SQL Editor에서 1회 실행. service_role 전용, anon 정책 없음.

테스트: `.\mvnw.cmd test` — H2 인메모리로 MyBatis XML 매핑 검증.

CORS는 `http://localhost:2782` 허용 (`application.yml` 참고).
