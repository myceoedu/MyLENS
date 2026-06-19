-- Phase 2: enforce max 5 creators per school (active + pending)

create or replace function public.school_creator_count(target_school uuid)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from public.profiles
  where school_id = target_school
    and role = 'creator'
    and status in ('active', 'pending');
$$;

create or replace function public.validate_school_registration(
  p_school_name text,
  p_access_token text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_school_id uuid;
begin
  if nullif(trim(p_school_name), '') is null or nullif(trim(p_access_token), '') is null then
    return null;
  end if;

  select id
  into matched_school_id
  from public.schools
  where lower(trim(name)) = lower(trim(p_school_name))
    and access_token = trim(p_access_token)
    and status = 'active'
  limit 1;

  if matched_school_id is null then
    return null;
  end if;

  if public.school_creator_count(matched_school_id) >= 5 then
    return null;
  end if;

  return matched_school_id;
end;
$$;

create or replace function public.check_creator_school_limit()
returns trigger
language plpgsql
as $$
declare
  existing_count integer;
begin
  if new.role = 'creator'
    and new.school_id is not null
    and new.status in ('active', 'pending')
  then
    select count(*)::integer
    into existing_count
    from public.profiles
    where school_id = new.school_id
      and role = 'creator'
      and status in ('active', 'pending')
      and id is distinct from new.id;

    if existing_count >= 5 then
      raise exception 'This school already has the maximum of 5 creators.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_creator_limit on public.profiles;

create trigger profiles_creator_limit
  before insert  or update on public.profiles
  for each row execute function public.check_creator_school_limit();
