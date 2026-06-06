-- 2 Week Campus Program: switch from per-session course menu to 5 themed full-day tracks.
-- Flat package fee Rs.1999, 14+, optional hostel/mess add-ons kept.
-- Old sessions/courses are deactivated (not deleted) so existing registrations keep context.

-- 0. Allow the new track slugs as course categories (keep old ones for other programs).
alter table public.courses drop constraint if exists courses_category_check;
alter table public.courses add constraint courses_category_check
  check (category = any (array[
    'tech','creative','career','sports','general',
    'ai-robots','creative-arts','agri-food','entrepreneurship','eng-tech'
  ]));

-- 1. Reconfigure the campus program: one flat 2-week price.
update public.programs
set fee_mode = 'package',
    base_fee = 1999,
    fee_status = 'ready',
    registration_enabled = true,
    schedule_type = 'selectable',
    accommodation_mode = 'optional'
where slug = 'campus';

-- 2. Retire the old menu (kept inactive for history).
update public.courses  set is_active = false where program_id = (select id from public.programs where slug = 'campus');
update public.sessions set is_active = false where program_id = (select id from public.programs where slug = 'campus');

-- 3. New daily teaching slots (4). Lunch + Dance/Sports/PEP are shown in the UI, not chosen.
insert into public.sessions (program_id, name, time_slot, sort_order, is_active)
select p.id, v.name, v.time_slot, v.sort_order, true
from public.programs p
cross join (values
  ('Slot 1', '09:30 - 11:00', 1),
  ('Slot 2', '11:00 - 12:30', 2),
  ('Slot 3', '13:30 - 15:00', 3),
  ('Slot 4', '15:00 - 16:30', 4)
) as v(name, time_slot, sort_order)
where p.slug = 'campus';

-- 4. 20 track classes (5 tracks x 4 slots). category = track slug. 14+, blank images.
insert into public.courses (program_id, session_id, name, description, category, class_range, min_age, image_url, is_active, sort_order)
select p.id, s.id, v.name, v.description, v.category, 'Classes 8-12', 14, '', true, v.sort_order
from public.programs p
cross join (values
  -- slot, track-category, name, description, sort_order
  (1, 'ai-robots',       'AI Tools & Emerging Technologies',                       'Get hands-on with today''s most powerful AI tools, from generative AI to smart assistants, and the emerging tech shaping tomorrow.', 11),
  (1, 'creative-arts',   'Mobile Photography & Editing',                           'Turn your phone into a creative studio with composition, lighting and pro-level editing for standout photos.', 12),
  (1, 'agri-food',       'Mushroom Cultivation & Beekeeping Technologies',         'Learn modern, sustainable techniques for growing mushrooms and keeping bees, agriculture you can start at home.', 13),
  (1, 'entrepreneurship','Law, Diplomacy & Model Parliament',                      'Step into the world of law and diplomacy through debate, negotiation and a live Model Parliament.', 14),
  (1, 'eng-tech',        'Green Innovative Camp: Sustainable Practices',           'Explore green technology and sustainable engineering through hands-on, eco-friendly innovation challenges.', 15),
  (2, 'ai-robots',       'Fundamentals of IoT',                                    'Build your first Internet of Things projects: connect sensors, read live data and control devices from the cloud.', 21),
  (2, 'creative-arts',   'JunkGenie',                                              'Upcycle everyday waste into imaginative art and useful products in this hands-on sustainability-meets-creativity workshop.', 22),
  (2, 'agri-food',       'Hydroponics: Soilless Culture (Foundations)',            'Discover how to grow healthy plants without soil using simple, water-based hydroponic systems.', 23),
  (2, 'entrepreneurship','Design Thinking',                                        'Learn the design-thinking process that innovators use to understand people and solve real problems creatively.', 24),
  (2, 'eng-tech',        'AEROBOTIX',                                              'Dive into aerial robotics: build, program and fly drones while learning the engineering behind them.', 25),
  (3, 'ai-robots',       'Web Development & Full Stack Technologies Lab',          'Design and build real, interactive websites end-to-end, from front-end pages to back-end logic.', 31),
  (3, 'creative-arts',   'Creative Textile Arts & Home Decor Product Design',      'Design and craft your own textile art and home-decor products, from first concept to finished piece.', 32),
  (3, 'agri-food',       'Be Body Smart: Health & Fitness in Adolescence',         'A practical guide to nutrition, fitness and well-being designed for growing teens.', 33),
  (3, 'entrepreneurship','Pitch Deck Preparation',                                 'Turn an idea into an investor-ready pitch with storytelling, sharp slides and the numbers that matter.', 34),
  (3, 'eng-tech',        'Future Builders: Hands-on Engineering Workshop',         'Design, prototype and build real engineering projects in this maker-style workshop for young innovators.', 35),
  (4, 'ai-robots',       'AutoCAD & 2D/3D Drafting (Beginner to Advanced)',        'Master industry-standard AutoCAD to create precise 2D drawings and 3D models from scratch.', 41),
  (4, 'creative-arts',   'Paperverse: A World Made of Paper',                      'Explore the art of paper through origami, quilling and sculpture to build a whole world from a single sheet.', 42),
  (4, 'agri-food',       'Hydroponics: Soilless Culture (Advanced)',               'Take hydroponics further with nutrient management, system design and scaling up your soilless garden.', 43),
  (4, 'entrepreneurship','AI Tools for Business & Innovation',                     'Put cutting-edge AI tools to work for business: research, content creation and smarter decision-making.', 44),
  (4, 'eng-tech',        'Future Engineers Bootcamp: Design, Build & Innovate',    'An intensive bootcamp where you take an engineering idea from design and build all the way to a working prototype.', 45)
) as v(slot, category, name, description, sort_order)
join public.sessions s on s.program_id = p.id and s.is_active = true and s.sort_order = v.slot
where p.slug = 'campus';
