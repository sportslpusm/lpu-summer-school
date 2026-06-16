import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SENDER_EMAIL = "summerschool@lpu.co.in";
const SENDER_NAME = "LPU Summer School";
const CONTACT_EMAIL = "summerschool@lpu.co.in";
const CONTACT_PHONE = "+91 860 723 4098";
const LPU_PAYTM_PAYMENT_URL = "https://secure.paytmpayments.com/link/paymentForm/25698/LL_925406030";

const ALLOWED_ORIGINS = new Set([
  "https://summerschool.unisportscouncil.co.in",
  "https://unisportscouncil.co.in",
  "https://www.unisportscouncil.co.in",
]);

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get("origin") || "";
  if (
    ALLOWED_ORIGINS.has(origin) ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1")
  ) {
    return origin;
  }
  return "https://summerschool.unisportscouncil.co.in";
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAmount(value: unknown): string {
  const amount = Number(value || 0);
  return `Rs. ${Number.isFinite(amount) ? amount.toLocaleString("en-IN") : "0"}`;
}

async function getSecureConfig(key: string): Promise<string> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/secure_config?key=eq.${encodeURIComponent(key)}&select=value`,
    { headers: { "apikey": SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}` } }
  );
  const rows = await res.json();
  return rows?.[0]?.value || "";
}

async function getAuthedUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "");
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": req.headers.get("apikey") || ""
      }
    });
    if (!res.ok) return null;
    const user = await res.json();
    return typeof user?.id === "string" ? user.id : null;
  } catch {
    return null;
  }
}

// Verify the caller is an explicit admin (public.admins allowlist), not merely
// any authenticated Supabase user. Uses the service-role key to bypass RLS.
async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admins?user_id=eq.${encodeURIComponent(userId)}&select=user_id`,
      { headers: { "apikey": SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}` } }
    );
    if (!res.ok) return false;
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

interface EmailPayload {
  to?: string;
  subject?: string;
  html?: string;
  type?: string;
  registration_id?: string;
  payment_reference?: string;
}

// Sends through the official LPU Summer School Google Workspace mailbox
// (summerschool@lpu.co.in) over Gmail SMTP using a stored App Password.
async function sendEmail(to: string, subject: string, html: string): Promise<Record<string, unknown>> {
  if (!to || !subject || !html) throw new Error("Missing required email fields");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error("Invalid email address");
  if (to.length > 254 || subject.length > 255) throw new Error("Invalid email fields");

  const appPassword = await getSecureConfig("gmail_app_password");
  if (!appPassword) throw new Error("Email service not configured");

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: { username: SENDER_EMAIL, password: appPassword },
    },
  });

  try {
    await client.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to,
      subject,
      html,
      content: "auto",
    });
  } finally {
    await client.close();
  }

  return { messageId: null };
}

async function fetchRegistration(registrationId: string, paymentReference: string) {
  const query = new URLSearchParams({
    id: `eq.${registrationId}`,
    payment_reference: `eq.${paymentReference}`,
    select: "id,email,guardian_name,student_name,class_level,program_name,course_names,total_fee,payment_reference,program_snapshot,created_at"
  });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/registrations?${query.toString()}`, {
    headers: { "apikey": SUPABASE_SERVICE_KEY, "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}` }
  });
  if (!res.ok) throw new Error("Could not verify registration before sending email");
  const rows = await res.json();
  return rows?.[0] || null;
}

function registrationCourses(reg: Record<string, unknown>): string[] {
  const rawCourses = reg.course_names;
  if (Array.isArray(rawCourses)) return rawCourses.map(String).filter(Boolean);
  if (typeof rawCourses === "string" && rawCourses.trim()) {
    try {
      const parsed = JSON.parse(rawCourses);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch (_) {
      return [rawCourses];
    }
  }
  const snapshot = reg.program_snapshot as { courses?: unknown } | null;
  if (Array.isArray(snapshot?.courses)) return snapshot.courses.map(String).filter(Boolean);
  return [];
}

function registrationReceivedEmail(reg: Record<string, unknown>): string {
  const courses = registrationCourses(reg);
  return `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;color:#101828">
      <div style="background:#f3700d;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="margin:0;font-size:22px">Registration Created</h1>
        <p style="margin:6px 0 0">LPU Summer School 2026</p>
      </div>
      <div style="border:1px solid #e4e7ec;border-top:0;border-radius:0 0 12px 12px;padding:24px;background:#fff">
        <p>Dear <strong>${escapeHtml(reg.guardian_name || "Parent/Guardian")}</strong>,</p>
        <p>We have received the registration details for <strong>${escapeHtml(reg.student_name || "the student")}</strong>. Please complete payment on the official LPU Paytm page and upload the payment screenshot on the registration site.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Program</td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(reg.program_name || "LPU Summer School")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Courses</td><td style="padding:8px;border-bottom:1px solid #eee">${courses.map(escapeHtml).join(", ") || "As per selected program"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Payment Ref</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${escapeHtml(reg.payment_reference || "")}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Amount</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${formatAmount(reg.total_fee)}</strong></td></tr>
        </table>
        <p style="margin:16px 0">Official payment link: <a href="${LPU_PAYTM_PAYMENT_URL}" style="color:#f3700d;font-weight:700">Open LPU Paytm payment page</a></p>
        <p style="font-size:13px;color:#667085">For help: ${CONTACT_EMAIL} | ${CONTACT_PHONE}</p>
      </div>
    </div>
  `;
}

function paymentConfirmedEmail(reg: Record<string, unknown>): string {
  const courses = registrationCourses(reg);
  return `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;color:#101828">
      <div style="background:#1f9d5b;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="margin:0;font-size:22px">Payment Verified — Seat Confirmed</h1>
        <p style="margin:6px 0 0">LPU Summer School 2026</p>
      </div>
      <div style="border:1px solid #e4e7ec;border-top:0;border-radius:0 0 12px 12px;padding:24px;background:#fff">
        <p>Dear <strong>${escapeHtml(reg.guardian_name || "Parent/Guardian")}</strong>,</p>
        <p>Good news! We have verified your payment and <strong>${escapeHtml(reg.student_name || "the student")}</strong>'s seat at LPU Summer School 2026 is now <strong>confirmed</strong>. No further action is needed.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Program</td><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(reg.program_name || "LPU Summer School")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Classes</td><td style="padding:8px;border-bottom:1px solid #eee">${courses.map(escapeHtml).join(", ") || "As per selected program"}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Payment Ref</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${escapeHtml(reg.payment_reference || "")}</strong></td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#667085">Amount Paid</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${formatAmount(reg.total_fee)}</strong></td></tr>
        </table>
        <p style="margin:16px 0">We look forward to welcoming ${escapeHtml(reg.student_name || "the student")} to the campus. Joining details and the schedule will follow closer to the start date.</p>
        <p style="font-size:13px;color:#667085">Questions? ${CONTACT_EMAIL} | ${CONTACT_PHONE}</p>
      </div>
    </div>
  `;
}

function jsonResponse(data: Record<string, unknown>, status: number, headers: HeadersInit): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

Deno.serve(async (req: Request) => {
  const corsOrigin = getCorsOrigin(req);
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIP)) {
    return jsonResponse({ error: "Too many requests. Please try again later." }, 429, corsHeaders);
  }

  let payload: EmailPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, corsHeaders);
  }

  try {
    if (payload.type === "registration_received") {
      if (!payload.registration_id || !payload.payment_reference) {
        return jsonResponse({ error: "Missing registration_id or payment_reference" }, 400, corsHeaders);
      }

      const reg = await fetchRegistration(payload.registration_id, payload.payment_reference);
      if (!reg) return jsonResponse({ error: "Registration not found" }, 404, corsHeaders);
      if (!reg.email) return jsonResponse({ error: "Registration has no email address" }, 400, corsHeaders);

      const createdAt = Date.parse(String(reg.created_at || ""));
      if (Number.isFinite(createdAt) && Date.now() - createdAt > 48 * 60 * 60 * 1000) {
        return jsonResponse({ error: "Registration email window has expired" }, 410, corsHeaders);
      }

      const data = await sendEmail(String(reg.email), "Registration Created - LPU Summer School", registrationReceivedEmail(reg));
      return jsonResponse({ success: true, messageId: data.messageId || null }, 200, corsHeaders);
    }

    // Everything below this point requires an authenticated admin.
    const userId = await getAuthedUserId(req);
    if (!userId || !(await isAdminUser(userId))) {
      return jsonResponse({ error: "Unauthorized. Admin access required." }, 401, corsHeaders);
    }

    if (payload.type === "payment_verified") {
      if (!payload.registration_id || !payload.payment_reference) {
        return jsonResponse({ error: "Missing registration_id or payment_reference" }, 400, corsHeaders);
      }
      const reg = await fetchRegistration(payload.registration_id, payload.payment_reference);
      if (!reg) return jsonResponse({ error: "Registration not found" }, 404, corsHeaders);
      if (!reg.email) return jsonResponse({ error: "Registration has no email address" }, 400, corsHeaders);
      const data = await sendEmail(String(reg.email), "Payment Verified - LPU Summer School 2026", paymentConfirmedEmail(reg));
      return jsonResponse({ success: true, messageId: data.messageId || null }, 200, corsHeaders);
    }

    const { to, subject, html } = payload;
    if (!to || !subject || !html) {
      return jsonResponse({ error: "Missing required fields: to, subject, html" }, 400, corsHeaders);
    }

    const data = await sendEmail(to, subject, html);
    return jsonResponse({ success: true, messageId: data.messageId || null }, 200, corsHeaders);
  } catch (error) {
    console.error("Edge function error:", error instanceof Error ? error.message : String(error));
    return jsonResponse({ error: "Email could not be sent. Please try again later." }, 500, corsHeaders);
  }
});
