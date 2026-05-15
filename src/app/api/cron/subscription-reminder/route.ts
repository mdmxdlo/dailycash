import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(req: Request) {
  // Vérification du secret cron
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupérer les utilisateurs Pro dont l'abonnement expire dans exactement 3 jours
  const in3Days = new Date();
  in3Days.setDate(in3Days.getDate() + 3);
  const dateStr = in3Days.toISOString().split("T")[0]; // YYYY-MM-DD

  const { data: users, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, email, pro_expires_at")
    .eq("is_pro", true)
    .gte("pro_expires_at", `${dateStr}T00:00:00.000Z`)
    .lt("pro_expires_at", `${dateStr}T23:59:59.999Z`);

  if (error) {
    console.error("Cron query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  for (const user of users) {
    const expiryDate = new Date(user.pro_expires_at).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });

    await resend.emails.send({
      from: "Daily Cash <noreply@dailycash.app>",
      to: user.email,
      subject: "Votre abonnement Pro expire dans 3 jours",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
            <tr><td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">

                <tr><td style="background:#16a34a;padding:24px 32px;">
                  <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Daily Cash</p>
                </td></tr>

                <tr><td style="padding:32px;">
                  <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
                    Bonjour ${user.name || ""}👋
                  </p>
                  <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                    Votre abonnement <strong style="color:#111827;">Daily Cash Pro</strong> expire le <strong style="color:#16a34a;">${expiryDate}</strong>.
                    Pour continuer à profiter de toutes les fonctionnalités sans interruption, renouvelez dès maintenant.
                  </p>

                  <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;width:100%;">
                    <tr><td style="padding:20px 24px;">
                      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:.05em;">Ce que vous perdrez sans Pro</p>
                      ${["Clients & tâches illimités", "Export CSV des revenus", "Analytics avancés", "Support prioritaire"].map(f =>
                        `<p style="margin:0 0 6px;font-size:14px;color:#374151;">✓ ${f}</p>`
                      ).join("")}
                    </td></tr>
                  </table>

                  <a href="https://dailycash-seven.vercel.app/dashboard/settings"
                     style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;">
                    Renouveler mon abonnement
                  </a>

                  <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                    Si vous ne souhaitez pas renouveler, votre accès restera actif jusqu'au ${expiryDate} puis basculera automatiquement vers le plan gratuit.
                  </p>
                </td></tr>

                <tr><td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                    Daily Cash · Outil de gestion pour freelances africains
                  </p>
                </td></tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
    sent++;
  }

  return NextResponse.json({ sent });
}
