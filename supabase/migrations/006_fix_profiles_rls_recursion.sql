-- Fix: profiles_select_school_teammates caused RLS recursion and blocked login profile reads.
-- Run in Supabase SQL Editor if 005 was already applied with the subquery policy.

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
