-- Public aggregate stats for the landing-page Malaysia map (no PII).

create or replace function public.get_public_state_stats()
returns table (
  state_id text,
  school_count bigint,
  video_count bigint,
  creator_count bigint
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.state_id,
    count(distinct s.id) as school_count,
    count(distinct sub.id) filter (where sub.status <> 'draft') as video_count,
    count(distinct p.id) filter (
      where p.role = 'creator' and p.status in ('active', 'pending')
    ) as creator_count
  from public.schools s
  left join public.submissions sub on sub.school_id = s.id
  left join public.profiles p on p.school_id = s.id
  where s.status = 'active'
  group by s.state_id;
$$;

create or replace function public.get_public_participating_schools(p_state_id text default null)
returns table (
  id uuid,
  state_id text,
  name text,
  points integer,
  video_count bigint,
  creator_count bigint
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.id,
    s.state_id,
    s.name,
    s.points,
    count(distinct sub.id) filter (where sub.status <> 'draft') as video_count,
    count(distinct p.id) filter (
      where p.role = 'creator' and p.status in ('active', 'pending')
    ) as creator_count
  from public.schools s
  left join public.submissions sub on sub.school_id = s.id
  left join public.profiles p on p.school_id = s.id
  where s.status = 'active'
    and (p_state_id is null or s.state_id = p_state_id)
  group by s.id, s.state_id, s.name, s.points
  order by s.state_id, s.name;
$$;

grant execute on function public.get_public_state_stats() to anon, authenticated;
grant execute on function public.get_public_participating_schools(text) to anon, authenticated;
