alter table public.courses
  add column if not exists min_age integer not null default 12;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'courses_min_age_check'
      and conrelid = 'public.courses'::regclass
  ) then
    alter table public.courses
      add constraint courses_min_age_check check (min_age between 0 and 30);
  end if;
end;
$$;

alter table public.registrations
  add column if not exists student_age integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'registrations_student_age_check'
      and conrelid = 'public.registrations'::regclass
  ) then
    alter table public.registrations
      add constraint registrations_student_age_check check (student_age is null or student_age between 3 and 30);
  end if;
end;
$$;

update public.courses c
set min_age = case
  when p.slug = 'staff-camp' then 5
  when c.class_range ~* 'classes?[[:space:]]*10' then 15
  when c.class_range ~* 'classes?[[:space:]]*[89]' then 14
  when c.class_range ~* 'classes?[[:space:]]*[67]' then 12
  else coalesce(c.min_age, 12)
end
from public.programs p
where p.id = c.program_id;

create or replace function public.create_program_registration(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_program public.programs%rowtype;
  v_program_slug text := coalesce(nullif(payload->>'program_slug', ''), 'campus');
  v_fixed_schedule boolean := false;
  v_course_ids uuid[] := array[]::uuid[];
  v_course_count integer := 0;
  v_course record;
  v_courses text[] := array[]::text[];
  v_selected_course_ids jsonb := '[]'::jsonb;
  v_course_names jsonb := '[]'::jsonb;
  v_course_min_ages jsonb := '{}'::jsonb;
  v_session_ids uuid[] := array[]::uuid[];
  v_session_fee integer := 0;
  v_hostel_option text := coalesce(nullif(payload->>'hostel_option', ''), 'none');
  v_hostel_daily_rate integer := 0;
  v_hostel_days integer := 0;
  v_hostel_amount integer := 0;
  v_gst_amount integer := 0;
  v_total integer := 0;
  v_reserved_count integer := 0;
  v_upi_id text := '';
  v_payment_reference text;
  v_registration_id uuid;
  v_attempt integer := 0;
  v_student_name text := nullif(trim(coalesce(payload->>'student_name', '')), '');
  v_student_age integer := case
    when coalesce(payload->>'student_age', '') ~ '^[0-9]+$' then (payload->>'student_age')::integer
    else null
  end;
  v_class_level text := nullif(trim(coalesce(payload->>'class_level', '')), '');
  v_school_name text := nullif(trim(coalesce(payload->>'school_name', '')), '');
  v_city text := nullif(trim(coalesce(payload->>'city', '')), '');
  v_guardian_name text := nullif(trim(coalesce(payload->>'guardian_name', '')), '');
  v_phone text := nullif(trim(coalesce(payload->>'phone', '')), '');
  v_email text := nullif(trim(coalesce(payload->>'email', '')), '');
  v_emergency_phone text := nullif(trim(coalesce(payload->>'emergency_phone', '')), '');
begin
  if v_student_name is null
    or v_student_age is null
    or v_class_level is null
    or v_school_name is null
    or v_city is null
    or v_guardian_name is null
    or v_phone is null
    or v_email is null
    or v_emergency_phone is null then
    raise exception 'Missing required registration details';
  end if;

  if v_student_age < 3 or v_student_age > 30 then
    raise exception 'Student age must be between 3 and 30';
  end if;

  select *
  into v_program
  from public.programs
  where slug = v_program_slug
    and is_active = true
  for update;

  if not found then
    raise exception 'Selected program is not available';
  end if;

  v_fixed_schedule := v_program.slug in ('staff-camp');

  if not v_program.registration_enabled
    or v_program.fee_status <> 'ready'
    or v_program.fee_mode = 'to_be_announced'
    or v_program.start_date is null
    or v_program.end_date is null then
    raise exception 'Registration for % will open once dates, schedule, and fee are announced', v_program.name;
  end if;

  if v_program.registration_deadline is not null and now() > v_program.registration_deadline then
    raise exception 'Registration is closed for %', v_program.name;
  end if;

  if jsonb_typeof(coalesce(payload->'course_ids', '[]'::jsonb)) <> 'array' then
    raise exception 'Invalid course selection';
  end if;

  if v_fixed_schedule then
    select coalesce(array_agg(c.id order by s.sort_order, c.sort_order, c.name), array[]::uuid[])
    into v_course_ids
    from public.courses c
    join public.sessions s on s.id = c.session_id
    where c.program_id = v_program.id
      and s.program_id = v_program.id
      and c.is_active = true
      and s.is_active = true;
  else
    select coalesce(array_agg(value::uuid), array[]::uuid[])
    into v_course_ids
    from jsonb_array_elements_text(coalesce(payload->'course_ids', '[]'::jsonb)) as t(value)
    where nullif(value, '') is not null;
  end if;

  v_course_count := coalesce(array_length(v_course_ids, 1), 0);

  if v_course_count = 0 then
    if v_fixed_schedule then
      raise exception 'The fixed schedule for % is not configured yet', v_program.name;
    end if;
    raise exception 'Please select at least one class';
  end if;

  if coalesce(v_program.seats_base, 0) > 0 then
    select count(*)::integer
    into v_reserved_count
    from public.registrations
    where program_id = v_program.id
      and coalesce(status, '') not in ('cancelled', 'rejected')
      and coalesce(payment_status, '') <> 'failed';

    if v_reserved_count >= v_program.seats_base then
      raise exception 'This program is currently full';
    end if;
  end if;

  for v_course in
    select c.id, c.name, c.session_id, c.sort_order, coalesce(c.min_age, 0) as min_age, s.sort_order as session_sort
    from public.courses c
    join public.sessions s on s.id = c.session_id
    where c.id = any(v_course_ids)
      and c.program_id = v_program.id
      and s.program_id = v_program.id
      and c.is_active = true
      and s.is_active = true
    order by s.sort_order, c.sort_order, c.name
  loop
    if v_student_age < v_course.min_age then
      raise exception '% requires student age %+', v_course.name, v_course.min_age;
    end if;

    if not v_fixed_schedule and v_course.session_id = any(v_session_ids) then
      raise exception 'Select only one class per session';
    end if;
    if not (v_course.session_id = any(v_session_ids)) then
      v_session_ids := array_append(v_session_ids, v_course.session_id);
    end if;
    v_courses := array_append(v_courses, v_course.name);
    v_selected_course_ids := v_selected_course_ids || to_jsonb(v_course.id::text);
    v_course_names := v_course_names || to_jsonb(v_course.name);
    v_course_min_ages := v_course_min_ages || jsonb_build_object(v_course.id::text, v_course.min_age);
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
    v_session_fee := coalesce(v_program.base_fee, 0);
  end if;

  if v_hostel_option not in ('none', 'hostel_only', 'hostel_food') then
    raise exception 'Invalid hostel option';
  end if;

  if not v_program.allow_hostel and v_hostel_option <> 'none' then
    raise exception 'Hostel is not available for %', v_program.name;
  end if;

  if v_hostel_option <> 'none' then
    v_hostel_days := case
      when lower(coalesce(v_program.duration, '')) ~ '([0-9]+)[[:space:]]*week'
        then greatest((substring(lower(v_program.duration) from '([0-9]+)[[:space:]]*week'))::integer * 7, 1)
      when lower(coalesce(v_program.duration, '')) ~ '([0-9]+)[[:space:]]*day'
        then greatest((substring(lower(v_program.duration) from '([0-9]+)[[:space:]]*day'))::integer, 1)
      when v_program.start_date is not null and v_program.end_date is not null
        then greatest((v_program.end_date - v_program.start_date) + 1, 1)
      else 1
    end;
  end if;

  if v_hostel_option = 'hostel_only' then
    select case when value ~ '^[0-9]+$' then value::integer else 0 end
    into v_hostel_daily_rate
    from public.site_config
    where key = 'hostel_only_fee';
  elsif v_hostel_option = 'hostel_food' then
    select case when value ~ '^[0-9]+$' then value::integer else 0 end
    into v_hostel_daily_rate
    from public.site_config
    where key = 'hostel_food_fee';
  end if;

  v_hostel_daily_rate := coalesce(v_hostel_daily_rate, 0);
  if v_hostel_daily_rate > 0 then
    v_hostel_amount := v_hostel_daily_rate * greatest(v_hostel_days, 1);
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
    student_age,
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
    course_names,
    program_snapshot
  )
  values (
    v_student_name,
    v_student_age,
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
    v_course_names,
    jsonb_build_object(
      'program_id', v_program.id,
      'slug', v_program.slug,
      'name', v_program.name,
      'student_age', v_student_age,
      'dates_label', v_program.dates_label,
      'mode', v_program.mode,
      'duration', v_program.duration,
      'location', v_program.location,
      'fee_mode', v_program.fee_mode,
      'selection_mode', case when v_fixed_schedule then 'fixed_schedule' else 'participant_choice' end,
      'gst_rate', v_program.gst_rate,
      'hostel_daily_rate', v_hostel_daily_rate,
      'hostel_days', v_hostel_days,
      'courses', v_course_names,
      'course_min_ages', v_course_min_ages
    )
  )
  returning id into v_registration_id;

  return jsonb_build_object(
    'registration_id', v_registration_id,
    'payment_reference', v_payment_reference,
    'program_slug', v_program.slug,
    'program_name', v_program.name,
    'selection_mode', case when v_fixed_schedule then 'fixed_schedule' else 'participant_choice' end,
    'student_age', v_student_age,
    'session_fee', v_session_fee,
    'hostel_daily_rate', v_hostel_daily_rate,
    'hostel_days', v_hostel_days,
    'hostel_amount', v_hostel_amount,
    'gst_amount', v_gst_amount,
    'total_amount', v_total,
    'courses', v_course_names,
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
grant execute on function public.create_program_registration(jsonb) to anon;
