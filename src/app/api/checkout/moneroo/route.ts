import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { initMonerooPayment } from "@/lib/moneroo";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Sandbox: amounts in EUR cents equivalent for testing; switch to XOF in production
const IS_SANDBOX = process.env.MONEROO_SECRET_KEY?.startsWith("pvk_sandbox");
const PLAN_AMOUNTS: Record<string, number> = IS_SANDBOX
  ? { monthly: 10, annual: 96 }       // ~6 500 XOF / ~62 400 XOF en EUR pour le test
  : { monthly: 6500, annual: 62400 };
const CURRENCY = IS_SANDBOX ? "EUR" : "XOF";

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const plan: "monthly" | "annual" = body.plan === "annual" ? "annual" : "monthly";
  const amount = PLAN_AMOUNTS[plan];
  const paymentId = randomUUID();

  const { error: insertError } = await supabaseAdmin.from("payments").insert({
    id: paymentId,
    user_id: user.id,
    amount,
    currency: CURRENCY,
    plan,
    status: "pending",
  });

  if (insertError) {
    console.error("Insert payment error:", insertError);
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dailycash-seven.vercel.app";
  const returnUrl = `${siteUrl}/dashboard?payment=success&paymentId=${paymentId}`;

  const result = await initMonerooPayment({
    amount,
    currency: CURRENCY,
    plan,
    paymentId,
    userEmail: user.email!,
    userName: profile?.name || "",
    returnUrl,
  });

  if (!result.ok) {
    await supabaseAdmin.from("payments").delete().eq("id", paymentId);
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  await supabaseAdmin
    .from("payments")
    .update({ moneroo_transaction_id: result.transactionId })
    .eq("id", paymentId);

  return NextResponse.json({ checkoutUrl: result.checkoutUrl });
}
