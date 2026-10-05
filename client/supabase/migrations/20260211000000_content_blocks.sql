-- Portfolio Platform 콘텐츠 저장소
-- 항목별 데이터를 통째로 JSONB로 보관하는 단순 구조.
-- 로컬: supabase start 후 자동 적용. 클라우드: Dashboard > SQL Editor에 붙여넣기.

create table if not exists public.content_blocks (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.content_blocks enable row level security;

-- 공개 사이트는 읽기만 필요
drop policy if exists "public read" on public.content_blocks;
create policy "public read"
  on public.content_blocks for select
  using (true);

-- 로컬 개발 편의를 위해 anon 쓰기 허용.
-- 운영 배포 전에는 아래 정책을 삭제하고 인증된 쓰기로 조이세요.
-- (예: 대시보드에서 anon 쓰기 정책 삭제 + Admin은 service_role 경유 API로 저장)
drop policy if exists "local dev write" on public.content_blocks;
create policy "local dev write"
  on public.content_blocks for all
  using (true)
  with check (true);
