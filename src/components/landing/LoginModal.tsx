"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { X, Mail, Lock, AlertCircle, Loader2, TrendingUp, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: Props) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setEmail("");
      setPassword("");
      setNeedsConfirmation(false);
      setResendDone(false);
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNeedsConfirmation(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect.");
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          setNeedsConfirmation(true);
          setError("Tu dois d'abord confirmer ton email avant de te connecter.");
        } else {
          setError(error.message);
        }
        setIsLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Impossible de se connecter. Vérifie ta connexion internet.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${siteUrl}/dashboard` },
    });
    setResendLoading(false);
    setResendDone(true);
  };

  const handleGoogleLogin = async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl}/dashboard` },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={cardRef}
        className="landing w-full max-w-md bg-white rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        style={{ animation: "lp-scale-in 0.22s ease both" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center mb-5">
            <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-green-200">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="landing-heading text-2xl font-extrabold text-slate-900">Content de te revoir</h2>
            <p className="landing text-sm text-slate-500 mt-1 text-center">Connecte-toi pour gérer ton activité freelance.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="landing text-sm text-red-600">{error}</p>
                {needsConfirmation && (
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || resendDone}
                    className="landing mt-2 text-xs font-semibold text-green-600 hover:underline disabled:opacity-60 flex items-center gap-1"
                  >
                    {resendLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    {resendDone
                      ? "✓ Email renvoyé ! Vérifie ta boîte mail."
                      : "Renvoyer l'email de confirmation →"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Resend success standalone */}
          {resendDone && !error && (
            <div className="mb-4 p-3.5 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <p className="landing text-sm text-green-700">Email de confirmation renvoyé !</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="landing block text-sm font-medium text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="landing w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all bg-slate-50"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="landing block text-sm font-medium text-slate-600">Mot de passe</label>
                <Link href="/forgot-password" className="landing text-xs text-green-600 hover:underline font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="landing w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="lp-btn-primary w-full py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="landing bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">ou continuer avec</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="landing w-full flex items-center justify-center gap-3 border border-slate-200 bg-white py-2.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="landing mt-6 text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-green-600 hover:underline font-semibold">
              S&apos;inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
