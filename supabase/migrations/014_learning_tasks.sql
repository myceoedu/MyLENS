-- Learning task submissions — proof-of-skill assignments attached to academy lessons.
-- Separate from campaign video submissions (public.submissions).

-- ── Extend learning_items for task lessons ──────────────────────────
alter table public.learning_items
  drop constraint if exists learning_items_content_type_check;

alter table public.learning_items
  add constraint learning_items_content_type_check
  check (
    content_type in (
      'live_class',
      'recorded_video',
      'document',
      'external_link',
      'task'
    )
  );

alter table public.learning_items
  drop constraint if exists learning_items_has_content;

alter table public.learning_items
  add constraint learning_items_has_content
  check (
    content_type = 'task'
    or content_url is not null
    or storage_path is not null
  );

alter table public.learning_items
  add column if not exists submission_mode text
    check (
      submission_mode is null
      or submission_mode in ('text', 'link', 'file', 'mixed')
    );

alter table public.learning_items
  add column if not exists due_at timestamptz;

alter table public.learning_items
  drop constraint if exists learning_items_task_mode;

alter table public.learning_items
  add constraint learning_items_task_mode
  check (
    (content_type = 'task' and submission_mode is not null)
    or (content_type != 'task' and submission_mode is null)
  );

-- ── Task submissions ────────────────────────────────────────────────
create table if not exists public.learning_task_submissions (
  id            uuid primary key default gen_random_uuid(),
  item_id       uuid not null references public.learning_items(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  school_id     uuid references public.schools(id) on delete set null,
  answer_text   text,
  answer_url    text,
  storage_path  text,
  status        text not null default 'draft'
    check (status in ('draft', 'submitted', 'in_review', 'approved', 'revision', 'rejected')),
  admin_notes   text,
  attempt       integer not null default 1 check (attempt >= 1),
  submitted_at  timestamptz,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint learning_task_submissions_one_per_user
    unique (user_id, item_id),
  constraint learning_task_submissions_has_answer
    check (
      status = 'draft'
      or answer_text is not null
      or answer_url is not null
      or storage_path is not null
    )
);

create index if not exists learning_task_submissions_queue_idx
  on public.learning_task_submissions (status, submitted_at desc nulls last);

create index if not exists learning_task_submissions_item_idx
  on public.learning_task_submissions (item_id, status);

create index if not exists learning_task_submissions_school_idx
  on public.learning_task_submissions (school_id);

create trigger learning_task_submissions_updated_at
  before update on public.learning_task_submissions
  for each row execute function public.set_updated_at();

-- Only allow submissions against published task items
create or replace function public.is_published_learning_task(p_item_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.learning_items item
    join public.learning_modules module on module.id = item.module_id
    where item.id = p_item_id
      and item.content_type = 'task'
      and item.published = true
      and module.published = true
  );
$$;

alter table public.learning_task_submissions enable row level security;

create policy "learning_task_submissions_select_own"
  on public.learning_task_submissions for select
  to authenticated
  using (
    user_id = auth.uid()
    and public.can_access_learning()
  );

create policy "learning_task_submissions_admin_select"
  on public.learning_task_submissions for select
  to authenticated
  using (public.is_admin());

create policy "learning_task_submissions_insert_own"
  on public.learning_task_submissions for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.can_access_learning()
    and public.is_published_learning_task(item_id)
    and school_id = (
      select school_id from public.profiles
      where id = auth.uid() and role = 'creator' and status = 'active'
    )
  );

create policy "learning_task_submissions_update_own_editable"
  on public.learning_task_submissions for update
  to authenticated
  using (
    user_id = auth.uid()
    and public.can_access_learning()
    and status in ('draft', 'revision')
  )
  with check (
    user_id = auth.uid()
    and status in ('draft', 'submitted', 'revision')
  );

create policy "learning_task_submissions_admin_all"
  on public.learning_task_submissions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Allow admins to mark progress when approving tasks
create policy "learning_item_progress_admin_all"
  on public.learning_item_progress for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Private storage for student task files ──────────────────────────
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'learning-tasks',
  'learning-tasks',
  false,
  20971520,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Path convention: {user_id}/{item_id}/{filename}
create policy "learning_tasks_select_own_or_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'learning-tasks'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

create policy "learning_tasks_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'learning-tasks'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role = 'creator'
        and status = 'active'
    )
  );

create policy "learning_tasks_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'learning-tasks'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'learning-tasks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "learning_tasks_delete_own_or_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'learning-tasks'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
