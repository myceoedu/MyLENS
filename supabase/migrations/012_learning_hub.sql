-- MyLENS Learning Hub — admin-managed modules, live classes, recordings, and documents

create table public.learning_modules (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(trim(title)) between 1 and 120),
  description text,
  sort_order  integer not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.learning_items (
  id               uuid primary key default gen_random_uuid(),
  module_id        uuid not null references public.learning_modules(id) on delete cascade,
  title            text not null check (char_length(trim(title)) between 1 and 160),
  description      text,
  content_type     text not null
    check (content_type in ('live_class', 'recorded_video', 'document', 'external_link')),
  content_url      text,
  storage_path     text,
  starts_at        timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  sort_order       integer not null default 0,
  published        boolean not null default false,
  created_by       uuid references auth.users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint learning_items_has_content
    check (content_url is not null or storage_path is not null),
  constraint learning_items_live_class_schedule
    check (content_type != 'live_class' or starts_at is not null)
);

create index learning_modules_sort_order_idx
  on public.learning_modules (sort_order, created_at);

create index learning_items_module_sort_idx
  on public.learning_items (module_id, sort_order, created_at);

create index learning_items_starts_at_idx
  on public.learning_items (starts_at)
  where content_type = 'live_class';

create trigger learning_modules_updated_at
  before update on public.learning_modules
  for each row execute function public.set_updated_at();

create trigger learning_items_updated_at
  before update on public.learning_items
  for each row execute function public.set_updated_at();

create or replace function public.can_access_learning()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and status = 'active'
      and role in ('creator', 'admin')
  );
$$;

alter table public.learning_modules enable row level security;
alter table public.learning_items enable row level security;

create policy "learning_modules_select"
  on public.learning_modules for select
  to authenticated
  using (
    public.can_access_learning()
    and (published = true or public.is_admin())
  );

create policy "learning_modules_admin_all"
  on public.learning_modules for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "learning_items_select"
  on public.learning_items for select
  to authenticated
  using (
    public.can_access_learning()
    and (
      public.is_admin()
      or (
        published = true
        and exists (
          select 1
          from public.learning_modules module
          where module.id = module_id
            and module.published = true
        )
      )
    )
  );

create policy "learning_items_admin_all"
  on public.learning_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Private creator/admin learning assets. Large recordings may also be supplied
-- as unlisted YouTube/Vimeo URLs instead of being uploaded to Supabase.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'learning-content',
  'learning-content',
  false,
  104857600,
  array[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "learning_content_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'learning-content'
    and public.can_access_learning()
  );

create policy "learning_content_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'learning-content'
    and public.is_admin()
  );

create policy "learning_content_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'learning-content'
    and public.is_admin()
  )
  with check (
    bucket_id = 'learning-content'
    and public.is_admin()
  );

create policy "learning_content_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'learning-content'
    and public.is_admin()
  );
