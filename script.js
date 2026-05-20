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
    const deadline = new Date(countdown.dataset.deadline);
    const now = new Date();
    const difference = Math.max(0, deadline - now);
    const totalMinutes = Math.floor(difference / 60000);
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    countdown.querySelector("[data-days]").textContent = String(days).padStart(2, "0");
    countdown.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
    countdown.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
    countdown.querySelector("[data-seconds]").textContent = String(seconds).padStart(2, "0");
  });
}

updateCountdown();
if (countdowns.length) {
  setInterval(updateCountdown, 1000);
}

function updateSeatsLeft() {
  if (!seatsLeftItems.length) return;

  const cdEl = document.querySelector("[data-countdown]");
  const deadline = new Date(cdEl ? cdEl.dataset.deadline : "2026-06-10T23:59:59+05:30");
  const start = new Date("2026-05-02T00:00:00+05:30");
  const now = new Date();
  const totalWindow = deadline - start;
  const elapsed = Math.max(0, Math.min(totalWindow, now - start));
  const progress = totalWindow > 0 ? elapsed / totalWindow : 1;
  const baseline = Math.round(24 - progress * 12);
  const pulse = Math.floor((Date.now() / 18000) % 4);
  const remaining = Math.max(6, baseline - pulse);

  seatsLeftItems.forEach((item) => {
    item.textContent = String(remaining);
    item.style.color = remaining <= 10 ? "#d32f2f" : "";
  });
  seatsNotes.forEach((note) => {
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
let galleryInterval = null;
let galleryIndex = 0;
let gallerySwapping = false;

// Load gallery exclusively from DB — no hardcoded fallback
(async function loadGalleryImages() {
  if (!galleryMain) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/gallery_images?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } });
    if (res.ok) {
      const data = await res.json();
      if (data.length) {
        galleryImages = data.map((img) => ({ src: img.image_url, alt: img.alt_text }));
      }
    }
  } catch (e) { /* no images to rotate */ }

  // Set initial images from DB (replace whatever HTML has)
  if (galleryImages.length >= 1) {
    galleryMain.src = galleryImages[0].src;
    galleryMain.alt = galleryImages[0].alt;
  }
  if (galleryImages.length >= 2 && gallerySideA) {
    gallerySideA.src = galleryImages[1].src;
    gallerySideA.alt = galleryImages[1].alt;
  }
  if (galleryImages.length >= 3 && gallerySideB) {
    gallerySideB.src = galleryImages[2].src;
    gallerySideB.alt = galleryImages[2].alt;
  }

  // Only start rotation if we have more images than visible slots
  if (galleryImages.length > 3) {
    galleryIndex = 0;
    galleryInterval = setInterval(rotateHeroGallery, 4200);
  }
})();

function swapGalleryImage(image, imageData) {
  if (!image) return;
  const frame = image.closest(".hero-image");
  frame?.classList.add("is-changing");
  setTimeout(() => {
    image.src = imageData.src;
    image.alt = imageData.alt;
    frame?.classList.remove("is-changing");
  }, 260);
}

function rotateHeroGallery() {
  if (!galleryMain || !gallerySideA || !gallerySideB) return;
  if (gallerySwapping) return;
  gallerySwapping = true;

  galleryIndex = (galleryIndex + 1) % galleryImages.length;

  // Pick 3 unique indices (guaranteed since length > 3)
  const i0 = galleryIndex;
  const i1 = (galleryIndex + 1) % galleryImages.length;
  const i2 = (galleryIndex + 2) % galleryImages.length;

  swapGalleryImage(galleryMain, galleryImages[i0]);
  swapGalleryImage(gallerySideA, galleryImages[i1]);
  swapGalleryImage(gallerySideB, galleryImages[i2]);

  // Unlock after transition completes (260ms fade-out + 420ms fade-in)
  setTimeout(() => { gallerySwapping = false; }, 700);
}

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
  document.body.style.overflow = "";
  form.hidden = true;
  document.querySelector(".form-progress-wrapper")?.remove();
  receiptEl.hidden = false;
  receiptEl.scrollIntoView({ behavior: "smooth", block: "start" });
  sessionStorage.removeItem("lpu_pending_reg");
}

// ── UPI Payment Section ────────────────────────────────────────────
let pendingRegistration = null;

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

  // Copy UPI button
  const copyBtn = section.querySelector("[data-copy-upi]");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(data.upi_id).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = data.upi_id;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
    });
  });

  // Screenshot upload
  const fileInput = section.querySelector("[data-screenshot-input]");
  const uploadArea = section.querySelector("[data-upload-area]");
  const previewWrap = section.querySelector("[data-upload-preview]");
  const previewImg = section.querySelector("[data-preview-img]");
  const removeBtn = section.querySelector("[data-remove-upload]");
  const submitScreenshotBtn = section.querySelector("[data-submit-screenshot]");
  const uploadStatus = section.querySelector("[data-upload-status]");

  let selectedFile = null;

  // Explicit click handler — ensures file picker opens on all mobile browsers
  uploadArea.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });

  function compressImage(file, maxDim, quality) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      uploadStatus.textContent = "File too large. Please select a smaller image.";
      uploadStatus.classList.add("error");
      return;
    }

    uploadStatus.textContent = "";
    uploadStatus.classList.remove("error");

    // Compress before preview
    const compressed = await compressImage(file, 1200, 0.8);
    selectedFile = new File([compressed], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
    previewImg.src = URL.createObjectURL(compressed);
    uploadArea.hidden = true;
    previewWrap.hidden = false;
    submitScreenshotBtn.disabled = false;
  });

  removeBtn.addEventListener("click", () => {
    selectedFile = null;
    fileInput.value = "";
    uploadArea.hidden = false;
    previewWrap.hidden = true;
    submitScreenshotBtn.disabled = true;
  });

  submitScreenshotBtn.addEventListener("click", async () => {
    if (!selectedFile || !pendingRegistration) return;

    submitScreenshotBtn.disabled = true;
    submitScreenshotBtn.textContent = "Uploading...";
    uploadStatus.textContent = "";
    uploadStatus.classList.remove("error");

    try {
      const fd = new FormData();
      fd.append("registration_id", pendingRegistration.registration_id);
      fd.append("payment_reference", pendingRegistration.payment_reference);
      fd.append("screenshot", selectedFile);

      const res = await fetch(`${SUPABASE_URL}/functions/v1/upload-screenshot`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      // Show receipt/confirmation
      showReceipt({
        ...pendingRegistration,
        hostel_option: pendingRegistration.hostel_option || "none"
      });
    } catch (err) {
      uploadStatus.textContent = err.message;
      uploadStatus.classList.add("error");
      submitScreenshotBtn.disabled = false;
      submitScreenshotBtn.textContent = "Submit Registration";
    }
  });

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
