// Sends booking confirmation emails (non-blocking).
// This function logs and attempts a Resend call if RESEND_API_KEY is set.
// Booking succeeds regardless of email outcome.

// Declare Deno global to fix TypeScript errors in Node/React environments
declare const Deno: any;

const ADMIN_EMAIL = "sanknoes.edu@gmail.com";
const FROM_EMAIL = "TrainHub <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  type: string;
  table: string;
  record: {
    booking_date: string;
    college_name: string;
    contact_person: string;
    email: string;
    phone: string;
  };
}

async function sendViaResend(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    console.log(`[email] RESEND_API_KEY not set — would send to ${to}: ${subject}`);
    return { skipped: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  const text = await res.text();
  if (!res.ok) console.error("[email] Resend error", res.status, text);
  return { ok: res.ok, status: res.status };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const payload = (await req.json()) as WebhookPayload;
    
    // Allow manual triggers for backwards compatibility or testing, but prefer webhook
    const data = payload.record || payload;
    
    const bookingDateStr = data.booking_date || (data as any).bookingDate;
    const collegeName = data.college_name || (data as any).collegeName;
    const contactPerson = data.contact_person || (data as any).contactPerson;
    
    if (!bookingDateStr || !collegeName || !contactPerson) {
      throw new Error("Invalid payload");
    }

    const dateStr = new Date(bookingDateStr).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const userHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1F2937">
        <h2 style="margin:0 0 8px;color:#1E3A8A">Booking Confirmed</h2>
        <p>Hi ${data.contactPerson},</p>
        <p>Your training slot for <strong>${data.collegeName}</strong> is confirmed for <strong>${dateStr}</strong>.</p>
        <p>We look forward to delivering an excellent session for your students.</p>
        <p style="color:#6B7280;font-size:12px;margin-top:24px">— TrainHub</p>
      </div>`;

    const adminHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#1F2937">
        <h2 style="margin:0 0 8px;color:#1E3A8A">New Booking Received</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#6B7280">College</td><td><strong>${data.collegeName}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Contact</td><td>${data.contactPerson}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Email</td><td>${data.email}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Phone</td><td>${data.phone}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280">Date</td><td><strong>${dateStr}</strong></td></tr>
        </table>
      </div>`;

    await Promise.allSettled([
      sendViaResend(data.email, "Booking Confirmed", userHtml),
      sendViaResend(ADMIN_EMAIL, "New Booking Received", adminHtml),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-booking-email error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 200, // never block client
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});