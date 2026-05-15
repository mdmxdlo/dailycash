import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyMonerooSignature, verifyMonerooPayment } from "@/lib/moneroo";
import crypto from "node:crypto";

export const runtime = "nodejs";

// Service role client — bypasses RLS, only used server-side for webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const PLAN_DAYS: Record<string, number> = {
  monthly: 31,
  annual: 366,
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-moneroo-signature");
  const webhookSecret = process.env.MONEROO_WEBHOOK_SECRET ?? "";

  if (!verifyMonerooSignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Dedup — same raw bytes = same event
  const eventHash = `moneroo-${crypto.createHash("sha256").update(rawBody).digest("hex").slice(0, 32)}`;
  const { data: existing } = await supabaseAdmin
    .from("processed_events")
    .select("id")
    .eq("event_hash", eventHash)
    .single();

  if (existing) {
    return NextResponse.json({ received: true, deduped: true });
  }

  await supabaseAdmin.from("processed_events").insert({ event_hash: eventHash });

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only act on successful payments
  if (event.event !== "payment.success") {
    return NextResponse.json({ received: true });
  }

  const transactionId = event.data?.id as string | undefined;
  const paymentId = (event.data?.metadata as Record<string, string> | undefined)?.paymentId;

  if (!transactionId || !paymentId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Re-query Moneroo for defense-in-depth
  const liveStatus = await verifyMonerooPayment(transactionId);
  if (!liveStatus || !["success", "succeeded"].includes(liveStatus.status)) {
    console.error("Moneroo re-query mismatch:", liveStatus);
    return NextResponse.json({ error: "Re-query mismatch" }, { status: 400 });
  }

  // Get pending payment row (idempotent guard)
  const { data: payment } = await supabaseAdmin
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .eq("status", "pending")
    .single();

  if (!payment) {
    // Already processed
    return NextResponse.json({ received: true });
  }

  // Amount tampering check
  if (liveStatus.amount !== undefined && Math.abs(liveStatus.amount - payment.amount) > 50) {
    console.error("Amount mismatch — expected:", payment.amount, "got:", liveStatus.amount);
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  // Mark payment completed
  await supabaseAdmin
    .from("payments")
    .update({ status: "completed", moneroo_transaction_id: transactionId })
    .eq("id", paymentId);

  // Activate Pro on user profile
  const days = PLAN_DAYS[payment.plan] ?? 31;
  const proExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  await supabaseAdmin
    .from("profiles")
    .update({ is_pro: true, pro_expires_at: proExpiresAt })
    .eq("id", payment.user_id);

  return NextResponse.json({ received: true });
}
