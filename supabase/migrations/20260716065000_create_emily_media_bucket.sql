-- Dedicated public media bucket for the Emily birthday experience.
-- This migration belongs only to the birthday-emily Supabase project.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'emily-birthday-media',
  'emily-birthday-media',
  true,
  15728640,
  array['image/webp', 'image/jpeg', 'image/png', 'video/mp4']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public delivery is required because the landing page is public and media is
-- requested directly from Supabase Storage's CDN endpoint.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read Emily birthday media'
  ) then
    execute $policy$
      create policy "Public read Emily birthday media"
      on storage.objects
      for select
      to public
      using (bucket_id = 'emily-birthday-media')
    $policy$;
  end if;
end
$$;
