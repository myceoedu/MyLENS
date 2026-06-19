-- School access tokens for creator self-registration

alter table public.schools
  add column if not exists access_token text;

create unique index if not exists schools_access_token_unique
  on public.schools (access_token)
  where access_token is not null;

-- Validate school name + token without exposing token values via public SELECT
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

  return matched_school_id;
end;
$$;

revoke all on function public.validate_school_registration(text, text) from public;
grant execute on function public.validate_school_registration(text, text) to anon, authenticated;
