# Supabase and database

This page explains the backend for MyLENS in plain language.

---

## What Supabase is used for

| Part | Used for |
|------|----------|
| Auth | Login, register, password reset |
| Postgres | Schools, profiles, submissions, learning, inquiries |
| Storage | Learning files, task uploads, related media |
| RLS | Who can read / write each row |

---

## Migrations (run in order)

Files live in `supabase/migrations/`.

| Order | File | Purpose |
|-------|------|---------|
| 001 | `001_phase0_foundation.sql` | Base foundation |
| 002 | `002_registration.sql` | Creator registration |
| 003 | `003_school_access_tokens.sql` | School access tokens |
| 004 | `004_creator_limit.sql` | Creator limit per school |
| 005 | `005_phase3_creator_portal.sql` | Creator portal pieces |
| 006 | `006_fix_profiles_rls_recursion.sql` | Fix profile RLS recursion |
| 007 | `007_phase4_submissions.sql` | Contest video submissions |
| 008 | `008_creator_limit_four.sql` | Creator limit update |
| 009 | `009_public_map_stats.sql` | Public map stats |
| 010 | `010_contact_inquiries.sql` | Contact inquiries |
| 011 | `011_partnership_inquiries.sql` | Partnership inquiries |
| 012 | `012_learning_hub.sql` | Learning modules + items |
| 013 | `013_learning_progress.sql` | Lesson completion progress |
| 014 | `014_learning_tasks.sql` | Homework tasks + task submissions |
| 015 | `015_remove_judge_access.sql` | Drop unused judge school policy |

Also read: `supabase/README.md`

---

## How to apply a migration

1. Open Supabase Dashboard → **SQL EDITOR** → New SNIPPET
2. Paste the migration file contents
3. Run
4. Fix errors before continuing to the next file

For an existing team project, confirm with the owner which files are already applied.

---

## Main tables (friendly map)

| Table | Meaning |
|-------|---------|
| `schools` | Participating schools |
| `profiles` | Users (role, status, school) |
| `submissions` | Contest tourism videos |
| `campaign_settings` | Submission open / close times |
| `campaign_resources` | Campaign resource links |
| `learning_modules` | Learning folders |
| `learning_items` | Lessons + assignments (`content_type` includes `task`) |
| `learning_item_progress` | Creator lesson completion |
| `learning_task_submissions` | Homework answers for review |
| `contact_inquiries` | School contact form messages |
| `partnership_inquiries` | Partnership form messages |

---

## Learning publish rules (backend + product)

Creators can see a lesson/assignment only when:

1. `learning_items.published = true`
2. Parent `learning_modules.published = true`
3. Creator can access learning (active creator rules)

Admin can see drafts. Creators cannot.

---

## Storage buckets to know

| Bucket | Used for |
|--------|----------|
| `learning-content` | Lesson videos / documents uploaded by admin |
| `learning-tasks` | Creator homework file uploads (from migration 014) |

Confirm buckets exist in Supabase → **Storage**.


### Promote / check an admin (example pattern)

Only do this with team approval. Exact SQL may depend on your profile setup. Prefer using the admin UI when possible.

---

## Seed / test users

`supabase/README.md` describes example test users and school tokens for local/dev setups.

Do not use production passwords in docs or chat logs.

---

## Care points

1. Missing migration = features “half work” in the UI
2. RLS recursion on profiles → run `006` if login cannot load profile
3. Task homework needs `014` + `learning-tasks` bucket
4. Contest videos and learning tasks are different tables
