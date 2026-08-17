# MyLENS LMS — Supabase setup (Phase 0)

## 1. Environment

`.env.local` is already in the project root with placeholders. Replace:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Get both from Supabase Dashboard → **Project Settings** → **API**, then restart `npm run dev`.

## 2. Run migration

In Supabase Dashboard → **SQL** → New query, paste and run:

`supabase/migrations/001_phase0_foundation.sql`

## 3. Create test users

Authentication → **Users** → Add user (with passwords):

| Email | User metadata |
|-------|----------------|
| `admin@mylens2026.my` | `{ "full_name": "National Admin", "role": "admin" }` |
| `creator1@mylens2026.my` | `{ "full_name": "Aisha Mya", "role": "creator" }` |
| `creator2@mylens2026.my` | `{ "full_name": "Irfan Izuddin", "role": "creator" }` |

## 4. Run seed

SQL Editor → run `supabase/seed.sql`

## Phase 1 — Auth (complete)

- `/login` — email + password sign in, role-based redirect
- `/forgot-password` — reset link via Supabase email
- Navbar **Login** link (desktop + mobile)
- Dashboard **Log out** button

### Create account (`/register`)

Creators can self-register. Accounts start as **pending** until an admin activates them.

Run migration: `supabase/migrations/002_registration.sql`  
Then: `supabase/migrations/003_school_access_tokens.sql`

Creators register with **school name** + **event access token** (no dropdown).

Example test tokens (after seed):
- `SMK Damansara Jaya` → `MYLENS-SGR-01`
- `SMK Victoria` → `MYLENS-KUL-02`

In Supabase → **Authentication** → **Providers** → Email:
- For dev, you may disable **Confirm email** so sign-up works immediately (admin still must activate profile).

- **Site URL:** `http://localhost:3000` (dev)
- **Redirect URLs:** `http://localhost:3000/api/auth/callback`

Add production URLs when deploying.

## Phase 2 — National Admin (complete)

- `/dashboard/admin` — overview stats + quick actions
- `/dashboard/admin/schools` — list, create, detail, access tokens
- `/dashboard/admin/users` + `/pending` — approve/suspend creators
- Max 4 creators per school (DB + admin enforcement)

Run migrations: `003_school_access_tokens.sql`, `004_creator_limit.sql`

## Phase 3 — Creator portal (complete)

- `/dashboard/creator` — campaign progress tracker + submission window notice
- `/dashboard/creator/profile` — edit name, photo URL, bio
- `/dashboard/creator/team` — view school teammates (up to 5)
- `/dashboard/creator/resources` — campaign briefs and guides

Run migration: `005_phase3_creator_portal.sql`

If creator login fails with "Could not load your profile" after 005, also run:
`006_fix_profiles_rls_recursion.sql`

## Learning Hub

- `/dashboard/admin/learning` — create modules, schedule online classes, and publish recordings or documents
- `/dashboard/creator/learning` — creator-only learning viewer with personal completion tracking
- Private uploads are stored in the `learning-content` Supabase Storage bucket
- Large recordings should use an unlisted YouTube or Vimeo URL

Run migrations in order: `012_learning_hub.sql`, then `013_learning_progress.sql`

## Folder map

```
app/(auth)/login          — login placeholder (Phase 1)
app/(dashboard)/dashboard — protected dashboards
lib/supabase/             — browser + server + middleware clients
lib/auth/                 — session + role helpers
types/                    — auth, profile, school
supabase/migrations/      — SQL schema
```
