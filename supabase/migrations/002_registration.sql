-- Phase 1.5 — Public creator registration support

-- Allow signup form to list active schools
create policy "schools_select_active_public"
  on public.schools for select
  to anon, authenticated
  using (status = 'active');

-- Store optional school_id from signup metadata on profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
  parsed_role public.user_role;
  meta_school_id text;
  parsed_school_id uuid;
begin
  meta_role := coalesce(new.raw_user_meta_data->>'role', 'creator');

  begin
    parsed_role := meta_role::public.user_role;
  exception
    when others then
      parsed_role := 'creator';
  end;

  -- Only creators may self-register; staff roles require admin provisioning
  if parsed_role != 'creator' then
    parsed_role := 'creator';
  end if;

  meta_school_id := nullif(trim(coalesce(new.raw_user_meta_data->>'school_id', '')), '');

  if meta_school_id is not null then
    begin
      parsed_school_id := meta_school_id::uuid;
    exception
      when others then
        parsed_school_id := null;
    end;

    if parsed_school_id is not null then
      if not exists (
        select 1 from public.schools
        where id = parsed_school_id and status = 'active'
      ) then
        parsed_school_id := null;
      end if;
    end if;
  end if;

  insert into public.profiles (id, email, full_name, role, status, school_id)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name', '')), ''),
    parsed_role,
    'pending',
    parsed_school_id
  );

  return new;
end;
$$;
