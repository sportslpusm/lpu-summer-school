const SUPABASE_URL = "https://bynpuhoysivxxlblxica.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bnB1aG95c2l2eHhsYmx4aWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTE1NjAsImV4cCI6MjA5NDQ4NzU2MH0.JltZJYggs2ycs3u0HUelRMivZgsByW_g5-n3qz6EaPk";

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-category]");
const form = document.querySelector("[data-registration-form]");
const statusMessage = document.querySelector("[data-form-status]");
const sessionToggles = document.querySelectorAll("[data-session-toggle]");
const courseSelects = document.querySelectorAll("[data-session-course]");
const feeTotals = document.querySelectorAll("[data-fee-total]");
const feeNote = document.querySelector("[data-fee-note]");
const countdowns = document.querySelectorAll("[data-countdown]");
const floatingRegister = document.querySelector("[data-floating-register]");
const registerButtons = document.querySelectorAll('a[href="register.html"]:not([data-floating-register])');
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
const trackEmpty = document.getElementById("trackEmpty");
const registrationProgramRoot = document.querySelector("[data-registration-programs]");
const registrationProgramInput = document.querySelector("[data-program-slug]");
const registrationProgramStatus = document.querySelector("[data-program-status]");
const hostelBlock = document.querySelector("[data-hostel-block]");
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
    facts: { eligibility: "Grades 6-12", duration: "2 weeks", mode: "On Campus", focus: "Session-wise tracks" },
    urgency: { deadlineLabel: "14 June 2026", deadline: "2026-06-14T23:59:59+05:30", seatsBase: 24, seatsMin: 6, note: "Final seats moving fast. Register today." },
    meta: { dates: "15–27 June 2026", mode: "On Campus", duration: "2 weeks", location: "LPU Campus, Phagwara" }
  },
  online: {
    name: "Online Course",
    description: "A flexible online learning track for students who want guided skill-building from home with structured lessons, mentor touchpoints, and practical outcomes.",
    context: "For learners who need remote access without losing the rhythm of a guided summer program.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779188840605-uiunxfem2bh.png",
    facts: { eligibility: "Open learners", duration: "To be announced", mode: "Online", focus: "Remote skill-building" },
    urgency: { deadlineLabel: "To be announced", deadline: "", seatsBase: 30, seatsMin: 12, note: "Dates and seats will be announced with the online schedule." },
    meta: { dates: "Date to be decided", mode: "Online", duration: "To be announced", location: "Online" }
  },
  "staff-camp": {
    name: "LPU Staff Kid Summer Camp",
    description: "A lively campus summer camp for LPU staff children, blending learning, creativity, sports, friendships, and supervised experiences across the university ecosystem.",
    context: "For LPU families looking for a meaningful, active, and well-supported summer experience.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779089835922-qm6ldbzss5.png",
    facts: { eligibility: "LPU staff kids", duration: "3 weeks", mode: "On Campus", focus: "Camp + activities" },
    urgency: { deadlineLabel: "31 May 2026", deadline: "2026-05-31T23:59:59+05:30", seatsBase: 18, seatsMin: 5, note: "Limited camp seats for staff children." },
    meta: { dates: "6–27 June 2026", mode: "On Campus", duration: "3 weeks", location: "LPU Campus, Phagwara" }
  },
  skills: {
    name: "Tailor-Made Skills Workshop",
    description: "A custom workshop format shaped around specific skill goals, cohorts, or institutional needs, with practical modules designed for the selected learners.",
    context: "For groups that need a focused skill-building experience with a tailored learning plan.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779191793080-mgw718dwqh9.png",
    facts: { eligibility: "Custom cohorts", duration: "Flexible", mode: "LPU / Hybrid", focus: "Designed to need" },
    urgency: { deadlineLabel: "To be announced", deadline: "", seatsBase: 16, seatsMin: 6, note: "Seats depend on the selected custom workshop cohort." },
    meta: { dates: "Date to be decided", mode: "Custom Workshop", duration: "Flexible", location: "LPU / Hybrid" }
  },
  immersion: {
    name: "LPU Immersion Program",
    description: "An immersive LPU experience for learners to explore campus life, academic pathways, culture, labs, and guided activities with a global outlook.",
    context: "For students who want to experience the energy, scale, and possibilities of LPU up close.",
    backgroundImage: "https://bynpuhoysivxxlblxica.supabase.co/storage/v1/object/public/images/1779188603214-x7q34c5kfq.png",
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

function normalizeProgram(row = {}, fallbackKey = "campus") {
  const slug = row.slug || fallbackKey;
  const fallback = HERO_PROGRAMS[slug] || HERO_PROGRAMS[fallbackKey] || HERO_PROGRAMS.campus;
  const deadline = row.registration_deadline || fallback.urgency?.deadline || "";
  const hasProgramBackground = Boolean(row.background_image_url);
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
    feeMode: row.fee_mode || fallback.feeMode || "session_count",
    feeStatus: row.fee_status || fallback.feeStatus || "ready",
    baseFee: Number(row.base_fee ?? fallback.baseFee ?? 0),
    gstRate: Number(row.gst_rate ?? fallback.gstRate ?? 0.18),
    allowHostel: Boolean(row.allow_hostel ?? fallback.allowHostel ?? false),
    registrationEnabled: Boolean(row.registration_enabled ?? fallback.registrationEnabled ?? true),
    sortOrder: Number(row.sort_order ?? fallback.sortOrder ?? 0),
    isActive: Boolean(row.is_active ?? fallback.isActive ?? true),
    facts: {
      eligibility: fallback.facts?.eligibility || "Students",
      duration: row.duration || fallback.facts?.duration || fallback.meta?.duration || "To be announced",
      mode: row.mode || fallback.facts?.mode || fallback.meta?.mode || "To be announced",
      focus: row.short_label || fallback.facts?.focus || fallback.name
    },
    urgency: {
      deadlineLabel: row.deadline_label || fallback.urgency?.deadlineLabel || "To be announced",
      deadline,
      seatsLabel: row.seats_label || fallback.urgency?.seatsLabel || "Seats Left",
      seatsBase: Number(row.seats_base ?? fallback.urgency?.seatsBase ?? 0),
      seatsMin: Number(row.seats_min ?? fallback.urgency?.seatsMin ?? 0),
      note: row.seats_note || fallback.urgency?.note || ""
    },
    meta: {
      dates: row.dates_label || fallback.meta?.dates || "Date to be decided",
      mode: row.mode || fallback.meta?.mode || "To be announced",
      duration: row.duration || fallback.meta?.duration || "To be announced",
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
  if (!programBySlug[registrationProgramSlug]) registrationProgramSlug = programs[0]?.slug || "campus";
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
let trackProgramSlug = "campus";
let registrationProgramSlug = "campus";

let sessionCourses = {
  session1: [],
  session2: [],
  session3: []
};

let feeBySessionCount = {
  0: 0,
  1: 600,
  2: 1000,
  3: 1400
};
let feeByProgramSessionCount = {};

function phoneDigits(phone) { return phone.replace(/[^0-9+]/g, ""); }
function phoneWA(phone) { return phone.replace(/[^0-9]/g, ""); }
const waText = encodeURIComponent("Hi, I have a query about LPU Summer School 2026");

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

  // Dynamic hostel fees from config
  const hostelOnly = parseInt(cfg["hostel_only_fee"]);
  const hostelFood = parseInt(cfg["hostel_food_fee"]);
  if (!isNaN(hostelOnly)) HOSTEL_FEES.hostel_only = hostelOnly;
  if (!isNaN(hostelFood)) HOSTEL_FEES.hostel_food = hostelFood;

  // Update hostel price labels on register page
  updateHostelPriceLabels();

  // Update hostel prices on homepage
  document.querySelectorAll('.hostel-option').forEach((el, i) => {
    const strong = el.querySelector('strong');
    if (!strong) return;
    if (i === 0 && !isNaN(hostelOnly)) strong.textContent = `Rs. ${hostelOnly.toLocaleString("en-IN")}`;
    if (i === 1 && !isNaN(hostelFood)) strong.textContent = `Rs. ${hostelFood.toLocaleString("en-IN")}`;
  });

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
    heroProgramSeatsLabel.textContent = hasAnnouncedDeadline ? (urgency.seatsLabel || "Seats Left") : "Seats Update";
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
    heroProgramRoot.dataset.seatsBase = String(urgency.seatsBase || 24);
    heroProgramRoot.dataset.seatsMin = String(urgency.seatsMin || 6);
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

function updateHeroProgram(programKey, animate = true) {
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
    setTrackProgram(programKey, { fromHero: true });

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
    updateHeroProgram(nextTab.dataset.programOption);
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
      updateHeroProgram(tab.dataset.programOption);
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
    const [programsRes, sessionsRes, coursesRes, feesRes, settingsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/programs?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/sessions?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/courses?is_active=eq.true&order=sort_order.asc&select=*,sessions(name,time_slot,sort_order,program_id),programs(slug,name)`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/fee_tiers?order=session_count.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/site_config?select=key,value`, { headers: { "apikey": SUPABASE_KEY } })
    ]);

    if (!sessionsRes.ok || !coursesRes.ok || !feesRes.ok) return;

    const programsData = programsRes.ok ? await programsRes.json() : [];
    const sessionsData = await sessionsRes.json();
    const coursesData = await coursesRes.json();
    const feesData = await feesRes.json();
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
  if (!options.fromHero && heroProgramRoot) updateHeroProgram(slug);
}

function renderTrackProgramFilters() {
  if (!trackProgramFilters || !programs.length) return;
  trackProgramFilters.innerHTML = programs.map((program) => `
    <button class="track-program-chip ${program.slug === trackProgramSlug ? "active" : ""}" type="button" data-track-program="${esc(program.slug)}">
      <span>${esc(program.name)}</span>
      <small>${esc(program.meta?.dates || program.urgency?.deadlineLabel || "")}</small>
    </button>
  `).join("");
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
    if (trackEmpty) {
      trackEmpty.hidden = false;
      trackEmpty.textContent = allCourses.length ? "No tracks match this filter yet." : `${program.name} tracks will appear here after admin adds them.`;
    }
    return;
  }

  if (trackEmpty) trackEmpty.hidden = true;
  trackGrid.innerHTML = visibleCourses.map((course, i) => `
    <article class="track-card" data-category="${esc(course.category)}" data-course-idx="${i}">
      <img src="${esc(course.image_url || fallbackCourseImage(program))}" alt="${esc(course.name)}">
      <div>
        <span>${esc(course.class_range || "Classes 6-12")}</span>
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
    sheetBadge.textContent = course.class_range || "Classes 6-12";
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

function formatFee(amount) {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

const GST_RATE = 0.18;

function gstPercentLabel(rate = GST_RATE) {
  const percent = Number(rate || GST_RATE) * 100;
  return `${Number.isInteger(percent) ? percent : percent.toFixed(2).replace(/\.?0+$/, "")}%`;
}

function updateHostelPriceLabels(rate = selectedRegistrationProgram()?.gstRate ?? GST_RATE) {
  document.querySelectorAll(".hostel-radio").forEach((radio) => {
    const input = radio.querySelector('input[name="hostel"]');
    const priceEl = radio.querySelector(".hostel-radio-price");
    if (!input || !priceEl) return;
    const fee = HOSTEL_FEES[input.value];
    if (fee > 0) {
      priceEl.innerHTML = `<em>Rs. ${fee.toLocaleString("en-IN")}</em><small>+ ${gstPercentLabel(rate)} GST</small>`;
    }
  });
}

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const HOSTEL_FEES = { none: 0, hostel_only: 1400, hostel_food: 3000 };
let registrationDeadline = null;

function selectedRegistrationProgram() {
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

function registrationProgramIsOpen(program = selectedRegistrationProgram()) {
  return Boolean(program?.registrationEnabled && programHasFeeConfig(program));
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
  if (!registrationProgramRoot || !programs.length) return;
  registrationProgramRoot.innerHTML = programs.map((program) => {
    const open = registrationProgramIsOpen(program);
    const active = program.slug === registrationProgramSlug;
    return `
      <button class="registration-program-card ${active ? "active" : ""}" type="button" data-registration-program="${esc(program.slug)}" aria-pressed="${active ? "true" : "false"}">
        <span>${esc(program.name)}</span>
        <small>${esc(program.meta?.dates || "Date to be decided")}</small>
        <em>${open ? "Registration open" : "Coming soon"}</em>
      </button>
    `;
  }).join("");
  registrationProgramRoot.querySelectorAll("[data-registration-program]").forEach((button) => {
    button.addEventListener("click", () => updateRegistrationProgram(button.dataset.registrationProgram));
  });
}

function resetSessionCards() {
  sessionToggles.forEach((toggle) => {
    toggle.checked = false;
    toggle.disabled = false;
    const select = document.querySelector(`[data-session-course="${toggle.value}"]`);
    if (select) {
      select.value = "";
      select.disabled = true;
      select.required = false;
    }
  });
}

function updateRegistrationProgram(slug, options = {}) {
  const program = getProgram(slug);
  if (!program) return;
  registrationProgramSlug = program.slug;
  if (registrationProgramInput) registrationProgramInput.value = program.slug;
  if (!options.preserveSelection) resetSessionCards();
  renderRegistrationPrograms();

  const sessions = programSessions(program.slug).slice(0, sessionToggles.length);
  sessionCourses = {};
  sessionToggles.forEach((toggle, index) => {
    const card = toggle.closest(".selection-card");
    const select = document.querySelector(`[data-session-course="${toggle.value}"]`);
    const session = sessions[index];
    const key = toggle.value;
    if (!session || !card || !select) {
      if (card) card.hidden = true;
      toggle.disabled = true;
      return;
    }

    card.hidden = false;
    toggle.disabled = !registrationProgramIsOpen(program);
    toggle.dataset.sessionId = session.id;
    const nameEl = document.querySelector(`[data-session-name="${key}"]`);
    const timeEl = document.querySelector(`[data-session-time="${key}"]`);
    if (nameEl) nameEl.textContent = session.name;
    if (timeEl) timeEl.textContent = session.time_slot;

    const courses = publicCourses.filter((course) => course.session_id === session.id && course.program_id === program.id);
    sessionCourses[key] = courses;
    select.innerHTML = `<option value="">Select ${esc(session.name)} class</option>`;
    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.name;
      select.append(option);
    });
    if (!courses.length) toggle.disabled = true;
  });

  if (hostelBlock) {
    hostelBlock.hidden = !program.allowHostel;
    hostelBlock.querySelectorAll("input").forEach((input) => {
      input.disabled = !program.allowHostel;
    });
    if (!program.allowHostel) {
      const noneHostel = hostelBlock.querySelector('input[name="hostel"][value="none"]');
      if (noneHostel) noneHostel.checked = true;
    }
  }
  updateHostelPriceLabels(program.gstRate);

  if (registrationProgramStatus) {
    const sessionsReady = sessions.length > 0 && sessions.some((session) => publicCourses.some((course) => course.session_id === session.id && course.program_id === program.id));
    if (!registrationProgramIsOpen(program)) {
      registrationProgramStatus.textContent = `${program.name} registration will open after the admin adds the final schedule and fee.`;
      registrationProgramStatus.classList.add("warning");
    } else if (!sessionsReady) {
      registrationProgramStatus.textContent = `${program.name} needs sessions and courses before registration can open.`;
      registrationProgramStatus.classList.add("warning");
    } else {
      registrationProgramStatus.textContent = `You are registering for ${program.name}.`;
      registrationProgramStatus.classList.remove("warning");
    }
  }

  updateRegistrationState();
  updateBlockStates();
  updateSubmitState();
}

function getHostelFee() {
  const checked = document.querySelector('input[name="hostel"]:checked');
  return HOSTEL_FEES[checked?.value] || 0;
}

function updateRegistrationState() {
  const program = selectedRegistrationProgram();
  const selected = selectedSessions();
  const sessionFee = selectedProgramFee(selected.length);
  const hostelFee = program?.allowHostel ? getHostelFee() : 0;
  const baseFee = sessionFee + hostelFee;
  const gstRate = Number(program?.gstRate ?? GST_RATE);
  const gst = Math.round(baseFee * gstRate);
  const gstLabel = gstPercentLabel(gstRate);
  const total = baseFee + gst;

  feeTotals.forEach((el) => { el.textContent = formatFee(total); });

  document.querySelectorAll("[data-fee-base]").forEach((el) => { el.textContent = formatFee(baseFee); });
  document.querySelectorAll("[data-gst-detail]").forEach((el) => {
    if (!baseFee) { el.innerHTML = ""; return; }
    const parts = [];
    if (hostelFee) parts.push(`<div class="fee-line"><span>Hostel</span><strong>${formatFee(hostelFee)}</strong></div>`);
    parts.push(`<div class="fee-line"><span>GST ${gstLabel}</span><strong>${formatFee(gst)}</strong></div>`);
    el.innerHTML = parts.join("");
  });
  document.querySelectorAll("[data-gst-line]").forEach((el) => {
    el.textContent = baseFee ? `Includes ${gstLabel} GST: ${formatFee(gst)}` : "";
  });

  if (feeNote) {
    if (!registrationProgramIsOpen(program)) {
      feeNote.textContent = "Fee will appear after this program opens for registration.";
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

sessionToggles.forEach((toggle) => {
  toggle.addEventListener("change", updateRegistrationState);
});

document.querySelectorAll('input[name="hostel"]').forEach((r) => {
  r.addEventListener("change", updateRegistrationState);
});

updateRegistrationState();

// ── Form validation system ──────────────────────────────────────────
const progressSteps = document.querySelectorAll(".progress-step");
const formBlocks = document.querySelectorAll(".form-block");
const submitButton = form?.querySelector('button[type="submit"]');

function getFieldError(field) {
  let err = field.nextElementSibling;
  if (err && err.classList.contains("field-error")) return err;
  err = document.createElement("p");
  err.className = "field-error";
  err.setAttribute("aria-live", "polite");
  field.insertAdjacentElement("afterend", err);
  return err;
}

function validateField(field) {
  if (!field || field.disabled) return true;
  const val = field.value.trim();
  let msg = "";

  if (field.required && !val) {
    msg = "This field is required.";
  } else if (field.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    msg = "Enter a valid email address.";
  } else if (field.type === "tel" && val && field.pattern) {
    const re = new RegExp("^" + field.pattern + "$");
    if (!re.test(val)) msg = "Enter a valid phone number.";
  } else if (field.tagName === "SELECT" && field.required && !val) {
    msg = "Please select an option.";
  }

  const errEl = getFieldError(field);
  if (msg) {
    field.classList.add("invalid");
    errEl.textContent = msg;
    errEl.classList.add("visible");
    return false;
  }
  field.classList.remove("invalid");
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
      const val = f.value.trim();
      if (f.required && !val) return false;
      if (f.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false;
      if (f.type === "tel" && val && f.pattern) {
        return new RegExp("^" + f.pattern + "$").test(val);
      }
      if (f.tagName === "SELECT" && f.required && !val) return false;
      return true;
    });
  }

  if (blockIndex === 2) {
    const program = selectedRegistrationProgram();
    if (!registrationProgramIsOpen(program)) return false;
    const selected = selectedSessions();
    if (selected.length === 0) return false;
    return selected.every((toggle) => {
      const sel = document.querySelector(`[data-session-course="${toggle.value}"]`);
      return sel && sel.value.trim() !== "";
    });
  }

  if (blockIndex === 3) {
    if (hostelBlock?.hidden) return true;
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
  sessionToggles.forEach((toggle) => {
    const card = toggle.closest(".selection-card");
    const sel = document.querySelector(`[data-session-course="${toggle.value}"]`);
    if (!card || !sel) return;
    if (card.hidden || !registrationProgramIsOpen(program)) {
      card.classList.remove("invalid");
      return;
    }

    if (toggle.checked && !sel.value.trim()) {
      card.classList.add("invalid");
      const errEl = getFieldError(sel);
      errEl.textContent = "Select a class for this session.";
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

function updateBlockStates() {
  if (!formBlocks.length) return;

  formBlocks.forEach((block, i) => {
    const valid = validateBlock(i);
    block.classList.toggle("block-valid", valid);
    block.classList.remove("block-invalid");
  });

  // Update stepper done states based on completion
  progressSteps.forEach((step, i) => {
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
  if (!registrationProgramIsOpen(program)) {
    submitButton.disabled = true;
    submitButton.textContent = "Registration Opening Soon";
  } else if (!submitButton.disabled && submitButton.textContent === "Registration Opening Soon") {
    submitButton.textContent = "Proceed to Payment";
  } else if (submitButton.disabled && submitButton.textContent === "Registration Opening Soon") {
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
      validateField(field);
      updateBlockStates();
      updateSubmitState();
    });
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) {
        validateField(field);
      }
      updateBlockStates();
      updateSubmitState();
    });
  });

  // Session toggles & course selects: validate on change
  sessionToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      validateSessionCards();
      updateBlockStates();
      updateSubmitState();
    });
  });
  courseSelects.forEach((sel) => {
    sel.addEventListener("change", () => {
      validateSessionCards();
      updateBlockStates();
      updateSubmitState();
    });
  });

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
  const cdEl = document.querySelector("[data-program-hero] [data-countdown]") || document.querySelector("[data-countdown]");
  const deadlineRaw = urgency.deadline || (cdEl ? cdEl.dataset.deadline : "");
  const deadline = deadlineRaw ? new Date(deadlineRaw) : null;
  const hasAnnouncedDeadline = Boolean(deadline && !Number.isNaN(deadline.getTime()));

  if (!hasAnnouncedDeadline) {
    seatsLeftItems.forEach((item) => {
      item.textContent = "TBA";
      item.style.color = "";
    });
    seatsNotes.forEach((note) => {
      note.textContent = "Seats will be announced with the final program schedule.";
    });
    return;
  }

  const start = new Date("2026-05-02T00:00:00+05:30");
  const now = new Date();
  const seatsBase = Number(heroProgramRoot?.dataset.seatsBase || urgency.seatsBase || 24);
  const seatsMin = Number(heroProgramRoot?.dataset.seatsMin || urgency.seatsMin || 6);
  const totalWindow = deadline && !Number.isNaN(deadline.getTime()) ? deadline - start : 0;
  const elapsed = totalWindow > 0 ? Math.max(0, Math.min(totalWindow, now - start)) : 0;
  const progress = totalWindow > 0 ? elapsed / totalWindow : 0.35;
  const baseline = Math.round(seatsBase - progress * Math.max(4, seatsBase - seatsMin));
  const pulse = Math.floor((Date.now() / 18000) % 4);
  const remaining = Math.max(seatsMin, baseline - pulse);

  seatsLeftItems.forEach((item) => {
    item.textContent = String(remaining);
    item.style.color = remaining <= 10 ? "#d32f2f" : "";
  });
  seatsNotes.forEach((note) => {
    if (urgency.note) {
      note.textContent = urgency.note;
      return;
    }
    note.textContent = remaining <= 12
      ? "Filling up fast — secure your spot now!"
      : remaining <= 18
        ? "Final seats moving fast. Register today."
        : "Limited batch size for better mentoring.";
  });
}

updateSeatsLeft();
if (seatsLeftItems.length) {
  setInterval(updateSeatsLeft, 12000);
}

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
const HOSTEL_LABELS = { none: "No hostel", hostel_only: "Hostel only", hostel_food: "Hostel + Food" };

function showReceipt(data) {
  const receiptEl = document.querySelector("[data-receipt]");
  const table = document.querySelector("[data-receipt-table]");
  if (!receiptEl || !table) return;

  const receiptProgram = getProgram(data.program_slug || registrationProgramSlug);
  const progDatesEl = document.querySelector('[data-cfg="program-dates"]');
  const progDatesStr = receiptProgram?.meta?.dates || (progDatesEl ? progDatesEl.textContent : "");
  const receiptGstLabel = gstPercentLabel(receiptProgram?.gstRate ?? GST_RATE);

  const rows = [
    ["Student", `<strong>${esc(data.student_name || "")}</strong> (${esc(data.class_level || "")})`],
    ["Guardian", esc(data.guardian_name || "")],
    ["Program", esc(data.program_name || "LPU Summer School 2026")],
    ["Courses", (data.courses || []).map(c => esc(c)).join(", ")],
    ["Hostel", esc(HOSTEL_LABELS[data.hostel_option] || "No hostel")],
  ];
  if (progDatesStr) rows.push(["Program Dates", esc(progDatesStr)]);
  rows.push(["Mode", esc(receiptProgram?.meta?.mode || "As per selected program")]);
  rows.push(["Venue", esc(receiptProgram?.meta?.location || "LPU Campus, Phagwara, Punjab")]);
  rows.push(["Session Fee", formatFee(data.session_fee || 0)]);
  if ((data.hostel_amount || 0) > 0) rows.push(["Hostel Fee", formatFee(data.hostel_amount)]);
  rows.push([`GST (${receiptGstLabel})`, formatFee(data.gst_amount || 0)]);

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

// ── UPI Payment Section ────────────────────────────────────────────
let pendingRegistration = null;
let paymentModalBound = false; // guard against duplicate event binding

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

function uploadLog(level, message, data) {
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

  let splitText = `Session fee: ${formatFee(data.session_fee)}`;
  if (data.hostel_amount > 0) splitText += ` + Hostel: ${formatFee(data.hostel_amount)}`;
  splitText += ` + GST ${gstPercentLabel(getProgram(data.program_slug || registrationProgramSlug)?.gstRate ?? GST_RATE)}: ${formatFee(data.gst_amount)}`;
  section.querySelector("[data-pay-split]").textContent = splitText;

  // UPI ID
  section.querySelector("[data-upi-id]").textContent = data.upi_id;

  // QR code
  const qrImg = section.querySelector("[data-upi-qr]");
  if (data.qr_data_url) {
    qrImg.src = data.qr_data_url;
    qrImg.closest(".upi-qr-box").hidden = false;
  } else {
    qrImg.closest(".upi-qr-box").hidden = true;
  }

  // Deep-link buttons
  const upiBase = data.upi_url;
  section.querySelector("[data-upi-gpay]").href = upiBase.replace("upi://", "tez://upi/");
  section.querySelector("[data-upi-phonepe]").href = upiBase.replace("upi://", "phonepe://");
  section.querySelector("[data-upi-paytm]").href = upiBase.replace("upi://", "paytmmp://");
  section.querySelector("[data-upi-bhim]").href = upiBase;

  resetUploadSelection(section, "payment section opened");

  // Bind events only once
  if (!paymentModalBound) {
    paymentModalBound = true;

    // Copy UPI button
    const copyBtn = section.querySelector("[data-copy-upi]");
    copyBtn.addEventListener("click", () => {
      const upiId = section.querySelector("[data-upi-id]").textContent;
      navigator.clipboard.writeText(upiId).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
      }).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = upiId;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
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

  const selected = selectedSessions();
  const formData = new FormData(form);
  const hostelOption = formData.get("hostel");
  const selectedCourseIds = selected
    .map((toggle) => formData.get(`${toggle.value}Course`))
    .filter(Boolean);

  submitButton.disabled = true;
  submitButton.textContent = "Creating registration...";
  statusMessage.classList.remove("error");
  statusMessage.textContent = "";

  const registrationData = {
    program_slug: program.slug,
    student_name: formData.get("studentName"),
    class_level: formData.get("classLevel"),
    school_name: formData.get("schoolName"),
    city: formData.get("city"),
    guardian_name: formData.get("guardianName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    emergency_phone: formData.get("emergencyPhone"),
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
    showPaymentSection({
      ...result,
      student_name: registrationData.student_name,
      class_level: registrationData.class_level,
      guardian_name: registrationData.guardian_name,
      hostel_option: hostelOption || "none"
    });
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

// Social proof popup — fake registration notifications
(function socialProofPopup() {
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
