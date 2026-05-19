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
  }
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
    if (trackGrid) {
      trackGrid.innerHTML = coursesData
        .filter((c) => c.image_url)
        .map((c) => `<article class="track-card" data-category="${esc(c.category)}"><img src="${esc(c.image_url)}" alt="${esc(c.name)}"><div><span>${esc(c.class_range || "Classes 6-12")}</span><h3>${esc(c.name)}</h3><p>${esc(c.description || "")}</p></div></article>`)
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

  const r = data.receipt || {};
  const rows = [
    ["Student", `<strong>${esc(r.student_name || "")}</strong> (${esc(r.class_level || "")})`],
    ["Guardian", esc(r.guardian_name || "")],
    ["Courses", (r.courses || []).map(c => esc(c)).join(", ")],
    ["Hostel", esc(r.hostel_label || HOSTEL_LABELS[data.hostel_option] || "No hostel")],
    ["Session Fee", formatFee(r.session_fee || 0)],
  ];
  if ((r.hostel_amount || 0) > 0) rows.push(["Hostel Fee", formatFee(r.hostel_amount)]);
  rows.push(["GST (18%)", formatFee(r.gst_amount || 0)]);

  const infoRows = [
    ["Payment ID", `<code>${esc(data.razorpay_payment_id || "")}</code>`],
    ["Order ID", `<code>${esc(data.razorpay_order_id || "")}</code>`],
    ["Registration ID", `<code>${esc(data.registration_id || "")}</code>`],
    ["Date", r.timestamp || new Date().toLocaleString("en-IN")],
  ];

  table.innerHTML =
    rows.map(([l, v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("") +
    `<tr class="receipt-total"><td>Total Paid</td><td>${formatFee(r.total_amount || 0)}</td></tr>` +
    `<tr><td colspan="2" style="height:12px;border:none"></td></tr>` +
    infoRows.map(([l, v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");

  form.hidden = true;
  document.querySelector(".form-progress-wrapper")?.remove();
  receiptEl.hidden = false;
  receiptEl.scrollIntoView({ behavior: "smooth", block: "start" });
  sessionStorage.removeItem("lpu_pending_order");
}

// ── UPI flow recovery ───────────────────────────────────────────────
function savePendingOrder(orderId, registrationData) {
  try {
    sessionStorage.setItem("lpu_pending_order", JSON.stringify({
      order_id: orderId,
      registration_data: registrationData,
      timestamp: Date.now()
    }));
  } catch (_) {}
}

async function checkPendingOrder() {
  try {
    const raw = sessionStorage.getItem("lpu_pending_order");
    if (!raw) return;
    const pending = JSON.parse(raw);
    // Expire after 30 minutes
    if (Date.now() - pending.timestamp > 30 * 60 * 1000) {
      sessionStorage.removeItem("lpu_pending_order");
      return;
    }
    // Try to verify the order (idempotent — server checks if already processed)
    const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: pending.order_id,
        razorpay_payment_id: "recovery_check",
        razorpay_signature: "recovery_check",
        registration_data: pending.registration_data
      })
    });
    if (verifyRes.ok) {
      const result = await verifyRes.json();
      if (result.success && result.already_processed) {
        showReceipt({
          ...result,
          hostel_option: pending.registration_data.hostel_option
        });
      }
    }
    // If not processed, clear pending (user can re-submit)
    if (!verifyRes.ok) sessionStorage.removeItem("lpu_pending_order");
  } catch (_) {
    sessionStorage.removeItem("lpu_pending_order");
  }
}

if (form) checkPendingOrder();

// ── Form submission ─────────────────────────────────────────────────
form?.addEventListener("submit", async (event) => {
  event.preventDefault();

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
  const sessionFee = feeBySessionCount[selected.length] ?? 0;
  const hostelFee = getHostelFee();
  const hostelOption = formData.get("hostel");
  const baseFee = sessionFee + hostelFee;
  const gstAmount = Math.round(baseFee * GST_RATE);
  const totalFee = baseFee + gstAmount;

  submitButton.disabled = true;
  submitButton.textContent = "Processing...";
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
    hostel_amount: hostelFee,
    medical_note: formData.get("medicalNote") || null,
    base_amount: sessionFee,
    gst_amount: gstAmount,
    total_amount: totalFee
  };

  try {
    // Step 1: Create Razorpay order (now includes hostel)
    const orderRes = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_count: selected.length,
        student_name: registrationData.student_name,
        email: registrationData.email,
        phone: registrationData.phone,
        hostel_option: hostelOption
      })
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(err.error || "Failed to create payment order");
    }

    const order = await orderRes.json();

    // Use server-validated amounts
    registrationData.base_amount = order.base_amount;
    registrationData.gst_amount = order.gst_amount;
    registrationData.total_amount = order.total_amount;

    // Save for UPI recovery before opening Razorpay
    savePendingOrder(order.order_id, registrationData);

    // Step 2: Open Razorpay checkout
    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: "LPU Summer School 2026",
      description: `Registration (${selected.length} session${selected.length > 1 ? "s" : ""}) + 18% GST`,
      order_id: order.order_id,
      prefill: {
        name: registrationData.guardian_name,
        email: registrationData.email,
        contact: registrationData.phone
      },
      notes: {
        student_name: registrationData.student_name,
        sessions: selected.length
      },
      theme: { color: "#f3700d" },
      handler: async function (response) {
        submitButton.textContent = "Verifying payment...";
        try {
          const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registration_data: registrationData
            })
          });

          if (!verifyRes.ok) {
            const err = await verifyRes.json();
            throw new Error(err.error || "Payment verification failed");
          }

          const result = await verifyRes.json();
          showReceipt({
            ...result,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            hostel_option: hostelOption
          });
        } catch (verifyErr) {
          statusMessage.classList.add("error");
          statusMessage.textContent = `Payment received but verification failed: ${verifyErr.message}. Please contact us with Payment ID: ${response.razorpay_payment_id}`;
          submitButton.textContent = "Pay & Register";
          updateSubmitState();
        }
      },
      modal: {
        ondismiss: function () {
          submitButton.textContent = "Pay & Register";
          updateSubmitState();
          statusMessage.textContent = "Payment cancelled. You can try again.";
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (response) {
      submitButton.textContent = "Pay & Register";
      updateSubmitState();
      statusMessage.classList.add("error");
      statusMessage.textContent = `Payment failed: ${response.error.description}. Please try again.`;
      sessionStorage.removeItem("lpu_pending_order");
    });
    rzp.open();
  } catch (error) {
    statusMessage.classList.add("error");
    statusMessage.textContent = `Something went wrong: ${error.message}. Please try again.`;
    submitButton.textContent = "Pay & Register";
    updateSubmitState();
    sessionStorage.removeItem("lpu_pending_order");
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
