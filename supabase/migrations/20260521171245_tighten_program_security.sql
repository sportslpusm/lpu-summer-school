drop policy if exists "Admin full access programs" on public.programs;

create policy "Admin full access programs"
  on public.programs
  for all
  to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

revoke execute on function public.create_program_registration(jsonb) from authenticated;
grant execute on function public.create_program_registration(jsonb) to anon;

notify pgrst, 'reload schema';
