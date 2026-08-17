# Setup and run

This page helps you run MyLENS on your computer.

---

## What you need

- Node.js (LTS recommended)
- npm (comes with Node)
- Git access to this repository
- Access to the Supabase project used by the team
- A code editor (Cursor / VS Code)

---

## 1. Get the code

```bash
cd "D:\Android Studio Project\mylens-2026"
```

If you clone fresh, open that folder as the project root.

---

## 2. Install packages

```bash
npm install
```

---

## 3. Create `.env.local`

In the project root, create or edit `.env.local`:

*DAPATKAN 2 KEY NI DARI SUPABASE-PROJECT SETTING-DATA API & API KEY -> COPY*
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Optional (admin scripts only — keep secret):

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Where to find the values

Supabase Dashboard → **Project Settings** → **API**

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Restart the dev server after changing env values.

---

## 4. Confirm database migrations

If you are setting up a **new** empty project, run the SQL files in order.  
See [02_supabase_and_database.md](02_supabase_and_database.md).

---

## 5. Start the app

```bash
npm run dev
```
Open: [http://localhost:3000]

---

## Useful npm scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Lint check |

---

## Quick smoke test after setup

1. Public home page loads
2. Login page opens
3. Creator account can open `/dashboard/creator` (if approved)
4. Admin account can open `/dashboard/admin`
5. Learning pages load without server errors

---

## Common setup problems

### Blank errors talking to Supabase

- Wrong URL or anon key
- Dev server not restarted after `.env.local` change
- You are pointed at a different Supabase project than the one with data

### Login works but dashboard fails

- Profile row missing / pending
- RLS issue (see migration `006_fix_profiles_rls_recursion.sql`)
- Role mismatch

### Learning tasks missing for creators

- Migration `014_learning_tasks.sql` not applied, or
- Module / item still draft (not published)

---

## Do not do this

- Do not commit `.env.local`
- Do not paste service role keys into client code
- Do not run random SQL out of order on production without a backup plan
