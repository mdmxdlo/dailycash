import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ subscription_cancelled: true })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: "Erreur lors de l'annulation" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
