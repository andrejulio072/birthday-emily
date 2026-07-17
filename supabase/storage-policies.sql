-- Run this in the Supabase SQL editor for the birthday-emily project.
-- The bucket is already public for downloads. This policy only permits the
-- anonymous front end to list image object names inside this specific bucket.

alter table storage.objects enable row level security;

drop policy if exists "Public can list Emily birthday media" on storage.objects;

create policy "Public can list Emily birthday media"
on storage.objects
for select
to anon
using (bucket_id = 'emily-birthday-media');
