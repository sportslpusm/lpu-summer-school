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
  const phone1 = cfg["contact phone 1"] || "";
  const phone2 = cfg["contact phone 2"] || "";
  const email = cfg["contact email"] || "";
  const pm1 = cfg["project manager 1"] || "";
  const pm2 = cfg["project manager 2"] || "";
  const eventName = cfg["event name"] || "";
  const uniName = cfg["university name"] || "";
  const address = cfg["address"] || "";
  const deadline = cfg["registration deadline"] || "";

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

function updateRegistrationState() {
  const selected = selectedSessions();
  const baseFee = feeBySessionCount[selected.length] ?? 0;
  const gst = Math.round(baseFee * GST_RATE);
  const total = baseFee + gst;

  feeTotals.forEach((el) => { el.textContent = formatFee(total); });

  document.querySelectorAll("[data-fee-base]").forEach((el) => { el.textContent = formatFee(baseFee); });
  document.querySelectorAll("[data-gst-detail]").forEach((el) => {
    el.textContent = baseFee ? `+ GST 18%: ${formatFee(gst)}` : "";
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

updateRegistrationState();

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
  const baseline = Math.round(34 - progress * 10);
  const pulse = Math.floor((Date.now() / 45000) % 3);
  const remaining = Math.max(18, baseline - pulse);

  seatsLeftItems.forEach((item) => {
    item.textContent = String(remaining);
  });
  seatsNotes.forEach((note) => {
    note.textContent = remaining <= 20
      ? "Final seats moving fast. Registration is recommended today."
      : "Limited batch size for better mentoring.";
  });
}

updateSeatsLeft();
if (seatsLeftItems.length) {
  setInterval(updateSeatsLeft, 15000);
}

let galleryImages = [
  { src: "https://static.wixstatic.com/media/ccbabc_5fba4c052e4a4ebe89a4756ed43488b4~mv2.png", alt: "Sports activity at LPU Summer School" },
  { src: "https://static.wixstatic.com/media/ccbabc_273ed44bcc2c4ebfb90688491c10349a~mv2.png", alt: "Artificial intelligence workshop" },
  { src: "https://static.wixstatic.com/media/ccbabc_c16d7be2eaca45aaa00b639715071b55~mv2.png", alt: "Theatre and acting workshop" },
  { src: "https://static.wixstatic.com/media/ccbabc_11bb09d6c2164a4185e0d3f012ab3423~mv2.png", alt: "Robotics and drones workshop" },
  { src: "https://static.wixstatic.com/media/ccbabc_49e677a164c84c6295873d8bc2ea33f9~mv2.png", alt: "Dance workshop" },
  { src: "https://static.wixstatic.com/media/ccbabc_620eb550d859431aa501391fa6557a1e~mv2.png", alt: "Music studio" }
];

// Load gallery from DB
(async function loadGalleryImages() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/gallery_images?is_active=eq.true&order=sort_order.asc`, { headers: { "apikey": SUPABASE_KEY } });
    if (res.ok) {
      const data = await res.json();
      if (data.length) {
        galleryImages = data.map((img) => ({ src: img.image_url, alt: img.alt_text }));
      }
    }
  } catch (e) { /* fallback to hardcoded */ }
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

let galleryIndex = 0;
function rotateHeroGallery() {
  if (!galleryMain || !gallerySideA || !gallerySideB) return;
  galleryIndex = (galleryIndex + 1) % galleryImages.length;

  swapGalleryImage(galleryMain, galleryImages[galleryIndex]);
  swapGalleryImage(gallerySideA, galleryImages[(galleryIndex + 1) % galleryImages.length]);
  swapGalleryImage(gallerySideB, galleryImages[(galleryIndex + 2) % galleryImages.length]);
}

if (galleryMain) {
  setInterval(rotateHeroGallery, 4200);
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const selected = selectedSessions();
  if (sessionToggles.length && selected.length === 0) {
    statusMessage.textContent = "Please select at least one session and one class.";
    statusMessage.classList.add("error");
    return;
  }

  const formData = new FormData(form);
  const baseFee = feeBySessionCount[selected.length] ?? 0;
  const gstAmount = Math.round(baseFee * GST_RATE);
  const totalFee = baseFee + gstAmount;
  const submitButton = form.querySelector('button[type="submit"]');

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
    medical_note: formData.get("medicalNote") || null,
    base_amount: baseFee,
    gst_amount: gstAmount,
    total_amount: totalFee
  };

  try {
    // Step 1: Create Razorpay order
    const orderRes = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_count: selected.length,
        student_name: registrationData.student_name,
        email: registrationData.email,
        phone: registrationData.phone
      })
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      throw new Error(err.error || "Failed to create payment order");
    }

    const order = await orderRes.json();

    // Use server-validated amounts (not client-calculated)
    registrationData.base_amount = order.base_amount;
    registrationData.gst_amount = order.gst_amount;
    registrationData.total_amount = order.total_amount;

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
        // Step 3: Verify payment and save registration
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

          statusMessage.classList.remove("error");
          statusMessage.textContent = `Payment successful! Registration confirmed for ${registrationData.student_name}. Payment ID: ${response.razorpay_payment_id}. A confirmation email has been sent.`;
          form.reset();
          updateRegistrationState();
        } catch (verifyErr) {
          statusMessage.classList.add("error");
          statusMessage.textContent = `Payment received but verification failed: ${verifyErr.message}. Please contact us with Payment ID: ${response.razorpay_payment_id}`;
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = "Pay & Register";
        }
      },
      modal: {
        ondismiss: function () {
          submitButton.disabled = false;
          submitButton.textContent = "Pay & Register";
          statusMessage.textContent = "Payment cancelled. You can try again.";
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (response) {
      submitButton.disabled = false;
      submitButton.textContent = "Pay & Register";
      statusMessage.classList.add("error");
      statusMessage.textContent = `Payment failed: ${response.error.description}. Please try again.`;
    });
    rzp.open();
  } catch (error) {
    statusMessage.classList.add("error");
    statusMessage.textContent = `Something went wrong: ${error.message}. Please try again.`;
    submitButton.disabled = false;
    submitButton.textContent = "Pay & Register";
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

// Form progress steps
const progressSteps = document.querySelectorAll(".progress-step");
const formBlocks = document.querySelectorAll(".form-block");

if (progressSteps.length && formBlocks.length && "IntersectionObserver" in window) {
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = [...formBlocks].indexOf(entry.target);
      if (index === -1) return;

      progressSteps.forEach((step, i) => {
        step.classList.remove("active", "done");
        if (i < index) step.classList.add("done");
        if (i === index) step.classList.add("active");
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
