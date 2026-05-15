"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, Mail, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-xl animate-in zoom-in-95 duration-500 text-center">
          <div className="bg-green-50 p-4 rounded-full inline-block mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h1>
          <p className="text-gray-500 mb-6">
            Nous avons envoyé un lien pour réinitialiser votre mot de passe à <br/> <strong className="text-gray-900">{email}</strong>
          </p>
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-xl animate-in zoom-in-95 duration-500">

        <Link href="/login" className="text-gray-500 hover:text-gray-900 inline-flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Retour</span>
        </Link>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-50 p-3 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Mot de passe oublié</h1>
          <p className="text-gray-500 mt-2 text-center text-sm">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm flex justify-center items-center gap-2 mt-6"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Envoyer le lien"}
          </button>
        </form>
      </div>
    </div>
  );
}
