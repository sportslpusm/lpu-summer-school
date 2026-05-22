drop policy if exists "Public can read active programs" on public.programs;

create policy "Public can read active programs"
on public.programs
for select
to anon
using (is_active = true);

notify pgrst, 'reload schema';
