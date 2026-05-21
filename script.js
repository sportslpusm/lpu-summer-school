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
const heroProgramBgImage = document.querySelector("[data-hero-bg-image]");
const heroProgramTabs = document.querySelectorAll("[data-program-option]");
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

let heroProgramTimer = null;
let heroProgramAutoTimer = null;

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
    if (imageUrl && HERO_PROGRAMS[programKey]) {
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
  document.querySelectorAll('.hostel-radio').forEach((radio) => {
    const input = radio.querySelector('input[name="hostel"]');
    const priceEl = radio.querySelector('.hostel-radio-price');
    if (!input || !priceEl) return;
    const fee = HOSTEL_FEES[input.value];
    if (fee > 0) {
      priceEl.innerHTML = `<em>Rs. ${fee.toLocaleString("en-IN")}</em><small>+ 18% GST</small>`;
    }
  });

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
  return HERO_PROGRAMS[heroProgramRoot.dataset.activeProgram] || HERO_PROGRAMS.campus;
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

  if (heroProgramDeadlineLabel) {
    heroProgramDeadlineLabel.textContent = urgency.deadlineLabel || "To be announced";
  }

  document.querySelectorAll("[data-countdown]").forEach((countdown) => {
    if (countdown.closest("[data-program-hero]")) {
      countdown.dataset.deadline = deadline;
      countdown.dataset.deadlineLabel = urgency.deadlineLabel || "";
    }
  });

  if (heroProgramRoot) {
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
  if (!heroProgramRoot || !HERO_PROGRAMS[programKey]) return;
  const program = HERO_PROGRAMS[programKey];

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
    const [sessionsRes, coursesRes, feesRes, settingsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/sessions?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/courses?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/fee_tiers?order=session_count.asc`, { headers: { "apikey": SUPABASE_KEY } }),
      fetch(`${SUPABASE_URL}/rest/v1/site_config?select=key,value`, { headers: { "apikey": SUPABASE_KEY } })
    ]);

    if (!sessionsRes.ok || !coursesRes.ok || !feesRes.ok) return;

    const sessionsData = await sessionsRes.json();
    const coursesData = await coursesRes.json();
    const feesData = await feesRes.json();

    const cfg = {};
    if (settingsRes.ok) {
      (await settingsRes.json()).forEach((r) => { cfg[r.key] = r.value; });
      applySettings(cfg);
      updateRegistrationState();
    }

    // Build sessionCourses map
    sessionCourses = {};
    sessionsData.forEach((s, i) => {
      const key = `session${i + 1}`;
      sessionCourses[key] = coursesData
        .filter((c) => c.session_id === s.id)
        .map((c) => c.name);
    });

    // Build fee map
    feeBySessionCount = {};
    feesData.forEach((f) => { feeBySessionCount[f.session_count] = f.fee_amount; });

    // Update session labels and time slots on register page
    sessionsData.forEach((s, i) => {
      const key = `session${i + 1}`;
      const nameEl = document.querySelector(`[data-session-name="${key}"]`);
      const timeEl = document.querySelector(`[data-session-time="${key}"]`);
      if (nameEl) nameEl.textContent = s.name;
      if (timeEl) timeEl.textContent = s.time_slot;
    });

    // Re-populate course dropdowns on register page
    courseSelects.forEach((select) => {
      const session = select.dataset.sessionCourse;
      const existingOptions = select.querySelectorAll("option:not(:first-child)");
      existingOptions.forEach((o) => o.remove());
      (sessionCourses[session] || []).forEach((course) => {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        select.append(option);
      });
    });

    // --- Populate homepage tracks grid ---
    const trackGrid = document.getElementById("trackGrid");
    const visibleCourses = coursesData.filter((c) => c.image_url);
    if (trackGrid) {
      trackGrid.innerHTML = visibleCourses
        .map((c, i) => `<article class="track-card" data-category="${esc(c.category)}" data-course-idx="${i}"><img src="${esc(c.image_url)}" alt="${esc(c.name)}"><div><span>${esc(c.class_range || "Classes 6-12")}</span><h3>${esc(c.name)}</h3><p>${esc(c.description || "")}</p></div></article>`)
        .join("");

      // Re-bind filter buttons to new cards
      const newCards = trackGrid.querySelectorAll("[data-category]");
      filters.forEach((button) => {
        button.addEventListener("click", () => {
          const category = button.dataset.filter;
          filters.forEach((f) => f.classList.remove("active"));
          button.classList.add("active");
          newCards.forEach((card) => {
            card.hidden = !(category === "all" || card.dataset.category === category);
          });
        });
      });

      // Mobile bottom sheet for course details
      initCourseBottomSheet(trackGrid, visibleCourses, sessionsData);
    }

    // --- Populate homepage sessions section ---
    const sessionColumns = document.getElementById("sessionColumns");
    if (sessionColumns) {
      sessionColumns.innerHTML = sessionsData.map((s) => {
        const courses = coursesData.filter((c) => c.session_id === s.id);
        return `<article class="session-card"><h3>${esc(s.name)} <span>${esc(s.time_slot)}</span></h3><ul>${courses.map((c) => `<li>${esc(c.name)}</li>`).join("")}</ul></article>`;
      }).join("");
    }

    // --- Populate homepage fees table ---
    const feeTableBody = document.getElementById("feeTableBody");
    if (feeTableBody) {
      feeTableBody.innerHTML = feesData
        .filter((f) => f.session_count > 0)
        .map((f) => `<tr><td>${f.session_count} Session${f.session_count > 1 ? "s" : ""}</td><td>${esc(f.label || "")}</td><td>Rs. ${f.fee_amount.toLocaleString("en-IN")}</td></tr>`)
        .join("");
    }
  } catch (e) {
    // Silently fall back if fetch fails
  }
})();

// ── Mobile course detail bottom sheet ───────────────────────────────
function initCourseBottomSheet(grid, courses, sessions) {
  const MOBILE_MAX = 620;
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
    sheetImg.src = course.image_url;
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
  grid.addEventListener("click", (e) => {
    if (window.innerWidth > MOBILE_MAX) return;
    const card = e.target.closest(".track-card");
    if (!card) return;
    e.preventDefault();
    const idx = parseInt(card.dataset.courseIdx, 10);
    if (!isNaN(idx) && courses[idx]) openSheet(courses[idx]);
  });

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
    const category = button.dataset.filter;
    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      card.hidden = !(category === "all" || card.dataset.category === category);
    });
  });
});

courseSelects.forEach((select) => {
  const session = select.dataset.sessionCourse;
  sessionCourses[session].forEach((course) => {
    const option = document.createElement("option");
    option.value = course;
    option.textContent = course;
    select.append(option);
  });
});

function selectedSessions() {
  return [...sessionToggles].filter((toggle) => toggle.checked);
}

function formatFee(amount) {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

const GST_RATE = 0.18;

function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const HOSTEL_FEES = { none: 0, hostel_only: 1400, hostel_food: 3000 };
let registrationDeadline = null;

function getHostelFee() {
  const checked = document.querySelector('input[name="hostel"]:checked');
  return HOSTEL_FEES[checked?.value] || 0;
}

function updateRegistrationState() {
  const selected = selectedSessions();
  const sessionFee = feeBySessionCount[selected.length] ?? 0;
  const hostelFee = getHostelFee();
  const baseFee = sessionFee + hostelFee;
  const gst = Math.round(baseFee * GST_RATE);
  const total = baseFee + gst;

  feeTotals.forEach((el) => { el.textContent = formatFee(total); });

  document.querySelectorAll("[data-fee-base]").forEach((el) => { el.textContent = formatFee(baseFee); });
  document.querySelectorAll("[data-gst-detail]").forEach((el) => {
    if (!baseFee) { el.innerHTML = ""; return; }
    const parts = [];
    if (hostelFee) parts.push(`<div class="fee-line"><span>Hostel</span><strong>${formatFee(hostelFee)}</strong></div>`);
    parts.push(`<div class="fee-line"><span>GST 18%</span><strong>${formatFee(gst)}</strong></div>`);
    el.innerHTML = parts.join("");
  });
  document.querySelectorAll("[data-gst-line]").forEach((el) => {
    el.textContent = baseFee ? `Includes 18% GST: ${formatFee(gst)}` : "";
  });

  if (feeNote) {
    feeNote.textContent = selected.length
      ? `${selected.length} session${selected.length > 1 ? "s" : ""} selected.`
      : "Select at least one session to calculate fee.";
  }

  sessionToggles.forEach((toggle) => {
    const select = document.querySelector(`[data-session-course="${toggle.value}"]`);
    if (!select) return;

    select.disabled = !toggle.checked;
    select.required = toggle.checked;
    if (!toggle.checked) {
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
    const selected = selectedSessions();
    if (selected.length === 0) return false;
    return selected.every((toggle) => {
      const sel = document.querySelector(`[data-session-course="${toggle.value}"]`);
      return sel && sel.value.trim() !== "";
    });
  }

  if (blockIndex === 3) {
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
  sessionToggles.forEach((toggle) => {
    const card = toggle.closest(".selection-card");
    const sel = document.querySelector(`[data-session-course="${toggle.value}"]`);
    if (!card || !sel) return;

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
    heroGalleryIndex = (heroGalleryIndex + 1) % currentCards.length;
    currentCards[heroGalleryIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
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
  heroGalleryIndex = 0;
  if (heroGalleryRoot) heroGalleryRoot.scrollLeft = 0;
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

  const progDatesEl = document.querySelector('[data-cfg="program-dates"]');
  const progDatesStr = progDatesEl ? progDatesEl.textContent : "";

  const rows = [
    ["Student", `<strong>${esc(data.student_name || "")}</strong> (${esc(data.class_level || "")})`],
    ["Guardian", esc(data.guardian_name || "")],
    ["Courses", (data.courses || []).map(c => esc(c)).join(", ")],
    ["Hostel", esc(HOSTEL_LABELS[data.hostel_option] || "No hostel")],
  ];
  if (progDatesStr) rows.push(["Program Dates", esc(progDatesStr)]);
  rows.push(["Daily Timings", "9:00 AM — 5:00 PM"]);
  rows.push(["Venue", "LPU Campus, Phagwara, Punjab"]);
  rows.push(["Session Fee", formatFee(data.session_fee || 0)]);
  if ((data.hostel_amount || 0) > 0) rows.push(["Hostel Fee", formatFee(data.hostel_amount)]);
  rows.push(["GST (18%)", formatFee(data.gst_amount || 0)]);

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
  splitText += ` + GST 18%: ${formatFee(data.gst_amount)}`;
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

  // Block submission if deadline has passed
  if (registrationDeadline && new Date() > registrationDeadline) {
    statusMessage.textContent = "Registration is closed. The deadline has passed.";
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

  submitButton.disabled = true;
  submitButton.textContent = "Creating registration...";
  statusMessage.classList.remove("error");
  statusMessage.textContent = "";

  const registrationData = {
    student_name: formData.get("studentName"),
    class_level: formData.get("classLevel"),
    school_name: formData.get("schoolName"),
    city: formData.get("city"),
    guardian_name: formData.get("guardianName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    emergency_phone: formData.get("emergencyPhone"),
    session1_course: formData.get("session1Course") || null,
    session2_course: formData.get("session2Course") || null,
    session3_course: formData.get("session3Course") || null,
    hostel_option: hostelOption,
    medical_note: formData.get("medicalNote") || null
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create registration");
    }

    const result = await res.json();
    showPaymentSection({
      ...result,
      student_name: registrationData.student_name,
      class_level: registrationData.class_level,
      guardian_name: registrationData.guardian_name,
      hostel_option: hostelOption
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
