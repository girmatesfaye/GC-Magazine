-- Step 4: Storage bucket for memory images

insert into storage.buckets (id, name, public)
values ('memory-media', 'memory-media', true)
on conflict (id) do update
set public = excluded.public;

-- Authenticated users can upload to their own folder inside the bucket.
drop policy if exists "memory media select public" on storage.objects;
create policy "memory media select public"
on storage.objects
for select
to public
using (bucket_id = 'memory-media');

drop policy if exists "memory media insert own" on storage.objects;
create policy "memory media insert own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'memory-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "memory media update own" on storage.objects;
create policy "memory media update own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'memory-media'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'memory-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "memory media delete own" on storage.objects;
create policy "memory media delete own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'memory-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);
