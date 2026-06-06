const SUPABASE_URL = "https://bynpuhoysivxxlblxica.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bnB1aG95c2l2eHhsYmx4aWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTE1NjAsImV4cCI6MjA5NDQ4NzU2MH0.JltZJYggs2ycs3u0HUelRMivZgsByW_g5-n3qz6EaPk";

let accessToken = null;
let sessions = [];
let programs = [];
let allCourses = [];
let allFees = [];
let allRegistrations = [];
let allGalleryImages = [];
let registrationRows = [];
let registrationPage = 1;
const REG_PAGE_SIZE = 50;

const FEE_MODE_LABELS = {
  session_count: "Per selected session",
  package: "Fixed program price",
  custom: "Custom price",
  to_be_announced: "Fee not announced"
};

const FEE_STATUS_LABELS = {
  ready: "Fee announced",
  to_be_announced: "Fee not announced"
};

const SCHEDULE_TYPE_LABELS = {
  selectable: "Parent selects sessions/classes",
  fixed: "Fixed schedule, no parent selection"
};

const DATE_DISPLAY_MODE_LABELS = {
  date_range: "Date range",
  self_paced: "Self-paced",
  to_be_announced: "To be announced"
};

const ACCOMMODATION_MODE_LABELS = {
  none: "No accommodation or meals",
  optional: "Optional add-ons",
  included: "Included in program fee"
};

const HERO_BACKGROUND_SETTINGS = [
  { key: "hero_bg_campus", label: "Hero background - 2 Week Campus Program", description: "Desktop/tablet background image for the 2 Week Campus Program hero tab. Mobile hides this background." },
  { key: "hero_bg_online", label: "Hero background - Online Course", description: "Desktop/tablet background image for the Online Course hero tab. Mobile hides this background." },
  { key: "hero_bg_staff_camp", label: "Hero background - LPU Staff Kid Summer Camp", description: "Desktop/tablet background image for the Staff Kid Summer Camp hero tab. Mobile hides this background." },
  { key: "hero_bg_skills", label: "Hero background - Tailor-Made Skills Workshop", description: "Desktop/tablet background image for the Tailor-Made Skills Workshop hero tab. Mobile hides this background." },
  { key: "hero_bg_immersion", label: "Hero background - LPU Immersion Program", description: "Desktop/tablet background image for the LPU Immersion Program hero tab. Mobile hides this background." }
];

// --- Auth ---
async function login(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error_description || err.msg || "Login failed");
  }
  return res.json();
}

async function resetPassword(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Failed to send reset email");
  }
}

async function updatePassword(newPassword) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${accessToken}` },
    body: JSON.stringify({ password: newPassword })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || "Failed to update password");
  }
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${accessToken}`
  };
}

// --- Payment screenshot signed URLs (payment-screenshots bucket is private) ---
function screenshotObjectPath(url) {
  const marker = "/payment-screenshots/";
  const i = String(url || "").indexOf(marker);
  return i === -1 ? "" : url.slice(i + marker.length);
}

async function signPaymentScreenshot(path) {
  if (!path) return "";
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/payment-screenshots/${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ expiresIn: 3600 })
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data?.signedURL ? `${SUPABASE_URL}/storage/v1${data.signedURL}` : "";
  } catch {
    return "";
  }
}

// Resolve every [data-screenshot-path] anchor into a time-limited signed URL.
async function hydrateScreenshotThumbs(root) {
  const scope = root || document;
  const nodes = Array.from(scope.querySelectorAll("a[data-screenshot-path]"));
  await Promise.all(nodes.map(async (link) => {
    const path = link.getAttribute("data-screenshot-path");
    link.removeAttribute("data-screenshot-path");
    const signed = await signPaymentScreenshot(path);
    if (!signed) return;
    link.href = signed;
    const img = link.querySelector("img");
    if (img) img.src = signed;
  }));
}

// --- API helpers ---
async function api(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: authHeaders(),
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function apiGet(table, query = "") {
  return api(`${table}?${query}`, { method: "GET", headers: { ...authHeaders(), "Prefer": "return=representation" } });
}

async function apiInsert(table, data) {
  return api(table, {
    method: "POST",
    headers: { ...authHeaders(), "Prefer": "return=representation" },
    body: JSON.stringify(data)
  });
}

async function apiUpdate(table, id, data) {
  return api(`${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Prefer": "return=representation" },
    body: JSON.stringify(data)
  });
}

async function apiDelete(table, id) {
  return api(`${table}?id=eq.${id}`, { method: "DELETE" });
}

function programName(programId) {
  return programs.find((p) => p.id === programId)?.name || "2 Week Campus Program";
}

function programOptions(selectedId = "") {
  return programs.map((program) => `<option value="${program.id}" ${program.id === selectedId ? "selected" : ""}>${esc(program.name)}</option>`).join("");
}

function courseMinAgeLabel(course = {}) {
  const age = Number.parseInt(course.min_age, 10);
  if (Number.isFinite(age) && age > 0) return `Age ${age}+`;
  const fallback = inferredCourseMinAge(course);
  return fallback > 0 ? `Age ${fallback}+` : "All ages";
}

function coursesSupportMinAge() {
  return allCourses.some((course) => Object.prototype.hasOwnProperty.call(course, "min_age"));
}

function inferredCourseMinAge(course = {}) {
  const age = Number.parseInt(course.min_age, 10);
  if (Number.isFinite(age) && age >= 0) return age;
  if (String(course.programs?.name || "").toLowerCase().includes("staff kid")) return 5;
  const range = String(course.class_range || "").toLowerCase();
  const ageMatch = range.match(/age\s*(\d+)/);
  if (ageMatch) return Number.parseInt(ageMatch[1], 10);
  const classMatch = range.match(/classes?\s*(\d+)/);
  if (!classMatch) return 12;
  const minClass = Number.parseInt(classMatch[1], 10);
  if (minClass >= 10) return 15;
  if (minClass >= 8) return 14;
  return 12;
}

function formatDateHuman(value, options = {}) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    ...(options.omitYear ? {} : { year: "numeric" })
  });
}

function formatDateRangeLabel(startDate, endDate) {
  if (!startDate && !endDate) return "Date to be decided";
  if (startDate && !endDate) return `From ${formatDateHuman(startDate)}`;
  if (!startDate && endDate) return `Until ${formatDateHuman(endDate)}`;

  const start = new Date(`${startDate}T00:00:00+05:30`);
  const end = new Date(`${endDate}T00:00:00+05:30`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Date to be decided";

  const sameYear = start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" })
  });
  const endLabel = formatDateHuman(endDate);
  return `${startLabel} to ${endLabel}`;
}

function durationFromDates(startDate, endDate) {
  if (!startDate || !endDate) return "To be announced";
  const start = new Date(`${startDate}T00:00:00+05:30`);
  const end = new Date(`${endDate}T00:00:00+05:30`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return "To be announced";
  const days = Math.max(Math.round((end - start) / 86400000) + 1, 1);
  if (days >= 7) {
    const weeks = Math.ceil(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  }
  return `${days} day${days > 1 ? "s" : ""}`;
}

function programDateDisplayMode(program = {}) {
  const mode = program.date_display_mode;
  if (Object.prototype.hasOwnProperty.call(DATE_DISPLAY_MODE_LABELS, mode)) return mode;
  const label = String(program.dates_label || "").toLowerCase();
  if (label.includes("self-paced") || label.includes("self paced")) return "self_paced";
  if (program.start_date || program.end_date) return "date_range";
  return "to_be_announced";
}

function dateDisplayModeLabel(value) {
  return DATE_DISPLAY_MODE_LABELS[value] || DATE_DISPLAY_MODE_LABELS.date_range;
}

function formatProgramDateLabel(program = {}) {
  const mode = programDateDisplayMode(program);
  if (mode === "self_paced") return "Self-paced";
  if (mode === "to_be_announced") return "Date to be announced";
  return formatDateRangeLabel(program.start_date, program.end_date);
}

function programDurationLabel(program = {}) {
  const mode = programDateDisplayMode(program);
  if (mode === "self_paced") return "Self-paced";
  if (mode === "to_be_announced") return "To be announced";
  return durationFromDates(program.start_date, program.end_date);
}

function programHasAnnouncedTiming(program = {}) {
  const mode = programDateDisplayMode(program);
  if (mode === "self_paced") return true;
  if (mode === "to_be_announced") return false;
  return Boolean(program.start_date && program.end_date);
}

function toPercentInput(rate) {
  const numeric = Number(rate ?? 0.18);
  const percent = numeric <= 1 ? numeric * 100 : numeric;
  return Number.isInteger(percent) ? String(percent) : String(Number(percent.toFixed(2)));
}

function fromPercentInput(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return numeric > 1 ? Number((numeric / 100).toFixed(4)) : numeric;
}

function feeModeLabel(value) {
  return FEE_MODE_LABELS[value] || value || "Not configured";
}

function feeStatusLabel(value) {
  return FEE_STATUS_LABELS[value] || value || "Not configured";
}

function scheduleTypeLabel(value) {
  return SCHEDULE_TYPE_LABELS[value] || SCHEDULE_TYPE_LABELS.selectable;
}

function accommodationModeLabel(value) {
  return ACCOMMODATION_MODE_LABELS[value] || ACCOMMODATION_MODE_LABELS.none;
}

function programScheduleType(program = {}) {
  return program.schedule_type || (program.slug === "staff-camp" ? "fixed" : "selectable");
}

function programAccommodationMode(program = {}) {
  return program.accommodation_mode || (program.allow_hostel ? "optional" : "none");
}

function activeSessionsForProgram(programId) {
  return sessions.filter((session) => session.program_id === programId && session.is_active !== false);
}

function activeCoursesForProgram(programId) {
  return allCourses.filter((course) => course.program_id === programId && course.is_active !== false);
}

function feeTiersForProgram(programId) {
  return allFees.filter((fee) => fee.program_id === programId);
}

function activeRegistrationsForProgram(programId) {
  return allRegistrations.filter((reg) => {
    if (reg.program_id !== programId) return false;
    if (["cancelled", "rejected"].includes(reg.status)) return false;
    if (reg.payment_status === "failed") return false;
    return true;
  });
}

function programSetupState(program) {
  const issues = [];
  const sessionCount = activeSessionsForProgram(program.id).length;
  const courseCount = activeCoursesForProgram(program.id).length;
  const tiers = feeTiersForProgram(program.id);
  const capacity = Number(program.seats_base || 0);

  if (!programHasAnnouncedTiming(program)) issues.push("schedule timing missing");
  if (!sessionCount) issues.push("sessions missing");
  if (!courseCount) issues.push("courses missing");
  if (program.fee_status !== "ready" || program.fee_mode === "to_be_announced") {
    issues.push("fee not announced");
  } else if (program.fee_mode === "session_count" && !tiers.some((tier) => Number(tier.session_count) > 0 && Number(tier.fee_amount) > 0)) {
    issues.push("fee tiers missing");
  } else if (program.fee_mode !== "session_count" && Number(program.base_fee || 0) <= 0) {
    issues.push("base fee missing");
  }
  if (programAccommodationMode(program) === "optional" && !program.allow_hostel && !program.allow_mess) {
    issues.push("optional add-ons selected but no hostel/mess add-on enabled");
  }
  if (program.registration_enabled && issues.length) issues.push("registration marked open before setup is ready");

  return {
    ready: program.is_active !== false && program.registration_enabled && issues.length === 0,
    displayReady: program.is_active !== false && courseCount > 0,
    issues,
    capacity,
    reserved: activeRegistrationsForProgram(program.id).length,
    seatsLeft: capacity > 0 ? Math.max(capacity - activeRegistrationsForProgram(program.id).length, 0) : null
  };
}

function updateProgramFilters() {
  const filters = [
    ["#regProgramFilter", "All Programs"],
    ["#courseProgramFilter", "All Programs"],
    ["#sessionProgramFilter", "All Programs"],
    ["#feeProgramFilter", "All Programs"]
  ];
  filters.forEach(([selector, label]) => {
    const el = $(selector);
    if (!el) return;
    const current = el.value || "all";
    el.innerHTML = `<option value="all">${label}</option>` + programs.map((program) => `<option value="${program.id}">${esc(program.name)}</option>`).join("");
    el.value = [...el.options].some((option) => option.value === current) ? current : "all";
  });
}

// --- Image Upload ---
async function uploadImage(file) {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${fileName}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": file.type
    },
    body: file
  });
  if (!res.ok) throw new Error("Upload failed");
  return `${SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;
}

// --- Email ---
async function sendEmail(to, subject, html) {
  if (!to) throw new Error("No email address is saved for this registration.");
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "apikey": SUPABASE_KEY
    },
    body: JSON.stringify({ to, subject, html })
  });

  const text = await res.text().catch(() => "");
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch (_) {}

  if (!res.ok) {
    throw new Error(body.error || body.message || text || `Email failed (${res.status})`);
  }
  return body;
}

async function sendEmailSafely(to, subject, html, successMessage) {
  try {
    await sendEmail(to, subject, html);
    if (successMessage) showToast(successMessage, "success");
    return true;
  } catch (err) {
    console.warn("Email send failed:", err?.message || err);
    showToast(`Registration was updated, but email failed: ${err.message || "Unknown email error"}`, "error");
    return false;
  }
}

function registrationConfirmationEmail(reg) {
  const courses = registrationCourseList(reg);
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#f3700d;color:white;padding:20px;border-radius:10px 10px 0 0;text-align:center">
        <h1 style="margin:0;font-size:22px">Registration Confirmed!</h1>
        <p style="margin:6px 0 0;opacity:0.9">LPU Summer School</p>
      </div>
      <div style="background:white;padding:24px;border:1px solid #e4e7ec;border-top:none;border-radius:0 0 10px 10px">
        <p>Dear <strong>${esc(reg.guardian_name)}</strong>,</p>
        <p>We are delighted to confirm <strong>${esc(reg.student_name)}</strong>'s registration for LPU Summer School.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Student</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${esc(reg.student_name)}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Program</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(reg.program_name || "LPU Summer School")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Class</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(reg.class_level)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Courses</td><td style="padding:8px;border-bottom:1px solid #eee">${courses.map(c => esc(c)).join(", ")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Total Fee</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>Rs. ${reg.total_fee}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Status</td><td style="padding:8px"><span style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:99px;font-weight:700;font-size:13px">Confirmed</span></td></tr>
        </table>
        <div style="background:#f7f8fb;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0 0 6px;font-weight:700;color:#111827">Program Schedule</p>
          <p style="margin:0;font-size:14px;color:#667085">Dates: <strong style="color:#111827">${esc(reg.program_snapshot?.dates_label || "As per selected program")}</strong></p>
          <p style="margin:4px 0 0;font-size:14px;color:#667085">Mode: <strong style="color:#111827">${esc(reg.program_snapshot?.mode || "As per selected program")}</strong></p>
          <p style="margin:4px 0 0;font-size:14px;color:#667085">Venue: <strong style="color:#111827">${esc(reg.program_snapshot?.location || "LPU Campus, Phagwara, Punjab")}</strong></p>
        </div>
        <p>Our team will contact you shortly with further details regarding campus logistics.</p>
        <p style="color:#667085;font-size:13px;margin-top:24px">For queries: summerschool@lpu.co.in | +91 860 723 4098</p>
      </div>
    </div>
  `;
}

function registrationRejectedEmail(reg, note = "") {
  const courses = registrationCourseList(reg);
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:#111827;color:white;padding:20px;border-radius:10px 10px 0 0;text-align:center">
        <h1 style="margin:0;font-size:22px">Payment Could Not Be Verified</h1>
        <p style="margin:6px 0 0;opacity:0.9">LPU Summer School</p>
      </div>
      <div style="background:white;padding:24px;border:1px solid #e4e7ec;border-top:none;border-radius:0 0 10px 10px">
        <p>Dear <strong>${esc(reg.guardian_name || "Parent/Guardian")}</strong>,</p>
        <p>We reviewed the payment proof for <strong>${esc(reg.student_name || "the student")}</strong>, but we could not verify it at this time.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Student</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${esc(reg.student_name)}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Program</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(reg.program_name || "LPU Summer School")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Courses</td><td style="padding:8px;border-bottom:1px solid #eee">${courses.map(c => esc(c)).join(", ") || "As per selected program"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Payment Ref</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(reg.payment_reference || "N/A")}</td></tr>
          ${note ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Reason</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(note)}</td></tr>` : ""}
        </table>
        <p>Please contact the LPU Summer School team if you have already made the payment or need help uploading the correct screenshot.</p>
        <p style="color:#667085;font-size:13px;margin-top:24px">For queries: summerschool@lpu.co.in | +91 860 723 4098</p>
      </div>
    </div>
  `;
}

// --- UI State ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showToast(message, type = "success") {
  const region = $("#toastRegion");
  if (!region) {
    alert(message);
    return;
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  region.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 220);
  }, 4200);
}

async function runAdminAction(action, successMessage, button) {
  const previousText = button?.textContent;
  try {
    if (button) {
      button.disabled = true;
      button.textContent = "Working...";
    }
    await action();
    if (successMessage) showToast(successMessage, "success");
  } catch (err) {
    showToast(err.message || "Something went wrong.", "error");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = previousText;
    }
  }
}

function setActiveTab(tabName) {
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  $$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${tabName}`));
}

// --- Login ---
$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#loginEmail").value;
  const password = $("#loginPassword").value;
  $("#loginError").textContent = "";

  try {
    const data = await login(email, password);
    accessToken = data.access_token;
    localStorage.setItem("sb_token", accessToken);
    localStorage.setItem("sb_email", email);
    localStorage.setItem("sb_login_time", String(Date.now()));
    showDashboard(email);
    startSessionTimer();
  } catch (err) {
    $("#loginError").textContent = err.message;
  }
});

// --- Forgot Password ---
$("#forgotPassBtn").addEventListener("click", async () => {
  const email = $("#loginEmail").value;
  if (!email) {
    $("#loginError").textContent = "Enter your admin email first, then click Forgot Password.";
    return;
  }
  try {
    await resetPassword(email);
    $("#loginError").style.color = "#087f5b";
    $("#loginError").textContent = "Password reset link sent to " + email + ". Check your inbox.";
  } catch (err) {
    $("#loginError").textContent = err.message;
  }
});

// --- Change Password (from dashboard) ---
$("#changePassBtn")?.addEventListener("click", () => {
  openModal("Change Password", `
    <label>New Password <input type="password" id="mNewPass" minlength="8" placeholder="Min 8 characters"></label>
    <label>Confirm Password <input type="password" id="mConfirmPass"></label>
  `, async () => {
    const newPass = $("#mNewPass").value;
    const confirm = $("#mConfirmPass").value;
    if (newPass.length < 8) throw new Error("Password must be at least 8 characters");
    if (newPass !== confirm) throw new Error("Passwords do not match");
    await updatePassword(newPass);
    showToast("Password updated successfully.", "success");
  });
});

// Handle password reset token from URL
(function handleResetToken() {
  const hash = window.location.hash;
  if (hash.includes("type=recovery")) {
    const params = new URLSearchParams(hash.replace("#", "?"));
    const token = params.get("access_token");
    if (token) {
      accessToken = token;
      localStorage.setItem("sb_token", token);
      localStorage.setItem("sb_email", "admin");
      window.location.hash = "";
      showDashboard("admin");
      setTimeout(() => {
        openModal("Set New Password", `
          <label>New Password <input type="password" id="mNewPass" minlength="8"></label>
          <label>Confirm Password <input type="password" id="mConfirmPass"></label>
        `, async () => {
          const newPass = $("#mNewPass").value;
          const confirm = $("#mConfirmPass").value;
          if (newPass.length < 8) throw new Error("Password must be at least 8 characters");
          if (newPass !== confirm) throw new Error("Passwords do not match");
          await updatePassword(newPass);
          showToast("Password updated. You can now log in with your new password.", "success");
        });
      }, 500);
    }
  }
})();

function showDashboard(email) {
  $("#loginScreen").hidden = true;
  $("#dashboard").hidden = false;
  $("#adminEmail").textContent = email;
  loadAll();
}

// Session timeout: 2 hours
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
let sessionTimer = null;

function startSessionTimer() {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    showToast("Session expired. Please log in again.", "error");
    $("#logoutBtn").click();
  }, SESSION_TIMEOUT);
}

// Auto-login from stored token with validation
(async function checkSession() {
  const token = localStorage.getItem("sb_token");
  const email = localStorage.getItem("sb_email");
  const loginTime = parseInt(localStorage.getItem("sb_login_time") || "0");

  if (token && email) {
    // Check if session has expired
    if (Date.now() - loginTime > SESSION_TIMEOUT) {
      localStorage.removeItem("sb_token");
      localStorage.removeItem("sb_email");
      localStorage.removeItem("sb_login_time");
      return;
    }
    // Validate token is still valid
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { "Authorization": `Bearer ${token}`, "apikey": SUPABASE_KEY }
      });
      if (res.ok) {
        accessToken = token;
        showDashboard(email);
        startSessionTimer();
      } else {
        localStorage.removeItem("sb_token");
        localStorage.removeItem("sb_email");
        localStorage.removeItem("sb_login_time");
      }
    } catch {
      localStorage.removeItem("sb_token");
      localStorage.removeItem("sb_email");
      localStorage.removeItem("sb_login_time");
    }
  }
})();

$("#logoutBtn").addEventListener("click", async () => {
  // Server-side token invalidation
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}`, "apikey": SUPABASE_KEY }
    });
  } catch {}
  clearTimeout(sessionTimer);
  localStorage.removeItem("sb_token");
  localStorage.removeItem("sb_email");
  localStorage.removeItem("sb_login_time");
  accessToken = null;
  $("#dashboard").hidden = true;
  $("#loginScreen").hidden = false;
});

// --- Tabs ---
$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.tab);
  });
});

$$("[data-switch-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.switchTab);
    if (button.dataset.paymentFilter && $("#regPaymentFilter")) {
      $("#regPaymentFilter").value = button.dataset.paymentFilter;
      registrationPage = 1;
      filterRegistrations();
    }
  });
});

$("#refreshAdminBtn")?.addEventListener("click", (event) => {
  runAdminAction(async () => {
    await loadAll();
  }, "Admin data refreshed.", event.currentTarget);
});

// --- Load All Data ---
async function loadAll() {
  try {
    await loadPrograms();
    await loadSessions();
    await Promise.all([loadRegistrations(), loadCourses(), loadFees(), loadGallery(), loadSettings()]);
    filterPrograms();
    renderDashboard();
  } catch (err) {
    if (err.message.includes("JWT") || err.message.includes("401")) {
      localStorage.removeItem("sb_token");
      localStorage.removeItem("sb_email");
      location.reload();
    } else {
      showToast(`Could not load admin data: ${err.message}`, "error");
    }
  }
}

function isToday(value) {
  if (!value) return false;
  return new Date(value).toLocaleDateString("en-CA") === new Date().toLocaleDateString("en-CA");
}

function setStat(key, value) {
  const el = document.querySelector(`[data-stat="${key}"]`);
  if (el) el.textContent = Number(value || 0).toLocaleString("en-IN");
}

function renderDashboard() {
  setStat("totalRegistrations", allRegistrations.length);
  setStat("pendingPayments", allRegistrations.filter((r) => r.payment_status === "verification_pending").length);
  setStat("verifiedPayments", allRegistrations.filter((r) => r.payment_status === "paid").length);
  setStat("registrationsToday", allRegistrations.filter((r) => isToday(r.created_at)).length);

  const attention = $("#attentionList");
  if (attention) {
    const pending = allRegistrations
      .filter((r) => r.payment_status === "verification_pending")
      .slice(0, 5);
    attention.innerHTML = pending.length
      ? pending.map((r) => `
        <button type="button" class="attention-row" onclick="viewRegistration('${r.id}')">
          <span><strong>${esc(r.student_name || "Unnamed student")}</strong><small>${esc(r.program_name || programName(r.program_id))}</small></span>
          <em>Review</em>
        </button>
      `).join("")
      : `<div class="empty-inline">No pending payment reviews right now.</div>`;
  }

  const setupList = $("#programSetupList");
  if (setupList) {
    const items = programs.map((program) => ({ program, setup: programSetupState(program) }))
      .filter(({ setup }) => !setup.ready)
      .slice(0, 5);
    setupList.innerHTML = items.length
      ? items.map(({ program, setup }) => `
        <button type="button" class="attention-row" onclick="editProgram('${program.id}')">
          <span><strong>${esc(program.name)}</strong><small>${esc(setup.issues.slice(0, 2).join(", ") || "Needs review")}</small></span>
          <em>Fix</em>
        </button>
      `).join("")
      : `<div class="empty-inline">All active programs look ready.</div>`;
  }
}

// --- PROGRAMS ---
async function loadPrograms() {
  programs = await apiGet("programs", "order=sort_order.asc");
  updateProgramFilters();
  filterPrograms();
}

function filterPrograms() {
  const q = ($("#programSearch")?.value || "").toLowerCase().trim();
  const readiness = $("#programReadinessFilter")?.value || "all";
  const visibility = $("#programActiveFilter")?.value || "all";
  let rows = programs;
  if (q) rows = rows.filter((p) => [p.name, p.slug, p.mode, p.location].some((v) => v && v.toLowerCase().includes(q)));
  if (visibility === "active") rows = rows.filter((p) => p.is_active !== false);
  if (visibility === "inactive") rows = rows.filter((p) => p.is_active === false);
  if (readiness !== "all") {
    rows = rows.filter((p) => {
      const setup = programSetupState(p);
      if (readiness === "ready") return setup.ready;
      if (readiness === "needs_setup") return !setup.ready && setup.displayReady;
      if (readiness === "draft") return !setup.ready && !setup.displayReady;
      return true;
    });
  }
  renderPrograms(rows);
  const countEl = $("#programCount");
  if (countEl) countEl.textContent = `${rows.length} of ${programs.length}`;
  const emptyEl = $("#programEmpty");
  if (emptyEl) emptyEl.hidden = rows.length > 0;
}

function renderPrograms(rows) {
  const body = $("#programBody");
  if (!body) return;
  body.innerHTML = rows.map((p) => `
    ${(() => {
      const setup = programSetupState(p);
      const dateLabel = formatProgramDateLabel(p);
      const durationLabel = programDurationLabel(p);
      const capacityLabel = setup.seatsLeft === null ? "TBA" : `${setup.seatsLeft} / ${setup.capacity}`;
      const readinessClass = setup.ready ? "confirmed" : setup.displayReady ? "warning" : "pending";
      const readinessText = setup.ready ? "Ready" : setup.displayReady ? "Needs setup" : "Draft";
      const feeText = p.fee_status === "ready"
        ? `${feeModeLabel(p.fee_mode)}${p.base_fee ? ` / Rs. ${Number(p.base_fee).toLocaleString("en-IN")}` : ""}`
        : "To be announced";
      return `
    <tr>
      <td data-label="Program"><strong>${esc(p.name)}</strong><br><small>${esc(p.slug)}</small></td>
      <td data-label="Dates">${esc(dateLabel)}<br><small>${esc(durationLabel)}</small></td>
      <td data-label="Mode">${esc(p.mode || "")}<br><small>${esc(scheduleTypeLabel(programScheduleType(p)))}</small><br><small>${esc(accommodationModeLabel(programAccommodationMode(p)))}</small></td>
      <td data-label="Fee">${esc(feeText)}</td>
      <td data-label="Readiness">
        <span class="badge badge-${readinessClass}">${readinessText}</span>
        ${setup.issues.length ? `<br><small>${esc(setup.issues.slice(0, 2).join(", "))}${setup.issues.length > 2 ? "..." : ""}</small>` : ""}
      </td>
      <td data-label="Seats">${esc(capacityLabel)}<br><small>reserved: ${setup.reserved}</small></td>
      <td data-label="Active"><button type="button" class="toggle ${p.is_active ? "on" : ""}" onclick="toggleProgram('${p.id}', ${!p.is_active}, this)" aria-label="${p.is_active ? "Deactivate" : "Activate"} ${esc(p.name)}"></button></td>
      <td class="row-actions" data-label="Actions">
        <button onclick="editProgram('${p.id}')">Edit</button>
        <button onclick="deleteProgram('${p.id}', this)" class="del">Delete</button>
      </td>
    </tr>
      `;
    })()}
  `).join("");
}

$("#programSearch")?.addEventListener("input", filterPrograms);
$("#programReadinessFilter")?.addEventListener("change", filterPrograms);
$("#programActiveFilter")?.addEventListener("change", filterPrograms);

window.toggleProgram = async function(id, active, button) {
  await runAdminAction(async () => {
    await apiUpdate("programs", id, { is_active: active, updated_at: new Date().toISOString() });
    await loadPrograms();
    renderDashboard();
  }, active ? "Program activated." : "Program deactivated.", button);
};

function programForm(p = {}) {
  const deadline = toLocalDateTimeInputs(p.registration_deadline);
  const startDate = p.start_date || "";
  const endDate = p.end_date || "";
  const dateDisplayMode = programDateDisplayMode(p);
  const setup = p.id ? programSetupState(p) : { issues: ["new program starts as draft"], seatsLeft: null, reserved: 0 };
  const scheduleType = programScheduleType(p);
  const accommodationMode = programAccommodationMode(p);
  const messMealRate = p.mess_meal_rate ?? 80;
  const messMealsPerDay = p.mess_meals_per_day ?? 3;
  return `
    <div class="modal-section">
      <h4>Basics</h4>
      <label>Name <input id="mProgramName" value="${esc(p.name || "")}" required></label>
      <div class="form-grid two">
        <label>Slug <input id="mProgramSlug" value="${esc(p.slug || "")}" placeholder="staff-camp" required></label>
        <label>Short Label <input id="mProgramShort" value="${esc(p.short_label || "")}" placeholder="Staff Kid Camp"></label>
      </div>
      <label>Description <textarea id="mProgramDesc" rows="3">${esc(p.description || "")}</textarea></label>
      <label>CTA Context <textarea id="mProgramContext" rows="2">${esc(p.cta_context || "")}</textarea></label>
    </div>

    <div class="modal-section">
      <h4>Schedule</h4>
      <label>Schedule Timing <select id="mProgramDateDisplayMode">
        <option value="date_range" ${dateDisplayMode === "date_range" ? "selected" : ""}>Date range - show start and end dates</option>
        <option value="self_paced" ${dateDisplayMode === "self_paced" ? "selected" : ""}>Self-paced - no fixed dates</option>
        <option value="to_be_announced" ${dateDisplayMode === "to_be_announced" ? "selected" : ""}>To be announced - not ready yet</option>
      </select></label>
      <div class="form-grid two">
        <label>Start Date <input id="mProgramStart" type="date" value="${esc(startDate)}"></label>
        <label>End Date <input id="mProgramEnd" type="date" value="${esc(endDate)}"></label>
        <label>Mode <input id="mProgramMode" value="${esc(p.mode || "")}" placeholder="On Campus / Online / Hybrid"></label>
        <label>Location <input id="mProgramLocation" value="${esc(p.location || "")}" placeholder="LPU Campus, Phagwara"></label>
      </div>
      <div class="derived-preview" data-program-date-preview>
        <strong>${esc(formatProgramDateLabel({ ...p, date_display_mode: dateDisplayMode, start_date: startDate, end_date: endDate }))}</strong>
        <span>${esc(programDurationLabel({ ...p, date_display_mode: dateDisplayMode, start_date: startDate, end_date: endDate }))}</span>
      </div>
      <p class="form-note">Choose Date range for fixed dates, Self-paced for flexible online learning, or To be announced when schedule timing is not ready.</p>
    </div>

    <div class="modal-section">
      <h4>Program Rules</h4>
      <label>Course Selection Mode <select id="mProgramScheduleType">
        <option value="selectable" ${scheduleType === "selectable" ? "selected" : ""}>Parent selects sessions/classes</option>
        <option value="fixed" ${scheduleType === "fixed" ? "selected" : ""}>Fixed schedule - no parent selection</option>
      </select></label>
      <p class="form-note">Use fixed schedule for programs like Staff Kid Summer Camp. Admin still adds sessions/courses as the schedule; parents only review them.</p>
      <label>Accommodation / Food Mode <select id="mProgramAccommodationMode">
        <option value="none" ${accommodationMode === "none" ? "selected" : ""}>No accommodation or meals</option>
        <option value="optional" ${accommodationMode === "optional" ? "selected" : ""}>Optional add-ons during registration</option>
        <option value="included" ${accommodationMode === "included" ? "selected" : ""}>Included in program fee</option>
      </select></label>
      <div class="form-grid two">
        <label class="check-label"><input id="mProgramHostel" type="checkbox" ${p.allow_hostel ? "checked" : ""}> Allow hostel bed add-ons</label>
        <label class="check-label"><input id="mProgramMess" type="checkbox" ${p.allow_mess ? "checked" : ""}> Allow mess food add-on</label>
        <label>Mess Meal Rate (Rs.) <input id="mProgramMessMealRate" type="number" min="0" value="${esc(messMealRate)}"></label>
        <label>Mess Meals Per Day <input id="mProgramMessMealsPerDay" type="number" min="0" max="10" value="${esc(messMealsPerDay)}"></label>
      </div>
      <label>Included Package Note <input id="mProgramIncludedServices" value="${esc(p.included_services || "")}" placeholder="Food, stay, activities included"></label>
      <p class="form-note">Mess defaults are Rs. 80 per meal and 3 meals per day. For all-inclusive packages, choose "Included in program fee" and write exactly what is included.</p>
    </div>

    <div class="modal-section">
      <h4>Registration</h4>
      <label>Registration Deadline
        <div class="inline-fields">
          <input id="mProgramDeadlineDate" type="date" value="${deadline.date}">
          <input id="mProgramDeadlineTime" type="time" value="${deadline.time}">
        </div>
      </label>
      <div class="form-grid two">
        <label>Seat Capacity <input id="mProgramSeatsBase" type="number" min="0" value="${p.seats_base ?? ""}" placeholder="Leave blank if not announced"></label>
        <label>Sort Order <input id="mProgramOrder" type="number" value="${p.sort_order ?? programs.length + 1}"></label>
      </div>
      <label>Seats Note <input id="mProgramSeatsNote" value="${esc(p.seats_note || "")}" placeholder="Optional note shown near seats"></label>
      <div class="derived-preview">
        <strong>Real seats left: ${setup.seatsLeft === null ? "TBA" : `${setup.seatsLeft} of ${setup.capacity}`}</strong>
        <span>Reserved registrations: ${setup.reserved || 0}</span>
      </div>
    </div>

    <div class="modal-section">
      <h4>Pricing</h4>
      <div class="form-grid two">
        <label>Fee Type <select id="mProgramFeeMode">
          ${["session_count", "package", "custom", "to_be_announced"].map((value) => `<option value="${value}" ${p.fee_mode === value ? "selected" : ""}>${feeModeLabel(value)}</option>`).join("")}
        </select></label>
        <label>Fee Status <select id="mProgramFeeStatus">
          <option value="ready" ${p.fee_status === "ready" ? "selected" : ""}>Fee announced</option>
          <option value="to_be_announced" ${p.fee_status !== "ready" ? "selected" : ""}>Fee not announced</option>
        </select></label>
        <label>Base Fee (Rs.) <input id="mProgramBaseFee" type="number" min="0" value="${p.base_fee ?? 0}"></label>
      </div>
      <p class="form-note">Families pay only the configured base/session price plus any selected accommodation or meal add-ons.</p>
    </div>

    <div class="modal-section">
      <h4>Media</h4>
      <label>Upload Program Card Image <input id="mProgramImageFile" type="file" accept="image/*"></label>
      <label>Program Card Image URL <input id="mProgramImage" value="${esc(p.image_url || "")}" placeholder="https://..."></label>
      <label>Upload Hero Background Image <input id="mProgramBgFile" type="file" accept="image/*"></label>
      <label>Hero Background Image URL <input id="mProgramBg" value="${esc(p.background_image_url || "")}" placeholder="https://..."></label>
    </div>

    <div class="modal-section">
      <h4>Visibility</h4>
      <label class="check-label"><input id="mProgramRegistration" type="checkbox" ${p.registration_enabled ? "checked" : ""}> Open registration when setup is ready</label>
      ${setup.issues.length ? `<div class="setup-warning"><strong>Setup checklist</strong><span>${esc(setup.issues.join("; "))}</span></div>` : `<div class="setup-ok">This program is ready for registration.</div>`}
    </div>
  `;
}

function updateProgramDerivedPreview() {
  const preview = $("[data-program-date-preview]");
  if (!preview) return;
  const dateDisplayMode = $("#mProgramDateDisplayMode")?.value || "date_range";
  const startDate = $("#mProgramStart")?.value || "";
  const endDate = $("#mProgramEnd")?.value || "";
  const draft = { date_display_mode: dateDisplayMode, start_date: startDate, end_date: endDate };
  preview.innerHTML = `<strong>${esc(formatProgramDateLabel(draft))}</strong><span>${esc(programDurationLabel(draft))}</span>`;
}

function updateProgramDateControls() {
  const dateDisplayMode = $("#mProgramDateDisplayMode")?.value || "date_range";
  const usesDateRange = dateDisplayMode === "date_range";
  const start = $("#mProgramStart");
  const end = $("#mProgramEnd");
  if (start) start.disabled = !usesDateRange;
  if (end) end.disabled = !usesDateRange;
  updateProgramDerivedPreview();
}

function updateProgramAccommodationControls() {
  const mode = $("#mProgramAccommodationMode")?.value || "none";
  const hostel = $("#mProgramHostel");
  const mess = $("#mProgramMess");
  const mealRate = $("#mProgramMessMealRate");
  const mealsPerDay = $("#mProgramMessMealsPerDay");
  const included = $("#mProgramIncludedServices");
  const optional = mode === "optional";
  if (hostel) hostel.disabled = !optional;
  if (mess) mess.disabled = !optional;
  if (!optional) {
    if (hostel) hostel.checked = false;
    if (mess) mess.checked = false;
  }
  const messFieldsEnabled = optional && Boolean(mess?.checked);
  if (mealRate) mealRate.disabled = !messFieldsEnabled;
  if (mealsPerDay) mealsPerDay.disabled = !messFieldsEnabled;
  if (included) included.disabled = mode !== "included";
}

function wireProgramForm() {
  ["#mProgramDateDisplayMode", "#mProgramStart", "#mProgramEnd"].forEach((selector) => {
    $(selector)?.addEventListener("change", updateProgramDerivedPreview);
  });
  $("#mProgramDateDisplayMode")?.addEventListener("change", updateProgramDateControls);
  $("#mProgramFeeMode")?.addEventListener("change", () => {
    const mode = $("#mProgramFeeMode").value;
    const baseFee = $("#mProgramBaseFee");
    if (baseFee) baseFee.disabled = mode === "session_count" || mode === "to_be_announced";
  });
  $("#mProgramFeeMode")?.dispatchEvent(new Event("change"));
  $("#mProgramAccommodationMode")?.addEventListener("change", updateProgramAccommodationControls);
  $("#mProgramMess")?.addEventListener("change", updateProgramAccommodationControls);
  updateProgramDateControls();
  updateProgramAccommodationControls();
}

function toLocalDateTimeInputs(value) {
  if (!value) return { date: "", time: "23:59" };
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return { date: "", time: "23:59" };
  const ist = new Date(dt.getTime() + (330 - dt.getTimezoneOffset()) * 60000);
  return { date: ist.toISOString().slice(0, 10), time: ist.toISOString().slice(11, 16) };
}

function getProgramFormData() {
  const deadlineDate = $("#mProgramDeadlineDate").value;
  const deadlineTime = $("#mProgramDeadlineTime").value || "23:59";
  const dateDisplayMode = $("#mProgramDateDisplayMode")?.value || "date_range";
  const startDate = dateDisplayMode === "date_range" ? ($("#mProgramStart").value || null) : null;
  const endDate = dateDisplayMode === "date_range" ? ($("#mProgramEnd").value || null) : null;
  const capacity = $("#mProgramSeatsBase").value ? parseInt($("#mProgramSeatsBase").value, 10) : null;
  const feeMode = $("#mProgramFeeMode").value;
  const feeStatus = $("#mProgramFeeStatus").value;
  const accommodationMode = $("#mProgramAccommodationMode")?.value || "none";
  const allowHostel = accommodationMode === "optional" && Boolean($("#mProgramHostel")?.checked);
  const allowMess = accommodationMode === "optional" && Boolean($("#mProgramMess")?.checked);
  return {
    name: $("#mProgramName").value,
    slug: $("#mProgramSlug").value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""),
    short_label: $("#mProgramShort").value || null,
    description: $("#mProgramDesc").value || null,
    cta_context: $("#mProgramContext").value || null,
    date_display_mode: dateDisplayMode,
    dates_label: formatProgramDateLabel({ date_display_mode: dateDisplayMode, start_date: startDate, end_date: endDate }),
    start_date: startDate,
    end_date: endDate,
    mode: $("#mProgramMode").value || null,
    duration: programDurationLabel({ date_display_mode: dateDisplayMode, start_date: startDate, end_date: endDate }),
    location: $("#mProgramLocation").value || null,
    registration_deadline: deadlineDate ? `${deadlineDate}T${deadlineTime}:00+05:30` : null,
    deadline_label: deadlineDate ? formatDateHuman(deadlineDate) : "To be announced",
    seats_label: capacity ? "Seats Left" : "Seats Update",
    seats_base: capacity,
    seats_min: null,
    seats_note: $("#mProgramSeatsNote").value || null,
    fee_mode: feeMode,
    fee_status: feeStatus,
    base_fee: parseInt($("#mProgramBaseFee").value || "0"),
    schedule_type: $("#mProgramScheduleType")?.value || "selectable",
    accommodation_mode: accommodationMode,
    allow_hostel: allowHostel,
    allow_mess: allowMess,
    mess_meal_rate: parseInt($("#mProgramMessMealRate")?.value || "80", 10),
    mess_meals_per_day: parseInt($("#mProgramMessMealsPerDay")?.value || "3", 10),
    included_services: $("#mProgramIncludedServices")?.value || null,
    image_url: $("#mProgramImage").value || null,
    background_image_url: $("#mProgramBg").value || null,
    registration_enabled: $("#mProgramRegistration").checked,
    sort_order: parseInt($("#mProgramOrder").value || "0"),
    updated_at: new Date().toISOString()
  };
}

async function applyProgramUploads(data) {
  const imageFile = $("#mProgramImageFile");
  const bgFile = $("#mProgramBgFile");
  if (imageFile?.files.length) data.image_url = await uploadImage(imageFile.files[0]);
  if (bgFile?.files.length) data.background_image_url = await uploadImage(bgFile.files[0]);
  return data;
}

window.editProgram = async function(id) {
  const p = programs.find((program) => program.id === id) || (await apiGet("programs", `id=eq.${id}`))[0];
  openModal("Edit Program", programForm(p), async () => {
    await apiUpdate("programs", id, await applyProgramUploads(getProgramFormData()));
    await loadPrograms();
    await loadSessions();
    await loadCourses();
    await loadFees();
    renderDashboard();
  });
  wireProgramForm();
};

window.deleteProgram = async function(id, button) {
  if (!confirm("Delete this program? Existing sessions/courses/registrations can block deletion.")) return;
  await runAdminAction(async () => {
    await apiDelete("programs", id);
    await loadPrograms();
    renderDashboard();
  }, "Program deleted.", button);
};

$("#addProgramBtn")?.addEventListener("click", () => {
  openModal("Add Program", programForm({ fee_status: "to_be_announced", fee_mode: "to_be_announced", registration_enabled: false, is_active: true }), async () => {
    await apiInsert("programs", await applyProgramUploads(getProgramFormData()));
    await loadPrograms();
    renderDashboard();
  });
  wireProgramForm();
});

async function loadRegistrations() {
  allRegistrations = await apiGet("registrations", "order=created_at.desc");
  filterRegistrations();
}

function paymentBadgeClass(ps) {
  if (ps === "paid") return "confirmed";
  if (ps === "verification_pending") return "warning";
  return "pending";
}
function paymentBadgeLabel(ps) {
  if (ps === "paid") return "verified";
  if (ps === "verification_pending") return "needs review";
  return ps || "unpaid";
}

function filterRegistrations() {
  const status = $("#regStatusFilter").value;
  const payment = $("#regPaymentFilter").value;
  const programId = $("#regProgramFilter")?.value || "all";
  const q = ($("#regSearch").value || "").toLowerCase().trim();

  let rows = allRegistrations;
  if (status !== "all") rows = rows.filter((r) => r.status === status);
  if (payment !== "all") rows = rows.filter((r) => r.payment_status === payment);
  if (programId !== "all") rows = rows.filter((r) => r.program_id === programId);
  if (q) rows = rows.filter((r) => [r.student_name, r.guardian_name, r.school_name, r.phone, r.email, r.city, r.payment_reference, r.program_name].some((v) => v && v.toLowerCase().includes(q)));

  registrationRows = rows;
  const maxPage = Math.max(Math.ceil(registrationRows.length / REG_PAGE_SIZE), 1);
  registrationPage = Math.min(registrationPage, maxPage);
  renderRegistrations(registrationRows.slice((registrationPage - 1) * REG_PAGE_SIZE, registrationPage * REG_PAGE_SIZE));
  renderRegistrationPagination();
  const countEl = $("#regCount");
  if (countEl) countEl.textContent = `${rows.length} of ${allRegistrations.length}`;
}

function renderRegistrations(rows) {
  const body = $("#regBody");
  if (!rows.length) {
    body.innerHTML = "";
    $("#regEmpty").hidden = false;
    return;
  }
  $("#regEmpty").hidden = true;

  body.innerHTML = rows.map((r) => {
    const courseList = registrationCourseList(r);
    return `
    <tr>
      <td data-label="Date">${new Date(r.created_at).toLocaleDateString("en-IN")}</td>
      <td data-label="Student"><strong>${esc(r.student_name)}</strong></td>
      <td data-label="Program">${esc(r.program_name || programName(r.program_id))}</td>
      <td data-label="Age / Class">${r.student_age ? `Age ${esc(r.student_age)}<br><small>${esc(r.class_level)}</small>` : esc(r.class_level)}</td>
      <td data-label="School">${esc(r.school_name)}</td>
      <td data-label="Guardian">${esc(r.guardian_name)}</td>
      <td data-label="Phone">${esc(r.phone)}</td>
      <td data-label="Sessions" class="cell-long">${courseList.map(c => esc(c)).join(", ") || "\u2014"}</td>
      <td data-label="Fee">Rs. ${Number(r.total_fee || 0).toLocaleString("en-IN")}</td>
      <td data-label="Payment"><span class="badge badge-${paymentBadgeClass(r.payment_status)}">${paymentBadgeLabel(r.payment_status)}</span></td>
      <td data-label="Proof">${r.screenshot_url ? `<a href="#" target="_blank" rel="noopener" class="screenshot-thumb" title="View screenshot" data-screenshot-path="${esc(screenshotObjectPath(r.screenshot_url))}"><img alt="Payment proof screenshot"></a>` : "\u2014"}</td>
      <td data-label="Status"><span class="badge badge-${r.status}">${r.status}</span></td>
      <td class="row-actions" data-label="Actions">
        <button onclick="viewRegistration('${r.id}')">View</button>
        <button onclick="deleteRegistration('${r.id}', this)" class="del" title="Delete permanently">Delete</button>
        ${r.payment_status === "verification_pending" ? `<button onclick="approveRegistration('${r.id}', this)" class="approve-btn">Approve</button><button onclick="rejectRegistration('${r.id}', this)" class="del">Reject</button>` : `<button onclick="changeRegStatus('${r.id}', 'confirmed', this)">Confirm</button><button onclick="changeRegStatus('${r.id}', 'cancelled', this)" class="del">Cancel</button>`}
      </td>
    </tr>
  `;
  }).join("");
  hydrateScreenshotThumbs(body);
}

function renderRegistrationPagination() {
  const el = $("#regPagination");
  if (!el) return;
  const total = registrationRows.length;
  const totalPages = Math.max(Math.ceil(total / REG_PAGE_SIZE), 1);
  el.hidden = total <= REG_PAGE_SIZE;
  if (el.hidden) {
    el.innerHTML = "";
    return;
  }
  const start = (registrationPage - 1) * REG_PAGE_SIZE + 1;
  const end = Math.min(registrationPage * REG_PAGE_SIZE, total);
  el.innerHTML = `
    <button class="btn ghost small" type="button" ${registrationPage <= 1 ? "disabled" : ""} data-page-prev>Previous</button>
    <span>Showing ${start}-${end} of ${total}</span>
    <button class="btn ghost small" type="button" ${registrationPage >= totalPages ? "disabled" : ""} data-page-next>Next</button>
  `;
  el.querySelector("[data-page-prev]")?.addEventListener("click", () => {
    registrationPage = Math.max(registrationPage - 1, 1);
    filterRegistrations();
  });
  el.querySelector("[data-page-next]")?.addEventListener("click", () => {
    registrationPage = Math.min(registrationPage + 1, totalPages);
    filterRegistrations();
  });
}

const HOSTEL_LABELS = {
  none: "No accommodation or meals",
  hostel_only: "Non-AC hostel bed",
  hostel_only_mess: "Non-AC hostel bed + mess food",
  hostel_food: "AC hostel bed",
  hostel_food_mess: "AC hostel bed + mess food",
  mess_only: "Mess food only",
  included: "Included in program fee"
};

function registrationCourseList(reg) {
  if (typeof reg.course_names === "string") {
    try {
      const parsed = JSON.parse(reg.course_names);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (_) {}
  }
  if (Array.isArray(reg.course_names) && reg.course_names.length) return reg.course_names;
  if (Array.isArray(reg.program_snapshot?.courses) && reg.program_snapshot.courses.length) return reg.program_snapshot.courses;
  return [reg.session1_course, reg.session2_course, reg.session3_course].filter(Boolean);
}

window.viewRegistration = async function(id) {
  const rows = await apiGet("registrations", `id=eq.${id}`);
  const r = rows[0];
  const courses = registrationCourseList(r);

  const hostelLabel = HOSTEL_LABELS[r.hostel_option] || r.hostel_option || "N/A";
  const hostelAmt = r.hostel_amount || 0;

  openModal("Registration Details", `
    <div style="display:grid;gap:12px">
      <div><strong>Student:</strong> ${esc(r.student_name)}</div>
      <div><strong>Program:</strong> ${esc(r.program_name || programName(r.program_id))}</div>
      ${r.student_age ? `<div><strong>Age:</strong> ${esc(r.student_age)}</div>` : ""}
      <div><strong>Class:</strong> ${esc(r.class_level)}</div>
      <div><strong>School:</strong> ${esc(r.school_name)}</div>
      <div><strong>City:</strong> ${esc(r.city)}</div>
      <hr style="border:none;border-top:1px solid #e4e7ec">
      <div><strong>Guardian:</strong> ${esc(r.guardian_name)}</div>
      <div><strong>Phone:</strong> ${esc(r.phone)}</div>
      <div><strong>Email:</strong> ${esc(r.email)}</div>
      <div><strong>Emergency:</strong> ${esc(r.emergency_phone)}</div>
      <hr style="border:none;border-top:1px solid #e4e7ec">
      <div><strong>Courses:</strong> ${courses.map(c => esc(c)).join(", ") || "None"}</div>
      <div><strong>Accommodation / Meals:</strong> ${esc(hostelLabel)}${hostelAmt ? ` (Rs. ${hostelAmt})` : ""}</div>
      <hr style="border:none;border-top:1px solid #e4e7ec">
      <div><strong>Session Fee:</strong> Rs. ${r.session_fee || 0}</div>
      <div><strong>Total Fee:</strong> <strong style="color:#f3700d">Rs. ${r.total_fee}</strong></div>
      <div><strong>Payment Ref:</strong> <code>${esc(r.payment_reference || "N/A")}</code></div>
      <div><strong>Payment:</strong> <span class="badge badge-${paymentBadgeClass(r.payment_status)}">${paymentBadgeLabel(r.payment_status)}</span></div>
      <div><strong>Status:</strong> <span class="badge badge-${r.status}">${r.status}</span></div>
      ${r.payment_review_note ? `<div><strong>Payment Review Note:</strong> ${esc(r.payment_review_note)}</div>` : ""}
      ${r.screenshot_url ? `
      <hr style="border:none;border-top:1px solid #e4e7ec">
      <div><strong>Payment Screenshot:</strong></div>
      <div style="text-align:center"><a href="#" target="_blank" rel="noopener" data-screenshot-path="${esc(screenshotObjectPath(r.screenshot_url))}"><img style="max-width:100%;max-height:400px;border-radius:8px;border:1px solid #e4e7ec" alt="Payment screenshot"></a></div>` : ""}
      ${r.verified_at ? `<div style="font-size:12px;color:#667085"><strong>Verified:</strong> ${new Date(r.verified_at).toLocaleString("en-IN")} by ${esc(r.verified_by || "admin")}</div>` : ""}
      <div><strong>Medical:</strong> ${esc(r.medical_note) || "None"}</div>
      <div><strong>Registered:</strong> ${new Date(r.created_at).toLocaleString("en-IN")}</div>
      ${r.payment_status === "verification_pending" ? `
      <hr style="border:none;border-top:1px solid #e4e7ec">
      <div style="display:flex;gap:8px">
        <button class="btn primary small" onclick="approveRegistration('${r.id}', this);closeModal()">Approve Payment</button>
        <button class="btn ghost small" onclick="rejectRegistration('${r.id}', this);closeModal()">Reject</button>
      </div>` : ""}
    </div>
  `, null);
  $("#modalSave").hidden = true;
  hydrateScreenshotThumbs();
};

window.deleteRegistration = async function(id, button) {
  const reg = allRegistrations.find((row) => row.id === id);
  const label = reg ? `${reg.student_name || "this student"} (${reg.payment_reference || "no payment ref"})` : "this registration";
  if (!confirm(`Permanently delete registration for ${label}? This cannot be undone.`)) return;
  await runAdminAction(async () => {
    await apiDelete("registrations", id);
    await loadRegistrations();
    renderDashboard();
  }, "Registration deleted permanently.", button);
};

window.approveRegistration = async function(id, button) {
  if (!confirm("Approve this payment and confirm registration?")) return;
  await runAdminAction(async () => {
    await apiUpdate("registrations", id, {
      status: "confirmed",
      payment_status: "paid",
      verified_by: localStorage.getItem("sb_email") || "admin",
      verified_at: new Date().toISOString()
    });

    const rows = await apiGet("registrations", `id=eq.${id}`);
    const reg = rows[0];
    if (reg && reg.email) {
      await sendEmailSafely(reg.email, "Registration Confirmed - LPU Summer School", registrationConfirmationEmail(reg), "Confirmation email sent.");
    }

    await loadRegistrations();
    renderDashboard();
  }, "Payment approved and registration confirmed.", button);
};

window.rejectRegistration = async function(id, button) {
  const note = prompt("Reason for rejection (shown only in admin export/detail):", "Payment proof could not be verified.");
  if (note === null) return;
  await runAdminAction(async () => {
    await apiUpdate("registrations", id, {
      status: "rejected",
      payment_status: "failed",
      verified_by: localStorage.getItem("sb_email") || "admin",
      verified_at: new Date().toISOString(),
      payment_review_note: note
    });
    const rows = await apiGet("registrations", `id=eq.${id}`);
    const reg = rows[0];
    if (reg && reg.email) {
      await sendEmailSafely(reg.email, "Payment Verification Update - LPU Summer School", registrationRejectedEmail(reg, note), "Rejection email sent.");
    }
    await loadRegistrations();
    renderDashboard();
  }, "Payment proof rejected.", button);
};

window.changeRegStatus = async function(id, status, button) {
  const label = status === "confirmed" ? "confirm this registration" : "cancel this registration";
  if (!confirm(`Are you sure you want to ${label}?`)) return;
  await runAdminAction(async () => {
    await apiUpdate("registrations", id, { status });

    if (status === "confirmed") {
      const rows = await apiGet("registrations", `id=eq.${id}`);
      const reg = rows[0];
      if (reg && reg.email) {
        await sendEmailSafely(reg.email, "Registration Confirmed - LPU Summer School", registrationConfirmationEmail(reg), "Confirmation email sent.");
      }
    }

    await loadRegistrations();
    renderDashboard();
  }, status === "confirmed" ? "Registration confirmed." : "Registration cancelled.", button);
};

function resetRegistrationPageAndFilter() {
  registrationPage = 1;
  filterRegistrations();
}

$("#regStatusFilter").addEventListener("change", resetRegistrationPageAndFilter);
$("#regPaymentFilter").addEventListener("change", resetRegistrationPageAndFilter);
$("#regProgramFilter")?.addEventListener("change", resetRegistrationPageAndFilter);
$("#regSearch").addEventListener("input", resetRegistrationPageAndFilter);

$("#exportCsvBtn").addEventListener("click", async () => {
  const rows = await apiGet("registrations", "order=created_at.desc");
  if (!rows.length) {
    showToast("No registrations available to export.", "error");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Registration CSV exported.", "success");
});

// --- SESSIONS ---
async function loadSessions() {
  sessions = await apiGet("sessions", "order=sort_order.asc&select=*");
  filterSessions();
}

function filterSessions() {
  const programId = $("#sessionProgramFilter")?.value || "all";
  const q = ($("#sessionSearch")?.value || "").toLowerCase().trim();
  let rows = sessions;
  if (programId !== "all") rows = rows.filter((s) => s.program_id === programId);
  if (q) rows = rows.filter((s) => s.name && s.name.toLowerCase().includes(q));
  renderSessions(rows);
  const countEl = $("#sessionCount");
  if (countEl) countEl.textContent = `${rows.length} of ${sessions.length}`;
}

function renderSessions(rows) {
  if (!rows) rows = sessions;
  const emptyEl = $("#sessionEmpty");
  if (emptyEl) emptyEl.hidden = rows.length > 0;
  $("#sessionBody").innerHTML = rows.map((s) => `
    <tr>
      <td data-label="Name"><strong>${esc(s.name)}</strong></td>
      <td data-label="Program">${esc(programName(s.program_id))}</td>
      <td data-label="Time Slot">${esc(s.time_slot)}</td>
      <td data-label="Order">${s.sort_order}</td>
      <td data-label="Active"><button type="button" class="toggle ${s.is_active ? "on" : ""}" onclick="toggleSession('${s.id}', ${!s.is_active}, this)" aria-label="${s.is_active ? "Deactivate" : "Activate"} ${esc(s.name)}"></button></td>
      <td class="row-actions" data-label="Actions">
        <button onclick="editSession('${s.id}')">Edit</button>
        <button onclick="deleteSession('${s.id}', this)" class="del">Delete</button>
      </td>
    </tr>
  `).join("");
}

$("#sessionSearch")?.addEventListener("input", filterSessions);
$("#sessionProgramFilter")?.addEventListener("change", filterSessions);

window.toggleSession = async function(id, active, button) {
  await runAdminAction(async () => {
    await apiUpdate("sessions", id, { is_active: active });
    await loadSessions();
  }, active ? "Session activated." : "Session deactivated.", button);
};

function parseTimeSlot(slot) {
  // "09:30 - 11:30" or "09:30 - 11:30" -> { start, end }
  const parts = (slot || "").split(/\s*[-–]\s*/);
  return { start: (parts[0] || "09:00").trim(), end: (parts[1] || "11:00").trim() };
}

function sessionTimeForm(slot) {
  const t = parseTimeSlot(slot);
  return `<label>Start Time <input type="time" id="mSessionStart" value="${esc(t.start)}" required></label>
    <label>End Time <input type="time" id="mSessionEnd" value="${esc(t.end)}" required></label>`;
}

function getSessionTimeSlot() {
  const start = $("#mSessionStart").value;
  const end = $("#mSessionEnd").value;
  if (!start || !end) throw new Error("Start and end times are required");
  if (start >= end) throw new Error("End time must be after start time");
  return `${start} - ${end}`;
}

window.editSession = function(id) {
  const s = sessions.find((x) => x.id === id);
  openModal("Edit Session", `
    <label>Name <input id="mSessionName" value="${esc(s.name)}" required></label>
    <label>Program <select id="mSessionProgram" required>${programOptions(s.program_id)}</select></label>
    ${sessionTimeForm(s.time_slot)}
    <label>Sort Order <input id="mSessionOrder" type="number" value="${s.sort_order}"></label>
  `, async () => {
    await apiUpdate("sessions", id, {
      name: $("#mSessionName").value,
      program_id: $("#mSessionProgram").value,
      time_slot: getSessionTimeSlot(),
      sort_order: parseInt($("#mSessionOrder").value)
    });
    await loadSessions();
    await loadCourses();
    renderDashboard();
  });
};

window.deleteSession = async function(id, button) {
  if (!confirm("Delete this session and all its courses?")) return;
  await runAdminAction(async () => {
    await apiDelete("sessions", id);
    await loadSessions();
    await loadCourses();
    renderDashboard();
  }, "Session deleted.", button);
};

$("#addSessionBtn").addEventListener("click", () => {
  openModal("Add Session", `
    <label>Name <input id="mSessionName" placeholder="Session 4" required></label>
    <label>Program <select id="mSessionProgram" required>${programOptions(programs[0]?.id)}</select></label>
    ${sessionTimeForm("")}
    <label>Sort Order <input id="mSessionOrder" type="number" value="${sessions.length + 1}"></label>
  `, async () => {
    await apiInsert("sessions", {
      name: $("#mSessionName").value,
      program_id: $("#mSessionProgram").value,
      time_slot: getSessionTimeSlot(),
      sort_order: parseInt($("#mSessionOrder").value)
    });
    await loadSessions();
    renderDashboard();
  });
});

async function loadCourses() {
  allCourses = await apiGet("courses", "order=sort_order.asc&select=*,sessions(name,time_slot,program_id),programs(name)");
  // Populate session filter dropdown
  const sessionFilter = $("#courseSessionFilter");
  if (sessionFilter) {
    const current = sessionFilter.value;
    sessionFilter.innerHTML = `<option value="all">All Sessions</option>` +
      sessions.map((s) => `<option value="${s.id}">${esc(programName(s.program_id))} - ${esc(s.name)}</option>`).join("");
    sessionFilter.value = current || "all";
  }
  updateProgramFilters();
  filterCourses();
}

function filterCourses() {
  const programId = $("#courseProgramFilter")?.value || "all";
  const sessionId = $("#courseSessionFilter")?.value || "all";
  const category = $("#courseCategoryFilter")?.value || "all";
  const q = ($("#courseSearch")?.value || "").toLowerCase().trim();

  let rows = allCourses;
  if (programId !== "all") rows = rows.filter((c) => c.program_id === programId);
  if (sessionId !== "all") rows = rows.filter((c) => c.session_id === sessionId);
  if (category !== "all") rows = rows.filter((c) => c.category === category);
  if (q) rows = rows.filter((c) => c.name && c.name.toLowerCase().includes(q));

  renderCourses(rows);
  const countEl = $("#courseCount");
  if (countEl) countEl.textContent = `${rows.length} of ${allCourses.length}`;
}

function renderCourses(courses) {
  const emptyEl = $("#courseEmpty");
  if (emptyEl) emptyEl.hidden = courses.length > 0;
  $("#courseBody").innerHTML = courses.map((c) => `
    <tr>
      <td data-label="Course Name">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;overflow:hidden">
          ${c.image_url ? `<img src="${esc(c.image_url)}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0">` : ""}
          <strong style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}</strong>
        </div>
      </td>
      <td data-label="Program">${esc(c.programs?.name || programName(c.program_id))}</td>
      <td data-label="Session">${esc(c.sessions?.name) || "\u2014"}</td>
      <td data-label="Category"><span class="badge badge-${c.category === 'tech' ? 'pending' : c.category === 'sports' ? 'confirmed' : 'cancelled'}">${esc(c.category)}</span></td>
      <td data-label="Minimum Age">${esc(courseMinAgeLabel(c))}</td>
      <td data-label="Active"><button type="button" class="toggle ${c.is_active ? "on" : ""}" onclick="toggleCourse('${c.id}', ${!c.is_active}, this)" aria-label="${c.is_active ? "Deactivate" : "Activate"} ${esc(c.name)}"></button></td>
      <td class="row-actions" data-label="Actions">
        <button onclick="editCourse('${c.id}')">Edit</button>
        <button onclick="deleteCourse('${c.id}', this)" class="del">Delete</button>
      </td>
    </tr>
  `).join("");
}

window.toggleCourse = async function(id, active, button) {
  await runAdminAction(async () => {
    await apiUpdate("courses", id, { is_active: active });
    await loadCourses();
    renderDashboard();
  }, active ? "Course activated." : "Course deactivated.", button);
};

window.editCourse = async function(id) {
  const courses = await apiGet("courses", `id=eq.${id}`);
  const c = courses[0];
  openModal("Edit Course", courseForm(c), async () => {
    const data = getCourseFormData();
    const fileInput = $("#mCourseFile");
    if (fileInput.files.length) {
      data.image_url = await uploadImage(fileInput.files[0]);
    }
    await apiUpdate("courses", id, data);
    await loadCourses();
    renderDashboard();
  });
};

window.deleteCourse = async function(id, button) {
  if (!confirm("Delete this course?")) return;
  await runAdminAction(async () => {
    await apiDelete("courses", id);
    await loadCourses();
    renderDashboard();
  }, "Course deleted.", button);
};

$("#addCourseBtn").addEventListener("click", () => {
  openModal("Add Course", courseForm({}), async () => {
    const data = getCourseFormData();
    const fileInput = $("#mCourseFile");
    if (fileInput.files.length) {
      data.image_url = await uploadImage(fileInput.files[0]);
    }
    await apiInsert("courses", data);
    await loadCourses();
    renderDashboard();
  });
});

$("#courseSearch")?.addEventListener("input", filterCourses);
$("#courseProgramFilter")?.addEventListener("change", filterCourses);
$("#courseSessionFilter")?.addEventListener("change", filterCourses);
$("#courseCategoryFilter")?.addEventListener("change", filterCourses);

function courseForm(c = {}) {
  const selectedProgramId = c.program_id || sessions.find((s) => s.id === c.session_id)?.program_id || programs[0]?.id || "";
  const minAgeValue = inferredCourseMinAge(c);
  const sessionOpts = sessions
    .filter((s) => !selectedProgramId || s.program_id === selectedProgramId)
    .map((s) => `<option value="${s.id}" ${s.id === c.session_id ? "selected" : ""}>${esc(s.name)} (${esc(s.time_slot)})</option>`)
    .join("");
  return `
    <label>Course Name <input id="mCourseName" value="${esc(c.name || "")}" required></label>
    <label>Program <select id="mCourseProgram" onchange="refreshCourseSessionOptions()" required>${programOptions(selectedProgramId)}</select></label>
    <label>Session <select id="mCourseSession" required>${sessionOpts}</select></label>
    <label>Category <select id="mCourseCategory" required>
      <option value="tech" ${c.category === "tech" ? "selected" : ""}>Tech</option>
      <option value="creative" ${c.category === "creative" ? "selected" : ""}>Creative</option>
      <option value="career" ${c.category === "career" ? "selected" : ""}>Career</option>
      <option value="sports" ${c.category === "sports" ? "selected" : ""}>Sports</option>
      <option value="general" ${c.category === "general" ? "selected" : ""}>General</option>
    </select></label>
    <label>Minimum Age <input id="mCourseMinAge" type="number" min="0" max="70" value="${minAgeValue}" required></label>
    <label>Description <textarea id="mCourseDesc" rows="3">${esc(c.description || "")}</textarea></label>
    <label>Upload Image <input id="mCourseFile" type="file" accept="image/*"></label>
    <small style="color:#667085;display:block;margin:-6px 0 8px">Recommended size: <strong>560 x 350 px</strong> (8:5 ratio)</small>
    ${c.image_url ? `<div style="margin:-8px 0 8px"><img src="${esc(c.image_url)}"><small style="color:#667085">Current image — upload new to replace</small></div>` : ""}
    <label>Or Image URL <input id="mCourseImg" value="${esc(c.image_url || "")}" placeholder="https://..."></label>
    <label>Sort Order <input id="mCourseOrder" type="number" value="${c.sort_order ?? 0}" required></label>
  `;
}

window.refreshCourseSessionOptions = function() {
  const programId = $("#mCourseProgram")?.value;
  const sessionSelect = $("#mCourseSession");
  if (!programId || !sessionSelect) return;
  const current = sessionSelect.value;
  const opts = sessions
    .filter((s) => s.program_id === programId)
    .map((s) => `<option value="${s.id}" ${s.id === current ? "selected" : ""}>${esc(s.name)} (${esc(s.time_slot)})</option>`)
    .join("");
  sessionSelect.innerHTML = opts || `<option value="">Add a session for this program first</option>`;
};

function getCourseFormData() {
  const programId = $("#mCourseProgram").value;
  const sessionId = $("#mCourseSession").value;
  const minAge = Number.parseInt($("#mCourseMinAge").value, 10);
  if (!$("#mCourseName").value.trim()) throw new Error("Course name is required.");
  if (!sessions.some((session) => session.id === sessionId && session.program_id === programId)) {
    throw new Error("Selected session does not belong to the selected program.");
  }
  if (!Number.isFinite(minAge) || minAge < 0 || minAge > 70) {
    throw new Error("Minimum age must be between 0 and 70.");
  }
  const data = {
    name: $("#mCourseName").value,
    program_id: programId,
    session_id: sessionId,
    category: $("#mCourseCategory").value,
    class_range: minAge > 0 ? `Age ${minAge}+` : "All eligible ages",
    description: $("#mCourseDesc").value,
    image_url: $("#mCourseImg").value || null,
    sort_order: parseInt($("#mCourseOrder").value)
  };
  if (coursesSupportMinAge()) data.min_age = minAge;
  return data;
}

async function loadFees() {
  allFees = await apiGet("fee_tiers", "order=session_count.asc");
  filterFees();
}

function filterFees() {
  const programId = $("#feeProgramFilter")?.value || "all";
  const q = ($("#feeSearch")?.value || "").toLowerCase().trim();
  let rows = programId === "all" ? allFees : allFees.filter((f) => f.program_id === programId);
  if (q) rows = rows.filter((f) => [programName(f.program_id), f.label, String(f.session_count), String(f.fee_amount)].some((v) => v && v.toLowerCase().includes(q)));
  renderFees(rows);
  const countEl = $("#feeCount");
  if (countEl) countEl.textContent = `${rows.length} of ${allFees.length}`;
}

function renderFees(fees) {
  const emptyEl = $("#feeEmpty");
  if (emptyEl) emptyEl.hidden = fees.length > 0;
  $("#feeBody").innerHTML = fees.map((f) => `
    <tr>
      <td data-label="Program">${esc(programName(f.program_id))}</td>
      <td data-label="Selected Sessions">${f.session_count} selected ${Number(f.session_count) === 1 ? "session" : "sessions"}</td>
      <td data-label="Fee">Rs. ${Number(f.fee_amount || 0).toLocaleString("en-IN")}</td>
      <td data-label="Label">${esc(f.label || "")}</td>
      <td class="row-actions" data-label="Actions">
        <button onclick="editFee('${f.id}')">Edit</button>
        <button onclick="deleteFee('${f.id}', this)" class="del">Delete</button>
      </td>
    </tr>
  `).join("");
}

$("#feeProgramFilter")?.addEventListener("change", filterFees);
$("#feeSearch")?.addEventListener("input", filterFees);

window.editFee = function(id) {
  const fee = allFees.find((f) => f.id === id);
  openModal("Edit Fee Tier", `
    <label>Program <select id="mFeeProgram" required>${programOptions(fee.program_id)}</select></label>
    <label>Number of selected sessions <input id="mFeeCount" type="number" min="1" value="${fee.session_count}" required></label>
    <label>Fee Amount (Rs.) <input id="mFeeAmount" type="number" min="0" value="${fee.fee_amount}" required></label>
    <label>Public label <input id="mFeeLabel" value="${esc(fee.label || "")}" placeholder="Example: Any 2 sessions"></label>
  `, async () => {
    await apiUpdate("fee_tiers", id, {
      program_id: $("#mFeeProgram").value,
      session_count: parseInt($("#mFeeCount").value),
      fee_amount: parseInt($("#mFeeAmount").value),
      label: $("#mFeeLabel").value
    });
    await loadFees();
    renderDashboard();
  });
};

window.deleteFee = async function(id, button) {
  if (!confirm("Delete this fee tier?")) return;
  await runAdminAction(async () => {
    await apiDelete("fee_tiers", id);
    await loadFees();
    renderDashboard();
  }, "Fee tier deleted.", button);
};

$("#addFeeBtn").addEventListener("click", () => {
  openModal("Add Fee Tier", `
    <label>Program <select id="mFeeProgram" required>${programOptions(programs[0]?.id)}</select></label>
    <label>Number of selected sessions <input id="mFeeCount" type="number" min="1" value="1" required></label>
    <label>Fee Amount (Rs.) <input id="mFeeAmount" type="number" min="0" value="0" required></label>
    <label>Public label <input id="mFeeLabel" placeholder="Example: Any 1 session"></label>
  `, async () => {
    await apiInsert("fee_tiers", {
      program_id: $("#mFeeProgram").value,
      session_count: parseInt($("#mFeeCount").value),
      fee_amount: parseInt($("#mFeeAmount").value),
      label: $("#mFeeLabel").value
    });
    await loadFees();
    renderDashboard();
  });
});

// --- GALLERY (with image upload) ---
async function loadGallery() {
  allGalleryImages = await apiGet("gallery_images", "order=sort_order.asc");
  filterGallery();
}

function filterGallery() {
  const status = $("#galleryStatusFilter")?.value || "all";
  const q = ($("#gallerySearch")?.value || "").toLowerCase().trim();
  let rows = allGalleryImages;
  if (status === "active") rows = rows.filter((img) => img.is_active !== false);
  if (status === "inactive") rows = rows.filter((img) => img.is_active === false);
  if (q) rows = rows.filter((img) => [img.alt_text, img.image_url].some((v) => v && v.toLowerCase().includes(q)));
  renderGallery(rows);
  const countEl = $("#galleryCount");
  if (countEl) countEl.textContent = `${rows.length} of ${allGalleryImages.length}`;
}

function renderGallery(images) {
  const emptyEl = $("#galleryEmpty");
  if (emptyEl) emptyEl.hidden = images.length > 0;
  $("#galleryGrid").innerHTML = images.map((img) => `
    <div class="gallery-card">
      <img src="${esc(img.image_url)}" alt="${esc(img.alt_text)}" onerror="this.style.background='#eee';this.style.minHeight='150px'">
      <div class="gallery-card-info">${esc(img.alt_text)}</div>
      <div class="gallery-card-actions">
        <button class="btn ghost small" onclick="editImage('${img.id}')">Edit</button>
        <button class="btn ghost small" onclick="deleteImage('${img.id}', this)">Delete</button>
        <button type="button" class="toggle ${img.is_active ? "on" : ""}" onclick="toggleImage('${img.id}', ${!img.is_active}, this)" style="margin-left:auto" aria-label="${img.is_active ? "Deactivate" : "Activate"} gallery image"></button>
      </div>
    </div>
  `).join("");
}

$("#gallerySearch")?.addEventListener("input", filterGallery);
$("#galleryStatusFilter")?.addEventListener("change", filterGallery);

window.toggleImage = async function(id, active, button) {
  await runAdminAction(async () => {
    await apiUpdate("gallery_images", id, { is_active: active });
    await loadGallery();
  }, active ? "Gallery image activated." : "Gallery image deactivated.", button);
};

window.editImage = async function(id) {
  const imgs = await apiGet("gallery_images", `id=eq.${id}`);
  const img = imgs[0];
  openModal("Edit Image", `
    ${img.image_url ? `<img src="${esc(img.image_url)}" style="margin-bottom:12px">` : ""}
    <label>Upload New Image <input id="mImgFile" type="file" accept="image/*"></label>
    <small style="color:#667085;display:block;margin:-6px 0 8px">Recommended size: <strong>1600 x 900 px</strong> (16:9 ratio, used in hero media)</small>
    <label>Or Image URL <input id="mImgUrl" value="${esc(img.image_url)}"></label>
    <label>Alt Text <input id="mImgAlt" value="${esc(img.alt_text)}" required></label>
    <label>Sort Order <input id="mImgOrder" type="number" value="${img.sort_order}" required></label>
  `, async () => {
    let imageUrl = $("#mImgUrl").value;
    const fileInput = $("#mImgFile");
    if (fileInput.files.length) {
      imageUrl = await uploadImage(fileInput.files[0]);
    }
    await apiUpdate("gallery_images", id, {
      image_url: imageUrl,
      alt_text: $("#mImgAlt").value,
      sort_order: parseInt($("#mImgOrder").value)
    });
    await loadGallery();
  });
};

window.deleteImage = async function(id, button) {
  if (!confirm("Delete this image?")) return;
  await runAdminAction(async () => {
    await apiDelete("gallery_images", id);
    await loadGallery();
  }, "Gallery image deleted.", button);
};

$("#addImageBtn").addEventListener("click", () => {
  openModal("Add Image", `
    <label>Upload Image <input id="mImgFile" type="file" accept="image/*"></label>
    <small style="color:#667085;display:block;margin:-6px 0 8px">Recommended size: <strong>1600 x 900 px</strong> (16:9 ratio, used in hero media)</small>
    <label>Or Image URL <input id="mImgUrl" placeholder="https://..."></label>
    <label>Alt Text <input id="mImgAlt" placeholder="Description of image" required></label>
    <label>Sort Order <input id="mImgOrder" type="number" value="0" required></label>
  `, async () => {
    let imageUrl = $("#mImgUrl").value;
    const fileInput = $("#mImgFile");
    if (fileInput.files.length) {
      imageUrl = await uploadImage(fileInput.files[0]);
    }
    if (!imageUrl) throw new Error("Please upload an image or enter a URL");
    await apiInsert("gallery_images", {
      image_url: imageUrl,
      alt_text: $("#mImgAlt").value,
      sort_order: parseInt($("#mImgOrder").value)
    });
    await loadGallery();
  });
});

// --- SETTINGS ---
let settingsData = [];

async function loadSettings() {
  settingsData = await apiGet("site_config", "order=key.asc");
  const existingKeys = new Set(settingsData.map((s) => s.key));
  HERO_BACKGROUND_SETTINGS.forEach((setting) => {
    if (!existingKeys.has(setting.key)) {
      settingsData.push({
        key: setting.key,
        value: "",
        description: setting.description,
        is_virtual: true
      });
    }
  });
  renderSettings();
}

// Field type detection for smart inputs
const SETTING_TYPES = {
  event_start_date: "date",
  event_end_date: "date",
  registration_deadline: "datetime",
  hostel_only_fee: "number",
  hostel_food_fee: "number",
  mess_meal_fee: "number",
  mess_meals_per_day: "number",
  max_seats: "number",
  upi_id: "text",
  hero_bg_campus: "image-url",
  hero_bg_online: "image-url",
  hero_bg_staff_camp: "image-url",
  hero_bg_skills: "image-url",
  hero_bg_immersion: "image-url",
};

const SETTING_LABELS = {
  event_start_date: "Global fallback start date",
  event_end_date: "Global fallback end date",
  registration_deadline: "Global fallback registration deadline",
  max_seats: "Legacy global seats fallback",
  hostel_only_fee: "Non-AC hostel bed daily rate",
  hostel_food_fee: "AC hostel bed daily rate",
  mess_meal_fee: "Mess meal rate",
  mess_meals_per_day: "Mess meals per day",
  upi_id: "Legacy UPI ID (not shown to users)"
};

const SETTING_GROUPS = [
  {
    title: "Event & Contact",
    description: "Main public contact details and global fallback dates.",
    keys: ["event_name", "event_year", "university_name", "address", "contact_email", "contact_phone_1", "contact_phone_2", "director_email", "program_director", "project_manager_1", "project_manager_2", "event_start_date", "event_end_date", "registration_deadline"]
  },
  {
    title: "Hostel & Food Defaults",
    description: "Used only when a program allows optional accommodation or mess add-ons.",
    keys: ["hostel_only_fee", "hostel_food_fee", "mess_meal_fee", "mess_meals_per_day"]
  },
  {
    title: "Legacy / Fallback Values",
    description: "Kept for older flows and empty program fallback states.",
    keys: ["max_seats", "upi_id"]
  },
  {
    title: "Hero Backgrounds",
    description: "Desktop/tablet hero backgrounds per program, independent from the scrolling gallery.",
    keys: HERO_BACKGROUND_SETTINGS.map((setting) => setting.key)
  }
];

function settingInput(key, value) {
  const type = SETTING_TYPES[key];
  if (type === "image-url") {
    return `<div style="display:grid;gap:8px">
      ${value ? `<img src="${esc(value)}" alt="" style="width:100%;max-height:160px;object-fit:cover;border-radius:10px;border:1px solid #e5e7eb">` : ""}
      <input data-key="${esc(key)}" value="${esc(value)}" placeholder="https://...">
      <input type="file" accept="image/*" data-bg-upload-key="${esc(key)}">
      <div class="desc">Upload a separate background here. This is independent from Gallery scrolling images. Recommended: 1600 x 900 px.</div>
    </div>`;
  }
  if (type === "date") {
    // value like "2026-06-16" — native date picker
    return `<input type="date" data-key="${esc(key)}" value="${esc(value)}" min="2025-01-01" max="2030-12-31">`;
  }
  if (type === "datetime") {
    // value like "2026-06-10T23:59:59+05:30" — split into date + time
    let dateVal = "", timeVal = "23:59";
    if (value) {
      const dt = new Date(value);
      if (!isNaN(dt)) {
        // Convert to IST for display
        const ist = new Date(dt.getTime() + (330 - dt.getTimezoneOffset()) * 60000);
        dateVal = ist.toISOString().slice(0, 10);
        timeVal = ist.toISOString().slice(11, 16);
      }
    }
    return `<div style="display:flex;gap:8px">
      <input type="date" data-key="${esc(key)}" data-part="date" value="${dateVal}" min="2025-01-01" max="2030-12-31" style="flex:1">
      <input type="time" data-key="${esc(key)}" data-part="time" value="${timeVal}" style="width:120px">
    </div>
    <div class="desc">Timezone: IST (Asia/Kolkata). Date and time combined on save.</div>`;
  }
  if (type === "number") {
    return `<input type="number" data-key="${esc(key)}" value="${esc(value)}" min="0" max="999999">`;
  }
  return `<input data-key="${esc(key)}" value="${esc(value)}">`;
}

function renderSettings() {
  const q = ($("#settingsSearch")?.value || "").toLowerCase().trim();
  const filteredRows = q
    ? settingsData.filter((s) => [
      HERO_BACKGROUND_SETTINGS.find((setting) => setting.key === s.key)?.label,
      SETTING_LABELS[s.key],
      s.key,
      s.description
    ].some((v) => v && v.toLowerCase().includes(q)))
    : settingsData;
  const countEl = $("#settingsCount");
  if (countEl) countEl.textContent = `${filteredRows.length} of ${settingsData.length}`;
  const emptyEl = $("#settingsEmpty");
  if (emptyEl) emptyEl.hidden = filteredRows.length > 0;

  const rowByKey = new Map(filteredRows.map((row) => [row.key, row]));
  const usedKeys = new Set();
  const renderItem = (s) => {
    usedKeys.add(s.key);
    return `
      <div class="setting-item">
        <label>${esc(HERO_BACKGROUND_SETTINGS.find((setting) => setting.key === s.key)?.label || SETTING_LABELS[s.key] || s.key.replace(/_/g, " "))}</label>
        ${settingInput(s.key, s.value)}
        ${s.description && !SETTING_TYPES[s.key]?.startsWith("datetime") ? `<div class="desc">${esc(s.description)}</div>` : ""}
      </div>
    `;
  };

  const grouped = SETTING_GROUPS.map((group) => {
    const items = group.keys.map((key) => rowByKey.get(key)).filter(Boolean);
    if (!items.length) return "";
    return `
      <section class="settings-card">
        <div class="settings-card-head">
          <h3>${esc(group.title)}</h3>
          <p>${esc(group.description)}</p>
        </div>
        <div class="settings-card-grid">
          ${items.map(renderItem).join("")}
        </div>
      </section>
    `;
  }).join("");

  const leftovers = filteredRows.filter((row) => !usedKeys.has(row.key));
  $("#settingsGrid").innerHTML = grouped + (leftovers.length ? `
    <section class="settings-card">
      <div class="settings-card-head">
        <h3>Other Settings</h3>
        <p>Advanced values that do not belong to the main admin groups.</p>
      </div>
      <div class="settings-card-grid">
        ${leftovers.map(renderItem).join("")}
      </div>
    </section>
  ` : "");
}

$("#settingsSearch")?.addEventListener("input", renderSettings);

function getSettingsValues() {
  const values = {};
  const inputs = $$("#settingsGrid input[data-key]");
  inputs.forEach((input) => {
    const key = input.dataset.key;
    const part = input.dataset.part;
    if (part === "date" || part === "time") {
      // Datetime split field — combine date + time into IST ISO string
      if (!values[key]) values[key] = { date: "", time: "23:59" };
      values[key][part] = input.value;
    } else {
      values[key] = input.value;
    }
  });
  // Resolve datetime pairs
  for (const key of Object.keys(values)) {
    const v = values[key];
    if (v && typeof v === "object" && "date" in v) {
      if (!v.date) {
        showToast(`"${key.replace(/_/g, " ")}" requires a date.`, "error");
        return null;
      }
      values[key] = `${v.date}T${v.time || "23:59"}:00+05:30`;
    }
  }
  return values;
}

$("#saveSettingsBtn").addEventListener("click", async (event) => {
  await runAdminAction(async () => {
    const values = getSettingsValues();
    if (!values) throw new Error("Please fix the highlighted settings before saving.");

    const bgUploads = $$("#settingsGrid input[data-bg-upload-key]");
    for (const input of bgUploads) {
      if (input.files.length) {
        values[input.dataset.bgUploadKey] = await uploadImage(input.files[0]);
      }
    }

    const updates = [];
    for (const [key, value] of Object.entries(values)) {
      const orig = settingsData.find((s) => s.key === key);
      if (orig && !orig.is_virtual && orig.value !== value) {
        if (!value && ["event_start_date", "event_end_date", "registration_deadline"].includes(key)) {
          throw new Error(`"${key.replace(/_/g, " ")}" cannot be empty.`);
        }
        updates.push(api(`site_config?key=eq.${key}`, {
          method: "PATCH",
          headers: { ...authHeaders(), "Prefer": "return=representation" },
          body: JSON.stringify({ value, updated_at: new Date().toISOString() })
        }));
      } else if ((!orig || orig.is_virtual) && value) {
        const heroSetting = HERO_BACKGROUND_SETTINGS.find((setting) => setting.key === key);
        updates.push(apiInsert("site_config", {
          key,
          value,
          description: heroSetting?.description || "",
          updated_at: new Date().toISOString()
        }));
      }
    }
    if (updates.length) {
      await Promise.all(updates);
      await loadSettings();
    } else {
      throw new Error("No changes to save.");
    }
  }, "Settings saved.", event.currentTarget);
});

// --- MODAL ---
let modalSaveCallback = null;
let modalInitialState = "";

function openModal(title, bodyHtml, onSave) {
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = bodyHtml;
  $("#modalOverlay").hidden = false;
  $("#modalSave").hidden = false;
  modalSaveCallback = onSave;
  if (!onSave) {
    $("#modalSave").hidden = true;
  }
  // Snapshot initial form state for dirty checking
  requestAnimationFrame(() => {
    modalInitialState = getModalFormState();
  });
}

function getModalFormState() {
  const inputs = $$("#modalBody input, #modalBody select, #modalBody textarea");
  return [...inputs].map((i) => i.type === "file" ? i.files.length : i.value).join("\x00");
}

function isModalDirty() {
  if (!modalSaveCallback) return false;
  return getModalFormState() !== modalInitialState;
}

function validateModalFields() {
  const fields = $$("#modalBody input, #modalBody select, #modalBody textarea");
  for (const field of fields) {
    if (field.disabled) continue;
    field.classList.remove("field-invalid");
    if (field.required && !String(field.value || "").trim()) {
      field.classList.add("field-invalid");
      field.focus();
      showToast("Please complete the highlighted required field.", "error");
      return false;
    }
    if (!field.checkValidity()) {
      field.classList.add("field-invalid");
      field.focus();
      showToast(field.validationMessage || "Please check the highlighted field.", "error");
      return false;
    }
  }
  return true;
}

function closeModal() {
  $("#modalOverlay").hidden = true;
  modalSaveCallback = null;
  modalInitialState = "";
}

function tryCloseModal() {
  if (isModalDirty()) {
    if (!confirm("You have unsaved changes. Discard and close?")) return;
  }
  closeModal();
}

$("#modalClose").addEventListener("click", tryCloseModal);
$("#modalCancel").addEventListener("click", tryCloseModal);
$("#modalOverlay").addEventListener("click", (e) => {
  if (e.target === $("#modalOverlay")) tryCloseModal();
});

$("#modalSave").addEventListener("click", async () => {
  if (modalSaveCallback) {
    if (!validateModalFields()) return;
    const btn = $("#modalSave");
    btn.disabled = true;
    btn.textContent = "Saving...";
    try {
      await modalSaveCallback();
      closeModal();
      showToast("Saved successfully.", "success");
    } catch (err) {
      showToast(err.message || "Could not save.", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Save";
    }
  }
});

// --- Utility ---
function esc(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
