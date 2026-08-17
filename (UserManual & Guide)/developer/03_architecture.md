# Architecture

This page explains how the MyLENS app is organized.

Keep changes small and follow existing patterns.

---

## Big picture

```text
Browser (Next.js app)
    ↓
Server components / server actions / route handlers
    ↓
Supabase client (user session) or service role (rare admin scripts)
    ↓
Postgres + Storage + Auth (with RLS)
```

---

## App Router folders

| Area | Path | Purpose |
|------|------|---------|
| Public site | `app/page.tsx`, `app/schools`, `app/videos` | Marketing / public pages |
| Auth | `app/(auth)/login`, `register`, `forgot-password` | Sign in flows |
| Shared dashboard shell | `app/(dashboard)/layout.tsx` | Logged-in chrome |
| Creator | `app/(dashboard)/dashboard/creator/...` | Student workspace |
| Admin | `app/(dashboard)/dashboard/admin/...` | Staff workspace |

---

## Auth and roles

Key files:

- `lib/auth/session.ts` — require login / role
- `lib/auth/roles.ts` — role helpers
- `lib/supabase/client.ts` — browser client
- `lib/supabase/server.ts` — server client
- `lib/supabase/middleware.ts` — session refresh / protection helpers

Pattern used in pages:

1. `requireRole(["creator"])` or `requireRole(["admin"])`
2. Load data with server queries
3. Render UI components

---

## Data flow pattern (preferred)

For dashboard features, the common pattern is:

1. **Page** (server) loads data from `lib/.../queries.ts`
2. **Component** shows UI
3. **Server action** in `lib/.../actions.ts` writes changes
4. `revalidatePath(...)` refreshes the related screens

Example learning areas:

- Queries: `lib/learning/queries.ts`
- Lesson actions: `lib/learning/actions.ts`
- Task actions: `lib/learning/task-actions.ts`

---

## UI layers

| Folder | Use for |
|--------|---------|
| `components/admin/` | Admin-only UI + shared admin design tokens (`AdminUI.tsx`) |
| `components/creator/` | Creator workspace UI |
| `components/sections/` | Public landing sections |
| `components/auth/` | Login / register forms |
| `types/` | Shared types (`auth`, `learning`, `submission`, …) |

Design note: admin learning uses forest/brass tokens in `components/admin/AdminUI.tsx`.

---

## Learning architecture (easy map)

```text
learning_modules
   └── learning_items
         ├── content_type = live_class / recorded_video / document / external_link
         └── content_type = task
               └── learning_task_submissions (per creator)
```

Creator progress for normal lessons uses `learning_item_progress`.  
Task completion is tied to mentor **approval**, not self “mark complete”.

---

## Contest submissions architecture

```text
profiles + schools
   └── submissions (video entries)
         └── admin moderation notes / status
```

Campaign timing comes from `campaign_settings`.

---

## Forms and safety

- Validate on the server in actions
- Keep dangerous operations behind `requireRole(["admin"])`
- Confirm destructive UI actions in the browser when needed
- Prefer clear status enums already defined in `types/`

---

## Next.js caution

This repo notes that Next.js APIs may differ from older training data.

Before large framework changes:

1. Read `AGENTS.md`
2. Check docs under `node_modules/next/dist/docs/`

---

