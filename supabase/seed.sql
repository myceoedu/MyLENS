-- MyLENS LMS Phase 0 seed data
-- Prerequisites:
--   1. Run supabase/migrations/001_phase0_foundation.sql first
--   2. Create auth users in Supabase Dashboard → Authentication → Users
--
-- Suggested test users (set User Metadata when creating):
--   admin@mylens2026.my   → { "full_name": "National Admin", "role": "admin" }
--   judge@mylens2026.my   → { "full_name": "Panel Judge", "role": "judge" }
--   creator1@mylens2026.my → { "full_name": "Aisha Mya", "role": "creator" }
--   creator2@mylens2026.my → { "full_name": "Irfan Izuddin", "role": "creator" }

-- Sample schools with event access tokens
insert into public.schools (slug, name, state_id, status, points, rank, access_token)
values
  ('smk-damansara-jaya', 'SMK Damansara Jaya', 'selangor', 'active', 980, 1, 'MYLENS-SGR-01'),
  ('smk-victoria', 'SMK Victoria', 'kualalumpur', 'active', 0, null, 'MYLENS-KUL-02')
on conflict (slug) do update
set
  access_token = excluded.access_token,
  status = excluded.status;

-- Activate admin
update public.profiles
set
  role = 'admin',
  status = 'active',
  full_name = 'National Admin',
  school_id = null
where email = 'admin@mylens2026.my';

-- Activate judge
update public.profiles
set
  role = 'judge',
  status = 'active',
  full_name = 'Panel Judge',
  school_id = null
where email = 'judge@mylens2026.my';

-- Activate creators and link to school
update public.profiles
set
  role = 'creator',
  status = 'active',
  school_id = (select id from public.schools where slug = 'smk-damansara-jaya'),
  full_name = case email
    when 'creator1@mylens2026.my' then 'Aisha Mya'
    when 'creator2@mylens2026.my' then 'Irfan Izuddin'
  end
where email in ('creator1@mylens2026.my', 'creator2@mylens2026.my');
