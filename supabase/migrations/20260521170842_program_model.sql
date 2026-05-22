-- Program-aware content, pricing, and registration model for LPU Summer School.
-- Existing sessions/courses/fees are backfilled to the 2 Week Campus Program.

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_label text,
  description text,
  cta_context text,
  dates_label text,
  start_date date,
  end_date date,
  mode text,
  duration text,
  location text,
  registration_deadline timestamp with time zone,
  deadline_label text,
  seats_label text default 'Seats Left',
  seats_base integer,
  seats_min integer,
  seats_note text,
  fee_mode text not null default 'session_count'
    check (fee_mode in ('session_count', 'package', 'custom', 'to_be_announced')),
  fee_status text not null default 'ready'
    check (fee_status in ('ready', 'to_be_announced')),
  base_fee integer not null default 0 check (base_fee >= 0),
  gst_rate numeric(5,4) not null default 0.18 check (gst_rate >= 0),
  allow_hostel boolean not null default false,
  registration_enabled boolean not null default true,
  image_url text,
  background_image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.programs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'programs'
      and policyname = 'Public can read active programs'
  ) then
    create policy "Public can read active programs"
      on public.programs
      for select
      to anon, authenticated
      using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'programs'
      and policyname = 'Admin full access programs'
  ) then
    create policy "Admin full access programs"
      on public.programs
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

grant select on public.programs to anon;
grant select, insert, update, delete on public.programs to authenticated;
grant all on public.programs to service_role;

insert into public.programs (
  slug, name, short_label, description, cta_context, dates_label,
  start_date, end_date, mode, duration, location,
  registration_deadline, deadline_label, seats_label, seats_base, seats_min, seats_note,
  fee_mode, fee_status, base_fee, gst_rate, allow_hostel, registration_enabled,
  sort_order, is_active
)
values
  (
    'campus',
    '2 Week Campus Program',
    '2 Week Campus',
    'A focused two-week LPU campus journey where students choose sessions, learn with mentors, build visible outcomes, and present their best work in a grand showcase.',
    'For students ready to learn by doing inside a vibrant university campus.',
    '15 to 27 June 2026',
    '2026-06-15',
    '2026-06-27',
    'On Campus',
    '2 weeks',
    'LPU Campus, Phagwara',
    '2026-06-14T23:59:59+05:30',
    '14 June 2026',
    'Seats Left',
    24,
    6,
    'Final seats moving fast. Register today.',
    'session_count',
    'ready',
    0,
    0.18,
    true,
    true,
    1,
    true
  ),
  (
    'online',
    'Online Course',
    'Online Course',
    'A flexible online learning track for students who want guided skill-building from home with structured lessons, mentor touchpoints, and practical outcomes.',
    'For learners who need remote access without losing the rhythm of a guided summer program.',
    'Date to be decided',
    null,
    null,
    'Online',
    'To be announced',
    'Online',
    null,
    'To be announced',
    'Seats Update',
    null,
    null,
    'Dates, pricing, and seats will be announced with the online schedule.',
    'to_be_announced',
    'to_be_announced',
    0,
    0.18,
    false,
    false,
    2,
    true
  ),
  (
    'staff-camp',
    'LPU Staff Kid Summer Camp',
    'Staff Kid Camp',
    'A lively campus summer camp for LPU staff children, blending learning, creativity, sports, friendships, and supervised experiences across the university ecosystem.',
    'For LPU families looking for a meaningful, active, and well-supported summer experience.',
    '6 to 27 June 2026',
    '2026-06-06',
    '2026-06-27',
    'On Campus',
    '3 weeks',
    'LPU Campus, Phagwara',
    '2026-05-31T23:59:59+05:30',
    '31 May 2026',
    'Seats Left',
    18,
    5,
    'Limited camp seats for staff children.',
    'to_be_announced',
    'to_be_announced',
    0,
    0.18,
    false,
    false,
    3,
    true
  ),
  (
    'skills',
    'Tailor-Made Skills Workshop',
    'Skills Workshop',
    'A custom workshop format shaped around specific skill goals, cohorts, or institutional needs, with practical modules designed for the selected learners.',
    'For groups that need a focused skill-building experience with a tailored learning plan.',
    'Date to be decided',
    null,
    null,
    'Custom Workshop',
    'Flexible',
    'LPU / Hybrid',
    null,
    'To be announced',
    'Seats Update',
    null,
    null,
    'Seats depend on the selected custom workshop cohort.',
    'to_be_announced',
    'to_be_announced',
    0,
    0.18,
    false,
    false,
    4,
    true
  ),
  (
    'immersion',
    'LPU Immersion Program',
    'Immersion',
    'An immersive LPU experience for learners to explore campus life, academic pathways, culture, labs, and guided activities with a global outlook.',
    'For students who want to experience the energy, scale, and possibilities of LPU up close.',
    '15 to 27 June 2026',
    '2026-06-15',
    '2026-06-27',
    'On Campus',
    '2 weeks',
    'LPU Campus, Phagwara',
    '2026-06-14T23:59:59+05:30',
    '14 June 2026',
    'Seats Left',
    20,
    6,
    'Immersion seats are limited for a guided campus experience.',
    'to_be_announced',
    'to_be_announced',
    0,
    0.18,
    false,
    false,
    5,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  short_label = excluded.short_label,
  description = excluded.description,
  cta_context = excluded.cta_context,
  dates_label = excluded.dates_label,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  mode = excluded.mode,
  duration = excluded.duration,
  location = excluded.location,
  registration_deadline = excluded.registration_deadline,
  deadline_label = excluded.deadline_label,
  seats_label = excluded.seats_label,
  seats_base = excluded.seats_base,
  seats_min = excluded.seats_min,
  seats_note = excluded.seats_note,
  fee_mode = excluded.fee_mode,
  fee_status = excluded.fee_status,
  base_fee = excluded.base_fee,
  gst_rate = excluded.gst_rate,
  allow_hostel = excluded.allow_hostel,
  registration_enabled = excluded.registration_enabled,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

alter table public.sessions
  add column if not exists program_id uuid references public.programs(id) on delete restrict;

update public.sessions
set program_id = (select id from public.programs where slug = 'campus')
where program_id is null;

alter table public.sessions
  alter column program_id set not null;

create index if not exists sessions_program_id_sort_idx
  on public.sessions(program_id, sort_order);

alter table public.courses
  add column if not exists program_id uuid references public.programs(id) on delete restrict;

update public.courses c
set program_id = s.program_id
from public.sessions s
where c.session_id = s.id
  and c.program_id is null;

alter table public.courses
  alter column program_id set not null;

create index if not exists courses_program_id_sort_idx
  on public.courses(program_id, sort_order);

alter table public.fee_tiers
  add column if not exists program_id uuid references public.programs(id) on delete restrict;

update public.fee_tiers
set program_id = (select id from public.programs where slug = 'campus')
where program_id is null;

alter table public.fee_tiers
  alter column program_id set not null;

alter table public.fee_tiers
  drop constraint if exists fee_tiers_session_count_key;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'fee_tiers_program_session_count_key'
      and conrelid = 'public.fee_tiers'::regclass
  ) then
    alter table public.fee_tiers
      add constraint fee_tiers_program_session_count_key unique (program_id, session_count);
  end if;
end $$;

create index if not exists fee_tiers_program_id_count_idx
  on public.fee_tiers(program_id, session_count);

alter table public.registrations
  add column if not exists program_id uuid references public.programs(id) on delete restrict,
  add column if not exists program_slug text,
  add column if not exists program_name text,
  add column if not exists session_fee integer not null default 0,
  add column if not exists gst_amount integer not null default 0,
  add column if not exists selected_course_ids jsonb not null default '[]'::jsonb,
  add column if not exists program_snapshot jsonb not null default '{}'::jsonb;

update public.registrations
set
  program_id = coalesce(program_id, (select id from public.programs where slug = 'campus')),
  program_slug = coalesce(program_slug, 'campus'),
  program_name = coalesce(program_name, '2 Week Campus Program')
where program_id is null
   or program_slug is null
   or program_name is null;

create index if not exists registrations_program_id_created_idx
  on public.registrations(program_id, created_at desc);

create or replace function public.create_program_registration(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_program public.programs%rowtype;
  v_program_slug text := coalesce(nullif(payload->>'program_slug', ''), 'campus');
  v_course_ids uuid[] := array[]::uuid[];
  v_course_count integer := 0;
  v_course record;
  v_courses text[] := array[]::text[];
  v_selected_course_ids jsonb := '[]'::jsonb;
  v_session_ids uuid[] := array[]::uuid[];
  v_session_fee integer := 0;
  v_hostel_option text := coalesce(nullif(payload->>'hostel_option', ''), 'none');
  v_hostel_amount integer := 0;
  v_gst_amount integer := 0;
  v_total integer := 0;
  v_upi_id text := '';
  v_payment_reference text;
  v_registration_id uuid;
  v_attempt integer := 0;
  v_student_name text := nullif(trim(coalesce(payload->>'student_name', '')), '');
  v_class_level text := nullif(trim(coalesce(payload->>'class_level', '')), '');
  v_school_name text := nullif(trim(coalesce(payload->>'school_name', '')), '');
  v_city text := nullif(trim(coalesce(payload->>'city', '')), '');
  v_guardian_name text := nullif(trim(coalesce(payload->>'guardian_name', '')), '');
  v_phone text := nullif(trim(coalesce(payload->>'phone', '')), '');
  v_email text := nullif(trim(coalesce(payload->>'email', '')), '');
  v_emergency_phone text := nullif(trim(coalesce(payload->>'emergency_phone', '')), '');
begin
  if v_student_name is null
    or v_class_level is null
    or v_school_name is null
    or v_city is null
    or v_guardian_name is null
    or v_phone is null
    or v_email is null
    or v_emergency_phone is null then
    raise exception 'Missing required registration details';
  end if;

  select *
  into v_program
  from public.programs
  where slug = v_program_slug
    and is_active = true;

  if not found then
    raise exception 'Selected program is not available';
  end if;

  if not v_program.registration_enabled
    or v_program.fee_status <> 'ready'
    or v_program.fee_mode = 'to_be_announced' then
    raise exception 'Registration for % will open once schedule and fee are announced', v_program.name;
  end if;

  if v_program.registration_deadline is not null and now() > v_program.registration_deadline then
    raise exception 'Registration is closed for %', v_program.name;
  end if;

  if jsonb_typeof(coalesce(payload->'course_ids', '[]'::jsonb)) <> 'array' then
    raise exception 'Invalid course selection';
  end if;

  select coalesce(array_agg(value::uuid), array[]::uuid[])
  into v_course_ids
  from jsonb_array_elements_text(coalesce(payload->'course_ids', '[]'::jsonb)) as t(value)
  where nullif(value, '') is not null;

  v_course_count := coalesce(array_length(v_course_ids, 1), 0);

  if v_course_count = 0 then
    raise exception 'Please select at least one class';
  end if;

  for v_course in
    select c.id, c.name, c.session_id, c.sort_order, s.sort_order as session_sort
    from public.courses c
    join public.sessions s on s.id = c.session_id
    where c.id = any(v_course_ids)
      and c.program_id = v_program.id
      and s.program_id = v_program.id
      and c.is_active = true
      and s.is_active = true
    order by s.sort_order, c.sort_order, c.name
  loop
    if v_course.session_id = any(v_session_ids) then
      raise exception 'Select only one class per session';
    end if;
    v_session_ids := array_append(v_session_ids, v_course.session_id);
    v_courses := array_append(v_courses, v_course.name);
    v_selected_course_ids := v_selected_course_ids || to_jsonb(v_course.id::text);
  end loop;

  if coalesce(array_length(v_courses, 1), 0) <> v_course_count then
    raise exception 'One or more selected classes are not available for %', v_program.name;
  end if;

  if v_program.fee_mode = 'session_count' then
    select fee_amount
    into v_session_fee
    from public.fee_tiers
    where program_id = v_program.id
      and session_count = v_course_count;

    if v_session_fee is null then
      raise exception 'Fee is not configured for % selected session(s)', v_course_count;
    end if;
  else
    v_session_fee := v_program.base_fee;
  end if;

  if v_hostel_option not in ('none', 'hostel_only', 'hostel_food') then
    raise exception 'Invalid hostel option';
  end if;

  if not v_program.allow_hostel and v_hostel_option <> 'none' then
    raise exception 'Hostel is not available for %', v_program.name;
  end if;

  if v_hostel_option = 'hostel_only' then
    select coalesce(nullif(value, '')::integer, 0)
    into v_hostel_amount
    from public.site_config
    where key = 'hostel_only_fee';
  elsif v_hostel_option = 'hostel_food' then
    select coalesce(nullif(value, '')::integer, 0)
    into v_hostel_amount
    from public.site_config
    where key = 'hostel_food_fee';
  end if;

  v_upi_id := coalesce((select value from public.site_config where key = 'upi_id'), '');
  v_gst_amount := round((v_session_fee + v_hostel_amount) * v_program.gst_rate);
  v_total := v_session_fee + v_hostel_amount + v_gst_amount;

  loop
    v_attempt := v_attempt + 1;
    v_payment_reference := 'LPUSS-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    exit when not exists (
      select 1 from public.registrations where payment_reference = v_payment_reference
    );
    if v_attempt > 10 then
      raise exception 'Could not generate payment reference';
    end if;
  end loop;

  insert into public.registrations (
    student_name,
    class_level,
    school_name,
    city,
    guardian_name,
    phone,
    email,
    emergency_phone,
    session1_course,
    session2_course,
    session3_course,
    medical_note,
    total_fee,
    status,
    payment_status,
    hostel_option,
    hostel_amount,
    payment_reference,
    program_id,
    program_slug,
    program_name,
    session_fee,
    gst_amount,
    selected_course_ids,
    program_snapshot
  )
  values (
    v_student_name,
    v_class_level,
    v_school_name,
    v_city,
    v_guardian_name,
    v_phone,
    v_email,
    v_emergency_phone,
    v_courses[1],
    v_courses[2],
    v_courses[3],
    nullif(payload->>'medical_note', ''),
    v_total,
    'pending',
    'unpaid',
    v_hostel_option,
    v_hostel_amount,
    v_payment_reference,
    v_program.id,
    v_program.slug,
    v_program.name,
    v_session_fee,
    v_gst_amount,
    v_selected_course_ids,
    jsonb_build_object(
      'program_id', v_program.id,
      'slug', v_program.slug,
      'name', v_program.name,
      'dates_label', v_program.dates_label,
      'mode', v_program.mode,
      'duration', v_program.duration,
      'location', v_program.location,
      'fee_mode', v_program.fee_mode,
      'gst_rate', v_program.gst_rate
    )
  )
  returning id into v_registration_id;

  return jsonb_build_object(
    'registration_id', v_registration_id,
    'payment_reference', v_payment_reference,
    'program_slug', v_program.slug,
    'program_name', v_program.name,
    'session_fee', v_session_fee,
    'hostel_amount', v_hostel_amount,
    'gst_amount', v_gst_amount,
    'total_amount', v_total,
    'courses', to_jsonb(v_courses),
    'upi_id', v_upi_id,
    'upi_url',
      'upi://pay?pa=' || v_upi_id ||
      '&pn=LPU%20Summer%20School' ||
      '&am=' || v_total::text ||
      '&cu=INR' ||
      '&tn=' || v_payment_reference,
    'qr_data_url', null
  );
end;
$$;

revoke all on function public.create_program_registration(jsonb) from public;
grant execute on function public.create_program_registration(jsonb) to anon, authenticated;

notify pgrst, 'reload schema';
