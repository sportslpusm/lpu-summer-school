const SUPABASE_URL = "https://bynpuhoysivxxlblxica.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bnB1aG95c2l2eHhsYmx4aWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTE1NjAsImV4cCI6MjA5NDQ4NzU2MH0.JltZJYggs2ycs3u0HUelRMivZgsByW_g5-n3qz6EaPk";

let accessToken = null;
let sessions = [];

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
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "apikey": SUPABASE_KEY
      },
      body: JSON.stringify({ to, subject, html })
    });
  } catch (e) {
    console.warn("Email send failed:", e.message);
  }
}

function registrationConfirmationEmail(reg) {
  const courses = [reg.session1_course, reg.session2_course, reg.session3_course].filter(Boolean);
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
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Class</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(reg.class_level)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Courses</td><td style="padding:8px;border-bottom:1px solid #eee">${courses.map(c => esc(c)).join(", ")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Total Fee</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>Rs. ${reg.total_fee}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Status</td><td style="padding:8px"><span style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:99px;font-weight:700;font-size:13px">Confirmed</span></td></tr>
        </table>
        <div style="background:#f7f8fb;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0 0 6px;font-weight:700;color:#111827">Program Schedule</p>
          <p style="margin:0;font-size:14px;color:#667085">Dates: <strong style="color:#111827">16 Jun — 28 Jun 2026</strong></p>
          <p style="margin:4px 0 0;font-size:14px;color:#667085">Timings: <strong style="color:#111827">9:00 AM — 5:00 PM daily</strong></p>
          <p style="margin:4px 0 0;font-size:14px;color:#667085">Venue: <strong style="color:#111827">LPU Campus, Phagwara, Punjab</strong></p>
        </div>
        <p>Our team will contact you shortly with further details regarding campus logistics.</p>
        <p style="color:#667085;font-size:13px;margin-top:24px">For queries: summerschool@lpu.co.in | +91 860 723 4098</p>
      </div>
    </div>
  `;
}

// --- UI State ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

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
    alert("Password updated successfully!");
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
          alert("Password updated! You can now login with your new password.");
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
    alert("Session expired. Please log in again.");
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
    $$(".tab").forEach((t) => t.classList.remove("active"));
    $$(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    $(`#panel-${tab.dataset.tab}`).classList.add("active");
  });
});

// --- Load All Data ---
async function loadAll() {
  try {
    await loadSessions();
    await Promise.all([loadRegistrations(), loadCourses(), loadFees(), loadGallery(), loadSettings()]);
  } catch (err) {
    if (err.message.includes("JWT") || err.message.includes("401")) {
      localStorage.removeItem("sb_token");
      localStorage.removeItem("sb_email");
      location.reload();
    }
  }
}

// --- REGISTRATIONS ---
let allRegistrations = [];

async function loadRegistrations() {
  allRegistrations = await apiGet("registrations", "order=created_at.desc");
  filterRegistrations();
}

function filterRegistrations() {
  const status = $("#regStatusFilter").value;
  const payment = $("#regPaymentFilter").value;
  const q = ($("#regSearch").value || "").toLowerCase().trim();

  let rows = allRegistrations;
  if (status !== "all") rows = rows.filter((r) => r.status === status);
  if (payment !== "all") rows = rows.filter((r) => (payment === "paid" ? r.payment_status === "paid" : r.payment_status !== "paid"));
  if (q) rows = rows.filter((r) => [r.student_name, r.guardian_name, r.school_name, r.phone, r.email, r.city].some((v) => v && v.toLowerCase().includes(q)));

  renderRegistrations(rows);
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

  body.innerHTML = rows.map((r) => `
    <tr>
      <td>${new Date(r.created_at).toLocaleDateString("en-IN")}</td>
      <td><strong>${esc(r.student_name)}</strong></td>
      <td>${esc(r.class_level)}</td>
      <td>${esc(r.school_name)}</td>
      <td>${esc(r.guardian_name)}</td>
      <td>${esc(r.phone)}</td>
      <td>${[r.session1_course, r.session2_course, r.session3_course].filter(Boolean).map(c => esc(c)).join(", ") || "\u2014"}</td>
      <td>Rs. ${r.total_fee}</td>
      <td><span class="badge badge-${r.payment_status === 'paid' ? 'confirmed' : 'pending'}">${r.payment_status || 'unpaid'}</span></td>
      <td><span class="badge badge-${r.status}">${r.status}</span></td>
      <td class="row-actions">
        <button onclick="viewRegistration('${r.id}')">View</button>
        <button onclick="changeRegStatus('${r.id}', 'confirmed')">✓</button>
        <button onclick="changeRegStatus('${r.id}', 'cancelled')" class="del">✗</button>
      </td>
    </tr>
  `).join("");
}

const HOSTEL_LABELS = { none: "No hostel", hostel_only: "Hostel only", hostel_food: "Hostel + Food" };

window.viewRegistration = async function(id) {
  const rows = await apiGet("registrations", `id=eq.${id}`);
  const r = rows[0];
  const courses = [r.session1_course, r.session2_course, r.session3_course].filter(Boolean);

  // Fetch linked payment record for Razorpay IDs and fee breakdown
  let payment = null;
  if (r.payment_id) {
    const prows = await apiGet("payments", `id=eq.${r.payment_id}`);
    payment = prows[0] || null;
  }

  const hostelLabel = HOSTEL_LABELS[r.hostel_option] || r.hostel_option || "N/A";
  const hostelAmt = r.hostel_amount || 0;

  openModal("Registration Details", `
    <div style="display:grid;gap:12px">
      <div><strong>Student:</strong> ${esc(r.student_name)}</div>
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
      <div><strong>Hostel:</strong> ${esc(hostelLabel)}${hostelAmt ? ` (Rs. ${hostelAmt})` : ""}</div>
      <hr style="border:none;border-top:1px solid #e4e7ec">
      <div><strong>Base Amount:</strong> Rs. ${payment ? payment.base_amount : "N/A"}</div>
      <div><strong>GST (18%):</strong> Rs. ${payment ? payment.gst_amount : "N/A"}</div>
      <div><strong>Total Fee:</strong> <strong style="color:#f3700d">Rs. ${r.total_fee}</strong></div>
      <div><strong>Payment:</strong> <span class="badge badge-${r.payment_status === 'paid' ? 'confirmed' : 'pending'}">${r.payment_status || 'unpaid'}</span></div>
      <div><strong>Status:</strong> <span class="badge badge-${r.status}">${r.status}</span></div>
      ${payment ? `
      <hr style="border:none;border-top:1px solid #e4e7ec">
      <div style="font-size:12px;color:#667085">
        <div><strong>Razorpay Payment ID:</strong> ${esc(payment.razorpay_payment_id || "N/A")}</div>
        <div><strong>Razorpay Order ID:</strong> ${esc(payment.razorpay_order_id || "N/A")}</div>
        <div><strong>Payment Date:</strong> ${payment.updated_at ? new Date(payment.updated_at).toLocaleString("en-IN") : "N/A"}</div>
      </div>` : ""}
      <div><strong>Medical:</strong> ${esc(r.medical_note) || "None"}</div>
      <div><strong>Registered:</strong> ${new Date(r.created_at).toLocaleString("en-IN")}</div>
    </div>
  `, null);
  $("#modalSave").hidden = true;
};

window.changeRegStatus = async function(id, status) {
  await apiUpdate("registrations", id, { status });

  // Send confirmation email when status changes to confirmed
  if (status === "confirmed") {
    const rows = await apiGet("registrations", `id=eq.${id}`);
    const reg = rows[0];
    if (reg.email) {
      await sendEmail(reg.email, "Registration Confirmed - LPU Summer School", registrationConfirmationEmail(reg));
    }
  }

  loadRegistrations();
};

$("#regStatusFilter").addEventListener("change", filterRegistrations);
$("#regPaymentFilter").addEventListener("change", filterRegistrations);
$("#regSearch").addEventListener("input", filterRegistrations);

$("#exportCsvBtn").addEventListener("click", async () => {
  const rows = await apiGet("registrations", "order=created_at.desc");
  if (!rows.length) return alert("No data to export");
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

// --- SESSIONS ---
async function loadSessions() {
  sessions = await apiGet("sessions", "order=sort_order.asc");
  filterSessions();
}

function filterSessions() {
  const q = ($("#sessionSearch")?.value || "").toLowerCase().trim();
  let rows = sessions;
  if (q) rows = rows.filter((s) => s.name && s.name.toLowerCase().includes(q));
  renderSessions(rows);
  const countEl = $("#sessionCount");
  if (countEl) countEl.textContent = `${rows.length} of ${sessions.length}`;
}

function renderSessions(rows) {
  if (!rows) rows = sessions;
  $("#sessionBody").innerHTML = rows.map((s) => `
    <tr>
      <td><strong>${esc(s.name)}</strong></td>
      <td>${esc(s.time_slot)}</td>
      <td>${s.sort_order}</td>
      <td><span class="toggle ${s.is_active ? "on" : ""}" onclick="toggleSession('${s.id}', ${!s.is_active})"></span></td>
      <td class="row-actions">
        <button onclick="editSession('${s.id}')">Edit</button>
        <button onclick="deleteSession('${s.id}')" class="del">Delete</button>
      </td>
    </tr>
  `).join("");
}

$("#sessionSearch")?.addEventListener("input", filterSessions);

window.toggleSession = async function(id, active) {
  await apiUpdate("sessions", id, { is_active: active });
  await loadSessions();
};

window.editSession = function(id) {
  const s = sessions.find((x) => x.id === id);
  openModal("Edit Session", `
    <label>Name <input id="mSessionName" value="${esc(s.name)}"></label>
    <label>Time Slot <input id="mSessionTime" value="${esc(s.time_slot)}"></label>
    <label>Sort Order <input id="mSessionOrder" type="number" value="${s.sort_order}"></label>
  `, async () => {
    await apiUpdate("sessions", id, {
      name: $("#mSessionName").value,
      time_slot: $("#mSessionTime").value,
      sort_order: parseInt($("#mSessionOrder").value)
    });
    await loadSessions();
    await loadCourses();
  });
};

window.deleteSession = async function(id) {
  if (!confirm("Delete this session and all its courses?")) return;
  await apiDelete("sessions", id);
  await loadSessions();
  await loadCourses();
};

$("#addSessionBtn").addEventListener("click", () => {
  openModal("Add Session", `
    <label>Name <input id="mSessionName" placeholder="Session 4"></label>
    <label>Time Slot <input id="mSessionTime" placeholder="17:00 - 19:00"></label>
    <label>Sort Order <input id="mSessionOrder" type="number" value="${sessions.length + 1}"></label>
  `, async () => {
    await apiInsert("sessions", {
      name: $("#mSessionName").value,
      time_slot: $("#mSessionTime").value,
      sort_order: parseInt($("#mSessionOrder").value)
    });
    await loadSessions();
  });
});

// --- COURSES (with image upload) ---
let allCourses = [];

async function loadCourses() {
  allCourses = await apiGet("courses", "order=sort_order.asc&select=*,sessions(name)");
  // Populate session filter dropdown
  const sessionFilter = $("#courseSessionFilter");
  if (sessionFilter) {
    const current = sessionFilter.value;
    sessionFilter.innerHTML = `<option value="all">All Sessions</option>` +
      sessions.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
    sessionFilter.value = current || "all";
  }
  filterCourses();
}

function filterCourses() {
  const sessionId = $("#courseSessionFilter")?.value || "all";
  const category = $("#courseCategoryFilter")?.value || "all";
  const q = ($("#courseSearch")?.value || "").toLowerCase().trim();

  let rows = allCourses;
  if (sessionId !== "all") rows = rows.filter((c) => c.session_id === sessionId);
  if (category !== "all") rows = rows.filter((c) => c.category === category);
  if (q) rows = rows.filter((c) => c.name && c.name.toLowerCase().includes(q));

  renderCourses(rows);
  const countEl = $("#courseCount");
  if (countEl) countEl.textContent = `${rows.length} of ${allCourses.length}`;
}

function renderCourses(courses) {
  $("#courseBody").innerHTML = courses.map((c) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;min-width:0;overflow:hidden">
          ${c.image_url ? `<img src="${esc(c.image_url)}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0">` : ""}
          <strong style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}</strong>
        </div>
      </td>
      <td>${esc(c.sessions?.name) || "\u2014"}</td>
      <td><span class="badge badge-${c.category === 'tech' ? 'pending' : c.category === 'sports' ? 'confirmed' : 'cancelled'}">${esc(c.category)}</span></td>
      <td>${esc(c.class_range || "")}</td>
      <td><span class="toggle ${c.is_active ? "on" : ""}" onclick="toggleCourse('${c.id}', ${!c.is_active})"></span></td>
      <td class="row-actions">
        <button onclick="editCourse('${c.id}')">Edit</button>
        <button onclick="deleteCourse('${c.id}')" class="del">Delete</button>
      </td>
    </tr>
  `).join("");
}

window.toggleCourse = async function(id, active) {
  await apiUpdate("courses", id, { is_active: active });
  await loadCourses();
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
  });
};

window.deleteCourse = async function(id) {
  if (!confirm("Delete this course?")) return;
  await apiDelete("courses", id);
  await loadCourses();
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
  });
});

$("#courseSearch")?.addEventListener("input", filterCourses);
$("#courseSessionFilter")?.addEventListener("change", filterCourses);
$("#courseCategoryFilter")?.addEventListener("change", filterCourses);

function courseForm(c = {}) {
  const sessionOpts = sessions.map((s) => `<option value="${s.id}" ${s.id === c.session_id ? "selected" : ""}>${esc(s.name)} (${esc(s.time_slot)})</option>`).join("");
  return `
    <label>Course Name <input id="mCourseName" value="${esc(c.name || "")}"></label>
    <label>Session <select id="mCourseSession">${sessionOpts}</select></label>
    <label>Category <select id="mCourseCategory">
      <option value="tech" ${c.category === "tech" ? "selected" : ""}>Tech</option>
      <option value="creative" ${c.category === "creative" ? "selected" : ""}>Creative</option>
      <option value="career" ${c.category === "career" ? "selected" : ""}>Career</option>
      <option value="sports" ${c.category === "sports" ? "selected" : ""}>Sports</option>
      <option value="general" ${c.category === "general" ? "selected" : ""}>General</option>
    </select></label>
    <label>Class Range <input id="mCourseClass" value="${esc(c.class_range || "Classes 6-12")}"></label>
    <label>Description <textarea id="mCourseDesc" rows="3">${esc(c.description || "")}</textarea></label>
    <label>Upload Image <input id="mCourseFile" type="file" accept="image/*"></label>
    <small style="color:#667085;display:block;margin:-6px 0 8px">Recommended size: <strong>560 x 350 px</strong> (8:5 ratio)</small>
    ${c.image_url ? `<div style="margin:-8px 0 8px"><img src="${esc(c.image_url)}"><small style="color:#667085">Current image — upload new to replace</small></div>` : ""}
    <label>Or Image URL <input id="mCourseImg" value="${esc(c.image_url || "")}" placeholder="https://..."></label>
    <label>Sort Order <input id="mCourseOrder" type="number" value="${c.sort_order ?? 0}"></label>
  `;
}

function getCourseFormData() {
  return {
    name: $("#mCourseName").value,
    session_id: $("#mCourseSession").value,
    category: $("#mCourseCategory").value,
    class_range: $("#mCourseClass").value,
    description: $("#mCourseDesc").value,
    image_url: $("#mCourseImg").value || null,
    sort_order: parseInt($("#mCourseOrder").value)
  };
}

// --- FEES ---
async function loadFees() {
  const fees = await apiGet("fee_tiers", "order=session_count.asc");
  renderFees(fees);
}

function renderFees(fees) {
  $("#feeBody").innerHTML = fees.map((f) => `
    <tr>
      <td>${f.session_count}</td>
      <td>Rs. ${f.fee_amount.toLocaleString("en-IN")}</td>
      <td>${esc(f.label || "")}</td>
      <td class="row-actions">
        <button onclick="editFee('${f.id}', ${f.session_count}, ${f.fee_amount}, '${esc(f.label || "")}')">Edit</button>
        <button onclick="deleteFee('${f.id}')" class="del">Delete</button>
      </td>
    </tr>
  `).join("");
}

window.editFee = function(id, count, amount, label) {
  openModal("Edit Fee Tier", `
    <label>Session Count <input id="mFeeCount" type="number" value="${count}"></label>
    <label>Fee Amount (Rs.) <input id="mFeeAmount" type="number" value="${amount}"></label>
    <label>Label <input id="mFeeLabel" value="${label}"></label>
  `, async () => {
    await apiUpdate("fee_tiers", id, {
      session_count: parseInt($("#mFeeCount").value),
      fee_amount: parseInt($("#mFeeAmount").value),
      label: $("#mFeeLabel").value
    });
    await loadFees();
  });
};

window.deleteFee = async function(id) {
  if (!confirm("Delete this fee tier?")) return;
  await apiDelete("fee_tiers", id);
  await loadFees();
};

$("#addFeeBtn").addEventListener("click", () => {
  openModal("Add Fee Tier", `
    <label>Session Count <input id="mFeeCount" type="number" value="0"></label>
    <label>Fee Amount (Rs.) <input id="mFeeAmount" type="number" value="0"></label>
    <label>Label <input id="mFeeLabel" placeholder="Description"></label>
  `, async () => {
    await apiInsert("fee_tiers", {
      session_count: parseInt($("#mFeeCount").value),
      fee_amount: parseInt($("#mFeeAmount").value),
      label: $("#mFeeLabel").value
    });
    await loadFees();
  });
});

// --- GALLERY (with image upload) ---
async function loadGallery() {
  const images = await apiGet("gallery_images", "order=sort_order.asc");
  renderGallery(images);
}

function renderGallery(images) {
  $("#galleryGrid").innerHTML = images.map((img) => `
    <div class="gallery-card">
      <img src="${esc(img.image_url)}" alt="${esc(img.alt_text)}" onerror="this.style.background='#eee';this.style.minHeight='150px'">
      <div class="gallery-card-info">${esc(img.alt_text)}</div>
      <div class="gallery-card-actions">
        <button class="btn ghost small" onclick="editImage('${img.id}')">Edit</button>
        <button class="btn ghost small" onclick="deleteImage('${img.id}')">Delete</button>
        <span class="toggle ${img.is_active ? "on" : ""}" onclick="toggleImage('${img.id}', ${!img.is_active})" style="margin-left:auto"></span>
      </div>
    </div>
  `).join("");
}

window.toggleImage = async function(id, active) {
  await apiUpdate("gallery_images", id, { is_active: active });
  await loadGallery();
};

window.editImage = async function(id) {
  const imgs = await apiGet("gallery_images", `id=eq.${id}`);
  const img = imgs[0];
  openModal("Edit Image", `
    ${img.image_url ? `<img src="${esc(img.image_url)}" style="margin-bottom:12px">` : ""}
    <label>Upload New Image <input id="mImgFile" type="file" accept="image/*"></label>
    <small style="color:#667085;display:block;margin:-6px 0 8px">Recommended size: <strong>1200 x 800 px</strong> (3:2 ratio)</small>
    <label>Or Image URL <input id="mImgUrl" value="${esc(img.image_url)}"></label>
    <label>Alt Text <input id="mImgAlt" value="${esc(img.alt_text)}"></label>
    <label>Sort Order <input id="mImgOrder" type="number" value="${img.sort_order}"></label>
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

window.deleteImage = async function(id) {
  if (!confirm("Delete this image?")) return;
  await apiDelete("gallery_images", id);
  await loadGallery();
};

$("#addImageBtn").addEventListener("click", () => {
  openModal("Add Image", `
    <label>Upload Image <input id="mImgFile" type="file" accept="image/*"></label>
    <small style="color:#667085;display:block;margin:-6px 0 8px">Recommended size: <strong>1200 x 800 px</strong> (3:2 ratio, used in hero gallery)</small>
    <label>Or Image URL <input id="mImgUrl" placeholder="https://..."></label>
    <label>Alt Text <input id="mImgAlt" placeholder="Description of image"></label>
    <label>Sort Order <input id="mImgOrder" type="number" value="0"></label>
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
  renderSettings();
}

function renderSettings() {
  $("#settingsGrid").innerHTML = settingsData.map((s) => `
    <div class="setting-item">
      <label>${esc(s.key.replace(/_/g, " "))}</label>
      <input data-key="${esc(s.key)}" value="${esc(s.value)}">
      ${s.description ? `<div class="desc">${esc(s.description)}</div>` : ""}
    </div>
  `).join("");
}

$("#saveSettingsBtn").addEventListener("click", async () => {
  const inputs = $$("#settingsGrid input[data-key]");
  const updates = [];
  inputs.forEach((input) => {
    const key = input.dataset.key;
    const orig = settingsData.find((s) => s.key === key);
    if (orig && orig.value !== input.value) {
      updates.push(api(`site_config?key=eq.${key}`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Prefer": "return=representation" },
        body: JSON.stringify({ value: input.value, updated_at: new Date().toISOString() })
      }));
    }
  });
  if (updates.length) {
    await Promise.all(updates);
    alert("Settings saved!");
    await loadSettings();
  } else {
    alert("No changes to save.");
  }
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
    const btn = $("#modalSave");
    btn.disabled = true;
    btn.textContent = "Saving...";
    try {
      await modalSaveCallback();
      closeModal();
    } catch (err) {
      alert("Error: " + err.message);
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
