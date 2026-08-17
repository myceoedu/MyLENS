-- Remove unused judge workspace access.
-- Keep historical user_role enum value for compatibility with existing DBs.
-- Application roles are creator + admin only.

drop policy if exists "schools_select_judge" on public.schools;
