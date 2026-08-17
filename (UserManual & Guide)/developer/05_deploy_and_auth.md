# Deploy and auth

This page covers hosting and login URL settings.

---

## Typical hosting

MyLENS is a Next.js app. Teams often deploy on **Vercel**.

High-level steps:

1. Connect the Git repository to the host
2. Set environment variables
3. Deploy
4. Update Supabase Auth URLs to match production

---

## Environment variables on the host

Set at least: DAPATKAN DARIPADA SUPABASE DALAM PROJECT SETTING-API KEY & DATA API

| Name | Notes |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |

Optional:

| Name | Notes |
|------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret. Never expose to the browser. |

Use the **same Supabase project** the team expects for that environment (staging vs production).

---

## Supabase Auth URLs

In Supabase Dashboard → **Authentication** → **URL configuration**:

### Local development example

- Site URL: `http://localhost:3000`
- Redirect URLs include:
  - `http://localhost:3000/api/auth/callback`
  - other local auth callback paths your app uses

### Production example

- Site URL: your live domain (example `https://mylensmalaysia.com`)
- Redirect URLs include the production callback URL(s)

If password reset opens the wrong page, Redirect URLs are usually wrong.

---

## Email settings (dev vs production)

For local testing, teams sometimes disable **Confirm email** so registration is faster.  
Admin approval of creator profiles may still be required.

For production:

- Use a proper email provider setup in Supabase when needed
- Watch rate limits on built-in email during heavy testing

---

## After deploy checklist

- [ ] Home page loads on production URL
- [ ] Login works
- [ ] Forgot password email link returns to the correct domain
- [ ] Creator dashboard loads for an approved creator
- [ ] Admin dashboard loads for an admin
- [ ] File upload buckets work (learning content / learning tasks)
- [ ] Contest submission create works when window is open

---

## Common deploy mistakes

1. Env vars missing on the host
2. Deployed app pointed at the wrong Supabase project
3. Auth redirect still set to localhost only
---

## Security basics

- Never commit `.env.local`
- Never put service role key in client components
- Prefer server actions / server components for privileged writes
- Review RLS before opening new tables to authenticated users
