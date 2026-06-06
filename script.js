const SUPABASE_URL = "https://bynpuhoysivxxlblxica.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bnB1aG95c2l2eHhsYmx4aWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTE1NjAsImV4cCI6MjA5NDQ4NzU2MH0.JltZJYggs2ycs3u0HUelRMivZgsByW_g5-n3qz6EaPk";

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-category]");
const form = document.querySelector("[data-registration-form]");
const statusMessage = document.querySelector("[data-form-status]");
let sessionToggles = document.querySelectorAll("[data-session-toggle]");
let courseSelects = document.querySelectorAll("[data-session-course]");
const feeTotals = document.querySelectorAll("[data-fee-total]");
const feeNote = document.querySelector("[data-fee-note]");
const countdowns = document.querySelectorAll("[data-countdown]");
const floatingRegister = document.querySelector("[data-floating-register]");
const registerButtons = document.querySelectorAll('a[href="register.html"]:not([data-floating-register]), a[href="/register"]:not([data-floating-register])');
const seatsLeftItems = document.querySelectorAll("[data-seats-left]");
const seatsNotes = document.querySelectorAll("[data-seats-note]");
const galleryMain = document.querySelector("[data-gallery-main]");
const gallerySideA = document.querySelector("[data-gallery-side-a]");
const gallerySideB = document.querySelector("[data-gallery-side-b]");
const gallerySlots = document.querySelectorAll("[data-gallery-slot]");
const heroGalleryRoot = document.querySelector("[data-hero-gallery]");
const heroGalleryTrack = document.querySelector("[data-hero-gallery] .hero-media-track");
const heroProgramRoot = document.querySelector("[data-program-hero]");
const heroProgramContent = document.querySelector("[data-hero-content]");
const heroProgramName = document.querySelector("[data-hero-program-name]");
const heroProgramDescription = document.querySelector("[data-hero-description]");
const heroProgramContext = document.querySelector("[data-hero-cta-context]");
const heroProgramDeadlineLabel = document.querySelector("[data-hero-deadline-label]");
const heroProgramSeatsLabel = document.querySelector("[data-hero-seats-label]");
const heroProgramBgImage = document.querySelector("[data-hero-bg-image]");
const heroProgramTabs = document.querySelectorAll("[data-program-option]");
const trackProgramFilters = document.querySelector("[data-track-programs]");
const trackScrollHint = document.querySelector("[data-track-scroll-hint]");
const trackEmpty = document.getElementById("trackEmpty");
const registrationProgramRoot = document.querySelector("[data-registration-programs]");
const registrationProgramInput = document.querySelector("[data-program-slug]");
const registrationProgramStatus = document.querySelector("[data-program-status]");
const registrationProgramSelect = document.querySelector("[data-registration-program-select]");
const studentAgeInput = form?.querySelector('input[name="studentAge"]');
const registrationSelectionHeading = document.querySelector("[data-selection-heading]");
const registrationSelectionHelp = document.querySelector("[data-selection-help]");
const sessionSelectorsRoot = document.querySelector("[data-session-selectors]");
const hostelBlock = document.querySelector("[data-hostel-block]");
const hostelOptionsRoot = document.querySelector("[data-hostel-options]");
const registrationSummaryFields = {
  dates: document.querySelector('[data-reg-summary="dates"]'),
  schedule: document.querySelector('[data-reg-summary="schedule"]'),
  venue: document.querySelector('[data-reg-summary="venue"]'),
  deadline: document.querySelector('[data-reg-summary="deadline"]')
};
const heroProgramFacts = {
  eligibility: document.querySelector('[data-hero-fact="eligibility"]'),
  duration: document.querySelector('[data-hero-fact="duration"]'),
  mode: document.querySelector('[data-hero-fact="mode"]'),
  focus: document.querySelector('[data-hero-fact="focus"]')
};
const heroProgramMeta = {
  dates: document.querySelector('[data-hero-meta="dates"]'),
  mode: document.querySelector('[data-hero-meta="mode"]'),
  duration: document.querySelector('[data-hero-meta="duration"]'),
  location: document.querySelector('[data-hero-meta="location"]')
};

const FALLBACK_HERO_IMAGES = [
  { src: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779163726439-f0drdpdqahd.png", alt: "LPU campus summer school moment" },
  { src: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779089835922-qm6ldbzss5.png", alt: "Sports activity at LPU Summer School" },
  { src: "https://static.wixstatic.com/media/ccbabc_49e677a164c84c6295873d8bc2ea33f9~mv2.png", alt: "Dance workshop showcase" },
  { src: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779191793080-mgw718dwqh9.png", alt: "Robotics and design workshop" },
  { src: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779190305970-8wmlssoh4pn.png", alt: "UI and design workshop" },
  { src: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779188603214-x7q34c5kfq.png", alt: "AI learning and creativity" },
  { src: "https://static.wixstatic.com/media/ccbabc_620eb550d859431aa501391fa6557a1e~mv2.png", alt: "Music studio summer school activity" },
  { src: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779192688907-7ntfeoxr9qt.png", alt: "General sports summer school activity" }
];

const HERO_PROGRAMS = {
  campus: {
    name: "2 Week Campus Program",
    description: "A focused two-week LPU campus journey where students choose sessions, learn with mentors, build visible outcomes, and present their best work in a grand showcase.",
    context: "For students ready to learn by doing inside a vibrant university campus.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779163726439-f0drdpdqahd.png",
    startDate: "2026-06-15",
    endDate: "2026-06-27",
    scheduleType: "selectable",
    dateDisplayMode: "date_range",
    accommodationMode: "optional",
    allowHostel: true,
    allowMess: true,
    facts: { eligibility: "Grades 6-12", duration: "2 weeks", mode: "On Campus", focus: "Session-wise tracks" },
    urgency: { deadlineLabel: "14 June 2026", deadline: "2026-06-14T23:59:59+05:30", seatsBase: 24, seatsMin: 6, note: "Final seats moving fast. Register today." },
    meta: { dates: "15–27 June 2026", mode: "On Campus", duration: "2 weeks", location: "LPU Campus, Phagwara" }
  },
  online: {
    name: "Online Course",
    description: "A flexible online learning track for students who want guided skill-building from home with structured lessons, mentor touchpoints, and practical outcomes.",
    context: "For learners who need remote access without losing the rhythm of a guided summer program.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779188840605-uiunxfem2bh.png",
    scheduleType: "selectable",
    dateDisplayMode: "self_paced",
    accommodationMode: "none",
    allowHostel: false,
    allowMess: false,
    facts: { eligibility: "Open learners", duration: "Self-paced", mode: "Online", focus: "Remote skill-building" },
    urgency: { deadlineLabel: "To be announced", deadline: "", seatsBase: 30, seatsMin: 12, note: "Dates and seats will be announced with the online schedule." },
    meta: { dates: "Self-paced", mode: "Online", duration: "Self-paced", location: "Online" }
  },
  "staff-camp": {
    name: "LPU Staff Kid Summer Camp",
    description: "A lively campus summer camp for LPU staff children, blending learning, creativity, sports, friendships, and supervised experiences across the university ecosystem.",
    context: "For LPU families looking for a meaningful, active, and well-supported summer experience.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779089835922-qm6ldbzss5.png",
    startDate: "2026-06-06",
    endDate: "2026-06-27",
    scheduleType: "fixed",
    dateDisplayMode: "date_range",
    accommodationMode: "none",
    allowHostel: false,
    allowMess: false,
    facts: { eligibility: "LPU staff kids", duration: "3 weeks", mode: "On Campus", focus: "Camp + activities" },
    urgency: { deadlineLabel: "31 May 2026", deadline: "2026-05-31T23:59:59+05:30", seatsBase: 18, seatsMin: 5, note: "Limited camp seats for staff children." },
    meta: { dates: "6–27 June 2026", mode: "On Campus", duration: "3 weeks", location: "LPU Campus, Phagwara" }
  },
  skills: {
    name: "Tailor-Made Skills Workshop",
    description: "A custom workshop format shaped around specific skill goals, cohorts, or institutional needs, with practical modules designed for the selected learners.",
    context: "For groups that need a focused skill-building experience with a tailored learning plan.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779191793080-mgw718dwqh9.png",
    scheduleType: "selectable",
    dateDisplayMode: "to_be_announced",
    accommodationMode: "none",
    allowHostel: false,
    allowMess: false,
    facts: { eligibility: "Custom cohorts", duration: "Flexible", mode: "LPU / Hybrid", focus: "Designed to need" },
    urgency: { deadlineLabel: "To be announced", deadline: "", seatsBase: 16, seatsMin: 6, note: "Seats depend on the selected custom workshop cohort." },
    meta: { dates: "Date to be decided", mode: "Custom Workshop", duration: "Flexible", location: "LPU / Hybrid" }
  },
  immersion: {
    name: "LPU Immersion Program",
    description: "An immersive LPU experience for learners to explore campus life, academic pathways, culture, labs, and guided activities with a global outlook.",
    context: "For students who want to experience the energy, scale, and possibilities of LPU up close.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779188603214-x7q34c5kfq.png",
    startDate: "2026-06-15",
    endDate: "2026-06-27",
    scheduleType: "selectable",
    dateDisplayMode: "date_range",
    accommodationMode: "included",
    allowHostel: false,
    allowMess: false,
    includedServices: "Stay, food, campus experiences, and guided activities are included when this package is announced.",
    facts: { eligibility: "Students / groups", duration: "2 weeks", mode: "On Campus", focus: "Campus immersion" },
    urgency: { deadlineLabel: "14 June 2026", deadline: "2026-06-14T23:59:59+05:30", seatsBase: 20, seatsMin: 6, note: "Immersion seats are limited for a guided campus experience." },
    meta: { dates: "15–27 June 2026", mode: "On Campus", duration: "2 weeks", location: "LPU Campus, Phagwara" }
  }
};

const HERO_BACKGROUND_CONFIG_KEYS = {
  campus: "hero_bg_campus",
  online: "hero_bg_online",
  "staff-camp": "hero_bg_staff_camp",
  skills: "hero_bg_skills",
  immersion: "hero_bg_immersion"
};

function formatDisplayDate(value, options = {}) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: options.short ? "short" : "long",
    ...(options.omitYear ? {} : { year: "numeric" })
  });
}

function formatDisplayDateRange(startDate, endDate, fallback = "Date to be decided") {
  if (!startDate && !endDate) return fallback;
  if (startDate && !endDate) return `From ${formatDisplayDate(startDate, { short: true })}`;
  if (!startDate && endDate) return `Until ${formatDisplayDate(endDate, { short: true })}`;
  const start = new Date(`${startDate}T00:00:00+05:30`);
  const end = new Date(`${endDate}T00:00:00+05:30`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return fallback;
  const sameYear = start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" })
  });
  return `${startLabel} to ${formatDisplayDate(endDate, { short: true })}`;
}

function durationFromProgramDates(startDate, endDate, fallback = "To be announced") {
  if (!startDate || !endDate) return fallback;
  const start = new Date(`${startDate}T00:00:00+05:30`);
  const end = new Date(`${endDate}T00:00:00+05:30`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return fallback;
  const days = Math.max(Math.round((end - start) / 86400000) + 1, 1);
  if (days >= 7) {
    const weeks = Math.ceil(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  }
  return `${days} day${days > 1 ? "s" : ""}`;
}

function normalizedDateDisplayMode(row = {}, fallback = {}) {
  const explicitMode = row.date_display_mode;
  if (["date_range", "self_paced", "to_be_announced"].includes(explicitMode)) return explicitMode;
  if (row.start_date || row.end_date) return "date_range";
  const label = String(row.dates_label || fallback.meta?.dates || "").toLowerCase();
  if (label.includes("self-paced") || label.includes("self paced")) return "self_paced";
  const fallbackMode = fallback.dateDisplayMode;
  if (["date_range", "self_paced", "to_be_announced"].includes(fallbackMode)) return fallbackMode;
  if (fallback.startDate || fallback.endDate) return "date_range";
  return "to_be_announced";
}

function displayDatesForProgram(row = {}, fallback = {}, hasRemoteProgram = false) {
  const mode = normalizedDateDisplayMode(row, fallback);
  if (mode === "self_paced") return "Self-paced";
  if (mode === "to_be_announced") return "Date to be announced";
  return row.start_date || row.end_date
    ? formatDisplayDateRange(row.start_date, row.end_date)
    : row.dates_label || (hasRemoteProgram ? "Date to be announced" : fallback.meta?.dates || "Date to be announced");
}

function displayDurationForProgram(row = {}, fallback = {}, hasRemoteProgram = false) {
  const mode = normalizedDateDisplayMode(row, fallback);
  if (mode === "self_paced") return "Self-paced";
  if (mode === "to_be_announced") return "To be announced";
  return row.start_date || row.end_date
    ? durationFromProgramDates(row.start_date, row.end_date)
    : row.duration || (hasRemoteProgram ? "To be announced" : fallback.meta?.duration || "To be announced");
}

function normalizeProgram(row = {}, fallbackKey = "campus") {
  const slug = row.slug || fallbackKey;
  const fallback = HERO_PROGRAMS[slug] || HERO_PROGRAMS[fallbackKey] || HERO_PROGRAMS.campus;
  const hasRemoteProgram = Boolean(row.id);
  const deadline = hasRemoteProgram ? row.registration_deadline || "" : fallback.urgency?.deadline || "";
  const hasProgramBackground = Boolean(row.background_image_url);
  const dateDisplayMode = normalizedDateDisplayMode(row, fallback);
  const datesLabel = displayDatesForProgram(row, fallback, hasRemoteProgram);
  const durationLabel = displayDurationForProgram(row, fallback, hasRemoteProgram);
  const deadlineLabel = row.registration_deadline
    ? formatDisplayDate(row.registration_deadline.slice(0, 10))
    : row.deadline_label || (hasRemoteProgram ? "To be announced" : fallback.urgency?.deadlineLabel || "To be announced");
  const scheduleType = row.schedule_type || fallback.scheduleType || (slug === "staff-camp" ? "fixed" : "selectable");
  const accommodationMode = row.accommodation_mode || fallback.accommodationMode || (row.allow_hostel ? "optional" : "none");
  return {
    ...fallback,
    id: row.id || fallback.id || null,
    slug,
    name: row.name || fallback.name,
    shortLabel: row.short_label || fallback.shortLabel || fallback.name,
    description: row.description || fallback.description,
    context: row.cta_context || fallback.context || "",
    backgroundImage: row.background_image_url || row.image_url || fallback.backgroundImage,
    hasProgramBackground,
    imageUrl: row.image_url || fallback.imageUrl || row.background_image_url || fallback.backgroundImage,
    startDate: row.start_date || (hasRemoteProgram ? "" : fallback.startDate || ""),
    endDate: row.end_date || (hasRemoteProgram ? "" : fallback.endDate || ""),
    feeMode: row.fee_mode || fallback.feeMode || "session_count",
    feeStatus: row.fee_status || fallback.feeStatus || "ready",
    baseFee: Number(row.base_fee ?? fallback.baseFee ?? 0),
    allowHostel: Boolean(row.allow_hostel ?? fallback.allowHostel ?? false),
    allowMess: Boolean(row.allow_mess ?? fallback.allowMess ?? false),
    scheduleType,
    dateDisplayMode,
    accommodationMode,
    messMealRate: Number(row.mess_meal_rate ?? fallback.messMealRate ?? 0),
    messMealsPerDay: Number(row.mess_meals_per_day ?? fallback.messMealsPerDay ?? 0),
    includedServices: row.included_services || fallback.includedServices || "",
    registrationEnabled: Boolean(row.registration_enabled ?? fallback.registrationEnabled ?? true),
    sortOrder: Number(row.sort_order ?? fallback.sortOrder ?? 0),
    isActive: Boolean(row.is_active ?? fallback.isActive ?? true),
    facts: {
      eligibility: fallback.facts?.eligibility || "Students",
      duration: durationLabel,
      mode: row.mode || fallback.facts?.mode || fallback.meta?.mode || "To be announced",
      focus: row.short_label || fallback.facts?.focus || fallback.name
    },
    urgency: {
      deadlineLabel,
      deadline,
      seatsLabel: row.seats_label || fallback.urgency?.seatsLabel || "Seats Left",
      seatsBase: Number(hasRemoteProgram ? (row.seats_base || 0) : (fallback.urgency?.seatsBase || 0)),
      seatsMin: Number(hasRemoteProgram ? (row.seats_min || 0) : (fallback.urgency?.seatsMin || 0)),
      note: row.seats_note || fallback.urgency?.note || ""
    },
    meta: {
      dates: datesLabel,
      mode: row.mode || fallback.meta?.mode || "To be announced",
      duration: durationLabel,
      location: row.location || fallback.meta?.location || "To be announced"
    }
  };
}

function setPrograms(rows = []) {
  const normalized = rows.length
    ? rows.map((row) => normalizeProgram(row, row.slug)).sort((a, b) => a.sortOrder - b.sortOrder)
    : Object.keys(HERO_PROGRAMS).map((slug, index) => normalizeProgram({ slug, sort_order: index + 1 }, slug));

  programs = normalized;
  programBySlug = {};
  normalized.forEach((program) => {
    programBySlug[program.slug] = program;
    HERO_PROGRAMS[program.slug] = program;
  });
  if (!programBySlug[trackProgramSlug]) trackProgramSlug = programs[0]?.slug || "campus";
  if (form) {
    if (registrationProgramSlug && !programBySlug[registrationProgramSlug]) registrationProgramSlug = "";
  } else if (!programBySlug[registrationProgramSlug]) {
    registrationProgramSlug = programs[0]?.slug || "campus";
  }
  renderHeroProgramTabs();
}

function getProgram(slug, fallback = "campus") {
  return programBySlug[slug] || HERO_PROGRAMS[slug] || programBySlug[fallback] || HERO_PROGRAMS[fallback] || programs[0] || HERO_PROGRAMS.campus;
}

function renderHeroProgramTabs() {
  if (!heroProgramTabs.length) return;
  heroProgramTabs.forEach((tab) => {
    const program = getProgram(tab.dataset.programOption);
    if (!program) return;
    const title = tab.querySelector("span");
    const date = tab.querySelector("small");
    if (title) title.textContent = program.name;
    if (date) date.textContent = program.meta?.dates || program.urgency?.deadlineLabel || "";
  });
}

let heroProgramTimer = null;
let heroProgramAutoTimer = null;
let programs = [];
let programBySlug = {};
let publicSessions = [];
let publicCourses = [];
let publicFees = [];
let programStatsById = {};
let trackProgramSlug = "campus";
let registrationProgramSlug = form ? "" : "campus";

let sessionCourses = {};

let feeBySessionCount = {
  0: 0,
  1: 600,
  2: 1000,
  3: 1400
};
let feeByProgramSessionCount = {};

const FIXED_SCHEDULE_PROGRAMS = new Set(["staff-camp"]);
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;
const AGE_MIN = 1;
const AGE_MAX = 70;
const DEFAULT_MESS_MEAL_RATE = 80;
const DEFAULT_MESS_MEALS_PER_DAY = 3;
let globalMessMealRate = DEFAULT_MESS_MEAL_RATE;
let globalMessMealsPerDay = DEFAULT_MESS_MEALS_PER_DAY;

function programUsesFixedSchedule(program) {
  return program?.scheduleType === "fixed" || FIXED_SCHEDULE_PROGRAMS.has(program?.slug);
}

function programAccommodationMode(program) {
  if (!program) return "none";
  return program.accommodationMode || (program.allowHostel ? "optional" : "none");
}

function programShowsHostelStep(program) {
  return programAccommodationMode(program) === "optional" && Boolean(program?.allowHostel || program?.allowMess);
}

function programIncludesAccommodation(program) {
  return programAccommodationMode(program) === "included";
}

function phoneDigits(phone) { return phone.replace(/[^0-9+]/g, ""); }
function phoneWA(phone) { return phone.replace(/[^0-9]/g, ""); }
const waText = encodeURIComponent("Hi, I have a query about LPU Summer School 2026");

function phoneDigitCount(value) {
  return String(value || "").replace(/\D/g, "").length;
}

function trimPhoneValue(value, maxDigits = PHONE_MAX_DIGITS) {
  const raw = String(value || "").replace(/[^\d+\s().-]/g, "");
  let digits = 0;
  let output = "";
  for (const char of raw) {
    if (/\d/.test(char)) {
      if (digits >= maxDigits) continue;
      digits += 1;
    }
    if (char === "+" && output.length > 0) continue;
    output += char;
  }
  return output.trimStart();
}

function isValidPhoneNumber(value) {
  const raw = String(value || "").trim();
  const digits = phoneDigitCount(raw);
  return digits >= PHONE_MIN_DIGITS && digits <= PHONE_MAX_DIGITS && /^\+?[0-9\s().-]+$/.test(raw);
}

function isValidEmail(value) {
  const email = String(value || "").trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatGuardianName(title, name) {
  return [String(title || "").trim(), String(name || "").trim()].filter(Boolean).join(" ");
}

function applySettings(cfg) {
  const phone1 = cfg["contact_phone_1"] || "";
  const phone2 = cfg["contact_phone_2"] || "";
  const email = cfg["contact_email"] || "";
  const pm1 = cfg["project_manager_1"] || "";
  const pm2 = cfg["project_manager_2"] || "";
  const director = cfg["program_director"] || "";
  const directorEmail = cfg["director_email"] || "";
  const eventName = cfg["event_name"] || "";
  const uniName = cfg["university_name"] || "";
  const address = cfg["address"] || "";
  const deadline = cfg["registration_deadline"] || "";

  Object.entries(HERO_BACKGROUND_CONFIG_KEYS).forEach(([programKey, configKey]) => {
    const imageUrl = (cfg[configKey] || "").trim();
    if (imageUrl && HERO_PROGRAMS[programKey] && !HERO_PROGRAMS[programKey].hasProgramBackground) {
      HERO_PROGRAMS[programKey].backgroundImage = imageUrl;
    }
  });
  updateHeroBackground(getActiveHeroProgram(), false);

  // Utility bar contact
  document.querySelectorAll('[data-cfg="utility-contact"]').forEach((el) => {
    el.textContent = phone1 && phone2 ? `${phone1} | ${phone2} | ${email}` : email;
    if (email) el.href = `mailto:${email}`;
  });

  // Footer event name
  document.querySelectorAll('[data-cfg="event-name"]').forEach((el) => {
    if (eventName) el.textContent = eventName;
  });

  // Footer full address
  document.querySelectorAll('[data-cfg="full-address"]').forEach((el) => {
    if (uniName && address) el.textContent = `${uniName}, ${address}`;
  });

  // Footer email
  document.querySelectorAll('[data-cfg="footer-email"]').forEach((el) => {
    if (email) el.innerHTML = `General enquiries: <a href="mailto:${esc(email)}">${esc(email)}</a>`;
  });

  // Footer contact cards
  function updateFooterPM(n, name, phone) {
    document.querySelectorAll(`[data-cfg-pm="${n}"]`).forEach((card) => {
      if (name) card.querySelector("span").textContent = `${name}, Program Manager`;
      const links = card.querySelectorAll(".contact-links a");
      if (phone && links[0]) {
        links[0].href = `tel:${phoneDigits(phone)}`;
        links[0].textContent = `\u{1F4DE} ${phone}`;
      }
      if (phone && links[1]) {
        links[1].href = `https://wa.me/${phoneWA(phone)}?text=${waText}`;
      }
    });
  }
  updateFooterPM("1", pm1, phone1);
  updateFooterPM("2", pm2, phone2);

  // Footer director card
  document.querySelectorAll("[data-cfg-director]").forEach((card) => {
    if (director) card.querySelector("span").textContent = `${director}, Program Director`;
    const link = card.querySelector("a");
    if (directorEmail && link) {
      link.href = `mailto:${directorEmail}`;
      link.textContent = directorEmail;
    }
  });

  // Overlay manager cards
  function updateOverlayPM(n, name, phone) {
    document.querySelectorAll(`[data-cfg-pm-overlay="${n}"]`).forEach((card) => {
      if (name) card.querySelector("strong").textContent = name;
      const call = card.querySelector(".action-btn.call");
      const wa = card.querySelector(".action-btn.whatsapp");
      if (phone && call) call.href = `tel:${phoneDigits(phone)}`;
      if (phone && wa) wa.href = `https://wa.me/${phoneWA(phone)}?text=${waText}`;
    });
  }
  updateOverlayPM("1", pm1, phone1);
  updateOverlayPM("2", pm2, phone2);

  // Countdown deadline
  if (deadline) {
    document.querySelectorAll("[data-countdown]").forEach((el) => {
      el.dataset.deadline = deadline;
    });
    const dlabel = document.querySelector('[data-cfg="deadline-label"]');
    if (dlabel) {
      const d = new Date(deadline);
      dlabel.textContent = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    }
    registrationDeadline = new Date(deadline);
    checkDeadlineExpiry();
    updateHeroProgram(heroProgramRoot?.dataset.activeProgram || "campus", false);
  }

  // Dynamic hostel daily rates from config
  HOSTEL_DAILY_RATES.hostel_only = normalizedHostelDailyRate(cfg["hostel_only_fee"], HOSTEL_DAILY_RATES.hostel_only);
  HOSTEL_DAILY_RATES.hostel_food = normalizedHostelDailyRate(cfg["hostel_food_fee"], HOSTEL_DAILY_RATES.hostel_food);
  globalMessMealRate = normalizedHostelDailyRate(cfg["mess_meal_fee"], globalMessMealRate || DEFAULT_MESS_MEAL_RATE);
  globalMessMealsPerDay = normalizedHostelDailyRate(cfg["mess_meals_per_day"], globalMessMealsPerDay || DEFAULT_MESS_MEALS_PER_DAY);

  // Update hostel price labels on register page
  updateHostelPriceLabels();

  updateHomepageHostelPrices();

  // Program dates
  const startDate = cfg["event_start_date"];
  const endDate = cfg["event_end_date"];
  if (startDate && endDate) {
    const s = new Date(startDate + "T00:00:00+05:30");
    const e = new Date(endDate + "T00:00:00+05:30");
    const fmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const fmtShort = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const dateStr = s.getFullYear() === e.getFullYear()
      ? `${fmtShort(s)} — ${fmt(e)}`
      : `${fmt(s)} — ${fmt(e)}`;
    document.querySelectorAll('[data-cfg="program-dates"]').forEach((el) => {
      el.textContent = dateStr;
    });
  }
}

function checkDeadlineExpiry() {
  if (!registrationDeadline) return;
  const expired = new Date() > registrationDeadline;
  if (!expired) return;

  // Disable registration form
  if (form) {
    form.querySelectorAll("input, select, textarea, button").forEach((el) => { el.disabled = true; });
    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Registration is closed. The deadline has passed.";
      status.classList.add("error");
    }
  }

  // Update register CTA buttons site-wide
  document.querySelectorAll('.nav-cta, .floating-register, .hero-actions .button.primary').forEach((el) => {
    if (el.tagName === "A") {
      el.removeAttribute("href");
      el.style.opacity = "0.5";
      el.style.pointerEvents = "none";
    }
  });
}

function getActiveHeroProgram() {
  if (!heroProgramRoot) return null;
  return getProgram(heroProgramRoot.dataset.activeProgram || "campus");
}

function setCountdownPartText(countdown, value) {
  countdown.querySelector("[data-days]").textContent = value.days;
  countdown.querySelector("[data-hours]").textContent = value.hours;
  countdown.querySelector("[data-minutes]").textContent = value.minutes;
  countdown.querySelector("[data-seconds]").textContent = value.seconds;
}

function updateHeroUrgency(program) {
  const urgency = program?.urgency || {};
  const deadline = urgency.deadline || "";
  const deadlineDate = deadline ? new Date(deadline) : null;
  const hasAnnouncedDeadline = Boolean(deadlineDate && !Number.isNaN(deadlineDate.getTime()));

  if (heroProgramDeadlineLabel) {
    heroProgramDeadlineLabel.textContent = urgency.deadlineLabel || "To be announced";
  }

  if (heroProgramSeatsLabel) {
    heroProgramSeatsLabel.textContent = hasAnnouncedDeadline && Number(urgency.seatsBase || 0) > 0 ? (urgency.seatsLabel || "Seats Left") : "Seats Update";
  }

  document.querySelectorAll("[data-countdown]").forEach((countdown) => {
    if (countdown.closest("[data-program-hero]")) {
      countdown.dataset.deadline = deadline;
      countdown.dataset.deadlineLabel = urgency.deadlineLabel || "";
    }
  });

  if (heroProgramRoot) {
    heroProgramRoot.classList.toggle("is-urgency-pending", !hasAnnouncedDeadline);
    heroProgramRoot.dataset.urgencyPending = hasAnnouncedDeadline ? "false" : "true";
    heroProgramRoot.dataset.programId = program?.id || "";
    heroProgramRoot.dataset.seatsBase = String(urgency.seatsBase || 0);
    heroProgramRoot.dataset.seatsMin = String(urgency.seatsMin || 0);
    heroProgramRoot.dataset.heroSeatsNote = urgency.note || "";
  }

  updateCountdown();
  updateSeatsLeft();
}

function updateHeroBackground(program, animate = true) {
  const nextSrc = program?.backgroundImage;
  if (!heroProgramRoot || !heroProgramBgImage || !nextSrc || heroProgramBgImage.src === nextSrc) return;

  const swapBackground = () => {
    heroProgramBgImage.src = nextSrc;
    if (animate) {
      requestAnimationFrame(() => {
        heroProgramRoot.classList.remove("is-bg-switching");
      });
    }
  };

  if (!animate) {
    swapBackground();
    return;
  }

  heroProgramRoot.classList.add("is-bg-switching");
  const preload = new Image();
  preload.onload = swapBackground;
  preload.onerror = () => {
    heroProgramRoot.classList.remove("is-bg-switching");
  };
  preload.src = nextSrc;
}

function updateHeroProgram(programKey, animate = true, options = {}) {
  const program = getProgram(programKey);
  if (!heroProgramRoot || !program) return;
  programKey = program.slug || programKey;

  const render = () => {
    heroProgramRoot.dataset.activeProgram = programKey;
    if (heroProgramName) heroProgramName.textContent = program.name;
    if (heroProgramDescription) heroProgramDescription.textContent = program.description;
    if (heroProgramContext) heroProgramContext.textContent = program.context;
    updateHeroBackground(program, animate);

    Object.entries(program.meta).forEach(([key, value]) => {
      if (heroProgramMeta[key]) heroProgramMeta[key].textContent = value;
    });

    Object.entries(program.facts).forEach(([key, value]) => {
      if (heroProgramFacts[key]) heroProgramFacts[key].textContent = value;
    });

    updateHeroUrgency(program);
    if (options.syncTracks) {
      setTrackProgram(programKey, { fromHero: true });
    }

    heroProgramTabs.forEach((tab) => {
      const active = tab.dataset.programOption === programKey;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
    });
  };

  clearTimeout(heroProgramTimer);
  if (!animate || !heroProgramContent) {
    render();
    return;
  }

  heroProgramContent.classList.add("is-switching");
  heroProgramTimer = setTimeout(() => {
    render();
    heroProgramContent.classList.remove("is-switching");
  }, 160);
}

function centerHeroProgramTab(tab, behavior = "smooth") {
  const selector = tab?.closest(".program-selector");
  if (!selector) return;
  if (window.matchMedia("(max-width: 767px)").matches) {
    selector.scrollTo({ left: Math.max(0, tab.offsetLeft - 20), behavior });
    return;
  }
  const left = tab.offsetLeft - ((selector.clientWidth - tab.offsetWidth) / 2);
  selector.scrollTo({ left: Math.max(0, left), behavior });
}

function activeHeroProgramIndex() {
  const tabs = Array.from(heroProgramTabs);
  const activeIndex = tabs.findIndex((tab) => tab.classList.contains("active"));
  return activeIndex >= 0 ? activeIndex : 0;
}

function startHeroProgramAutoRotation() {
  if (!heroProgramRoot || heroProgramTabs.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  clearInterval(heroProgramAutoTimer);
  heroProgramAutoTimer = setInterval(() => {
    const tabs = Array.from(heroProgramTabs);
    const nextTab = tabs[(activeHeroProgramIndex() + 1) % tabs.length];
    if (!nextTab) return;
    updateHeroProgram(nextTab.dataset.programOption, true, { syncTracks: false });
    centerHeroProgramTab(nextTab);
  }, 5200);
}

function resetHeroProgramAutoRotation() {
  clearInterval(heroProgramAutoTimer);
  startHeroProgramAutoRotation();
}

if (heroProgramRoot && heroProgramTabs.length) {
  heroProgramTabs.forEach((tab, index) => {
    tab.tabIndex = tab.classList.contains("active") ? 0 : -1;
    tab.addEventListener("click", () => {
      updateHeroProgram(tab.dataset.programOption, true, { syncTracks: true });
      centerHeroProgramTab(tab);
      resetHeroProgramAutoRotation();
    });
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + heroProgramTabs.length) % heroProgramTabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % heroProgramTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = heroProgramTabs.length - 1;
      const nextTab = heroProgramTabs[nextIndex];
      nextTab.focus();
      nextTab.click();
    });
  });
  heroProgramRoot.addEventListener("mouseenter", () => clearInterval(heroProgramAutoTimer));
  heroProgramRoot.addEventListener("mouseleave", startHeroProgramAutoRotation);
  heroProgramRoot.addEventListener("focusin", () => clearInterval(heroProgramAutoTimer));
  heroProgramRoot.addEventListener("focusout", startHeroProgramAutoRotation);
  updateHeroProgram("campus", false);
  startHeroProgramAutoRotation();
}

// Fetch all dynamic data from Supabase
(async function loadDynamicData() {
  try {
    const [programsRes, sessionsRes, coursesRes, feesRes, settingsRes, statsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/programs?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/sessions?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/courses?is_active=eq.true&order=sort_order.asc&select=*,sessions(name,time_slot,sort_order,program_id),programs(slug,name)`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/fee_tiers?order=session_count.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/site_config?select=key,value`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/rpc/get_program_registration_stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
        body: "{}"
      })
    ]);

    if (!sessionsRes.ok || !coursesRes.ok || !feesRes.ok) return;

    const programsData = programsRes.ok ? await programsRes.json() : [];
    const sessionsData = await sessionsRes.json();
    const coursesData = await coursesRes.json();
    const feesData = await feesRes.json();
    const statsData = statsRes.ok ? await statsRes.json() : [];
    programStatsById = {};
    statsData.forEach((row) => {
      programStatsById[row.program_id] = {
        reserved: Number(row.reserved_count || 0),
        confirmed: Number(row.confirmed_count || 0)
      };
    });
    publicSessions = sessionsData;
    publicCourses = coursesData;
    publicFees = feesData;
    setPrograms(programsData);

    const cfg = {};
    if (settingsRes.ok) {
      (await settingsRes.json()).forEach((r) => { cfg[r.key] = r.value; });
      applySettings(cfg);
    }

    buildFeeMaps();
    renderTrackProgramFilters();
    renderHomepageProgramContent();
    renderRegistrationPrograms();
    updateRegistrationProgram(registrationProgramSlug, { preserveSelection: true });
    updateHeroProgram(heroProgramRoot?.dataset.activeProgram || "campus", false);
  } catch (e) {
    // Silently fall back if fetch fails
  }
})();

// ── Mobile course detail bottom sheet ───────────────────────────────
function buildFeeMaps() {
  feeBySessionCount = {};
  feeByProgramSessionCount = {};
  publicFees.forEach((fee) => {
    const program = programs.find((p) => p.id === fee.program_id) || programs[0];
    const slug = program?.slug || "campus";
    if (!feeByProgramSessionCount[slug]) feeByProgramSessionCount[slug] = {};
    feeByProgramSessionCount[slug][fee.session_count] = Number(fee.fee_amount || 0);
    if (slug === "campus") feeBySessionCount[fee.session_count] = Number(fee.fee_amount || 0);
  });
}

function courseSessionSort(course) {
  return Number(course.sessions?.sort_order ?? publicSessions.find((s) => s.id === course.session_id)?.sort_order ?? 0);
}

function programSessions(slug) {
  const program = getProgram(slug);
  return publicSessions
    .filter((session) => program?.id ? session.program_id === program.id : true)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

function programCourses(slug) {
  const program = getProgram(slug);
  return publicCourses
    .filter((course) => program?.id ? course.program_id === program.id : true)
    .sort((a, b) => {
      const aSession = courseSessionSort(a);
      const bSession = courseSessionSort(b);
      if (aSession !== bSession) return aSession - bSession;
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
}

function activeTrackCategory() {
  return document.querySelector(".filter.active")?.dataset.filter || "all";
}

function setTrackProgram(slug, options = {}) {
  if (!slug || !getProgram(slug)) return;
  trackProgramSlug = slug;
  renderTrackProgramFilters();
  renderHomepageProgramContent();
  if (!options.fromHero && heroProgramRoot) updateHeroProgram(slug, true, { syncTracks: false });
}

function renderTrackProgramFilters() {
  if (!trackProgramFilters || !programs.length) return;
  trackProgramFilters.innerHTML = programs.map((program) => {
    const courseCount = programCourses(program.slug).length;
    return `
    <button class="track-program-chip ${program.slug === trackProgramSlug ? "active" : ""}" type="button" data-track-program="${esc(program.slug)}">
      <span>${esc(program.name)}</span>
      <small>${courseCount} ${courseCount === 1 ? "course" : "courses"}</small>
    </button>
  `;
  }).join("");
  trackProgramFilters.querySelectorAll("[data-track-program]").forEach((button) => {
    button.addEventListener("click", () => setTrackProgram(button.dataset.trackProgram));
  });
}

function renderHomepageProgramContent() {
  renderHomepageTracks();
  renderHomepageSessions();
  renderHomepageFees();
}

function fallbackCourseImage(program) {
  return program?.imageUrl || program?.backgroundImage || FALLBACK_HERO_IMAGES[0].src;
}

function renderHomepageTracks() {
  const trackGrid = document.getElementById("trackGrid");
  if (!trackGrid) return;
  const program = getProgram(trackProgramSlug);
  const category = activeTrackCategory();
  const allCourses = programCourses(trackProgramSlug);
  const visibleCourses = allCourses.filter((course) => category === "all" || course.category === category);

  if (!visibleCourses.length) {
    trackGrid.innerHTML = "";
    if (trackScrollHint) trackScrollHint.hidden = true;
    if (trackEmpty) {
      trackEmpty.hidden = false;
      trackEmpty.textContent = allCourses.length ? "No tracks match this filter yet." : `${program.name} tracks will appear here after admin adds them.`;
    }
    return;
  }

  if (trackEmpty) trackEmpty.hidden = true;
  if (trackScrollHint) {
    trackScrollHint.hidden = true;
    trackScrollHint.textContent = "";
  }
  trackGrid.innerHTML = visibleCourses.map((course, i) => `
    <article class="track-card" data-category="${esc(course.category)}" data-course-idx="${i}">
      <img src="${esc(course.image_url || fallbackCourseImage(program))}" alt="${esc(course.name)}" loading="lazy" decoding="async">
      <div>
        <span>${esc(courseEligibilityLabel(course))}</span>
        <h3>${esc(course.name)}</h3>
        <p>${esc(course.description || "")}</p>
      </div>
    </article>
  `).join("");

  initCourseBottomSheet(trackGrid, visibleCourses, publicSessions);
}

function renderHomepageSessions() {
  const sessionColumns = document.getElementById("sessionColumns");
  if (!sessionColumns) return;
  const sessions = programSessions(trackProgramSlug);
  if (!sessions.length) {
    sessionColumns.innerHTML = `<article class="session-card empty-session-card"><h3>Schedule coming soon</h3><ul><li>Admin can add sessions for ${esc(getProgram(trackProgramSlug).name)} from the admin panel.</li></ul></article>`;
    return;
  }
  sessionColumns.innerHTML = sessions.map((session) => {
    const courses = programCourses(trackProgramSlug).filter((course) => course.session_id === session.id);
    return `<article class="session-card"><h3>${esc(session.name)} <span>${esc(session.time_slot)}</span></h3><ul>${courses.length ? courses.map((course) => `<li>${esc(course.name)}</li>`).join("") : "<li>Courses coming soon</li>"}</ul></article>`;
  }).join("");
}

function renderHomepageFees() {
  const feeTableBody = document.getElementById("feeTableBody");
  if (!feeTableBody) return;
  const program = getProgram(trackProgramSlug);
  const fees = publicFees.filter((fee) => fee.program_id === program?.id && fee.session_count > 0).sort((a, b) => a.session_count - b.session_count);

  if (program?.feeStatus !== "ready" || program?.feeMode === "to_be_announced") {
    feeTableBody.innerHTML = `<tr><td>${esc(program.name)}</td><td>Fee details are being finalized.</td><td>To be announced</td></tr>`;
    return;
  }

  if (program?.feeMode !== "session_count" && program?.baseFee > 0) {
    feeTableBody.innerHTML = `<tr><td>${esc(program.name)}</td><td>${esc(program.shortLabel || "Program package")}</td><td>${formatFee(program.baseFee)}</td></tr>`;
    return;
  }

  feeTableBody.innerHTML = fees.length
    ? fees.map((fee) => `<tr><td>${fee.session_count} Session${fee.session_count > 1 ? "s" : ""}</td><td>${esc(fee.label || "")}</td><td>${formatFee(Number(fee.fee_amount || 0))}</td></tr>`).join("")
    : `<tr><td>${esc(program.name)}</td><td>Fee tiers are not configured yet.</td><td>To be announced</td></tr>`;
}

function initCourseBottomSheet(grid, courses, sessions) {
  const MOBILE_MAX = 620;
  document.querySelector(".course-sheet-overlay")?.remove();
  if (grid._courseSheetClickHandler) {
    grid.removeEventListener("click", grid._courseSheetClickHandler);
  }
  // Build session lookup: session_id -> session name
  const sessionMap = {};
  sessions.forEach((s, i) => { sessionMap[s.id] = s.name + " (" + s.time_slot + ")"; });

  // Create bottom sheet DOM
  const overlay = document.createElement("div");
  overlay.className = "course-sheet-overlay";

  const sheet = document.createElement("div");
  sheet.className = "course-sheet";
  sheet.innerHTML = `
    <div class="course-sheet-handle"><span></span></div>
    <button class="course-sheet-close" type="button" aria-label="Close">&times;</button>
    <div class="course-sheet-body">
      <img class="course-sheet-img" src="" alt="">
      <div class="course-sheet-content">
        <span class="course-sheet-badge"></span>
        <h3 class="course-sheet-title"></h3>
        <p class="course-sheet-session"></p>
        <p class="course-sheet-desc"></p>
      </div>
    </div>`;
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);

  const sheetImg = sheet.querySelector(".course-sheet-img");
  const sheetBadge = sheet.querySelector(".course-sheet-badge");
  const sheetTitle = sheet.querySelector(".course-sheet-title");
  const sheetSession = sheet.querySelector(".course-sheet-session");
  const sheetDesc = sheet.querySelector(".course-sheet-desc");
  const closeBtn = sheet.querySelector(".course-sheet-close");

  let isOpen = false;

  function openSheet(course) {
    sheetImg.src = course.image_url || fallbackCourseImage(getProgram(trackProgramSlug));
    sheetImg.alt = course.name;
    sheetBadge.textContent = courseEligibilityLabel(course);
    sheetTitle.textContent = course.name;
    sheetSession.textContent = sessionMap[course.session_id] || "";
    sheetDesc.textContent = course.description || "";
    isOpen = true;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Tap handler — only on mobile
  grid._courseSheetClickHandler = (e) => {
    if (window.innerWidth > MOBILE_MAX) return;
    const card = e.target.closest(".track-card");
    if (!card) return;
    e.preventDefault();
    const idx = parseInt(card.dataset.courseIdx, 10);
    if (!isNaN(idx) && courses[idx]) openSheet(courses[idx]);
  };
  grid.addEventListener("click", grid._courseSheetClickHandler);

  closeBtn.addEventListener("click", closeSheet);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSheet();
  });

  // Swipe-down to close
  let touchStartY = 0;
  sheet.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  sheet.addEventListener("touchend", (e) => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (dy > 80) closeSheet();
  }, { passive: true });
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
}, { passive: true });

if (floatingRegister && registerButtons.length && "IntersectionObserver" in window) {
  const visibleRegisterButtons = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleRegisterButtons.add(entry.target);
      } else {
        visibleRegisterButtons.delete(entry.target);
      }
    });

    floatingRegister.classList.toggle("visible", visibleRegisterButtons.size === 0);
  }, { threshold: 0.2 });

  registerButtons.forEach((button) => observer.observe(button));
} else if (floatingRegister) {
  floatingRegister.classList.add("visible");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
    renderHomepageTracks();
  });
});

function selectedSessions() {
  return [...sessionToggles].filter((toggle) => {
    const card = toggle.closest(".selection-card");
    return toggle.checked && !toggle.disabled && !(card && card.hidden);
  });
}

function fixedScheduleCourses(program = selectedRegistrationProgram()) {
  if (!programUsesFixedSchedule(program)) return [];
  const sessions = programSessions(program.slug);
  return sessions.flatMap((session) => publicCourses
    .filter((course) => (
      course.program_id === program.id &&
      course.session_id === session.id &&
      course.is_active !== false
    ))
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
}

function registrationCourseIds(program = selectedRegistrationProgram(), formData = new FormData(form || document.createElement("form"))) {
  if (programUsesFixedSchedule(program)) {
    return fixedScheduleCourses(program).map((course) => course.id).filter(Boolean);
  }
  return selectedSessions()
    .map((toggle) => formData.get(`${toggle.value}Course`))
    .filter(Boolean);
}

function formatFee(amount) {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

const HOSTEL_DAILY_RATES = { none: 0, hostel_only: 100, hostel_food: 300 };
const HOSTEL_LABELS = {
  none: "No accommodation or meals",
  hostel_only: "Non-AC hostel bed",
  hostel_only_mess: "Non-AC hostel bed + mess food",
  hostel_food: "AC hostel bed",
  hostel_food_mess: "AC hostel bed + mess food",
  mess_only: "Mess food only",
  included: "Included in program fee"
};
const HOSTEL_DAY_FALLBACKS = { campus: 14, "staff-camp": 21, immersion: 14 };

function hostelChargeDays(program = selectedRegistrationProgram()) {
  const duration = String(program?.meta?.duration || program?.facts?.duration || "").toLowerCase();
  const weekMatch = duration.match(/(\d+)\s*week/);
  if (weekMatch) return Math.max(Number(weekMatch[1]) * 7, 1);

  const dayMatch = duration.match(/(\d+)\s*day/);
  if (dayMatch) return Math.max(Number(dayMatch[1]), 1);

  if (program?.startDate && program?.endDate) {
    const start = new Date(`${program.startDate}T00:00:00+05:30`);
    const end = new Date(`${program.endDate}T00:00:00+05:30`);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      return Math.max(Math.round((end - start) / 86400000) + 1, 1);
    }
  }

  return HOSTEL_DAY_FALLBACKS[program?.slug] || 1;
}

function hostelDailyRate(option) {
  return HOSTEL_DAILY_RATES[option] || 0;
}

function messDailyRate(program = selectedRegistrationProgram()) {
  const mealRate = Number(program?.messMealRate || globalMessMealRate || DEFAULT_MESS_MEAL_RATE);
  const mealsPerDay = Number(program?.messMealsPerDay || globalMessMealsPerDay || DEFAULT_MESS_MEALS_PER_DAY);
  return Math.max(mealRate, 0) * Math.max(mealsPerDay, 0);
}

function normalizedHostelDailyRate(value, fallback) {
  const rate = Number.parseInt(value, 10);
  if (Number.isNaN(rate) || rate < 0) return fallback;
  return rate <= 1000 ? rate : fallback;
}

function hostelOptionDailyRate(option, program = selectedRegistrationProgram()) {
  if (!option || option === "none" || option === "included") return 0;
  let rate = 0;
  if (option === "hostel_only" || option === "hostel_only_mess") rate += hostelDailyRate("hostel_only");
  if (option === "hostel_food" || option === "hostel_food_mess") rate += hostelDailyRate("hostel_food");
  if (option === "mess_only" || option === "hostel_only_mess" || option === "hostel_food_mess") rate += messDailyRate(program);
  return rate;
}

function hostelTotalForOption(option, program = selectedRegistrationProgram()) {
  return hostelOptionDailyRate(option, program) * hostelChargeDays(program);
}

function hostelOptionChoices(program = selectedRegistrationProgram()) {
  if (!programShowsHostelStep(program)) return [];
  const choices = [{
    value: "none",
    title: "No accommodation or meals",
    description: "I do not need hostel bed or mess food.",
    price: "Free"
  }];
  const messRate = messDailyRate(program);
  if (program.allowHostel) {
    choices.push({
      value: "hostel_only",
      title: "Non-AC hostel bed",
      description: "Per student bed, charged per day.",
      price: `Rs. ${hostelDailyRate("hostel_only").toLocaleString("en-IN")}/day`
    });
  }
  if (program.allowHostel && program.allowMess) {
    const mealsPerDay = program.messMealsPerDay || globalMessMealsPerDay || DEFAULT_MESS_MEALS_PER_DAY;
    choices.push({
      value: "hostel_only_mess",
      title: "Non-AC bed + mess food",
      description: `Bed plus ${mealsPerDay} mess meals per day.`,
      price: `Rs. ${hostelOptionDailyRate("hostel_only_mess", program).toLocaleString("en-IN")}/day`
    });
  }
  if (program.allowHostel) {
    choices.push({
      value: "hostel_food",
      title: "AC hostel bed",
      description: "Per student bed, charged per day.",
      price: `Rs. ${hostelDailyRate("hostel_food").toLocaleString("en-IN")}/day`
    });
  }
  if (program.allowHostel && program.allowMess) {
    const mealsPerDay = program.messMealsPerDay || globalMessMealsPerDay || DEFAULT_MESS_MEALS_PER_DAY;
    choices.push({
      value: "hostel_food_mess",
      title: "AC bed + mess food",
      description: `Bed plus ${mealsPerDay} mess meals per day.`,
      price: `Rs. ${hostelOptionDailyRate("hostel_food_mess", program).toLocaleString("en-IN")}/day`
    });
  } else if (!program.allowHostel && program.allowMess) {
    choices.push({
      value: "mess_only",
      title: "Mess food add-on",
      description: `${program.messMealsPerDay || globalMessMealsPerDay || DEFAULT_MESS_MEALS_PER_DAY} meals per day.`,
      price: `Rs. ${messRate.toLocaleString("en-IN")}/day`
    });
  }
  return choices;
}

function renderHostelOptions(program = selectedRegistrationProgram(), options = {}) {
  if (!hostelOptionsRoot) return;
  const choices = hostelOptionChoices(program);
  if (!choices.length) {
    hostelOptionsRoot.innerHTML = "";
    return;
  }
  const checkedValue = options.preserveSelection
    ? document.querySelector('input[name="hostel"]:checked')?.value
    : "";
  const defaultValue = choices.some((choice) => choice.value === checkedValue) ? checkedValue : "none";
  const days = hostelChargeDays(program);
  hostelOptionsRoot.innerHTML = choices.map((choice) => `
    <label class="hostel-radio">
      <input type="radio" name="hostel" value="${esc(choice.value)}" ${choice.value === defaultValue ? "checked" : ""}>
      <div class="hostel-radio-body">
        <strong>${esc(choice.title)}</strong>
        <span>${esc(choice.description)}</span>
      </div>
      <div class="hostel-radio-price">
        <em>${esc(choice.price)}</em>
        ${choice.value === "none" ? "" : `<small>Per student, ${days} days</small>`}
      </div>
    </label>
  `).join("");
  hostelOptionsRoot.querySelectorAll('input[name="hostel"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      updateRegistrationState();
      updateBlockStates();
      updateSubmitState();
    });
  });
}

function hostelLabelForOption(option) {
  return HOSTEL_LABELS[option] || "No accommodation or meals";
}

function updateHostelPriceLabels() {
  const days = hostelChargeDays();
  document.querySelectorAll(".hostel-radio").forEach((radio) => {
    const input = radio.querySelector('input[name="hostel"]');
    const priceEl = radio.querySelector(".hostel-radio-price");
    if (!input || !priceEl) return;
    const dailyRate = hostelOptionDailyRate(input.value);
    if (dailyRate > 0) {
      priceEl.innerHTML = `<em>Rs. ${dailyRate.toLocaleString("en-IN")}/day</em><small>Per student, ${days} days</small>`;
    }
  });
}

function updateHomepageHostelPrices() {
  document.querySelectorAll(".hostel-option[data-hostel-option]").forEach((el) => {
    const option = el.dataset.hostelOption;
    const strong = el.querySelector("strong");
    const label = el.querySelector("span");
    const dailyRate = hostelDailyRate(option);
    if (strong && dailyRate > 0) strong.textContent = `Rs. ${dailyRate.toLocaleString("en-IN")}/day`;
    if (label) label.textContent = `${HOSTEL_LABELS[option] || "Hostel bed"} per student`;
  });
}

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function queueRegistrationCreatedEmail(data) {
  if (!data?.registration_id || !data?.payment_reference) return;
  fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify({
      type: "registration_received",
      registration_id: data.registration_id,
      payment_reference: data.payment_reference
    })
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Email API error ${res.status}`);
    }
  }).catch((err) => {
    console.warn("Registration received email failed:", err?.message || err);
  });
}

function courseMinAge(course) {
  const age = Number.parseInt(course?.min_age, 10);
  if (Number.isFinite(age) && age > 0) return age;
  if (course?.programs?.slug === "staff-camp") return 5;
  const range = String(course?.class_range || "").toLowerCase();
  const ageMatch = range.match(/age\s*(\d+)/);
  if (ageMatch) return Number.parseInt(ageMatch[1], 10);
  const classMatch = range.match(/classes?\s*(\d+)/);
  if (!classMatch) return 0;
  const minClass = Number.parseInt(classMatch[1], 10);
  if (minClass >= 10) return 15;
  if (minClass >= 8) return 14;
  return 12;
}

function courseEligibilityLabel(course) {
  const minAge = courseMinAge(course);
  return minAge > 0 ? `Age ${minAge}+` : "All eligible ages";
}

function studentAgeValue() {
  if (!studentAgeInput) return null;
  const age = Number.parseInt(studentAgeInput.value, 10);
  return Number.isFinite(age) ? age : null;
}

function hasValidStudentAge(age = studentAgeValue()) {
  return Number.isFinite(age) && age >= AGE_MIN && age <= AGE_MAX;
}

function courseAgeEligible(course, age = studentAgeValue()) {
  return hasValidStudentAge(age) && age >= courseMinAge(course);
}

function courseById(id) {
  return publicCourses.find((course) => course.id === id);
}

let registrationDeadline = null;

function selectedRegistrationProgram() {
  if (!registrationProgramSlug) return null;
  return getProgram(registrationProgramSlug);
}

function programHasFeeConfig(program) {
  if (!program || program.feeStatus !== "ready" || program.feeMode === "to_be_announced") return false;
  if (program.feeMode === "session_count") {
    const tiers = feeByProgramSessionCount[program.slug] || {};
    const hasProgramTier = Object.keys(tiers).some((count) => Number(count) > 0 && Number(tiers[count]) > 0);
    if (hasProgramTier) return true;
    return program.slug === "campus" && Object.keys(feeBySessionCount).some((count) => Number(count) > 0 && Number(feeBySessionCount[count]) > 0);
  }
  return Number(program.baseFee || 0) > 0;
}

function programHasSchedule(program) {
  if (!program) return false;
  const sessions = programSessions(program.slug);
  if (!sessions.length) return false;
  return sessions.some((session) => publicCourses.some((course) => (
    course.program_id === program.id &&
    course.session_id === session.id &&
    course.is_active !== false
  )));
}

function programHasAnnouncedTiming(program) {
  if (!program) return false;
  if (program.dateDisplayMode === "self_paced") return true;
  if (program.dateDisplayMode === "to_be_announced") return false;
  return Boolean(program.startDate && program.endDate);
}

function registrationProgramIsOpen(program = selectedRegistrationProgram()) {
  return Boolean(program?.registrationEnabled && programHasAnnouncedTiming(program) && programHasFeeConfig(program) && programHasSchedule(program));
}

function registrationScheduleSummary(program) {
  if (!program) return "Varies by selected program";
  const slots = [...new Set(programSessions(program.slug).map((session) => session.time_slot).filter(Boolean))];
  if (programUsesFixedSchedule(program)) {
    if (slots.length === 1) return slots[0];
    return "Fixed program schedule";
  }
  if (!slots.length) return "Shown after schedule setup";
  if (slots.length === 1) return slots[0];
  return "Session-wise timings";
}

function updateRegistrationHeroSummary(program = selectedRegistrationProgram()) {
  if (!registrationSummaryFields.dates) return;
  registrationSummaryFields.dates.textContent = program?.meta?.dates || "Choose program";
  registrationSummaryFields.schedule.textContent = registrationScheduleSummary(program);
  registrationSummaryFields.venue.textContent = !program
    ? "Campus / Online as selected"
    : (String(program.meta?.mode || program.facts?.mode || "").toLowerCase().includes("online")
      ? "Online"
      : program.meta?.location || "As per selected program");
  registrationSummaryFields.deadline.textContent = program?.urgency?.deadlineLabel || "Program-wise";
}

function selectedProgramFee(selectedCount) {
  const program = selectedRegistrationProgram();
  if (!program || !registrationProgramIsOpen(program)) return 0;
  if (program.feeMode === "session_count") {
    return feeByProgramSessionCount[program.slug]?.[selectedCount] ?? (program.slug === "campus" ? feeBySessionCount[selectedCount] : 0) ?? 0;
  }
  return Number(program.baseFee || 0);
}

function renderRegistrationPrograms() {
  if (!programs.length) return;
  if (registrationProgramSelect) {
    registrationProgramSelect.innerHTML = `
      <option value="">Choose a program</option>
      ${programs.map((program) => `<option value="${esc(program.slug)}">${esc(program.name)} - ${esc(program.meta?.dates || "Date to be announced")}</option>`).join("")}
    `;
    registrationProgramSelect.value = registrationProgramSlug || "";
    if (registrationProgramSelect.dataset.bound !== "true") {
      registrationProgramSelect.dataset.bound = "true";
      registrationProgramSelect.addEventListener("change", () => updateRegistrationProgram(registrationProgramSelect.value));
    }
  }

  if (!registrationProgramRoot) return;
  registrationProgramRoot.innerHTML = programs.map((program) => {
    const open = registrationProgramIsOpen(program);
    const active = program.slug === registrationProgramSlug;
    return `
      <button class="registration-program-card ${active ? "active" : ""}" type="button" data-registration-program="${esc(program.slug)}" aria-pressed="${active ? "true" : "false"}">
        <span>${esc(program.name)}</span>
        <small>${esc(program.meta?.dates || "Date to be announced")}</small>
        <em>${open ? "Registration open" : "Coming soon"}</em>
      </button>
    `;
  }).join("");
  registrationProgramRoot.querySelectorAll("[data-registration-program]").forEach((button) => {
    button.addEventListener("click", () => updateRegistrationProgram(button.dataset.registrationProgram));
  });
}

function refreshSessionElements() {
  sessionToggles = document.querySelectorAll("[data-session-toggle]");
  courseSelects = document.querySelectorAll("[data-session-course]");
}

function registrationSessionKey(index) {
  return `session${index + 1}`;
}

function attachSessionInputListeners() {
  sessionToggles.forEach((toggle) => {
    if (toggle.dataset.bound === "true") return;
    toggle.dataset.bound = "true";
    toggle.addEventListener("change", () => {
      updateRegistrationState();
      validateSessionCards();
      updateBlockStates();
      updateSubmitState();
    });
  });

  courseSelects.forEach((select) => {
    if (select.dataset.bound === "true") return;
    select.dataset.bound = "true";
    select.addEventListener("change", () => {
      validateSessionCards();
      updateBlockStates();
      updateSubmitState();
    });
  });
}

function renderRegistrationSessionCards(program) {
  if (!sessionSelectorsRoot) return;
  const studentAge = studentAgeValue();
  const hasAge = hasValidStudentAge(studentAge);
  if (!program) {
    sessionCourses = {};
    sessionSelectorsRoot.classList.remove("fixed-schedule-list");
    sessionSelectorsRoot.innerHTML = `
      <article class="selection-card selection-empty">
        <strong>Choose a program first</strong>
        <p>The schedule, class choices, and fee will appear after you select a program.</p>
      </article>
    `;
    refreshSessionElements();
    return;
  }

  const sessions = programSessions(program.slug);
  const open = registrationProgramIsOpen(program);
  const fixedSchedule = programUsesFixedSchedule(program);
  sessionCourses = {};
  sessionSelectorsRoot.classList.toggle("fixed-schedule-list", fixedSchedule);

  if (!sessions.length) {
    sessionSelectorsRoot.innerHTML = `
      <article class="selection-card selection-empty">
        <strong>Schedule coming soon</strong>
        <p>Admin needs to add sessions and courses before this program can accept registrations.</p>
      </article>
    `;
    refreshSessionElements();
    return;
  }

  if (fixedSchedule) {
    sessionSelectorsRoot.innerHTML = sessions.map((session, index) => {
      const courses = publicCourses
        .filter((course) => course.program_id === program.id && course.session_id === session.id && course.is_active !== false)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      const ineligible = courses.filter((course) => !courseAgeEligible(course, studentAge));
      return `
        <article class="selection-card fixed-schedule-card ${!courses.length ? "selection-card-empty" : ""} ${hasAge && ineligible.length ? "invalid" : ""}">
          <div class="fixed-schedule-head">
            <span class="fixed-schedule-kicker">${esc(session.time_slot || `Schedule ${index + 1}`)}</span>
            <strong>${esc(session.name || `Schedule ${index + 1}`)}</strong>
          </div>
          <div class="fixed-schedule-items">
            ${courses.length
              ? courses.map((course) => `
                <div class="fixed-schedule-item ${!courseAgeEligible(course, studentAge) ? "course-ineligible" : ""}">
                  <strong>${esc(course.name)}</strong>
                  <em>${esc(courseEligibilityLabel(course))}</em>
                  ${course.description ? `<small>${esc(course.description)}</small>` : ""}
                </div>
              `).join("")
              : `<p>No active activities added for this schedule block.</p>`}
          </div>
          ${!hasAge ? `<p class="eligibility-note">Enter student age above to confirm eligibility for this fixed schedule.</p>` : ""}
          ${hasAge && ineligible.length ? `<p class="eligibility-note warning">This schedule includes ${ineligible.length} activity${ineligible.length === 1 ? "" : "ies"} above the entered age.</p>` : ""}
        </article>
      `;
    }).join("");
    refreshSessionElements();
    return;
  }

  sessionSelectorsRoot.innerHTML = sessions.map((session, index) => {
    const key = registrationSessionKey(index);
    const courses = publicCourses
      .filter((course) => course.program_id === program.id && course.session_id === session.id && course.is_active !== false)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const eligibleCourses = courses.filter((course) => courseAgeEligible(course, studentAge));
    const disabled = !open || !courses.length || !hasAge || !eligibleCourses.length;
    sessionCourses[key] = courses;

    return `
      <article class="selection-card ${!courses.length ? "selection-card-empty" : ""}">
        <label class="check-row">
          <input type="checkbox" name="session" value="${esc(key)}" data-session-toggle data-session-id="${esc(session.id)}" ${disabled ? "disabled" : ""}>
          <span data-session-name="${esc(key)}">${esc(session.name || `Session ${index + 1}`)}</span>
          <small data-session-time="${esc(key)}">${esc(session.time_slot || "")}</small>
        </label>
        <label>
          Class for ${esc(session.name || `Session ${index + 1}`)}
          <select name="${esc(key)}Course" data-session-course="${esc(key)}" disabled>
            <option value="">${!courses.length ? "No active classes added" : !hasAge ? "Enter age first" : eligibleCourses.length ? `Select ${esc(session.name || `Session ${index + 1}`)} class` : "No age-eligible classes in this session"}</option>
            ${courses.map((course) => {
              const eligible = courseAgeEligible(course, studentAge);
              const label = `${course.name} (${courseEligibilityLabel(course)}${eligible ? "" : " - not eligible yet"})`;
              return `<option value="${esc(course.id)}" ${eligible ? "" : "disabled"}>${esc(label)}</option>`;
            }).join("")}
          </select>
        </label>
        <p class="eligibility-note ${hasAge && !eligibleCourses.length && courses.length ? "warning" : ""}">
          ${!courses.length
            ? "Admin needs to add classes for this session."
            : !hasAge
            ? "Enter student age above to unlock eligible classes."
            : `${eligibleCourses.length} of ${courses.length} class${courses.length === 1 ? "" : "es"} available for age ${studentAge}.`}
        </p>
      </article>
    `;
  }).join("");

  refreshSessionElements();
  attachSessionInputListeners();
}

function resetSessionCards() {
  sessionToggles.forEach((toggle) => {
    toggle.checked = false;
    const select = document.querySelector(`[data-session-course="${toggle.value}"]`);
    if (select) {
      select.value = "";
      select.disabled = true;
      select.required = false;
    }
  });
}

function updateRegistrationProgram(slug, options = {}) {
  const program = slug ? getProgram(slug) : null;
  if (slug && !program) return;
  registrationProgramSlug = program?.slug || "";
  if (registrationProgramInput) registrationProgramInput.value = registrationProgramSlug;
  updateRegistrationHeroSummary(program);
  renderRegistrationPrograms();
  renderRegistrationSessionCards(program);
  if (!options.preserveSelection) resetSessionCards();

  const fixedSchedule = programUsesFixedSchedule(program);
  if (registrationSelectionHeading) {
    registrationSelectionHeading.textContent = fixedSchedule ? "Fixed program schedule" : "Session and class selection";
  }
  if (registrationSelectionHelp) {
    registrationSelectionHelp.textContent = !program
      ? "Choose your program first. Nothing is selected by default, so you know exactly what you are registering for."
      : fixedSchedule
      ? "This program follows a fixed schedule. Review the included activities; no class selection is needed."
      : "Choose the program first. The sessions, classes, dates, and fee will update automatically.";
  }

  if (hostelBlock) {
    const hostelAllowed = programShowsHostelStep(program);
    hostelBlock.hidden = !hostelAllowed;
    renderHostelOptions(program, options);
    hostelBlock.querySelectorAll("input").forEach((input) => {
      input.disabled = !hostelAllowed;
    });
    if (!hostelAllowed) {
      const noneHostel = hostelBlock.querySelector('input[name="hostel"][value="none"]');
      if (noneHostel) noneHostel.checked = true;
    } else if (!options.preserveSelection) {
      hostelBlock.querySelectorAll('input[name="hostel"]').forEach((input) => {
        input.checked = false;
      });
    }
  }
  updateProgressStepVisibility(program);
  updateHostelPriceLabels();

  if (registrationProgramStatus) {
    registrationProgramStatus.classList.remove("warning");
    if (!program) {
      registrationProgramStatus.textContent = "Select a program to see its schedule, fee, and registration status.";
    } else {
      const hasFee = programHasFeeConfig(program);
      const hasSchedule = programHasSchedule(program);
      const hasTiming = programHasAnnouncedTiming(program);
      if (!program.registrationEnabled) {
        registrationProgramStatus.textContent = `${program.name} registration is currently closed by admin.`;
        registrationProgramStatus.classList.add("warning");
      } else if (!hasTiming && !hasFee && !hasSchedule) {
        registrationProgramStatus.textContent = `${program.name} needs schedule timing, courses, and fee before registration can open.`;
        registrationProgramStatus.classList.add("warning");
      } else if (!hasTiming) {
        registrationProgramStatus.textContent = `${program.name} schedule timing is not announced yet.`;
        registrationProgramStatus.classList.add("warning");
      } else if (!hasFee) {
        registrationProgramStatus.textContent = `${program.name} fee is not announced yet.`;
        registrationProgramStatus.classList.add("warning");
      } else if (!hasSchedule) {
        registrationProgramStatus.textContent = `${program.name} needs sessions and courses before registration can open.`;
        registrationProgramStatus.classList.add("warning");
      } else if (programUsesFixedSchedule(program)) {
        registrationProgramStatus.textContent = `${program.name} has a fixed schedule. No class selection is needed.`;
      } else {
        registrationProgramStatus.textContent = `You are registering for ${program.name}.`;
      }
    }
  }

  updateRegistrationState();
  updateBlockStates();
  updateSubmitState();
}

function getHostelFee() {
  const checked = document.querySelector('input[name="hostel"]:checked');
  return hostelTotalForOption(checked?.value);
}

function updateRegistrationState() {
  const program = selectedRegistrationProgram();
  const selected = selectedSessions();
  const fixedSchedule = programUsesFixedSchedule(program);
  const fixedCourses = fixedSchedule ? fixedScheduleCourses(program) : [];
  const selectionCount = fixedSchedule ? fixedCourses.length : selected.length;
  const sessionFee = selectedProgramFee(selectionCount);
  const hostelFee = programShowsHostelStep(program) ? getHostelFee() : 0;
  const baseFee = sessionFee + hostelFee;
  const total = baseFee;

  feeTotals.forEach((el) => { el.textContent = formatFee(total); });

  document.querySelectorAll("[data-fee-base]").forEach((el) => { el.textContent = formatFee(baseFee); });
  document.querySelectorAll("[data-fee-detail]").forEach((el) => {
    if (!baseFee) { el.innerHTML = ""; return; }
    const parts = [];
    if (hostelFee) parts.push(`<div class="fee-line"><span>Accommodation / meals (${hostelChargeDays(program)} days)</span><strong>${formatFee(hostelFee)}</strong></div>`);
    if (programIncludesAccommodation(program) && program?.includedServices) parts.push(`<div class="fee-line"><span>${esc(program.includedServices)}</span><strong>Included</strong></div>`);
    el.innerHTML = parts.join("");
  });

  if (feeNote) {
    if (!program) {
      feeNote.textContent = "Choose a program to see the fee.";
    } else if (!registrationProgramIsOpen(program)) {
      feeNote.textContent = "Fee will appear after this program opens for registration.";
    } else if (fixedSchedule) {
      feeNote.textContent = fixedCourses.length
        ? `${program.name} fixed schedule is included. No class selection is needed.`
        : "Admin needs to add fixed schedule activities before registration can continue.";
    } else if (programIncludesAccommodation(program) && program.includedServices) {
      feeNote.textContent = `${program.name} package fee includes ${program.includedServices}`;
    } else if (program.feeMode !== "session_count") {
      feeNote.textContent = selected.length
        ? `${program.name} fixed program fee applies.`
        : "Select at least one activity or class to continue.";
    } else {
      feeNote.textContent = selected.length
      ? `${selected.length} session${selected.length > 1 ? "s" : ""} selected.`
      : "Select at least one session to calculate fee.";
    }
  }

  sessionToggles.forEach((toggle) => {
    const select = document.querySelector(`[data-session-course="${toggle.value}"]`);
    if (!select) return;
    const card = toggle.closest(".selection-card");
    const unavailable = !registrationProgramIsOpen(program) || (card && card.hidden);

    select.disabled = unavailable || !toggle.checked;
    select.required = !unavailable && toggle.checked;
    if (unavailable || !toggle.checked) {
      select.value = "";
    }
  });
}

attachSessionInputListeners();

document.querySelectorAll('input[name="hostel"]').forEach((r) => {
  r.addEventListener("change", updateRegistrationState);
});

function refreshAgeEligibility() {
  const program = selectedRegistrationProgram();
  renderRegistrationSessionCards(program);
  updateRegistrationState();
  validateSessionCards();
  updateBlockStates();
  updateSubmitState();
}

studentAgeInput?.addEventListener("input", refreshAgeEligibility);

updateRegistrationState();

// ── Form validation system ──────────────────────────────────────────
const progressSteps = document.querySelectorAll(".progress-step");
const formBlocks = document.querySelectorAll(".form-block");
const submitButton = form?.querySelector('button[type="submit"]');

function getFieldError(field) {
  let err = field.nextElementSibling;
  if (err && err.classList.contains("field-error")) {
    if (!err.id) err.id = `${field.name || field.id || "field"}-error`;
    if (!err.getAttribute("role")) err.setAttribute("role", "alert");
    return err;
  }
  err = document.createElement("p");
  err.className = "field-error";
  err.id = `${field.name || field.id || "field"}-error`;
  err.setAttribute("aria-live", "polite");
  err.setAttribute("role", "alert");
  field.insertAdjacentElement("afterend", err);
  return err;
}

function validateField(field) {
  if (!field || field.disabled) return true;
  const val = field.value.trim();
  let msg = "";

  if (field.required && !val) {
    msg = "This field is required.";
  } else if (field.type === "number" && val) {
    const num = Number.parseFloat(val);
    const min = field.min !== "" ? Number.parseFloat(field.min) : null;
    const max = field.max !== "" ? Number.parseFloat(field.max) : null;
    if (!Number.isFinite(num)) {
      msg = "Enter a valid number.";
    } else if (min !== null && num < min) {
      msg = `Enter ${min} or more.`;
    } else if (max !== null && num > max) {
      msg = `Enter ${max} or less.`;
    }
  } else if (field.type === "email" && val && !isValidEmail(val)) {
    msg = "Enter a valid email address.";
  } else if (field.type === "tel" && val && !isValidPhoneNumber(val)) {
    msg = `Enter a valid phone number with ${PHONE_MIN_DIGITS} to ${PHONE_MAX_DIGITS} digits.`;
  } else if (field.tagName === "SELECT" && field.required && !val) {
    msg = "Please select an option.";
  }

  const errEl = getFieldError(field);
  if (msg) {
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", errEl.id);
    field.closest("label")?.classList.add("field-has-error");
    errEl.textContent = msg;
    errEl.classList.add("visible");
    return false;
  }
  field.classList.remove("invalid");
  field.setAttribute("aria-invalid", "false");
  field.removeAttribute("aria-describedby");
  field.closest("label")?.classList.remove("field-has-error");
  errEl.classList.remove("visible");
  errEl.textContent = "";
  return true;
}

function validateBlock(blockIndex) {
  const block = formBlocks[blockIndex];
  if (!block) return true;

  if (blockIndex === 0 || blockIndex === 1) {
    const fields = block.querySelectorAll("input, select, textarea");
    return [...fields].every((f) => {
      if (f.disabled) return true;
      const val = f.value.trim();
      if (f.required && !val) return false;
      if (f.type === "number" && val) {
        const num = Number.parseFloat(val);
        const min = f.min !== "" ? Number.parseFloat(f.min) : null;
        const max = f.max !== "" ? Number.parseFloat(f.max) : null;
        if (!Number.isFinite(num)) return false;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
      }
      if (f.type === "email" && val && !isValidEmail(val)) return false;
      if (f.type === "tel" && val && !isValidPhoneNumber(val)) return false;
      if (f.tagName === "SELECT" && f.required && !val) return false;
      return true;
    });
  }

  if (blockIndex === 2) {
    const program = selectedRegistrationProgram();
    if (!registrationProgramIsOpen(program)) return false;
    const age = studentAgeValue();
    if (!hasValidStudentAge(age)) return false;
    if (programUsesFixedSchedule(program)) {
      const fixedCourses = fixedScheduleCourses(program);
      return fixedCourses.length > 0 && fixedCourses.every((course) => courseAgeEligible(course, age));
    }
    const selected = selectedSessions();
    if (selected.length === 0) return false;
    return selected.every((toggle) => {
      const sel = document.querySelector(`[data-session-course="${toggle.value}"]`);
      const course = courseById(sel?.value);
      return sel && sel.value.trim() !== "" && course && courseAgeEligible(course, age);
    });
  }

  if (blockIndex === 3) {
    if (hostelBlock?.hidden || !programShowsHostelStep(selectedRegistrationProgram())) return true;
    const hostelChecked = block.querySelector('input[name="hostel"]:checked');
    return !!hostelChecked;
  }

  if (blockIndex === 4) {
    const consent = block.querySelector('input[name="consent"]');
    return consent ? consent.checked : true;
  }

  return true;
}

function validateSessionCards() {
  let allValid = true;
  const program = selectedRegistrationProgram();
  const age = studentAgeValue();
  if (programUsesFixedSchedule(program)) {
    const fixedCourses = fixedScheduleCourses(program);
    const valid = hasValidStudentAge(age) && fixedCourses.length > 0 && fixedCourses.every((course) => courseAgeEligible(course, age));
    document.querySelectorAll(".fixed-schedule-card").forEach((card) => card.classList.toggle("invalid", !valid));
    return valid;
  }
  sessionToggles.forEach((toggle) => {
    const card = toggle.closest(".selection-card");
    const sel = document.querySelector(`[data-session-course="${toggle.value}"]`);
    if (!card || !sel) return;
    if (card.hidden || !registrationProgramIsOpen(program)) {
      card.classList.remove("invalid");
      return;
    }

    const selectedCourse = courseById(sel.value);
    if (toggle.checked && !sel.value.trim()) {
      card.classList.add("invalid");
      const errEl = getFieldError(sel);
      errEl.textContent = "Select a class for this session.";
      errEl.classList.add("visible");
      allValid = false;
    } else if (toggle.checked && (!selectedCourse || !courseAgeEligible(selectedCourse, age))) {
      card.classList.add("invalid");
      const errEl = getFieldError(sel);
      errEl.textContent = "This class is not eligible for the entered age.";
      errEl.classList.add("visible");
      allValid = false;
    } else {
      card.classList.remove("invalid");
      const errEl = getFieldError(sel);
      errEl.classList.remove("visible");
      errEl.textContent = "";
    }
  });
  return allValid;
}

function updateProgressStepVisibility(program = selectedRegistrationProgram()) {
  const hostelAllowed = programShowsHostelStep(program);
  let visibleStepNumber = 1;

  progressSteps.forEach((step) => {
    const isHostelStep = step.dataset.step === "4";
    step.hidden = isHostelStep && !hostelAllowed;
    if (step.hidden) {
      step.classList.remove("active", "done");
      return;
    }

    const numberEl = step.querySelector("span");
    if (numberEl) numberEl.textContent = String(visibleStepNumber);
    visibleStepNumber += 1;
  });

  let visibleBlockNumber = 1;
  formBlocks.forEach((block) => {
    if (block.hidden) return;
    const numberEl = block.querySelector(".form-heading span");
    if (numberEl) numberEl.textContent = String(visibleBlockNumber).padStart(2, "0");
    visibleBlockNumber += 1;
  });
}

function updateBlockStates() {
  if (!formBlocks.length) return;
  updateProgressStepVisibility();

  formBlocks.forEach((block, i) => {
    const valid = validateBlock(i);
    block.classList.toggle("block-valid", valid);
    block.classList.remove("block-invalid");
  });

  // Update stepper done states based on completion
  progressSteps.forEach((step, i) => {
    if (step.hidden) {
      step.classList.remove("active", "done");
      return;
    }
    if (validateBlock(i)) {
      step.classList.add("done");
    } else {
      step.classList.remove("done");
    }
  });
}

function isFormComplete() {
  if (!form) return false;
  for (let i = 0; i < formBlocks.length; i++) {
    if (!validateBlock(i)) return false;
  }
  return true;
}

function updateSubmitState() {
  if (!submitButton) return;
  const complete = isFormComplete();
  submitButton.disabled = !complete;
  const program = selectedRegistrationProgram();
  if (submitButton.textContent === "Creating registration...") return;
  if (!program) {
    submitButton.disabled = true;
    submitButton.textContent = "Select Program First";
  } else if (!registrationProgramIsOpen(program)) {
    submitButton.disabled = true;
    submitButton.textContent = "Registration Opening Soon";
  } else if (submitButton.textContent === "Registration Opening Soon" || submitButton.textContent === "Select Program First") {
    submitButton.textContent = "Proceed to Payment";
  }
}

function runFullValidation(showErrors) {
  if (!form) return;

  if (showErrors) {
    formBlocks.forEach((block, i) => {
      if (i <= 1) {
        block.querySelectorAll("input, select, textarea").forEach(validateField);
      }
    });
    validateSessionCards();
  }

  updateBlockStates();
  updateSubmitState();
}

// Attach blur validation to all form fields
if (form) {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.type === "tel") field.value = trimPhoneValue(field.value);
      if (field.type === "email") field.value = field.value.trim();
      validateField(field);
      updateBlockStates();
      updateSubmitState();
    });
    field.addEventListener("input", () => {
      if (field.type === "tel") {
        field.value = trimPhoneValue(field.value);
      }
      if (field.type === "email") {
        field.value = field.value.trimStart();
      }
      if (field.classList.contains("invalid")) {
        validateField(field);
      }
      updateBlockStates();
      updateSubmitState();
    });
  });

  // Session toggles and course selects are generated dynamically per program.
  attachSessionInputListeners();

  // Consent checkbox
  const consentBox = form.querySelector('input[name="consent"]');
  if (consentBox) {
    consentBox.addEventListener("change", () => {
      updateBlockStates();
      updateSubmitState();
    });
  }

  // Hostel radios
  document.querySelectorAll('input[name="hostel"]').forEach((r) => {
    r.addEventListener("change", () => {
      updateBlockStates();
      updateSubmitState();
    });
  });

  // Initial state
  updateBlockStates();
  updateSubmitState();
}

function updateCountdown() {
  if (!countdowns.length) return;

  countdowns.forEach((countdown) => {
    const deadlineRaw = countdown.dataset.deadline || "";
    const deadline = deadlineRaw ? new Date(deadlineRaw) : null;
    if (!deadline || Number.isNaN(deadline.getTime())) {
      setCountdownPartText(countdown, { days: "--", hours: "--", minutes: "--", seconds: "--" });
      return;
    }

    const now = new Date();
    const difference = Math.max(0, deadline - now);
    const totalMinutes = Math.floor(difference / 60000);
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    setCountdownPartText(countdown, {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0")
    });
  });
}

updateCountdown();
if (countdowns.length) {
  setInterval(updateCountdown, 1000);
}

function updateSeatsLeft() {
  if (!seatsLeftItems.length) return;

  const program = getActiveHeroProgram();
  const urgency = program?.urgency || {};
  const deadline = urgency.deadline ? new Date(urgency.deadline) : null;
  const hasAnnouncedDeadline = Boolean(deadline && !Number.isNaN(deadline.getTime()));
  const capacity = hasAnnouncedDeadline ? Number(urgency.seatsBase || 0) : 0;

  if (!capacity) {
    seatsLeftItems.forEach((item) => {
      item.textContent = "TBA";
      item.style.color = "";
    });
    seatsNotes.forEach((note) => {
      note.textContent = !hasAnnouncedDeadline
        ? "Seats will be announced after dates and registration deadline are finalized."
        : urgency.note || "Seat capacity will be announced with the final program schedule.";
    });
    return;
  }

  const stats = program?.id ? programStatsById[program.id] : null;
  const reserved = Number(stats?.reserved || 0);
  const remaining = Math.max(capacity - reserved, 0);

  seatsLeftItems.forEach((item) => {
    item.textContent = String(remaining);
    item.style.color = remaining <= 10 ? "#d32f2f" : "";
  });
  seatsNotes.forEach((note) => {
    if (urgency.note) {
      note.textContent = urgency.note;
      return;
    }
    if (remaining <= 0) {
      note.textContent = "This program is currently full.";
      return;
    }
    if (remaining <= Math.max(3, Math.ceil(capacity * 0.2))) {
      note.textContent = "Limited seats remain for this program.";
      return;
    }
    note.textContent = "Seat count is based on submitted registrations.";
  });
}

updateSeatsLeft();

let galleryImages = [];
let heroGalleryAutoTimer = null;
let heroGalleryResumeTimer = null;
let heroGalleryIndex = 0;

function heroGalleryCards() {
  return heroGalleryTrack ? Array.from(heroGalleryTrack.querySelectorAll(".hero-strip-card")) : [];
}

function heroGalleryScrollLeftForCard(card) {
  if (!heroGalleryRoot || !card) return 0;
  const rootRect = heroGalleryRoot.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const centeredLeft = heroGalleryRoot.scrollLeft + cardRect.left - rootRect.left - ((heroGalleryRoot.clientWidth - cardRect.width) / 2);
  const maxScroll = Math.max(0, heroGalleryRoot.scrollWidth - heroGalleryRoot.clientWidth);
  return Math.min(maxScroll, Math.max(0, centeredLeft));
}

function getInitialHeroGalleryIndex(cards) {
  if (cards.length > 2 && window.matchMedia("(max-width: 767px)").matches) return 1;
  return 0;
}

function scrollHeroGalleryToIndex(index, behavior = "smooth") {
  const cards = heroGalleryCards();
  if (!heroGalleryRoot || !cards.length) return;
  const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
  heroGalleryIndex = safeIndex;
  heroGalleryRoot.scrollTo({
    left: heroGalleryScrollLeftForCard(cards[safeIndex]),
    behavior,
  });
}

function stopHeroGalleryAutoScroll() {
  clearInterval(heroGalleryAutoTimer);
  heroGalleryAutoTimer = null;
}

function startHeroGalleryAutoScroll() {
  if (!heroGalleryRoot || !heroGalleryTrack || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cards = heroGalleryCards();
  if (cards.length < 2) return;

  stopHeroGalleryAutoScroll();
  heroGalleryAutoTimer = setInterval(() => {
    const currentCards = heroGalleryCards();
    if (currentCards.length < 2) return;
    const hasSidePeeks = currentCards.length > 2 && window.matchMedia("(max-width: 767px)").matches;
    const firstMainIndex = hasSidePeeks ? 1 : 0;
    const lastMainIndex = hasSidePeeks ? currentCards.length - 2 : currentCards.length - 1;
    const nextIndex = heroGalleryIndex >= lastMainIndex ? firstMainIndex : heroGalleryIndex + 1;
    scrollHeroGalleryToIndex(nextIndex, "smooth");
  }, 3200);
}

function pauseHeroGalleryAutoScroll(resumeDelay = 5000) {
  stopHeroGalleryAutoScroll();
  clearTimeout(heroGalleryResumeTimer);
  heroGalleryResumeTimer = setTimeout(startHeroGalleryAutoScroll, resumeDelay);
}

if (heroGalleryRoot) {
  ["pointerdown", "touchstart", "wheel", "focusin"].forEach((eventName) => {
    heroGalleryRoot.addEventListener(eventName, () => pauseHeroGalleryAutoScroll(), { passive: true });
  });
  heroGalleryRoot.addEventListener("mouseenter", () => stopHeroGalleryAutoScroll());
  heroGalleryRoot.addEventListener("mouseleave", () => startHeroGalleryAutoScroll());
}

function uniqueHeroImages(images) {
  const uniqueImages = new Map();
  [...images, ...FALLBACK_HERO_IMAGES].forEach((img) => {
    if (img?.src && !uniqueImages.has(img.src)) uniqueImages.set(img.src, img);
  });
  return Array.from(uniqueImages.values());
}

function renderHeroGalleryStrip(images) {
  if (!heroGalleryTrack || !images.length) return;
  heroGalleryTrack.innerHTML = "";

  const renderImage = (image, hidden = false) => {
    const figure = document.createElement("figure");
    figure.className = "hero-strip-card";
    if (hidden) figure.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = hidden ? "" : (image.alt || "LPU Summer School highlight");
    img.loading = "lazy";
    img.decoding = "async";
    figure.appendChild(img);
    heroGalleryTrack.appendChild(figure);
  };

  images.forEach((image) => renderImage(image));
  heroGalleryIndex = getInitialHeroGalleryIndex(heroGalleryCards());
  requestAnimationFrame(() => scrollHeroGalleryToIndex(heroGalleryIndex, "auto"));
  startHeroGalleryAutoScroll();
}

// Load gallery exclusively from DB — no hardcoded fallback
(async function loadGalleryImages() {
  const galleryTargets = gallerySlots.length ? Array.from(gallerySlots) : [galleryMain, gallerySideA, gallerySideB].filter(Boolean);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/gallery_images?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } });
    if (res.ok) {
      const data = await res.json();
      if (data.length) {
        galleryImages = data.map((img) => ({ src: img.image_url, alt: img.alt_text }));
      }
    }
  } catch (e) { /* no images to rotate */ }

  galleryImages = uniqueHeroImages(galleryImages);
  renderHeroGalleryStrip(galleryImages);

  galleryTargets.forEach((target, index) => {
    const image = galleryImages[index % galleryImages.length];
    if (!image) return;
    target.src = image.src;
    target.alt = image.alt;
  });

})();

// ── Receipt display ─────────────────────────────────────────────────
function showReceipt(data) {
  const receiptEl = document.querySelector("[data-receipt]");
  const table = document.querySelector("[data-receipt-table]");
  if (!receiptEl || !table) return;

  const receiptProgram = getProgram(data.program_slug || registrationProgramSlug);
  const progDatesEl = document.querySelector('[data-cfg="program-dates"]');
  const progDatesStr = receiptProgram?.meta?.dates || (progDatesEl ? progDatesEl.textContent : "");
  const rows = [
    ["Student", `<strong>${esc(data.student_name || "")}</strong> (${esc(data.class_level || "")}${data.student_age ? `, Age ${esc(data.student_age)}` : ""})`],
    ["Guardian", esc(data.guardian_name || "")],
    ["Program", esc(data.program_name || "LPU Summer School 2026")],
    ["Courses", (data.courses || []).map(c => esc(c)).join(", ")],
    ["Accommodation / Meals", esc(hostelLabelForOption(data.hostel_option))],
  ];
  if (progDatesStr) rows.push(["Program Dates", esc(progDatesStr)]);
  rows.push(["Mode", esc(receiptProgram?.meta?.mode || "As per selected program")]);
  rows.push(["Venue", esc(receiptProgram?.meta?.location || "LPU Campus, Phagwara, Punjab")]);
  rows.push([receiptProgram?.feeMode === "session_count" ? "Session Fee" : "Program Fee", formatFee(data.session_fee || 0)]);
  if ((data.hostel_amount || 0) > 0) rows.push([`Accommodation / Meals (${data.hostel_days || hostelChargeDays(receiptProgram)} days)`, formatFee(data.hostel_amount)]);

  const infoRows = [
    ["Payment Ref", `<code>${esc(data.payment_reference || "")}</code>`],
    ["Registration ID", `<code>${esc(data.registration_id || "")}</code>`],
    ["Date", new Date().toLocaleString("en-IN")],
  ];

  table.innerHTML =
    rows.map(([l, v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("") +
    `<tr class="receipt-total"><td>Total Amount</td><td>${formatFee(data.total_amount || 0)}</td></tr>` +
    `<tr><td colspan="2" style="height:12px;border:none"></td></tr>` +
    infoRows.map(([l, v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");

  // Close payment modal, restore scroll, hide form, show receipt
  const paySection = document.querySelector("[data-payment-section]");
  if (paySection) paySection.hidden = true;
  revokePreviewUrl("receipt displayed");
  uploadSelection.selectedFile = null;
  uploadSelection.previewVisible = false;
  uploadSelection.uploadInProgress = false;
  document.body.style.overflow = "hidden";
  form.hidden = true;
  document.querySelector(".form-progress-wrapper")?.remove();
  receiptEl.hidden = false;
  requestAnimationFrame(() => receiptEl.focus({ preventScroll: true }));
  sessionStorage.removeItem("lpu_pending_reg");
}

document.querySelector("[data-print-receipt]")?.addEventListener("click", () => {
  window.print();
});

// ── Paytm Payment Section ──────────────────────────────────────────
let pendingRegistration = null;
let paymentModalBound = false; // guard against duplicate event binding
const LPU_PAYTM_PAYMENT_URL = "https://secure.paytmpayments.com/link/paymentForm/38633/LL_920680970";

// Body-level file input (outside modal — avoids overflow/clip/backdrop mobile bugs)
const screenshotInput = document.getElementById("screenshotFileInput");

const UPLOAD_LOG_PREFIX = "[LPU screenshot upload]";
const MAX_SCREENSHOT_BYTES = 10 * 1024 * 1024;
const COMPRESSION_THRESHOLD_BYTES = 4 * 1024 * 1024;
const COMPRESSION_MAX_DIMENSION = 1600;
const COMPRESSION_QUALITY = 0.82;
const ACCEPTED_SCREENSHOT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const EXTENSION_TYPE_MAP = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif"
};

const uploadSelection = {
  token: 0,
  selectedFile: null,
  previewUrl: null,
  previewVisible: false,
  uploadInProgress: false
};

const DEBUG_UPLOAD = false; // production: keep payment refs / registration IDs / file metadata out of the browser console
function uploadLog(level, message, data) {
  if (!DEBUG_UPLOAD) return;
  const fn = console[level] || console.log;
  if (data !== undefined) {
    fn.call(console, `${UPLOAD_LOG_PREFIX} ${message}`, data);
  } else {
    fn.call(console, `${UPLOAD_LOG_PREFIX} ${message}`);
  }
}

function fileExtension(name) {
  const match = String(name || "").toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

function inferImageType(file) {
  return file?.type || EXTENSION_TYPE_MAP[fileExtension(file?.name)] || "";
}

function describeFile(file) {
  if (!file) return null;
  return {
    name: file.name || "(unnamed)",
    type: file.type || "(empty)",
    inferredType: inferImageType(file) || "(unknown)",
    size: file.size || 0,
    lastModified: file.lastModified || null
  };
}

function validateScreenshotFile(file) {
  uploadLog("info", "selected file metadata", describeFile(file));

  if (!file || !file.size) {
    throw new Error("No readable image was selected. Please choose the screenshot again.");
  }

  const type = inferImageType(file);
  if (!type || !ACCEPTED_SCREENSHOT_TYPES.has(type)) {
    throw new Error("Unsupported image type. Please upload a JPG, PNG, WebP, or HEIC screenshot.");
  }

  if (file.size > MAX_SCREENSHOT_BYTES) {
    throw new Error("File too large. Please upload a screenshot under 10 MB.");
  }

  return type;
}

function setUploadState(section, state, reason) {
  const stateEl = section.querySelector("[data-upload-state]");
  if (stateEl) stateEl.setAttribute("data-upload-state", state);
  uploadLog("debug", "state transition", { state, reason: reason || "" });
}

function setUploadStatus(section, message, isError) {
  const status = section.querySelector("[data-upload-status]");
  if (!status) return;
  status.textContent = message || "";
  status.classList.toggle("error", Boolean(isError));
}

function setUploadSubmitEnabled(section, enabled) {
  const btn = section.querySelector("[data-submit-screenshot]");
  if (!btn) return;
  btn.disabled = !enabled;
}

function revokePreviewUrl(reason) {
  if (!uploadSelection.previewUrl) return;
  uploadLog("debug", "revoking preview object URL", { reason: reason || "" });
  URL.revokeObjectURL(uploadSelection.previewUrl);
  uploadSelection.previewUrl = null;
}

function resetUploadSelection(section, reason, options = {}) {
  uploadSelection.token += 1;
  uploadSelection.selectedFile = null;
  uploadSelection.previewVisible = false;
  uploadSelection.uploadInProgress = false;
  revokePreviewUrl(reason);

  const previewImg = section.querySelector("[data-preview-img]");
  const filenameEl = section.querySelector("[data-upload-filename]");
  const submitBtn = section.querySelector("[data-submit-screenshot]");

  if (previewImg) {
    previewImg.removeAttribute("src");
    previewImg.onload = null;
    previewImg.onerror = null;
  }
  if (filenameEl) filenameEl.textContent = "";
  if (screenshotInput) screenshotInput.value = "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submit Registration";
  }
  if (!options.keepStatus) setUploadStatus(section, "", false);
  setUploadState(section, "pick", reason);
}

function waitForImageLoad(img, url, token, file) {
  return new Promise((resolve, reject) => {
    img.onload = () => {
      if (token !== uploadSelection.token) {
        reject(new Error("Selection changed before preview finished loading."));
        return;
      }
      const width = img.naturalWidth || img.width || 0;
      const height = img.naturalHeight || img.height || 0;
      if (!width || !height) {
        reject(new Error("Image preview loaded without dimensions."));
        return;
      }
      resolve({ width, height });
    };

    img.onerror = () => {
      uploadLog("error", "image decode failure", { url, file: describeFile(file) });
      reject(new Error("Could not preview this image. Please try a JPG or PNG screenshot."));
    };

    img.src = url;
  });
}

function shouldCompress(file, imageMeta, type) {
  return (
    file.size > COMPRESSION_THRESHOLD_BYTES ||
    imageMeta.width > COMPRESSION_MAX_DIMENSION ||
    imageMeta.height > COMPRESSION_MAX_DIMENSION ||
    type === "image/heic" ||
    type === "image/heif"
  );
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob || !blob.size) {
          uploadLog("error", "blob creation failure", { type, quality, width: canvas.width, height: canvas.height });
          reject(new Error("Compressed image blob was empty."));
          return;
        }
        resolve(blob);
      }, type, quality);
    } catch (err) {
      uploadLog("error", "blob creation failure", err);
      reject(err);
    }
  });
}

async function compressLoadedPreview(previewImg, originalFile) {
  const sourceWidth = previewImg.naturalWidth || previewImg.width;
  const sourceHeight = previewImg.naturalHeight || previewImg.height;
  let targetWidth = sourceWidth;
  let targetHeight = sourceHeight;

  if (targetWidth > COMPRESSION_MAX_DIMENSION || targetHeight > COMPRESSION_MAX_DIMENSION) {
    const ratio = Math.min(COMPRESSION_MAX_DIMENSION / targetWidth, COMPRESSION_MAX_DIMENSION / targetHeight);
    targetWidth = Math.max(1, Math.round(targetWidth * ratio));
    targetHeight = Math.max(1, Math.round(targetHeight * ratio));
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    uploadLog("error", "compression failure", "Could not create canvas context.");
    throw new Error("Could not create canvas context.");
  }

  ctx.drawImage(previewImg, 0, 0, targetWidth, targetHeight);
  const blob = await canvasToBlob(canvas, "image/jpeg", COMPRESSION_QUALITY);

  uploadLog("info", "compression result", {
    original: describeFile(originalFile),
    compressed: { type: blob.type, size: blob.size, width: targetWidth, height: targetHeight }
  });

  if (blob.size >= originalFile.size && originalFile.type !== "image/heic" && originalFile.type !== "image/heif") {
    uploadLog("info", "compression skipped because result was not smaller", { originalSize: originalFile.size, compressedSize: blob.size });
    return originalFile;
  }

  return new File([blob], String(originalFile.name || "payment-screenshot").replace(/\.[^.]+$/, "") + ".jpg", {
    type: "image/jpeg",
    lastModified: Date.now()
  });
}

function normalizeOriginalFile(file, inferredType) {
  if (file.type) return file;
  return new File([file], file.name || "payment-screenshot", {
    type: inferredType,
    lastModified: file.lastModified || Date.now()
  });
}

async function prepareScreenshotUpload(file, previewImg, imageMeta, inferredType) {
  const originalFile = normalizeOriginalFile(file, inferredType);
  if (!shouldCompress(originalFile, imageMeta, inferredType)) {
    uploadLog("info", "using original image without compression", describeFile(originalFile));
    return originalFile;
  }

  try {
    return await compressLoadedPreview(previewImg, originalFile);
  } catch (err) {
    uploadLog("warn", "compression failure; falling back to original validated image", {
      error: err?.message || String(err),
      file: describeFile(originalFile)
    });
    return originalFile;
  }
}

async function preparePreviewAndUploadFile(section, file, token) {
  const inferredType = validateScreenshotFile(file);
  const previewImg = section.querySelector("[data-preview-img]");
  const filenameEl = section.querySelector("[data-upload-filename]");

  if (!previewImg || !filenameEl) {
    throw new Error("Upload preview UI is not available.");
  }

  const previewUrl = URL.createObjectURL(file);
  revokePreviewUrl("new selection");
  uploadSelection.previewUrl = previewUrl;
  uploadSelection.selectedFile = null;
  uploadSelection.previewVisible = false;

  let imageMeta;
  try {
    imageMeta = await waitForImageLoad(previewImg, previewUrl, token, file);
    uploadSelection.previewVisible = true;
    uploadLog("info", "preview generation success", { file: describeFile(file), image: imageMeta });
  } catch (err) {
    uploadLog("error", "preview generation failure", { error: err?.message || String(err), file: describeFile(file) });
    revokePreviewUrl("preview failure");
    throw err;
  }

  if (token !== uploadSelection.token) {
    throw new Error("Selection changed while processing image.");
  }

  const uploadFile = await prepareScreenshotUpload(file, previewImg, imageMeta, inferredType);

  if (token !== uploadSelection.token) {
    throw new Error("Selection changed while preparing upload.");
  }

  uploadSelection.selectedFile = uploadFile;
  filenameEl.textContent = `${file.name || "Selected screenshot"} (${(uploadFile.size / 1024).toFixed(0)} KB upload)`;
  return uploadFile;
}

function showPaymentSection(data) {
  const section = document.querySelector("[data-payment-section]");
  if (!section) return;

  pendingRegistration = data;

  // Save pending state for page recovery
  try {
    sessionStorage.setItem("lpu_pending_reg", JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  } catch (_) {}

  // Populate fields
  section.querySelector("[data-pay-ref]").textContent = data.payment_reference;
  section.querySelector("[data-pay-total]").textContent = formatFee(data.total_amount);

  const paymentProgram = getProgram(data.program_slug || registrationProgramSlug);
  const mainFeeLabel = paymentProgram?.feeMode === "session_count" ? "Session fee" : "Program fee";
  let splitText = `${mainFeeLabel}: ${formatFee(data.session_fee)}`;
  if (data.hostel_amount > 0) splitText += ` + Accommodation / meals (${data.hostel_days || hostelChargeDays(getProgram(data.program_slug || registrationProgramSlug))} days): ${formatFee(data.hostel_amount)}`;
  if (data.hostel_option === "included" && data.included_services) splitText += ` + ${data.included_services}: Included`;
  section.querySelector("[data-pay-split]").textContent = splitText;

  const paytmName = `${data.student_name || data.guardian_name || "LPU Summer School"} - ${data.payment_reference || ""}`.trim();
  const paytmPhone = data.phone || data.emergency_phone || "";
  const paytmEmail = data.email || "";
  const paytmAmount = String(Math.round(Number(data.total_amount || 0)));

  section.querySelector("[data-paytm-name]").textContent = paytmName || "Student name";
  section.querySelector("[data-paytm-phone]").textContent = paytmPhone || "Registered mobile number";
  section.querySelector("[data-paytm-email]").textContent = paytmEmail || "Registered email";
  section.querySelector("[data-paytm-amount]").textContent = paytmAmount || "0";
  section.querySelector("[data-paytm-link]").href = LPU_PAYTM_PAYMENT_URL;

  resetUploadSelection(section, "payment section opened");

  // Bind events only once
  if (!paymentModalBound) {
    paymentModalBound = true;

    // Copy Paytm payment details button
    const copyBtn = section.querySelector("[data-copy-paytm-details]");
    copyBtn.addEventListener("click", () => {
      const details = [
        "LPU Summer School 2026 Payment",
        `Full Name: ${section.querySelector("[data-paytm-name]").textContent}`,
        `Mobile no: ${section.querySelector("[data-paytm-phone]").textContent}`,
        `e mail id: ${section.querySelector("[data-paytm-email]").textContent}`,
        `Fee: ${section.querySelector("[data-paytm-amount]").textContent}`,
        `Payment Ref: ${section.querySelector("[data-pay-ref]").textContent}`,
        `Paytm link: ${LPU_PAYTM_PAYMENT_URL}`
      ].join("\n");
      const writeClipboard = navigator.clipboard?.writeText
        ? navigator.clipboard.writeText(details)
        : Promise.reject(new Error("Clipboard API unavailable"));
      writeClipboard.then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy Payment Details"; }, 2000);
      }).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = details;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy Payment Details"; }, 2000);
      });
    });

    // Upload area click → open body-level file input
    const uploadArea = section.querySelector("[data-upload-area]");
    const openFilePicker = () => {
      if (!screenshotInput || uploadSelection.uploadInProgress) return;
      screenshotInput.value = "";
      screenshotInput.click();
    };
    uploadArea.addEventListener("click", openFilePicker);
    uploadArea.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFilePicker();
      }
    });

    // File selected
    screenshotInput.addEventListener("change", async () => {
      const file = screenshotInput.files[0];
      resetUploadSelection(section, "new file selected");
      const token = uploadSelection.token;

      try {
        setUploadState(section, "processing", "file selected");
        const uploadFile = await preparePreviewAndUploadFile(section, file, token);
        if (token !== uploadSelection.token) return;
        setUploadState(section, "ready", "preview visible and upload file prepared");
        setUploadSubmitEnabled(section, Boolean(uploadFile && uploadSelection.previewVisible));
        setUploadStatus(section, "", false);
      } catch (err) {
        if (token !== uploadSelection.token) return;
        uploadLog("error", "selection handling failure", { error: err?.message || String(err), file: describeFile(file) });
        resetUploadSelection(section, "selection failed", { keepStatus: true });
        setUploadStatus(section, err?.message || "Could not process image. Try a different file.", true);
      }
      return;

    });

    // Remove / retry
    section.querySelector("[data-remove-upload]").addEventListener("click", () => {
      resetUploadSelection(section, "user removed selected screenshot");
    });

    // Submit screenshot
    section.querySelector("[data-submit-screenshot]").addEventListener("click", async () => {
      const selectedFile = uploadSelection.selectedFile;
      if (!selectedFile || !uploadSelection.previewVisible || !pendingRegistration || uploadSelection.uploadInProgress) return;

      const btn = section.querySelector("[data-submit-screenshot]");

      btn.disabled = true;
      btn.textContent = "Uploading...";
      uploadSelection.uploadInProgress = true;
      setUploadState(section, "uploading", "submit clicked");
      setUploadStatus(section, "", false);

      try {
        const fd = new FormData();
        fd.append("registration_id", pendingRegistration.registration_id);
        fd.append("payment_reference", pendingRegistration.payment_reference);
        fd.append("screenshot", selectedFile);

        uploadLog("info", "submitting screenshot", {
          registration_id: pendingRegistration.registration_id,
          payment_reference: pendingRegistration.payment_reference,
          file: describeFile(selectedFile)
        });

        const res = await fetch(`${SUPABASE_URL}/functions/v1/upload-screenshot`, {
          method: "POST",
          body: fd
        });

        if (!res.ok) {
          const bodyText = await res.text().catch(() => "");
          let err = {};
          try { err = bodyText ? JSON.parse(bodyText) : {}; } catch (_) {}
          uploadLog("error", "backend upload rejection", { status: res.status, body: bodyText, file: describeFile(selectedFile) });
          throw new Error(err.error || err.message || "Upload failed. Please try again.");
        }

        setUploadState(section, "done", "upload accepted by backend");
        uploadLog("info", "backend upload accepted");
        showReceipt({
          ...pendingRegistration,
          hostel_option: pendingRegistration.hostel_option || "none"
        });
      } catch (err) {
        uploadLog("error", "upload submission failure", { error: err?.message || String(err), file: describeFile(selectedFile) });
        setUploadStatus(section, err.message, true);
        setUploadState(section, "ready", "upload failed; keeping preview ready");
        btn.disabled = false;
        btn.textContent = "Submit Registration";
      } finally {
        uploadSelection.uploadInProgress = false;
      }
    });

    // Cancel / close button
    section.querySelector("[data-payment-close]")?.addEventListener("click", () => {
      if (!confirm("Cancel payment? Your registration is saved — you can upload the screenshot later by revisiting this page.")) return;
      resetUploadSelection(section, "payment modal closed");
      section.hidden = true;
      document.body.style.overflow = "";
    });
  }

  // Show modal overlay
  section.hidden = false;
  document.body.style.overflow = "hidden";
}

// ── Page recovery (if user navigated away during payment) ──────────
function checkPendingRegistration() {
  try {
    const raw = sessionStorage.getItem("lpu_pending_reg");
    if (!raw) return;
    const pending = JSON.parse(raw);
    // Expire after 2 hours
    if (Date.now() - pending.timestamp > 2 * 60 * 60 * 1000) {
      sessionStorage.removeItem("lpu_pending_reg");
      return;
    }
    showPaymentSection(pending);
  } catch (_) {
    sessionStorage.removeItem("lpu_pending_reg");
  }
}

if (form) checkPendingRegistration();

// ── Form submission ─────────────────────────────────────────────────
form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const program = selectedRegistrationProgram();
  if (!program) {
    statusMessage.textContent = "Please choose a program before proceeding.";
    statusMessage.classList.add("error");
    return;
  }
  const programDeadline = program?.urgency?.deadline ? new Date(program.urgency.deadline) : registrationDeadline;
  // Block submission if deadline has passed
  if (programDeadline && new Date() > programDeadline) {
    statusMessage.textContent = "Registration is closed. The deadline has passed.";
    statusMessage.classList.add("error");
    return;
  }
  if (!registrationProgramIsOpen(program)) {
    statusMessage.textContent = `${program.name} registration will open after the schedule and fee are announced.`;
    statusMessage.classList.add("error");
    return;
  }

  runFullValidation(true);
  if (!isFormComplete()) {
    statusMessage.textContent = "Please complete all required fields before proceeding.";
    statusMessage.classList.add("error");
    const firstInvalid = form.querySelector(".invalid, .block-invalid");
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const formData = new FormData(form);
  const hostelOption = programShowsHostelStep(program)
    ? (formData.get("hostel") || "none")
    : (programIncludesAccommodation(program) ? "included" : "none");
  const selectedCourseIds = registrationCourseIds(program, formData);
  const studentAge = studentAgeValue();

  if (!selectedCourseIds.length) {
    statusMessage.textContent = programUsesFixedSchedule(program)
      ? "This fixed schedule is not ready yet. Please contact the admin team."
      : "Please select at least one class before proceeding.";
    statusMessage.classList.add("error");
    return;
  }

  if (!hasValidStudentAge(studentAge)) {
    statusMessage.textContent = "Please enter a valid student age before proceeding.";
    statusMessage.classList.add("error");
    studentAgeInput?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const ineligibleSelected = selectedCourseIds
    .map((id) => courseById(id))
    .filter((course) => course && !courseAgeEligible(course, studentAge));
  if (ineligibleSelected.length) {
    statusMessage.textContent = `${ineligibleSelected[0].name} requires ${courseEligibilityLabel(ineligibleSelected[0])}.`;
    statusMessage.classList.add("error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Creating registration...";
  statusMessage.classList.remove("error");
  statusMessage.textContent = "";

  const guardianName = formatGuardianName(formData.get("guardianTitle"), formData.get("guardianName"));
  const phone = trimPhoneValue(formData.get("phone"));
  const emergencyPhone = trimPhoneValue(formData.get("emergencyPhone"));
  const email = String(formData.get("email") || "").trim().toLowerCase();

  const registrationData = {
    program_slug: program.slug,
    student_name: String(formData.get("studentName") || "").trim(),
    student_age: studentAge,
    class_level: String(formData.get("classLevel") || "").trim(),
    school_name: String(formData.get("schoolName") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    guardian_name: guardianName,
    phone,
    email,
    emergency_phone: emergencyPhone,
    course_ids: selectedCourseIds,
    hostel_option: hostelOption,
    medical_note: formData.get("medicalNote") || null
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_program_registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ payload: registrationData })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || "Failed to create registration");
    }

    const result = await res.json();
    const pending = {
      ...result,
      student_name: registrationData.student_name,
      student_age: registrationData.student_age,
      class_level: registrationData.class_level,
      guardian_name: registrationData.guardian_name,
      phone: registrationData.phone,
      email: registrationData.email,
      emergency_phone: registrationData.emergency_phone,
      hostel_option: hostelOption || "none"
    };
    queueRegistrationCreatedEmail(pending);
    showPaymentSection(pending);
  } catch (error) {
    statusMessage.classList.add("error");
    statusMessage.textContent = `Something went wrong: ${error.message}. Please try again.`;
    submitButton.textContent = "Proceed to Payment";
    updateSubmitState();
  }
});

// Scroll reveal
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

// Close mobile nav on outside click
document.addEventListener("click", (event) => {
  if (nav?.classList.contains("open") && !event.target.closest(".site-nav") && !event.target.closest(".nav-toggle")) {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

// Form progress steps (progressSteps & formBlocks declared earlier with validation system)
if (progressSteps.length && formBlocks.length && "IntersectionObserver" in window) {
  let activeStepIndex = 0;

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = [...formBlocks].indexOf(entry.target);
      if (index === -1) return;
      activeStepIndex = index;

      progressSteps.forEach((step, i) => {
        if (step.hidden) {
          step.classList.remove("active", "done");
          return;
        }
        step.classList.remove("active");
        if (i === index) step.classList.add("active");
        // done state is driven by validation via updateBlockStates()
        // but also mark previous blocks done if validated
        if (i < index && validateBlock(i)) step.classList.add("done");
      });
    });
  }, { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" });

  formBlocks.forEach((block) => stepObserver.observe(block));
}

// Contact overlay toggle
const contactToggle = document.querySelector("[data-contact-toggle]");
const contactOverlay = document.querySelector("[data-contact-overlay]");
const contactClose = document.querySelector("[data-contact-close]");

if (contactToggle && contactOverlay) {
  contactToggle.addEventListener("click", () => { contactOverlay.hidden = false; });
  contactClose?.addEventListener("click", () => { contactOverlay.hidden = true; });
  contactOverlay.addEventListener("click", (e) => {
    if (e.target === contactOverlay) contactOverlay.hidden = true;
  });
}

// Social proof popup is intentionally disabled; registrations should not show fake urgency.
(function socialProofPopup() {
  return;
  if (document.querySelector(".register-page")) return;

  const first = [
    "Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Ayaan","Krishna","Ishaan",
    "Shaurya","Atharv","Advik","Pranav","Advaith","Aarush","Kabir","Ritvik","Darsh","Arnav",
    "Dhruv","Harsh","Lakshya","Parth","Rudra","Yash","Rohit","Sahil","Tanmay","Utkarsh",
    "Vansh","Kunal","Manav","Nikhil","Om","Pranit","Rachit","Sparsh","Tejas","Ujjwal",
    "Dev","Gaurav","Himanshu","Jay","Kartik","Mohit","Neil","Rohan","Siddharth","Tushar",
    "Varun","Aryan","Bhavya","Chirag","Divyansh","Eklavya","Raghav","Virat","Karan","Aman",
    "Ananya","Diya","Myra","Sara","Aanya","Aadhya","Ira","Navya","Pari","Saanvi",
    "Anika","Kiara","Riya","Anvi","Prisha","Zara","Mishka","Ahana","Trisha","Kavya",
    "Siya","Nitya","Meera","Tanya","Amaira","Charvi","Eshani","Fatima","Gauri","Hiya",
    "Inaya","Jiya","Khushi","Lavanya","Mahi","Nisha","Oviya","Pihu","Radhika","Shreya",
    "Tanvi","Uma","Vedika","Wridhi","Yashvi","Zoya","Pooja","Neha","Simran","Palak",
    "Ridhi","Sneha","Swati","Komal","Aditi","Bhumi","Chetna","Deepa","Esha","Gargi",
    "Harini","Ishita","Janvi","Kritika","Lata","Madhuri","Nandini","Ojaswi","Paridhi","Ridhima"
  ];
  const last = [
    "S.","M.","R.","K.","P.","T.","G.","D.","B.","L.","V.","N.","J.","W.","C.","H.","F.","A.","E.","Q."
  ];
  const sessionLabels = ["1 session", "2 sessions", "all 3 sessions"];

  // Seeded shuffle using timestamp so each page load is different
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Generate 250 unique names by combining first + last
  const allNames = [];
  const shuffledFirst = shuffle(first);
  const shuffledLast = shuffle(last);
  const used = new Set();
  for (let i = 0; allNames.length < 250 && i < 2000; i++) {
    const f = shuffledFirst[i % shuffledFirst.length];
    const l = shuffledLast[Math.floor(Math.random() * last.length)];
    const full = f + " " + l;
    if (!used.has(full)) { used.add(full); allNames.push(full); }
  }

  const namePool = shuffle(allNames);
  let idx = 0;

  const toast = document.createElement("div");
  toast.className = "social-proof-toast";
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  function showProof() {
    if (idx >= namePool.length) idx = 0;
    const name = namePool[idx++];
    const r = Math.random();
    const sessions = r < 0.25 ? sessionLabels[0] : r < 0.6 ? sessionLabels[1] : sessionLabels[2];
    const mins = Math.floor(Math.random() * 18) + 1;

    toast.innerHTML = `<div class="sp-icon">🎓</div><div class="sp-body"><strong>${name}</strong> registered for <em>${sessions}</em><span>${mins} min ago</span></div>`;
    toast.classList.add("visible");
    setTimeout(() => { toast.classList.remove("visible"); }, 5500);
  }

  setTimeout(() => {
    showProof();
    setInterval(showProof, (25 + Math.random() * 15) * 1000);
  }, (8 + Math.random() * 6) * 1000);
})();
