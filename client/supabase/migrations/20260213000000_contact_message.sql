-- 문의 메시지 저장소 (Spring Boot + MyBatis)
-- Dashboard > SQL Editor에 붙여넣고 Run.
-- service_role(backend 전용)로만 접근, anon 정책 없음.

create table if not exists public.contact_message (
  id bigint generated always as identity primary key,
  name varchar(50) not null,
  email varchar(320) not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_message enable row level security;
