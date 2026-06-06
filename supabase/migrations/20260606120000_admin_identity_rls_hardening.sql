-- Admin identity model + RLS hardening
-- Applied 2026-06-06 via Management API during security remediation.
-- Replaces the "any authenticated user = admin" policies (auth.role()='authenticated'
-- / auth.uid() is not null) with an explicit admin allowlist (public.admins + public.is_admin()).
-- Public anon read policies and service_role policies are intentionally preserved.

-- 1. Admin allowlist + helper -------------------------------------------------
create table if not exists public.admins (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  email     text,
  added_at  timestamptz not null default now()
);
alter table public.admins enable row level security;
-- No policies on public.admins: only service_role / SECURITY DEFINER may touch it.

create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public, pg_temp
as $func$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$func$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Seed the admin allowlist OUT-OF-BAND. Do NOT hardcode account identities in a
-- public repo (this would hand an attacker a known target). Run once against
-- production with the real values:
--   insert into public.admins (user_id, email)
--   values ('<auth.users.id>', '<ops-email>')
--   on conflict (user_id) do nothing;
-- The production admin was seeded via the Management API on 2026-06-06.
-- A fresh DB intentionally has zero admins until explicitly seeded (secure default).

-- 2. registrations (PII) ------------------------------------------------------
drop policy if exists "Admin can read all registrations" on public.registrations;
drop policy if exists "Admin can update registrations"   on public.registrations;
drop policy if exists "Admin can delete registrations"   on public.registrations;
create policy "Admins read registrations"   on public.registrations for select to authenticated using (public.is_admin());
create policy "Admins update registrations" on public.registrations for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete registrations" on public.registrations for delete to authenticated using (public.is_admin());
-- "Service role creates registrations" (INSERT, service_role) is preserved.

-- 3. payments -----------------------------------------------------------------
drop policy if exists "Authenticated can read payments" on public.payments;
create policy "Admins read payments" on public.payments for select to authenticated using (public.is_admin());
-- "Service role manages payments" (ALL, service_role) is preserved.

-- 4. content/config tables (writes -> admin only; public reads preserved) ------
drop policy if exists "Admin full access programs"     on public.programs;
create policy "Admins manage programs"     on public.programs     for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin full access sessions"     on public.sessions;
create policy "Admins manage sessions"     on public.sessions     for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin full access courses"      on public.courses;
create policy "Admins manage courses"      on public.courses      for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin full access fee_tiers"    on public.fee_tiers;
create policy "Admins manage fee_tiers"    on public.fee_tiers    for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin full access gallery"      on public.gallery_images;
create policy "Admins manage gallery"      on public.gallery_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admin full access site_config"  on public.site_config;
create policy "Admins manage site_config"  on public.site_config  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5. secure_config: drop the authenticated-read policy (Brevo key exposure) ----
drop policy if exists "Admin read secure_config" on public.secure_config;
-- "Service role only" (ALL, service_role) is preserved; the send-email Edge Function
-- reads this table with the service-role key and is unaffected.

-- 6. storage: payment-screenshots --------------------------------------------
-- Remove anon read (enumeration) and anon insert (uploads use the service-role
-- key inside the upload-screenshot Edge Function, so this is safe).
drop policy if exists "Allow public reads from payment-screenshots"   on storage.objects;
drop policy if exists "Allow anonymous uploads to payment-screenshots" on storage.objects;
create policy "Admins read payment screenshots"
  on storage.objects for select to authenticated
  using (bucket_id = 'payment-screenshots' and public.is_admin());
