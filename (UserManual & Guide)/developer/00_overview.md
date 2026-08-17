# Developer overview

This guide is for a **new developer** taking over MyLENS.

Read it first. Keep language simple. Follow the linked pages in order.

---

## What you are inheriting

| Item | Detail |
|------|--------|
| Product | MyLENS — youth tourism video campaign + learning academy |
| App type | Next.js web app (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Backend | Supabase (Auth, Postgres, Storage, RLS) |
| Language | TypeScript |
| Package manager | npm |

---

## What the product does

1. **Public website** — campaign story, schools map, videos, contact / partnership
2. **Creator workspace** — lessons, homework tasks, contest video submissions, team, profile
3. **Admin workspace** — schools, people approval, video review, learning content, inquiries

---

## Important product rule (do not mix these)

| Feature | Tables / area | UI |
|---------|----------------|-----|
| Contest video | `submissions` | Admin **Submissions** / Creator **Submissions** |
| Learning homework | `learning_task_submissions` | Admin **Learning → Reviews** / Creator **My tasks** |
| Learning lessons | `learning_modules`, `learning_items` | Admin **Lessons** / Creator **Lessons** |

If a bug report says “submission”, ask: **contest video** or **homework task**?

---

## Repository layout (important folders)

```text
mylens-2026/
  app/                         Next.js routes (auth, public, dashboards)
  components/                  UI (admin/, creator/, sections/, auth/)
  lib/                         Server actions, queries, auth, supabase clients
  types/                       Shared TypeScript types
  supabase/migrations/         SQL migrations (run in order)
  supabase/README.md           Setup notes for Supabase
  (UserManual & Guide)/        User + developer docs + PDF build
  .env.local                   Local secret (do not commit)
  package.json                 Scripts and dependencies
  AGENTS.md                    Note: read Next.js docs in node_modules before big changes
```

---

## Roles

Stored on `public.profiles.role` (and related auth metadata):

| Role | Goes to |
|------|---------|
| `creator` | `/dashboard/creator` |
| `admin` | `/dashboard/admin` |

Creators often start as **pending** until an admin activates them.

There is **no judge workspace** in the current product. Do not create judge accounts.

---

## Documentation map for developers

| File | Purpose |
|------|---------|
| [01_setup_and_run.md](01_setup_and_run.md) | Install, env, run locally |
| [02_supabase_and_database.md](02_supabase_and_database.md) | Migrations, tables, storage |
| [03_architecture.md](03_architecture.md) | How the app is structured |
| [04_features_and_key_files.md](04_features_and_key_files.md) | Where each feature lives |
| [05_deploy_and_auth.md](05_deploy_and_auth.md) | Hosting + Auth redirect URLs |
| [06_handover_checklist.md](06_handover_checklist.md) | checklist |

Also skim the **user** guides so you understand the product screens.

---

## Tech notes before you code

1. This project uses a **newer Next.js** than many tutorials. Read `AGENTS.md` and `node_modules/next/dist/docs/` when APIs look unfamiliar.
2. Prefer existing patterns in `lib/` and `components/` over inventing new folders.
3. Database rules (RLS) control what creators see. “Missing content” is often **draft / unpublished**, not a React bug.
4. Never commit real service-role keys.
