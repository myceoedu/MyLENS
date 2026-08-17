# Handover checklist

Use this on day 1 of taking over MyLENS.

---

## Access you should receive

- [ ] Git repository access
- [ ] Supabase project access (Dashboard)
- [ ] Hosting access (for example Vercel)
- [ ] Production / staging URLs
- [ ] At least one admin test account
- [ ] At least one approved creator test account
- [ ] This documentation folder

---

## Verify the environment

- [ ] `npm install` works
- [ ] `.env.local` has correct Supabase URL + anon key
- [ ] `npm run dev` opens [http://localhost:3000](http://localhost:3000)
- [ ] App talks to the expected Supabase project
- [ ] Migrations through `014_learning_tasks.sql` are applied (or you know what is missing)
- [ ] Storage buckets exist (`learning-content`, `learning-tasks`)
- [ ] Auth Site URL + Redirect URLs match local and production needs

---

## Verify product flows

### Public

- [ ] Home page loads
- [ ] Schools / videos pages open
- [ ] Contact or partnership form can submit (if enabled)

### Creator

- [ ] Register / login
- [ ] Pending creator cannot fully work until approved
- [ ] Approved creator opens Home
- [ ] Lessons open under Learning → Lessons
- [ ] My tasks open under Learning → My tasks
- [ ] Contest Submissions list opens
- [ ] Team and Profile open

### Admin

- [ ] Overview loads
- [ ] Approve a pending creator
- [ ] Open Schools
- [ ] Open contest Submissions and open one detail page
- [ ] Learning → Lessons catalogue loads
- [ ] Learning → Assignments catalogue loads
- [ ] Learning → Reviews queue loads
- [ ] Inquiries page loads

---

## Read these docs

- [ ] [(UserManual & Guide)/README.md](../README.md)
- [ ] [User getting started](../user/00_getting_started.md)
- [ ] [Creator guide](../user/01_creator_guide.md)
- [ ] [Admin guide](../user/02_admin_guide.md)
- [ ] [Developer overview](00_overview.md)
- [ ] [Setup and run](01_setup_and_run.md)
- [ ] [Supabase and database](02_supabase_and_database.md)
- [ ] [Architecture](03_architecture.md)
- [ ] [Features and key files](04_features_and_key_files.md)
- [ ] [Deploy and auth](05_deploy_and_auth.md)

---

## Known care points (do not ignore)

1. **Wrong Supabase project** — many “bugs” are missing SQL on the active project
2. **Draft learning content** — creators only see published module + published item
3. **Video vs homework** — `submissions` ≠ `learning_task_submissions`
4. **Migration 014** — required for assignments / My tasks / Reviews
5. **Profile RLS** — if profile cannot load after older migrations, check `006`
6. **Next.js version** — read `AGENTS.md` before assuming old Next APIs
7. **Auth redirect URLs** — required for password reset to work on each domain

---

## When you change a feature

1. Update or add a migration if the database changes
2. Update user docs if screens or button names change
3. Rebuild PDFs:

```bash
node "(UserManual & Guide)/scripts/build-pdf-manuals.mjs"
```

4. Test both creator and admin paths when the change touches Learning or Submissions

---

## First-week goal

Be able to:

- Run the app locally
- Explain video submissions vs learning tasks
- Publish a lesson and an assignment
- Review one contest video and one homework task
- Know where env, migrations, and key feature files live
