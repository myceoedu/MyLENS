-- MyLENS LMS Phase 0 — schools + profiles foundation
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- ── Enums ──────────────────────────────────────────────
create type public.user_role as enum ('creator', 'admin', 'judge');
create type public.user_status as enum ('pending', 'active', 'suspended');
create type public.school_status as enum ('pending', 'active', 'archived');

-- Reserved for Phase 4+
create type public.submission_status as enum (
  'draft',
  'submitted',
  'in_review',
  'approved',
  'revision',
  'rejected'
);

-- ── Schools ────────────────────────────────────────────
create table public.schools (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  state_id   text not null,
  status     public.school_status not null default 'pending',
  points     integer not null default 0,
  rank       integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Profiles (extends auth.users) ──────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  role       public.user_role not null default 'creator',
  status     public.user_status not null default 'pending',
  school_id  uuid references public.schools(id) on delete set null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_school_required_for_active_creator
    check (role != 'creator' or status != 'active' or school_id is not null)
);

-- ── updated_at trigger ─────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger schools_updated_at
  before update on public.schools
  for each row execute function public.set_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── Auto-create profile on signup ──────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
  parsed_role public.user_role;
begin
  meta_role := coalesce(new.raw_user_meta_data->>'role', 'creator');

  begin
    parsed_role := meta_role::public.user_role;
  exception
    when others then
      parsed_role := 'creator';
  end;

  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    parsed_role,
    'pending'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Helpers ────────────────────────────────────────────
create or replace function public.is_admin()
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
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.school_creator_count(target_school uuid)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from public.profiles
  where school_id = target_school
    and role = 'creator'
    and status != 'suspended';
$$;

-- ── Row Level Security ─────────────────────────────────
alter table public.schools enable row level security;
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_admin"
  on public.profiles for select
  using (public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin());

create policy "schools_select_own"
  on public.schools for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.school_id = schools.id
    )
  );

create policy "schools_admin_all"
  on public.schools for all
  using (public.is_admin());

-- Judges can read schools for review context (Phase 5+)
create policy "schools_select_judge"
  on public.schools for select
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'judge'
        and p.status = 'active'
    )
  );
