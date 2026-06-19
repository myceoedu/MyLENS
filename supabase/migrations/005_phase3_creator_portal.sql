-- Phase 3 — Creator portal: profile bio, resources, campaign settings, teammate visibility

alter table public.profiles
  add column if not exists bio text;

-- ── Campaign resources (admin-managed; seeded for Phase 3) ──
create table if not exists public.campaign_resources (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  resource_type text not null default 'link'
    check (resource_type in ('link', 'pdf', 'video')),
  url         text not null,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger campaign_resources_updated_at
  before update on public.campaign_resources
  for each row execute function public.set_updated_at();

-- ── Campaign settings (single-row config) ──
create table if not exists public.campaign_settings (
  id                    uuid primary key default gen_random_uuid(),
  submission_opens_at   timestamptz,
  submission_closes_at  timestamptz,
  updated_at            timestamptz not null default now()
);

insert into public.campaign_settings (submission_opens_at, submission_closes_at)
select '2026-07-01T00:00:00+08:00', '2026-09-30T23:59:59+08:00'
where not exists (select 1 from public.campaign_settings limit 1);

-- ── Seed default resources ──
insert into public.campaign_resources (title, description, resource_type, url, sort_order)
select * from (values
  (
    'MyLENS 2026 Campaign Brief'::text,
    'Official competition overview, themes, and participation rules.'::text,
    'link'::text,
    'https://www.tourism.gov.my'::text,
    1
  ),
  (
    'Video Submission Rules',
    'Format requirements, duration (45s target), and eligibility criteria.',
    'link',
    '/dashboard/creator/resources',
    2
  ),
  (
    'Filming & Storytelling Guide',
    'Tips for capturing authentic Malaysian tourism stories on camera.',
    'link',
    '/dashboard/creator/resources',
    3
  ),
  (
    'Category Inspiration',
    'Nature, Food, Culture, Heritage, Adventure, and Hidden Gems examples.',
    'link',
    '/videos',
    4
  ),
  (
    'Pre-Submit Checklist',
    'Location consent, category selection, duration, and quality checks.',
    'link',
    '/dashboard/creator/resources',
    5
  )
) as v(title, description, resource_type, url, sort_order)
where not exists (select 1 from public.campaign_resources limit 1);

-- ── RLS: campaign resources ──
alter table public.campaign_resources enable row level security;
alter table public.campaign_settings enable row level security;

create policy "campaign_resources_select_published"
  on public.campaign_resources for select
  to authenticated
  using (published = true or public.is_admin());

create policy "campaign_resources_admin_all"
  on public.campaign_resources for all
  using (public.is_admin());

create policy "campaign_settings_select_authenticated"
  on public.campaign_settings for select
  to authenticated
  using (true);

create policy "campaign_settings_admin_all"
  on public.campaign_settings for all
  using (public.is_admin());

-- ── Creators can view active teammates at same school ──
-- Uses SECURITY DEFINER helper to avoid RLS recursion on profiles subquery.

create or replace function public.current_creator_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id
  from public.profiles
  where id = auth.uid()
    and role = 'creator'
    and status = 'active'
  limit 1;
$$;

drop policy if exists "profiles_select_school_teammates" on public.profiles;

create policy "profiles_select_school_teammates"
  on public.profiles for select
  to authenticated
  using (
    role = 'creator'
    and status = 'active'
    and school_id is not null
    and school_id = public.current_creator_school_id()
  );
