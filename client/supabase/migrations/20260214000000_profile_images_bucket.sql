-- 프로필 이미지 저장소 (공개 읽기, 본인 폴더만 쓰기)
-- Dashboard > SQL Editor에 붙여넣고 Run. 파일 경로 규칙: {user_id}/profile

insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

drop policy if exists "profile-images public read" on storage.objects;
create policy "profile-images public read"
  on storage.objects for select
  using (bucket_id = 'profile-images');

drop policy if exists "profile-images owner write" on storage.objects;
create policy "profile-images owner write"
  on storage.objects for all
  using (bucket_id = 'profile-images' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'profile-images' and auth.uid()::text = (storage.foldername(name))[1]);
