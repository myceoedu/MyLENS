-- Phase 4 — Tourism video submissions
-- Creators draft, upload (URL for MVP), and submit 45-second Malaysia tourism videos.

create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  school_id     uuid not null references public.schools(id) on delete cascade,
  title         text not null,
  description   text,
  category      text not null
    check (category in ('Nature', 'Food', 'Culture', 'Heritage', 'Adventure', 'Hidden Gems')),
  location      text not null,
  state_id      text not null,
  video_url     text,
  status        public.submission_status not null default 'draft',
  admin_notes   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger submissions_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- ── RLS ────────────────────────────────────────────────
alter table public.submissions enable row level security;

-- Creators can read their own submissions
create policy "submissions_select_own"
  on public.submissions for select
  to authenticated
  using (user_id = auth.uid());

-- Creators can insert their own submissions (school_id must match profile)
create policy "submissions_insert_own"
  on public.submissions for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and school_id = (
      select school_id from public.profiles
      where id = auth.uid() and role = 'creator' and status = 'active'
    )
  );

-- Creators can update only their own DRAFT or REVISION submissions
create policy "submissions_update_own_draft"
  on public.submissions for update
  to authenticated
  using (
    user_id = auth.uid()
    and status in ('draft', 'revision')
  );

-- Creators can delete only their own draft submissions
create policy "submissions_delete_own_draft"
  on public.submissions for delete
  to authenticated
  using (
    user_id = auth.uid()
    and status = 'draft'
  );

-- Admin can read and moderate all submissions
create policy "submissions_admin_all"
  on public.submissions for all
  using (public.is_admin());
 