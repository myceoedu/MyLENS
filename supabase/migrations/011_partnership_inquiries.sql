-- Partnership inquiry form (homepage sponsor "Discuss Partnership" modal).

create table public.partnership_inquiries (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  full_name     text not null,
  job_title     text not null,
  email         text not null,
  phone         text not null,
  website       text,
  message       text not null,
  consent_given boolean not null default false,
  status        text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  created_at    timestamptz not null default now()
);

create index partnership_inquiries_created_at_idx on public.partnership_inquiries (created_at desc);
create index partnership_inquiries_status_idx on public.partnership_inquiries (status);

alter table public.partnership_inquiries enable row level security;

create policy "partnership_inquiries_insert_public"
  on public.partnership_inquiries for insert
  to anon, authenticated
  with check (consent_given = true);

create policy "partnership_inquiries_admin_all"
  on public.partnership_inquiries for all
  using (public.is_admin());
