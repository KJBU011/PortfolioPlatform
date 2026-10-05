-- 다중 사용자 포트폴리오 저장소
-- portfolios 1행 = 1명의 포트폴리오 전체(JSON). username으로 공개 조회.
-- Dashboard > SQL Editor에 붙여넣고 Run (content_blocks 마이그레이션 다음에 실행).

create table if not exists public.portfolios (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null constraint username_format check (username ~ '^[a-z0-9-]{3,20}$'),
  display_name text not null default '',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portfolios enable row level security;

-- 누구든 공개 포트폴리오 읽기 (목록/상세)
drop policy if exists "public read" on public.portfolios;
create policy "public read"
  on public.portfolios for select
  using (true);

-- 본인 것만 쓰기 (로그인 필수)
drop policy if exists "owner write" on public.portfolios;
create policy "owner write"
  on public.portfolios for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
