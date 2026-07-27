-- Creator learning progress. Each creator can mark published learning items complete.

create table public.learning_item_progress (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  item_id      uuid not null references public.learning_items(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index learning_item_progress_user_idx
  on public.learning_item_progress (user_id, completed_at desc);

alter table public.learning_item_progress enable row level security;

create policy "learning_item_progress_creator_select"
  on public.learning_item_progress for select
  to authenticated
  using (
    user_id = auth.uid()
    and public.can_access_learning()
  );

create policy "learning_item_progress_creator_insert"
  on public.learning_item_progress for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.can_access_learning()
    and exists (
      select 1
      from public.learning_items item
      join public.learning_modules module on module.id = item.module_id
      where item.id = item_id
        and item.published = true
        and module.published = true
    )
  );

create policy "learning_item_progress_creator_delete"
  on public.learning_item_progress for delete
  to authenticated
  using (
    user_id = auth.uid()
    and public.can_access_learning()
  );
