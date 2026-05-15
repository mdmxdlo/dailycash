import crypto from "node:crypto";

const MONEROO_API_URL = "https://api.moneroo.io";

function splitName(full: string | undefined, fallbackEmail: string): { first: string; last: string } {
  const v = (full ?? "").trim();
  if (!v) {
    const local = fallbackEmail.split("@")[0] || "Customer";
    return { first: local, last: "-" };
  }
  const parts = v.split(/\s+/);
  return { first: parts[0]!, last: parts.slice(1).join(" ") || "-" };
}

export async function initMonerooPayment(params: {
  amount: number;
  currency: string;
  plan: "monthly" | "annual";
  paymentId: string;
  userEmail: string;
  userName: string;
  returnUrl: string;
}): Promise<{ ok: true; checkoutUrl: string; transactionId: string } | { ok: false; error: string }> {
  const secretKey = process.env.MONEROO_SECRET_KEY!;
  const { first, last } = splitName(params.userName, params.userEmail);

  const body = {
    amount: params.amount,
    currency: params.currency,
    description: `Daily Cash Pro — ${params.plan === "monthly" ? "Mensuel" : "Annuel"}`.slice(0, 200),
    return_url: params.returnUrl,
    customer: {
      email: params.userEmail,
      first_name: first,
      last_name: last,
    },
    metadata: {
      paymentId: params.paymentId,
      plan: params.plan,
    },
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);

  try {
    const res = await fetch(`${MONEROO_API_URL}/v1/payments/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    const parsed = await res.json().catch(() => null) as { data?: { id?: string; checkout_url?: string }; message?: string } | null;

    if (!res.ok || !parsed?.data?.id || !parsed?.data?.checkout_url) {
      return { ok: false, error: parsed?.message || `Moneroo error ${res.status}` };
    }

    return { ok: true, checkoutUrl: parsed.data.checkout_url, transactionId: parsed.data.id };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, error: `Network error: ${(err as Error).message}` };
  }
}

export async function verifyMonerooPayment(transactionId: string): Promise<{
  status: string;
  amount?: number;
} | null> {
  const secretKey = process.env.MONEROO_SECRET_KEY!;
  try {
    const res = await fetch(`${MONEROO_API_URL}/v1/payments/${encodeURIComponent(transactionId)}/verify`, {
      headers: { Authorization: `Bearer ${secretKey}`, Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null) as { data?: { status?: string; amount?: number | string } } | null;
    if (!json?.data?.status) return null;
    return {
      status: String(json.data.status).toLowerCase(),
      amount: typeof json.data.amount === "number" ? json.data.amount : parseInt(String(json.data.amount), 10),
    };
  } catch {
    return null;
  }
}

export function verifyMonerooSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature.trim());
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
