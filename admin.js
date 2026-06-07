/* =====================================================================
   LPU SUMMER SCHOOL — ADMIN (rebuild)
   Dependency-free. Talks to Supabase via raw fetch (CSP: script-src 'self').
   Keeps the existing secure DB/RLS/RPCs; this is a clean client + UI.
   ===================================================================== */
"use strict";

const SUPABASE_URL = "https://bynpuhoysivxxlblxica.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bnB1aG95c2l2eHhsYmx4aWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTE1NjAsImV4cCI6MjA5NDQ4NzU2MH0.JltZJYggs2ycs3u0HUelRMivZgsByW_g5-n3qz6EaPk";
const SESSION_KEY = "lpu_admin_session";
const REG_PAGE_SIZE = 50;

/* ---------- state ---------- */
const state = {
  programs: [], sessions: [], courses: [], fees: [],
  registrations: [], gallery: [], settings: [],
  regPage: 1,
};

const SETTING_LABELS = {
  event_name: "Event name", event_year: "Event year", university_name: "University name",
  address: "Full address", contact_email: "Contact email", contact_phone_1: "Contact phone 1",
  contact_phone_2: "Contact phone 2", director_email: "Director email", program_director: "Program director",
  project_manager_1: "Program manager 1", project_manager_2: "Program manager 2",
  event_start_date: "Event start date", event_end_date: "Event end date",
  registration_deadline: "Registration deadline", max_seats: "Max seats", upi_id: "UPI id",
  hostel_only_fee: "Non-AC hostel fee / day", hostel_food_fee: "AC hostel fee / day",
  mess_meal_fee: "Mess meal fee / meal", mess_meals_per_day: "Mess meals per day",
};
const FEE_MODE_LABELS = { session_count: "Per selected session", package: "Fixed program price", to_be_announced: "Fee not announced" };
const ACCOMMODATION_LABELS = { none: "None", optional: "Optional add-ons", included: "Included in fee" };
const SCHEDULE_LABELS = { selectable: "Parent selects", fixed: "Fixed schedule" };

/* ---------- tiny utils ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const fmtFee = (n) => "Rs. " + Number(n || 0).toLocaleString("en-IN");
const fmtDate = (iso) => { if (!iso) return "—"; const d = new Date(iso); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };
const fmtDateTime = (iso) => { if (!iso) return "—"; const d = new Date(iso); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); };
const todayKey = () => new Date().toLocaleDateString("en-CA");
function debounce(fn, ms = 220) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

function toast(msg, type = "") {
  const region = $("[data-toasts]");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  region.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 250); }, 3200);
}

/* ---------- client-side image compression (canvas, no deps) ---------- */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read this image")); };
    img.src = url;
  });
}
async function compressImage(file, { maxDim = 1600, quality = 0.82 } = {}) {
  if (!file || !file.type.startsWith("image/")) return file;
  let loaded;
  try { loaded = await loadImage(file); } catch { return file; } // e.g. HEIC browsers can't decode → upload as-is
  const { img, url } = loaded;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) { URL.revokeObjectURL(url); return file; }
  ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(url);
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!blob || blob.size >= file.size) return file; // didn't help → keep original
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
}
const fmtKB = (bytes) => bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(bytes / 1024)) + " KB";

/* ---------- upload-only image field (compress → show → upload) ---------- */
let imageUploadsInFlight = 0;
function imageField(label, name, url = "") {
  return `<div class="field image-field" data-image-field>
    <label>${esc(label)}</label>
    <input type="hidden" name="${name}" value="${esc(url || "")}">
    <div class="image-up">
      <div class="image-up-preview" data-image-preview>${url ? `<img src="${esc(url)}" alt="">` : `<span>No image yet</span>`}</div>
      <div class="image-up-side">
        <button type="button" class="btn btn-ghost btn-sm" data-image-pick>${url ? "Replace image" : "Upload image"}</button>
        <input type="file" accept="image/*" data-image-input hidden>
        <p class="image-up-status" data-image-status></p>
      </div>
    </div>
  </div>`;
}
function setImageBusy(delta) {
  imageUploadsInFlight = Math.max(0, imageUploadsInFlight + delta);
  const saveBtn = $("[data-modal-save]");
  if (saveBtn) saveBtn.disabled = imageUploadsInFlight > 0;
}
function wireImageFields(scope) {
  scope.querySelectorAll("[data-image-field]").forEach((fieldEl) => {
    const pick = fieldEl.querySelector("[data-image-pick]");
    const input = fieldEl.querySelector("[data-image-input]");
    const hidden = fieldEl.querySelector('input[type="hidden"]');
    const preview = fieldEl.querySelector("[data-image-preview]");
    const status = fieldEl.querySelector("[data-image-status]");
    pick.addEventListener("click", () => { if (!imageUploadsInFlight) input.click(); });
    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      setImageBusy(1);
      status.textContent = "Compressing photo…";
      try {
        const compressed = await compressImage(file);
        const local = URL.createObjectURL(compressed);
        preview.innerHTML = `<img src="${local}" alt="">`;
        status.textContent = `Uploading… (${fmtKB(file.size)} → ${fmtKB(compressed.size)})`;
        const uploadedUrl = await api.uploadImage(compressed);
        hidden.value = uploadedUrl;
        pick.textContent = "Replace image";
        status.innerHTML = `<span class="image-ok">Ready ✓ ${fmtKB(file.size)} → ${fmtKB(compressed.size)}</span>`;
      } catch (e) {
        status.innerHTML = `<span class="image-err">${esc(e.message || "Upload failed")}</span>`;
      } finally {
        setImageBusy(-1);
      }
    });
  });
}

/* =====================================================================
   API layer
   ===================================================================== */
const api = {
  accessToken: null, refreshToken: null, email: null, expiresAt: 0,

  authHeaders(json = true) {
    const h = { apikey: SUPABASE_ANON, Authorization: `Bearer ${this.accessToken || SUPABASE_ANON}` };
    if (json) h["Content-Type"] = "application/json";
    return h;
  },

  saveSession() {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      access_token: this.accessToken, refresh_token: this.refreshToken, email: this.email, expires_at: this.expiresAt,
    }));
  },
  loadSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!s) return false;
      this.accessToken = s.access_token; this.refreshToken = s.refresh_token; this.email = s.email; this.expiresAt = s.expires_at || 0;
      return !!this.refreshToken;
    } catch { return false; }
  },
  clearSession() {
    this.accessToken = this.refreshToken = this.email = null; this.expiresAt = 0;
    localStorage.removeItem(SESSION_KEY);
  },

  async login(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || "Sign in failed");
    this.setTokens(data);
  },
  async refresh() {
    if (!this.refreshToken) throw new Error("No session");
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON },
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || "Session expired");
    this.setTokens(data);
  },
  setTokens(data) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token || this.refreshToken;
    this.email = data.user?.email || this.email;
    this.expiresAt = Date.now() + (Number(data.expires_in || 3600) * 1000);
    this.saveSession();
  },
  async ensureFresh() {
    if (this.accessToken && Date.now() < this.expiresAt - 60000) return;
    await this.refresh();
  },
  async recover(email) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.msg || "Could not send reset email"); }
  },
  async changePassword(password) {
    await this.ensureFresh();
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: "PUT", headers: this.authHeaders(), body: JSON.stringify({ password }),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.msg || "Could not update password"); }
  },

  async rest(path, { method = "GET", body, representation = false } = {}) {
    await this.ensureFresh();
    const headers = this.authHeaders();
    if (representation) headers.Prefer = "return=representation";
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) { const t = await res.text().catch(() => ""); throw new Error(t || `Request failed (${res.status})`); }
    if (method === "DELETE" || res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },
  async rpc(name, args = {}) {
    await this.ensureFresh();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: "POST", headers: this.authHeaders(), body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error(`RPC ${name} failed`);
    return res.json();
  },
  async isAdmin() {
    try { return (await this.rpc("is_admin")) === true; } catch { return false; }
  },
  async signScreenshot(pathOrUrl) {
    const marker = "/payment-screenshots/";
    const i = String(pathOrUrl || "").indexOf(marker);
    const path = i === -1 ? pathOrUrl : pathOrUrl.slice(i + marker.length);
    if (!path) return "";
    try {
      await this.ensureFresh();
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/payment-screenshots/${path}`, {
        method: "POST", headers: this.authHeaders(), body: JSON.stringify({ expiresIn: 3600 }),
      });
      if (!res.ok) return "";
      const data = await res.json();
      return data?.signedURL ? `${SUPABASE_URL}/storage/v1${data.signedURL}` : "";
    } catch { return ""; }
  },
  async sendEdgeEmail(payload) {
    await this.ensureFresh();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST", headers: this.authHeaders(), body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Email could not be sent");
    return data;
  },
  async uploadImage(file) {
    await this.ensureFresh();
    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "-").toLowerCase();
    const name = `${Date.now()}-${Math.round(performance.now())}-${safe}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${name}`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${this.accessToken}`, "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!res.ok) throw new Error("Image upload failed");
    return `${SUPABASE_URL}/storage/v1/object/public/images/${name}`;
  },
};

/* =====================================================================
   Boot + auth flow
   ===================================================================== */
async function boot() {
  if (api.loadSession()) {
    try {
      await api.ensureFresh();
      if (await api.isAdmin()) { return enterApp(); }
    } catch { /* fall through to login */ }
    api.clearSession();
  }
  showLogin();
}

function showLogin() {
  $("[data-app]").hidden = true;
  $("[data-login-view]").hidden = false;
}

async function enterApp() {
  $("[data-login-view]").hidden = true;
  $("[data-app]").hidden = false;
  $("[data-admin-email]").textContent = api.email || "admin";
  $("[data-admin-initial]").textContent = (api.email || "A").charAt(0);
  await loadAll();
  switchView("dashboard");
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = $("[data-login-submit]");
  const errEl = $("[data-login-error]");
  const email = $('[data-login-form] [name="email"]').value.trim();
  const password = $('[data-login-form] [name="password"]').value;
  errEl.textContent = "";
  btn.disabled = true; btn.textContent = "Signing in…";
  try {
    await api.login(email, password);
    if (!(await api.isAdmin())) { api.clearSession(); throw new Error("This account is not an admin."); }
    api.saveSession();
    await enterApp();
  } catch (err) {
    errEl.textContent = err.message || "Sign in failed";
  } finally {
    btn.disabled = false; btn.textContent = "Sign in";
  }
}

function logout() { api.clearSession(); location.reload(); }

/* =====================================================================
   Data load
   ===================================================================== */
async function loadAll() {
  try {
    const [programs, sessions, courses, fees, registrations, gallery, settings] = await Promise.all([
      api.rest("programs?select=*&order=sort_order.asc"),
      api.rest("sessions?select=*&order=sort_order.asc"),
      api.rest("courses?select=*&order=sort_order.asc"),
      api.rest("fee_tiers?select=*&order=session_count.asc"),
      api.rest("registrations?select=*&order=created_at.desc"),
      api.rest("gallery_images?select=*&order=sort_order.asc"),
      api.rest("site_config?select=*"),
    ]);
    state.programs = programs || []; state.sessions = sessions || []; state.courses = courses || [];
    state.fees = fees || []; state.registrations = registrations || []; state.gallery = gallery || [];
    state.settings = settings || [];
    populateFilters();
    renderActive();
    updateNavBadge();
  } catch (err) {
    toast("Could not load data. " + (err.message || ""), "error");
  }
}

const programName = (id) => state.programs.find((p) => p.id === id)?.name || "—";
const sessionName = (id) => { const s = state.sessions.find((x) => x.id === id); return s ? s.name : "—"; };

function populateFilters() {
  const progOpts = '<option value="all">All programs</option>' + state.programs.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("");
  ["[data-reg-program]", "[data-program-active]", "[data-session-program]", "[data-course-program]", "[data-fee-program]"].forEach(() => {});
  $$("[data-reg-program],[data-session-program],[data-course-program],[data-fee-program]").forEach((sel) => {
    const cur = sel.value; sel.innerHTML = progOpts; sel.value = cur || "all";
  });
  const sessOpts = '<option value="all">All sessions</option>' + state.sessions.map((s) => `<option value="${s.id}">${esc(s.name)} — ${esc(programName(s.program_id))}</option>`).join("");
  const cs = $("[data-course-session]"); if (cs) { const c = cs.value; cs.innerHTML = sessOpts; cs.value = c || "all"; }
}

function updateNavBadge() {
  const pending = state.registrations.filter((r) => r.payment_status === "verification_pending").length;
  const badge = $("[data-nav-pending]");
  badge.hidden = pending === 0;
  badge.textContent = pending;
}

/* =====================================================================
   Navigation
   ===================================================================== */
const VIEW_TITLES = { dashboard: "Dashboard", registrations: "Registrations", programs: "Programs", sessions: "Sessions", courses: "Courses", fees: "Fee tiers", gallery: "Gallery", settings: "Site settings", yearly: "New season" };
let currentView = "dashboard";

function switchView(view) {
  currentView = view;
  $$(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.panel === view));
  $("[data-page-title]").textContent = VIEW_TITLES[view] || "Admin";
  $("[data-app]").classList.remove("nav-open");
  renderActive();
}

function renderActive() {
  ({ dashboard: renderDashboard, registrations: renderRegistrations, programs: renderPrograms,
     sessions: renderSessions, courses: renderCourses, fees: renderFees, gallery: renderGallery,
     settings: renderSettings, yearly: renderYearly }[currentView] || (() => {}))();
}

/* =====================================================================
   Dashboard
   ===================================================================== */
function renderDashboard() {
  const regs = state.registrations;
  const pending = regs.filter((r) => r.payment_status === "verification_pending");
  const verified = regs.filter((r) => r.payment_status === "paid");
  const today = regs.filter((r) => (r.created_at || "").slice(0, 10) === todayKey());
  const revenue = verified.reduce((s, r) => s + Number(r.total_fee || 0), 0);

  $("[data-stat-grid]").innerHTML = [
    statCard("Total registrations", regs.length, "All submitted records", "orange"),
    statCard("Pending payments", pending.length, "Need screenshot review", "amber"),
    statCard("Verified payments", verified.length, "Confirmed paid", "green"),
    statCard("Verified revenue", fmtFee(revenue), `${today.length} new today`, "blue"),
  ].join("");

  const attention = $("[data-attention]");
  attention.innerHTML = pending.length
    ? pending.slice(0, 6).map((r) => `
        <div class="stack-row">
          <div class="grow"><strong>${esc(r.student_name)}</strong><small>${esc(r.program_name || "—")} · ${fmtFee(r.total_fee)} · ${fmtDateTime(r.created_at)}</small></div>
          <button class="btn btn-ghost btn-sm" data-open-reg="${r.id}">Review</button>
        </div>`).join("")
    : `<p class="stack-empty">All payments reviewed. Nothing pending 🎉</p>`;

  const health = $("[data-program-health]");
  health.innerHTML = state.programs.length
    ? state.programs.map((p) => {
        const courseCount = state.courses.filter((c) => c.program_id === p.id).length;
        const ready = p.fee_status === "ready" && courseCount > 0;
        return `<div class="stack-row">
          <div class="grow"><strong>${esc(p.name)}</strong><small>${courseCount} courses · ${p.is_active ? "Active" : "Hidden"}</small></div>
          <span class="badge ${ready ? "green" : "amber"}">${ready ? "Ready" : "Needs setup"}</span>
        </div>`;
      }).join("")
    : `<p class="stack-empty">No programs yet.</p>`;
}
function statCard(label, value, sub, color) {
  return `<article class="stat is-${color}"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-sub">${esc(sub)}</div></article>`;
}

/* =====================================================================
   Registrations
   ===================================================================== */
function filteredRegistrations() {
  const q = $("[data-reg-search]").value.trim().toLowerCase();
  const status = $("[data-reg-status]").value;
  const payment = $("[data-reg-payment]").value;
  const program = $("[data-reg-program]").value;
  return state.registrations.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (payment !== "all" && r.payment_status !== payment) return false;
    if (program !== "all" && r.program_id !== program) return false;
    if (q) {
      const hay = [r.student_name, r.guardian_name, r.school_name, r.phone, r.email, r.payment_reference, r.program_name].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function paymentBadge(r) {
  const map = { paid: ["green", "Verified"], verification_pending: ["amber", "Needs review"], unpaid: ["gray", "Unpaid"], failed: ["red", "Rejected"] };
  const [cls, label] = map[r.payment_status] || ["gray", r.payment_status || "—"];
  return `<span class="badge ${cls}">${label}</span>`;
}
function statusBadge(r) {
  const map = { confirmed: ["green", "Confirmed"], pending: ["amber", "Pending"], cancelled: ["gray", "Cancelled"], rejected: ["red", "Rejected"] };
  const [cls, label] = map[r.status] || ["gray", r.status || "—"];
  return `<span class="badge ${cls}">${label}</span>`;
}

function renderRegistrations() {
  const rows = filteredRegistrations();
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / REG_PAGE_SIZE));
  if (state.regPage > pages) state.regPage = 1;
  const start = (state.regPage - 1) * REG_PAGE_SIZE;
  const pageRows = rows.slice(start, start + REG_PAGE_SIZE);

  $("[data-reg-count]").textContent = `${total} registration${total === 1 ? "" : "s"}`;
  $("[data-reg-empty]").hidden = total !== 0;
  $("[data-reg-body]").innerHTML = pageRows.map((r) => `
    <tr>
      <td class="cell-sub">${fmtDateTime(r.created_at)}</td>
      <td class="cell-strong">${esc(r.student_name)}</td>
      <td>${esc(r.program_name || "—")}</td>
      <td class="cell-sub">${r.student_age ? r.student_age + " yrs" : "—"} · ${esc(r.class_level || "")}</td>
      <td>${esc(r.guardian_name || "—")}</td>
      <td class="cell-sub">${esc(r.phone || "—")}</td>
      <td class="cell-strong">${fmtFee(r.total_fee)}</td>
      <td>${paymentBadge(r)}</td>
      <td>${statusBadge(r)}</td>
      <td class="row-actions"><button class="btn btn-ghost btn-sm" data-open-reg="${r.id}">View</button></td>
    </tr>`).join("");

  renderPagination(pages);
}

function renderPagination(pages) {
  const wrap = $("[data-reg-pagination]");
  wrap.hidden = pages <= 1;
  if (pages <= 1) { wrap.innerHTML = ""; return; }
  let html = `<button ${state.regPage === 1 ? "disabled" : ""} data-page="${state.regPage - 1}">‹</button>`;
  for (let i = 1; i <= pages; i++) html += `<button class="${i === state.regPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  html += `<button ${state.regPage === pages ? "disabled" : ""} data-page="${state.regPage + 1}">›</button>`;
  wrap.innerHTML = html;
}

async function openRegistration(id) {
  const r = state.registrations.find((x) => x.id === id);
  if (!r) return;
  const courses = Array.isArray(r.course_names) ? r.course_names : [];
  const detail = `
    <div class="modal-detail">
      <dl>
        <dt>Submitted</dt><dd>${fmtDateTime(r.created_at)}</dd>
        <dt>Student</dt><dd>${esc(r.student_name)} (${r.student_age || "?"} yrs, ${esc(r.class_level || "")})</dd>
        <dt>School / city</dt><dd>${esc(r.school_name || "—")}, ${esc(r.city || "—")}</dd>
        <dt>Guardian</dt><dd>${esc(r.guardian_name || "—")}</dd>
        <dt>Phone</dt><dd>${esc(r.phone || "—")} · emergency ${esc(r.emergency_phone || "—")}</dd>
        <dt>Email</dt><dd>${esc(r.email || "—")}</dd>
        <dt>Program</dt><dd>${esc(r.program_name || "—")}</dd>
        <dt>Classes</dt><dd>${courses.length ? courses.map(esc).join(", ") : "—"}</dd>
        <dt>Stay</dt><dd>${esc(r.hostel_option || "none")}${r.hostel_amount ? " · " + fmtFee(r.hostel_amount) : ""}</dd>
        <dt>Fee</dt><dd><strong>${fmtFee(r.total_fee)}</strong> (program ${fmtFee(r.session_fee)} + stay ${fmtFee(r.hostel_amount)})</dd>
        <dt>Payment ref</dt><dd>${esc(r.payment_reference || "—")}</dd>
        <dt>Payment</dt><dd>${paymentBadge(r)} ${statusBadge(r)}</dd>
        ${r.medical_note ? `<dt>Medical note</dt><dd>${esc(r.medical_note)}</dd>` : ""}
        ${r.verified_by ? `<dt>Verified by</dt><dd>${esc(r.verified_by)} · ${fmtDateTime(r.verified_at)}</dd>` : ""}
        ${r.payment_review_note ? `<dt>Review note</dt><dd>${esc(r.payment_review_note)}</dd>` : ""}
      </dl>
      <div class="modal-screenshot" data-shot>${r.screenshot_url ? `<p class="field-hint">Loading payment screenshot…</p>` : `<p class="field-hint">No payment screenshot uploaded.</p>`}</div>
    </div>`;

  const footer = `
    <button class="btn btn-ghost" data-modal-cancel>Close</button>
    ${r.payment_status !== "failed" ? `<button class="btn btn-danger" data-reg-reject>Reject payment</button>` : ""}
    ${r.payment_status !== "paid" ? `<button class="btn btn-primary" data-reg-verify>Verify &amp; confirm</button>` : ""}`;

  openModal({ title: `Registration · ${r.student_name}`, bodyHTML: detail, footerHTML: footer });

  if (r.screenshot_url) {
    const signed = await api.signScreenshot(r.screenshot_url);
    const shot = $("[data-shot]");
    if (shot) shot.innerHTML = signed
      ? `<a href="${signed}" target="_blank" rel="noopener"><img src="${signed}" alt="Payment screenshot"></a>`
      : `<p class="field-hint">Could not load screenshot.</p>`;
  }
  const verifyBtn = $("[data-reg-verify]"); if (verifyBtn) verifyBtn.addEventListener("click", () => verifyRegistration(r));
  const rejectBtn = $("[data-reg-reject]"); if (rejectBtn) rejectBtn.addEventListener("click", () => rejectRegistration(r));
}

async function verifyRegistration(r) {
  try {
    await api.rest(`registrations?id=eq.${r.id}`, { method: "PATCH", body: {
      status: "confirmed", payment_status: "paid", verified_by: api.email, verified_at: new Date().toISOString(), payment_review_note: null,
    }});
    Object.assign(r, { status: "confirmed", payment_status: "paid", verified_by: api.email });
    closeModal(); toast("Payment verified — registration confirmed.", "success");
    updateNavBadge(); renderActive();
    // Best-effort confirmation email to the registrant (never blocks the verify).
    if (r.email && r.payment_reference) {
      try {
        await api.sendEdgeEmail({ type: "payment_verified", registration_id: r.id, payment_reference: r.payment_reference });
        toast(`Confirmation email sent to ${r.email}.`, "success");
      } catch {
        toast("Verified ✓ — but the confirmation email did not send.", "error");
      }
    }
  } catch (e) { toast("Verify failed: " + e.message, "error"); }
}

function rejectRegistration(r) {
  openModal({
    title: "Reject payment",
    bodyHTML: `<div class="field"><label>Reason (shown internally)</label><textarea data-reject-note placeholder="e.g. screenshot unreadable / amount mismatch"></textarea></div>`,
    footerHTML: `<button class="btn btn-ghost" data-modal-cancel>Cancel</button><button class="btn btn-danger" data-confirm-reject>Reject payment</button>`,
  });
  $("[data-confirm-reject]").addEventListener("click", async () => {
    const note = $("[data-reject-note]").value.trim();
    try {
      await api.rest(`registrations?id=eq.${r.id}`, { method: "PATCH", body: { payment_status: "failed", payment_review_note: note || "Rejected by admin" } });
      Object.assign(r, { payment_status: "failed", payment_review_note: note });
      closeModal(); toast("Payment marked rejected.", "success"); updateNavBadge(); renderActive();
    } catch (e) { toast("Reject failed: " + e.message, "error"); }
  });
}

function exportRegistrationsCsv() {
  const rows = filteredRegistrations();
  if (!rows.length) { toast("Nothing to export.", "error"); return; }
  const cols = ["created_at", "student_name", "student_age", "class_level", "school_name", "city", "guardian_name", "phone", "email", "emergency_phone", "program_name", "course_names", "hostel_option", "session_fee", "hostel_amount", "total_fee", "payment_status", "status", "payment_reference", "verified_by"];
  const head = cols.join(",");
  const body = rows.map((r) => cols.map((c) => {
    let v = r[c];
    if (Array.isArray(v)) v = v.join(" | ");
    return `"${String(v ?? "").replace(/"/g, '""')}"`;
  }).join(",")).join("\n");
  const blob = new Blob([head + "\n" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `registrations-${todayKey()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`Exported ${rows.length} registrations.`, "success");
}

/* =====================================================================
   Generic CRUD form helpers
   ===================================================================== */
function field(label, name, value, opts = {}) {
  const { type = "text", options, hint, rows = 3, step } = opts;
  let control;
  if (type === "textarea") control = `<textarea name="${name}" rows="${rows}">${esc(value ?? "")}</textarea>`;
  else if (type === "select") control = `<select name="${name}">${options.map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(value ?? "") ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>`;
  else if (type === "checkbox") return `<label class="field field-check"><input type="checkbox" name="${name}" ${value ? "checked" : ""}><span>${esc(label)}</span></label>`;
  else control = `<input type="${type}" name="${name}" value="${esc(value ?? "")}" ${step ? `step="${step}"` : ""}>`;
  return `<label class="field">${esc(label)}${control}${hint ? `<span class="field-hint">${esc(hint)}</span>` : ""}</label>`;
}
function readForm(names) {
  const out = {};
  names.forEach((n) => {
    const el = $(`[data-modal-body] [name="${n}"]`);
    if (!el) return;
    if (el.type === "checkbox") out[n] = el.checked;
    else if (el.type === "number") out[n] = el.value === "" ? null : Number(el.value);
    else out[n] = el.value === "" ? null : el.value;
  });
  return out;
}
async function saveRow(table, id, body, label) {
  try {
    if (id) await api.rest(`${table}?id=eq.${id}`, { method: "PATCH", body });
    else await api.rest(table, { method: "POST", body });
    closeModal(); toast(`${label} saved.`, "success");
    await loadAll();
  } catch (e) { toast(`Save failed: ${e.message}`, "error"); }
}
function confirmDelete(table, id, label, onDone) {
  openModal({
    title: `Delete ${label}?`,
    bodyHTML: `<p>This cannot be undone.</p>`,
    footerHTML: `<button class="btn btn-ghost" data-modal-cancel>Cancel</button><button class="btn btn-danger" data-confirm-del>Delete</button>`,
  });
  $("[data-confirm-del]").addEventListener("click", async () => {
    try { await api.rest(`${table}?id=eq.${id}`, { method: "DELETE" }); closeModal(); toast(`${label} deleted.`, "success"); await loadAll(); onDone && onDone(); }
    catch (e) { toast(`Delete failed: ${e.message}`, "error"); }
  });
}

/* =====================================================================
   Programs
   ===================================================================== */
function renderPrograms() {
  const q = $("[data-program-search]").value.trim().toLowerCase();
  const vis = $("[data-program-active]").value;
  const rows = state.programs.filter((p) => {
    if (vis === "active" && !p.is_active) return false;
    if (vis === "inactive" && p.is_active) return false;
    if (q && !`${p.name} ${p.slug}`.toLowerCase().includes(q)) return false;
    return true;
  });
  $("[data-program-count]").textContent = `${rows.length} program${rows.length === 1 ? "" : "s"}`;
  $("[data-program-empty]").hidden = rows.length !== 0;
  $("[data-program-body]").innerHTML = rows.map((p) => {
    const courseCount = state.courses.filter((c) => c.program_id === p.id).length;
    const ready = p.fee_status === "ready" && courseCount > 0;
    return `<tr>
      <td class="cell-strong">${esc(p.name)}<div class="cell-sub">${esc(p.slug)}</div></td>
      <td class="cell-sub">${esc(p.dates_label || (p.start_date ? fmtDate(p.start_date) + " – " + fmtDate(p.end_date) : "—"))}</td>
      <td class="cell-sub">${esc(p.mode || "—")}</td>
      <td>${p.fee_mode === "session_count" ? "Per session" : fmtFee(p.base_fee)}</td>
      <td><span class="badge ${ready ? "green" : "amber"}">${ready ? "Ready" : "Needs setup"}</span></td>
      <td><button class="pill-toggle ${p.is_active ? "on" : "off"}" data-toggle-active="programs" data-id="${p.id}" data-val="${p.is_active}">${p.is_active ? "Active" : "Hidden"}</button></td>
      <td class="row-actions"><button class="btn btn-ghost btn-sm" data-edit-program="${p.id}">Edit</button></td>
    </tr>`;
  }).join("");
}

function programForm(p = {}) {
  const progSel = (name, val) => field(name === "fee_mode" ? "Fee mode" : name, name, val);
  return [
    `<div class="field-row">${field("Program name", "name", p.name)}${field("Slug (URL id)", "slug", p.slug, { hint: "lowercase, no spaces" })}</div>`,
    field("Short label", "short_label", p.short_label),
    field("Description", "description", p.description, { type: "textarea" }),
    field("CTA context line", "cta_context", p.cta_context),
    `<div class="field-row">${field("Start date", "start_date", p.start_date, { type: "date" })}${field("End date", "end_date", p.end_date, { type: "date" })}</div>`,
    `<div class="field-row">${field("Dates label (override)", "dates_label", p.dates_label, { hint: "blank = auto from dates" })}${field("Date display", "date_display_mode", p.date_display_mode, { type: "select", options: [{ value: "date_range", label: "Date range" }, { value: "self_paced", label: "Self-paced" }, { value: "to_be_announced", label: "To be announced" }] })}</div>`,
    `<div class="field-row">${field("Mode", "mode", p.mode, { hint: "e.g. On campus / Online" })}${field("Duration", "duration", p.duration)}</div>`,
    `<div class="field-row">${field("Seats (capacity)", "seats_base", p.seats_base, { type: "number" })}${field("Sort order", "sort_order", p.sort_order, { type: "number" })}</div>`,
    `<div class="field-row">${field("Fee mode", "fee_mode", p.fee_mode, { type: "select", options: [{ value: "session_count", label: "Per selected session" }, { value: "package", label: "Fixed program price" }, { value: "to_be_announced", label: "Not announced" }] })}${field("Fee status", "fee_status", p.fee_status, { type: "select", options: [{ value: "ready", label: "Announced" }, { value: "to_be_announced", label: "Not announced" }] })}</div>`,
    field("Base fee (Rs.)", "base_fee", p.base_fee, { type: "number", hint: "used when fee mode = fixed price" }),
    `<div class="field-row">${field("Schedule", "schedule_type", p.schedule_type, { type: "select", options: [{ value: "selectable", label: "Parent selects" }, { value: "fixed", label: "Fixed schedule" }] })}${field("Accommodation", "accommodation_mode", p.accommodation_mode, { type: "select", options: [{ value: "none", label: "None" }, { value: "optional", label: "Optional add-ons" }, { value: "included", label: "Included in fee" }] })}</div>`,
    `<div class="field-row">${field("Allow hostel", "allow_hostel", p.allow_hostel, { type: "checkbox" })}${field("Allow mess food", "allow_mess", p.allow_mess, { type: "checkbox" })}</div>`,
    field("Included services (when included)", "included_services", p.included_services, { type: "textarea", rows: 2 }),
    field("Registration deadline", "registration_deadline", (p.registration_deadline || "").slice(0, 16), { type: "datetime-local" }),
    imageField("Card image", "image_url", p.image_url),
    `<div class="field-row">${field("Registration open", "registration_enabled", p.registration_enabled, { type: "checkbox" })}${field("Active (visible on site)", "is_active", p.is_active, { type: "checkbox" })}</div>`,
  ].join("");
}
const PROGRAM_FIELDS = ["name", "slug", "short_label", "description", "cta_context", "start_date", "end_date", "dates_label", "date_display_mode", "mode", "duration", "seats_base", "sort_order", "fee_mode", "fee_status", "base_fee", "schedule_type", "accommodation_mode", "allow_hostel", "allow_mess", "included_services", "registration_deadline", "image_url", "registration_enabled", "is_active"];

function editProgram(id) {
  const p = id ? state.programs.find((x) => x.id === id) : {};
  openModal({
    title: id ? "Edit program" : "Add program",
    bodyHTML: programForm(p),
    onSave: () => {
      const body = readForm(PROGRAM_FIELDS);
      if (!body.name || !body.slug) { toast("Name and slug are required.", "error"); return; }
      if (body.registration_deadline) body.registration_deadline = new Date(body.registration_deadline).toISOString();
      saveRow("programs", id, body, "Program");
    },
  });
}

/* =====================================================================
   Sessions
   ===================================================================== */
function renderSessions() {
  const q = $("[data-session-search]").value.trim().toLowerCase();
  const prog = $("[data-session-program]").value;
  const rows = state.sessions.filter((s) => {
    if (prog !== "all" && s.program_id !== prog) return false;
    if (q && !`${s.name}`.toLowerCase().includes(q)) return false;
    return true;
  });
  $("[data-session-count]").textContent = `${rows.length} session${rows.length === 1 ? "" : "s"}`;
  $("[data-session-empty]").hidden = rows.length !== 0;
  $("[data-session-body]").innerHTML = rows.map((s) => `
    <tr>
      <td class="cell-strong">${esc(s.name)}</td>
      <td class="cell-sub">${esc(programName(s.program_id))}</td>
      <td>${esc(s.time_slot || "—")}</td>
      <td class="cell-sub">${s.sort_order ?? "—"}</td>
      <td><button class="pill-toggle ${s.is_active ? "on" : "off"}" data-toggle-active="sessions" data-id="${s.id}" data-val="${s.is_active}">${s.is_active ? "Active" : "Hidden"}</button></td>
      <td class="row-actions"><button class="btn btn-ghost btn-sm" data-edit-session="${s.id}">Edit</button> <button class="btn-link danger" data-del-session="${s.id}">Delete</button></td>
    </tr>`).join("");
}
const SESSION_FIELDS = ["name", "program_id", "time_slot", "sort_order", "is_active"];
function editSession(id) {
  const s = id ? state.sessions.find((x) => x.id === id) : { is_active: true };
  const progOpts = state.programs.map((p) => ({ value: p.id, label: p.name }));
  openModal({
    title: id ? "Edit session" : "Add session",
    bodyHTML: [
      field("Session name", "name", s.name),
      field("Program", "program_id", s.program_id, { type: "select", options: progOpts }),
      field("Time slot", "time_slot", s.time_slot, { hint: "e.g. 09:00 - 12:00" }),
      field("Sort order", "sort_order", s.sort_order, { type: "number" }),
      field("Active", "is_active", s.is_active, { type: "checkbox" }),
    ].join(""),
    onSave: () => { const body = readForm(SESSION_FIELDS); if (!body.name || !body.program_id) { toast("Name and program required.", "error"); return; } saveRow("sessions", id, body, "Session"); },
  });
}

/* =====================================================================
   Courses
   ===================================================================== */
function renderCourses() {
  const q = $("[data-course-search]").value.trim().toLowerCase();
  const prog = $("[data-course-program]").value;
  const sess = $("[data-course-session]").value;
  const rows = state.courses.filter((c) => {
    if (prog !== "all" && c.program_id !== prog) return false;
    if (sess !== "all" && c.session_id !== sess) return false;
    if (q && !`${c.name}`.toLowerCase().includes(q)) return false;
    return true;
  });
  $("[data-course-count]").textContent = `${rows.length} course${rows.length === 1 ? "" : "s"}`;
  $("[data-course-empty]").hidden = rows.length !== 0;
  $("[data-course-body]").innerHTML = rows.map((c) => `
    <tr>
      <td class="cell-strong">${esc(c.name)}</td>
      <td class="cell-sub">${esc(programName(c.program_id))}</td>
      <td class="cell-sub">${esc(sessionName(c.session_id))}</td>
      <td class="cell-sub">${esc(c.category || "—")}</td>
      <td>${c.min_age ? c.min_age + "+" : "Any"}</td>
      <td><button class="pill-toggle ${c.is_active ? "on" : "off"}" data-toggle-active="courses" data-id="${c.id}" data-val="${c.is_active}">${c.is_active ? "Active" : "Hidden"}</button></td>
      <td class="row-actions"><button class="btn btn-ghost btn-sm" data-edit-course="${c.id}">Edit</button> <button class="btn-link danger" data-del-course="${c.id}">Delete</button></td>
    </tr>`).join("");
}
const COURSE_FIELDS = ["name", "program_id", "session_id", "category", "description", "min_age", "class_range", "image_url", "sort_order", "is_active"];
function editCourse(id) {
  const c = id ? state.courses.find((x) => x.id === id) : { is_active: true };
  const progOpts = state.programs.map((p) => ({ value: p.id, label: p.name }));
  const sessOpts = [{ value: "", label: "— none —" }].concat(state.sessions.map((s) => ({ value: s.id, label: `${s.name} (${programName(s.program_id)})` })));
  const catOpts = ["tech", "creative", "career", "sports", "general", "ai-robots", "creative-arts", "agri-food", "entrepreneurship", "eng-tech"].map((v) => ({ value: v, label: v }));
  openModal({
    title: id ? "Edit course" : "Add course",
    bodyHTML: [
      field("Course name", "name", c.name),
      `<div class="field-row">${field("Program", "program_id", c.program_id, { type: "select", options: progOpts })}${field("Session", "session_id", c.session_id, { type: "select", options: sessOpts })}</div>`,
      `<div class="field-row">${field("Category", "category", c.category, { type: "select", options: catOpts })}${field("Minimum age", "min_age", c.min_age, { type: "number", hint: "blank = any age" })}</div>`,
      field("Description", "description", c.description, { type: "textarea" }),
      `<div class="field-row">${field("Class range", "class_range", c.class_range)}${field("Sort order", "sort_order", c.sort_order, { type: "number" })}</div>`,
      imageField("Course image", "image_url", c.image_url),
      field("Active", "is_active", c.is_active, { type: "checkbox" }),
    ].join(""),
    onSave: () => { const body = readForm(COURSE_FIELDS); if (!body.name || !body.program_id) { toast("Name and program required.", "error"); return; } saveRow("courses", id, body, "Course"); },
  });
}

/* =====================================================================
   Fees
   ===================================================================== */
function renderFees() {
  const q = $("[data-fee-search]").value.trim().toLowerCase();
  const prog = $("[data-fee-program]").value;
  const rows = state.fees.filter((f) => {
    if (prog !== "all" && f.program_id !== prog) return false;
    if (q && !`${programName(f.program_id)} ${f.label}`.toLowerCase().includes(q)) return false;
    return true;
  });
  $("[data-fee-count]").textContent = `${rows.length} tier${rows.length === 1 ? "" : "s"}`;
  $("[data-fee-empty]").hidden = rows.length !== 0;
  $("[data-fee-body]").innerHTML = rows.map((f) => `
    <tr>
      <td class="cell-strong">${esc(programName(f.program_id))}</td>
      <td>${f.session_count}</td>
      <td class="cell-strong">${fmtFee(f.fee_amount)}</td>
      <td class="cell-sub">${esc(f.label || "—")}</td>
      <td class="row-actions"><button class="btn btn-ghost btn-sm" data-edit-fee="${f.id}">Edit</button> <button class="btn-link danger" data-del-fee="${f.id}">Delete</button></td>
    </tr>`).join("");
}
const FEE_FIELDS = ["program_id", "session_count", "fee_amount", "label"];
function editFee(id) {
  const f = id ? state.fees.find((x) => x.id === id) : {};
  const progOpts = state.programs.map((p) => ({ value: p.id, label: p.name }));
  openModal({
    title: id ? "Edit fee tier" : "Add fee tier",
    bodyHTML: [
      field("Program", "program_id", f.program_id, { type: "select", options: progOpts }),
      `<div class="field-row">${field("Selected sessions", "session_count", f.session_count, { type: "number", hint: "how many sessions this price covers" })}${field("Fee (Rs.)", "fee_amount", f.fee_amount, { type: "number" })}</div>`,
      field("Label", "label", f.label),
    ].join(""),
    onSave: () => { const body = readForm(FEE_FIELDS); if (!body.program_id) { toast("Program required.", "error"); return; } saveRow("fee_tiers", id, body, "Fee tier"); },
  });
}

/* =====================================================================
   Gallery
   ===================================================================== */
function renderGallery() {
  const q = $("[data-gallery-search]").value.trim().toLowerCase();
  const rows = state.gallery.filter((g) => !q || `${g.alt_text} ${g.image_url}`.toLowerCase().includes(q));
  $("[data-gallery-count]").textContent = `${rows.length} image${rows.length === 1 ? "" : "s"}`;
  $("[data-gallery-empty]").hidden = rows.length !== 0;
  $("[data-gallery-grid]").innerHTML = rows.map((g) => `
    <div class="gallery-item">
      <img src="${esc(g.image_url)}" alt="${esc(g.alt_text || "")}" loading="lazy">
      <div class="gallery-item-body">
        <div class="grow"><small>${esc(g.alt_text || "—")}</small></div>
        <button class="pill-toggle ${g.is_active ? "on" : "off"}" data-toggle-active="gallery_images" data-id="${g.id}" data-val="${g.is_active}">${g.is_active ? "On" : "Off"}</button>
        <button class="btn-link danger" data-del-gallery="${g.id}">Delete</button>
      </div>
    </div>`).join("");
}
function editGalleryImage() {
  openModal({
    title: "Add gallery image",
    bodyHTML: [
      imageField("Image", "image_url", ""),
      field("Alt text", "alt_text", "", { hint: "short description for accessibility" }),
      field("Sort order", "sort_order", state.gallery.length, { type: "number" }),
      field("Active", "is_active", true, { type: "checkbox" }),
    ].join(""),
    saveLabel: "Add image",
    onSave: () => {
      const url = $('[data-modal-body] [name="image_url"]').value.trim();
      if (!url) { toast("Please upload an image first.", "error"); return; }
      const body = { image_url: url, alt_text: $('[data-modal-body] [name="alt_text"]').value.trim(), sort_order: Number($('[data-modal-body] [name="sort_order"]').value || 0), is_active: $('[data-modal-body] [name="is_active"]').checked };
      saveRow("gallery_images", null, body, "Image");
    },
  });
}

/* =====================================================================
   Settings
   ===================================================================== */
function renderSettings() {
  const q = $("[data-settings-search]").value.trim().toLowerCase();
  const rows = state.settings
    .slice()
    .sort((a, b) => (SETTING_LABELS[a.key] || a.key).localeCompare(SETTING_LABELS[b.key] || b.key))
    .filter((s) => !q || `${s.key} ${SETTING_LABELS[s.key] || ""} ${s.description || ""}`.toLowerCase().includes(q));
  $("[data-settings-count]").textContent = `${rows.length} setting${rows.length === 1 ? "" : "s"}`;
  $("[data-settings-grid]").innerHTML = rows.map((s) => `
    <div class="setting-card">
      <label for="set-${esc(s.key)}">${esc(SETTING_LABELS[s.key] || s.key)}</label>
      <div class="setting-key">${esc(s.key)}</div>
      ${s.description ? `<p class="setting-desc">${esc(s.description)}</p>` : ""}
      <input class="input" id="set-${esc(s.key)}" data-setting="${esc(s.key)}" value="${esc(s.value ?? "")}">
    </div>`).join("");
}
async function saveSettings() {
  const inputs = $$("[data-setting]");
  const changed = inputs.filter((i) => {
    const orig = state.settings.find((s) => s.key === i.dataset.setting);
    return orig && String(orig.value ?? "") !== i.value;
  });
  if (!changed.length) { toast("No changes to save."); return; }
  try {
    for (const i of changed) {
      await api.rest(`site_config?key=eq.${encodeURIComponent(i.dataset.setting)}`, { method: "PATCH", body: { value: i.value } });
    }
    toast(`Saved ${changed.length} setting${changed.length === 1 ? "" : "s"}.`, "success");
    await loadAll();
  } catch (e) { toast("Save failed: " + e.message, "error"); }
}

/* =====================================================================
   New season / yearly tools
   ===================================================================== */
function renderYearly() {
  $("[data-yearly]").innerHTML = `
    <section class="card">
      <div class="card-head"><h2>Bump year &amp; dates</h2></div>
      <p class="setting-desc">Update the season's headline year and dates in one place. Find the detailed fields in Settings.</p>
      <button class="btn btn-ghost btn-sm" data-goto="settings">Open settings</button>
    </section>
    <section class="card">
      <div class="card-head"><h2>Duplicate a program</h2></div>
      <p class="setting-desc">Clone a program (and its sessions, courses &amp; fee tiers) as a starting point for a new one.</p>
      <div class="toolbar" style="margin:0">
        <select class="input" data-dup-program style="min-width:240px">${state.programs.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select>
        <button class="btn btn-primary btn-sm" data-do-duplicate>Duplicate</button>
      </div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Archive &amp; clear registrations</h2></div>
      <p class="setting-desc">Export all ${state.registrations.length} registrations to a CSV, then permanently delete them so the new season starts clean. Programs, courses, sessions and fees are kept.</p>
      <button class="btn btn-danger btn-sm" data-archive-clear ${state.registrations.length ? "" : "disabled"}>Export &amp; clear registrations</button>
    </section>`;
}

async function duplicateProgram(id) {
  const p = state.programs.find((x) => x.id === id);
  if (!p) return;
  try {
    const clone = { ...p }; delete clone.id; delete clone.created_at; delete clone.updated_at;
    clone.name = `${p.name} (copy)`; clone.slug = `${p.slug}-copy-${Date.now().toString(36)}`; clone.is_active = false; clone.registration_enabled = false;
    const [created] = await api.rest("programs", { method: "POST", body: clone, representation: true });
    const newPid = created.id;
    // sessions: map old->new id
    const oldSessions = state.sessions.filter((s) => s.program_id === id);
    const sessionIdMap = {};
    for (const s of oldSessions) {
      const sc = { ...s }; const old = sc.id; delete sc.id; delete sc.created_at; sc.program_id = newPid;
      const [ns] = await api.rest("sessions", { method: "POST", body: sc, representation: true });
      sessionIdMap[old] = ns.id;
    }
    for (const c of state.courses.filter((x) => x.program_id === id)) {
      const cc = { ...c }; delete cc.id; delete cc.created_at; cc.program_id = newPid; cc.session_id = cc.session_id ? sessionIdMap[cc.session_id] || null : null;
      await api.rest("courses", { method: "POST", body: cc });
    }
    for (const f of state.fees.filter((x) => x.program_id === id)) {
      const fc = { ...f }; delete fc.id; fc.program_id = newPid;
      await api.rest("fee_tiers", { method: "POST", body: fc });
    }
    toast("Program duplicated (hidden & closed). Edit it in Programs.", "success");
    await loadAll();
  } catch (e) { toast("Duplicate failed: " + e.message, "error"); }
}

function archiveAndClear() {
  openModal({
    title: "Archive & clear registrations",
    bodyHTML: `<p>This will download a CSV backup of <strong>${state.registrations.length}</strong> registrations, then permanently delete them. Type <strong>CLEAR</strong> to confirm.</p><div class="field"><input data-clear-confirm placeholder="CLEAR"></div>`,
    footerHTML: `<button class="btn btn-ghost" data-modal-cancel>Cancel</button><button class="btn btn-danger" data-do-clear>Export &amp; delete</button>`,
  });
  $("[data-do-clear]").addEventListener("click", async () => {
    if ($("[data-clear-confirm]").value.trim().toUpperCase() !== "CLEAR") { toast("Type CLEAR to confirm.", "error"); return; }
    // export everything first
    const allRows = state.registrations;
    const cols = ["id", "created_at", "student_name", "student_age", "class_level", "school_name", "city", "guardian_name", "phone", "email", "emergency_phone", "program_name", "course_names", "hostel_option", "session_fee", "hostel_amount", "total_fee", "payment_status", "status", "payment_reference", "verified_by", "verified_at"];
    const csv = cols.join(",") + "\n" + allRows.map((r) => cols.map((c) => { let v = r[c]; if (Array.isArray(v)) v = v.join(" | "); return `"${String(v ?? "").replace(/"/g, '""')}"`; }).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `registrations-archive-${todayKey()}.csv`; a.click(); URL.revokeObjectURL(a.href);
    try {
      await api.rest(`registrations?id=not.is.null`, { method: "DELETE" });
      closeModal(); toast("Archived to CSV and cleared registrations.", "success"); await loadAll(); switchView("dashboard");
    } catch (e) { toast("Clear failed (CSV was still downloaded): " + e.message, "error"); }
  });
}

/* =====================================================================
   Modal
   ===================================================================== */
let modalSaveHandler = null;
function openModal({ title, bodyHTML, footerHTML, onSave, saveLabel = "Save" }) {
  $("[data-modal-title]").textContent = title;
  $("[data-modal-body]").innerHTML = bodyHTML;
  const foot = $("[data-modal-foot]");
  if (footerHTML) { foot.innerHTML = footerHTML; modalSaveHandler = null; }
  else {
    foot.innerHTML = `<button class="btn btn-ghost" data-modal-cancel>Cancel</button><button class="btn btn-primary" data-modal-save>${esc(saveLabel)}</button>`;
    modalSaveHandler = onSave || null;
  }
  $("[data-modal-overlay]").hidden = false;
  imageUploadsInFlight = 0;
  wireImageFields($("[data-modal-body]"));
  // wire cancel buttons fresh each open
  $$("[data-modal-cancel]").forEach((b) => b.addEventListener("click", closeModal));
  const saveBtn = $("[data-modal-save]"); if (saveBtn && modalSaveHandler) saveBtn.addEventListener("click", () => modalSaveHandler());
}
function closeModal() { $("[data-modal-overlay]").hidden = true; $("[data-modal-body]").innerHTML = ""; modalSaveHandler = null; }

/* =====================================================================
   Active-toggle (shared across tables)
   ===================================================================== */
async function toggleActive(table, id, current) {
  try {
    await api.rest(`${table}?id=eq.${id}`, { method: "PATCH", body: { is_active: !current } });
    const bucket = { programs: state.programs, sessions: state.sessions, courses: state.courses, gallery_images: state.gallery }[table];
    const row = bucket?.find((x) => x.id === id); if (row) row.is_active = !current;
    renderActive(); updateNavBadge();
  } catch (e) { toast("Could not update: " + e.message, "error"); }
}

/* =====================================================================
   Event wiring
   ===================================================================== */
function wire() {
  $("[data-login-form]").addEventListener("submit", handleLogin);
  $("[data-forgot-pass]").addEventListener("click", async () => {
    const email = $('[data-login-form] [name="email"]').value.trim();
    if (!email) { $("[data-login-error]").textContent = "Enter your email first."; return; }
    try { await api.recover(email); toast("Password reset email sent.", "success"); } catch (e) { $("[data-login-error]").textContent = e.message; }
  });

  $$(".nav-item").forEach((b) => b.addEventListener("click", () => switchView(b.dataset.view)));
  $("[data-sidebar-toggle]").addEventListener("click", () => $("[data-app]").classList.toggle("nav-open"));
  $("[data-logout]").addEventListener("click", logout);
  $("[data-refresh]").addEventListener("click", () => { loadAll(); toast("Refreshed."); });
  $("[data-change-pass]").addEventListener("click", changePasswordModal);

  // delegated clicks
  document.body.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open-reg],[data-goto],[data-edit-program],[data-add-program],[data-edit-session],[data-add-session],[data-del-session],[data-edit-course],[data-add-course],[data-del-course],[data-edit-fee],[data-add-fee],[data-del-fee],[data-add-image],[data-del-gallery],[data-toggle-active],[data-page],[data-do-duplicate],[data-archive-clear],[data-modal-close],[data-modal-overlay]");
    if (!t) return;
    if (t.hasAttribute("data-open-reg")) openRegistration(t.dataset.openReg);
    else if (t.hasAttribute("data-goto")) { if (t.hasAttribute("data-preset-pending")) { $("[data-reg-payment]").value = "verification_pending"; state.regPage = 1; } switchView(t.dataset.goto); }
    else if (t.hasAttribute("data-add-program")) editProgram(null);
    else if (t.hasAttribute("data-edit-program")) editProgram(t.dataset.editProgram);
    else if (t.hasAttribute("data-add-session")) editSession(null);
    else if (t.hasAttribute("data-edit-session")) editSession(t.dataset.editSession);
    else if (t.hasAttribute("data-del-session")) confirmDelete("sessions", t.dataset.delSession, "session");
    else if (t.hasAttribute("data-add-course")) editCourse(null);
    else if (t.hasAttribute("data-edit-course")) editCourse(t.dataset.editCourse);
    else if (t.hasAttribute("data-del-course")) confirmDelete("courses", t.dataset.delCourse, "course");
    else if (t.hasAttribute("data-add-fee")) editFee(null);
    else if (t.hasAttribute("data-edit-fee")) editFee(t.dataset.editFee);
    else if (t.hasAttribute("data-del-fee")) confirmDelete("fee_tiers", t.dataset.delFee, "fee tier");
    else if (t.hasAttribute("data-add-image")) editGalleryImage();
    else if (t.hasAttribute("data-del-gallery")) confirmDelete("gallery_images", t.dataset.delGallery, "image");
    else if (t.hasAttribute("data-toggle-active")) toggleActive(t.dataset.toggleActive, t.dataset.id, t.dataset.val === "true");
    else if (t.hasAttribute("data-page")) { state.regPage = Number(t.dataset.page); renderRegistrations(); }
    else if (t.hasAttribute("data-do-duplicate")) duplicateProgram($("[data-dup-program]").value);
    else if (t.hasAttribute("data-archive-clear")) archiveAndClear();
    else if (t.hasAttribute("data-modal-close")) closeModal();
    else if (t.hasAttribute("data-modal-overlay") && e.target === t) closeModal();
  });

  // search/filter inputs
  $("[data-reg-search]").addEventListener("input", debounce(() => { state.regPage = 1; renderRegistrations(); }));
  ["[data-reg-status]", "[data-reg-payment]", "[data-reg-program]"].forEach((s) => $(s).addEventListener("change", () => { state.regPage = 1; renderRegistrations(); }));
  $("[data-export-csv]").addEventListener("click", exportRegistrationsCsv);
  $("[data-program-search]").addEventListener("input", debounce(renderPrograms));
  $("[data-program-active]").addEventListener("change", renderPrograms);
  $("[data-session-search]").addEventListener("input", debounce(renderSessions));
  $("[data-session-program]").addEventListener("change", renderSessions);
  $("[data-course-search]").addEventListener("input", debounce(renderCourses));
  $("[data-course-program]").addEventListener("change", renderCourses);
  $("[data-course-session]").addEventListener("change", renderCourses);
  $("[data-fee-search]").addEventListener("input", debounce(renderFees));
  $("[data-fee-program]").addEventListener("change", renderFees);
  $("[data-gallery-search]").addEventListener("input", debounce(renderGallery));
  $("[data-settings-search]").addEventListener("input", debounce(renderSettings));
  $("[data-save-settings]").addEventListener("click", saveSettings);
}

function changePasswordModal() {
  openModal({
    title: "Change password",
    bodyHTML: field("New password", "newpass", "", { type: "password", hint: "at least 8 characters" }),
    saveLabel: "Update password",
    onSave: async () => {
      const pw = $('[data-modal-body] [name="newpass"]').value;
      if (pw.length < 8) { toast("Use at least 8 characters.", "error"); return; }
      try { await api.changePassword(pw); closeModal(); toast("Password updated.", "success"); } catch (e) { toast(e.message, "error"); }
    },
  });
}

document.addEventListener("DOMContentLoaded", () => { wire(); boot(); });
