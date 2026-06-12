import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get("origin") || "";
  if (
    origin.endsWith(".vercel.app") ||
    origin.endsWith(".unisportscouncil.co.in") ||
    origin === "https://unisportscouncil.co.in" ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1")
  ) {
    return origin;
  }
  return "https://summerschool.unisportscouncil.co.in";
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 3;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

Deno.serve(async (req: Request) => {
  const corsOrigin = getCorsOrigin(req);
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIP)) {
      return new Response(JSON.stringify({ error: "Too many uploads. Please wait and try again." }), {
        status: 429, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const formData = await req.formData();
    const registrationId = formData.get("registration_id") as string;
    const paymentRef = formData.get("payment_reference") as string;
    const file = formData.get("screenshot") as File;

    if (!registrationId || !paymentRef || !file) {
      return new Response(JSON.stringify({ error: "Missing registration_id, payment_reference, or screenshot" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Invalid file type. Please upload a JPG, PNG, or WebP image." }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: "File too large. Maximum size is 5MB." }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const serviceHeaders = {
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`
    };

    const regRes = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?id=eq.${registrationId}&payment_reference=eq.${paymentRef}&select=id,payment_status,screenshot_url`,
      { headers: serviceHeaders }
    );
    const regs = await regRes.json();

    if (!regs?.length) {
      return new Response(JSON.stringify({ error: "Registration not found or reference mismatch" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const reg = regs[0];

    if (reg.payment_status === "verification_pending" && reg.screenshot_url) {
      return new Response(JSON.stringify({ error: "Screenshot already uploaded. Your payment is under verification." }), {
        status: 409, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (reg.payment_status === "paid") {
      return new Response(JSON.stringify({ error: "Payment already verified for this registration." }), {
        status: 409, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${paymentRef}-${Date.now()}.${ext}`;
    const fileBytes = await file.arrayBuffer();

    const uploadRes = await fetch(
      `${SUPABASE_URL}/storage/v1/object/payment-screenshots/${fileName}`,
      {
        method: "POST",
        headers: {
          ...serviceHeaders,
          "Content-Type": file.type,
          "x-upsert": "true"
        },
        body: fileBytes
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return new Response(JSON.stringify({ error: "Failed to upload screenshot", details: err }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const screenshot_url = `${SUPABASE_URL}/storage/v1/object/public/payment-screenshots/${fileName}`;

    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/registrations?id=eq.${registrationId}`,
      {
        method: "PATCH",
        headers: { ...serviceHeaders, "Content-Type": "application/json", "Prefer": "return=representation" },
        body: JSON.stringify({
          screenshot_url,
          payment_status: "verification_pending"
        })
      }
    );

    if (!updateRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to update registration" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      screenshot_url,
      message: "Screenshot uploaded. Your payment will be verified shortly."
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
