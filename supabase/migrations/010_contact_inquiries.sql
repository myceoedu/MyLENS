-- Join The Journey contact form submissions (homepage #contact).

create table public.contact_inquiries (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null,
  school_name text not null,
  message     text not null,
  status      text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  created_at  timestamptz not null default now()
);

create index contact_inquiries_created_at_idx on public.contact_inquiries (created_at desc);
create index contact_inquiries_status_idx on public.contact_inquiries (status);

alter table public.contact_inquiries enable row level security;

-- Anyone can submit the public contact form (no auth required).
create policy "contact_inquiries_insert_public"
  on public.contact_inquiries for insert
  to anon, authenticated
  with check (true);

-- Only active admins can read and manage inquiries.
create policy "contact_inquiries_admin_all"
  on public.contact_inquiries for all
  using (public.is_admin());
