# Features and key files

Use this page to find the right files quickly.

---

## Auth

| Feature | Key places |
|---------|------------|
| Login | `components/auth/LoginForm.tsx`, `app/(auth)/login` |
| Register | `components/auth/RegisterForm.tsx`, `app/(auth)/register` |
| Forgot password | `components/auth/ForgotPasswordForm.tsx` |
| Session / roles | `lib/auth/session.ts`, `lib/auth/roles.ts` |

---

## Public website

| Feature | Key places |
|---------|------------|
| Landing sections | `components/sections/*`, `app/page.tsx` |
| Schools page | `app/schools` |
| Videos page | `app/videos` |
| Contact inquiry | `lib/contact/actions.ts` |
| Partnership inquiry | `lib/partnership/actions.ts`, `components/partnership/*` |

---

## Creator workspace

| Feature | Route | Key places |
|---------|-------|------------|
| Home | `/dashboard/creator` | `app/.../creator/page.tsx`, `CreatorOverview`, `CreatorNextStep` |
| Lessons | `/dashboard/creator/learning` | `LearningHub.tsx`, `lib/learning/queries.ts` |
| My tasks | `/dashboard/creator/learning/tasks` | `CreatorTasksHub.tsx`, `LearningTaskSubmitForm.tsx`, `lib/learning/task-actions.ts` |
| Submissions list | `/dashboard/creator/submissions` | `SubmissionsWorkspace.tsx` |
| New submission | `/dashboard/creator/submissions/new` | `SubmissionForm.tsx`, `lib/creator/submission-actions.ts` |
| Team | `/dashboard/creator/team` | team components + creator queries |
| Profile | `/dashboard/creator/profile` | `ProfileForm.tsx` |
| Nav | — | `components/creator/CreatorNav.tsx` |

---

## Admin workspace

| Feature | Route | Key places |
|---------|-------|------------|
| Overview | `/dashboard/admin` | `AdminAttentionPanel`, stats |
| Contest submissions | `/dashboard/admin/submissions` | `lib/admin/submissions.ts`, moderation form |
| Submission detail | `/dashboard/admin/submissions/[id]` | `SubmissionModerationForm.tsx` |
| Inquiries | `/dashboard/admin/inquiries` | `AdminInquiriesHub.tsx` |
| People | `/dashboard/admin/users`, `.../pending` | user status actions |
| Schools | `/dashboard/admin/schools` | school forms, tokens |
| Lessons | `/dashboard/admin/learning` | `LearningAdminPanel` mode `lessons` |
| Assignments | `/dashboard/admin/learning/assignments` | `LearningAdminPanel` mode `assignments` |
| Task reviews | `/dashboard/admin/learning/tasks` | task list + moderation |
| Nav | — | `components/admin/AdminNav.tsx` |
| Design tokens | — | `components/admin/AdminUI.tsx` |

---

## Learning domain (shared)

| Concern | File |
|---------|------|
| Types / labels | `types/learning.ts` |
| Queries | `lib/learning/queries.ts` |
| Module/lesson CRUD + complete | `lib/learning/actions.ts` |
| Task submit + moderate | `lib/learning/task-actions.ts` |
| Task helpers / filters | `lib/learning/tasks.ts` |
| SQL | `012`, `013`, `014` migrations |

---

## Contest submissions domain

| Concern | File |
|---------|------|
| Types | `types/submission.ts`, `types/auth.ts` |
| Creator write | `lib/creator/submission-actions.ts` |
| Admin review | `lib/admin/submission-actions.ts` |
| Admin list helpers | `lib/admin/submissions.ts` |
| SQL | `007_phase4_submissions.sql` |

---

## Schools and people

| Concern | File |
|---------|------|
| School admin logic | `lib/admin/schools.ts`, `lib/admin/tokens.ts` |
| Admin actions | `lib/admin/actions.ts` |
| Creator context | `lib/creator/queries.ts` |

---

## User manuals / docs build

| Concern | File |
|---------|------|
| Docs home | `(UserManual & Guide)/README.md` |
| User chapters | `(UserManual & Guide)/user/*` |
| Developer chapters | `(UserManual & Guide)/developer/*` |
| PDF builder | `(UserManual & Guide)/scripts/build-pdf-manuals.mjs` |

Rebuild:

```bash
node "(UserManual & Guide)/scripts/build-pdf-manuals.mjs"
```

---

## Debugging tip

If UI looks fine but data is wrong:

1. Check role + profile status
2. Check published learning
3. Check the correct table (video vs task)
4. Check whether migration exists on the active Supabase project
5. Check browser network / server action errors
