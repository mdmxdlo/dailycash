"use client";

import { useState } from "react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import { Check, X, Zap, Shield, BarChart3 } from "lucide-react";

const FREE_FEATURES = [
  { text: "Tableau de bord & KPIs", included: true },
  { text: "Tâches Kanban (20 max)", included: true },
  { text: "3 clients / prospects", included: true },
  { text: "Suivi revenus basique", included: true },
  { text: "Score de discipline", included: true },
  { text: "Export CSV des revenus", included: false },
  { text: "Clients & tâches illimités", included: false },
  { text: "Objectif mensuel personnalisé", included: false },
];

const PRO_FEATURES = [
  { text: "Tout du plan Gratuit", included: true, bold: false },
  { text: "Clients & tâches illimités", included: true, bold: true },
  { text: "Revenus illimités + Export CSV", included: true, bold: true },
  { text: "Objectif mensuel personnalisé", included: true, bold: true },
  { text: "Graphiques & analytics avancés", included: true, bold: false },
  { text: "Note de discipline quotidienne", included: true, bold: false },
  { text: "Support prioritaire", included: true, bold: false },
];

export function Pricing({ onOpenRegister }: { onOpenRegister: () => void }) {
  const [annual, setAnnual] = useState(false);

  const monthlyPrice = 6500;
  const annualPrice = 5200;
  const displayPrice = annual ? annualPrice : monthlyPrice;
  const formatPrice = (p: number) => p.toLocaleString("fr-FR");

  return (
    <section className="landing lp-section lp-section-alt" id="tarifs">
      <div className="lp-container mx-auto">

        {/* Header */}
        <AnimateOnScroll animation="fade-up" className="text-center mb-10 md:mb-12">
          <span className="landing inline-block text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 border border-green-100 px-4 py-1.5 rounded-full mb-4">
            Tarifs
          </span>
          <h2 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Investi dans ta croissance.
          </h2>
          <p className="landing text-base md:text-lg text-slate-500 max-w-xl mx-auto">
            Commence gratuitement, passe Pro quand tu es prêt à scaler.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="lp-pricing-toggle">
              <button
                className={`lp-pricing-toggle-btn landing ${!annual ? "active" : ""}`}
                onClick={() => setAnnual(false)}
              >
                Mensuel
              </button>
              <button
                className={`lp-pricing-toggle-btn landing flex items-center gap-1.5 ${annual ? "active" : ""}`}
                onClick={() => setAnnual(true)}
              >
                Annuel
                <span className="lp-savings-badge">-20%</span>
              </button>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto items-stretch">

          {/* Free */}
          <AnimateOnScroll animation="fade-left">
            <div className="lp-card rounded-2xl p-7 flex flex-col h-full">
              <div className="mb-6">
                <p className="landing text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gratuit</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="landing-heading text-5xl font-extrabold text-slate-900">0</span>
                  <span className="landing text-slate-500 text-lg font-bold">FCFA</span>
                  <span className="landing text-slate-400 text-sm">/mois</span>
                </div>
                <p className="landing text-xs text-slate-400">Pour démarrer et tester l'outil</p>
              </div>

              <hr className="lp-feature-divider" />

              <ul className="flex-1 space-y-2.5 mb-7">
                {FREE_FEATURES.map((f) => (
                  <li key={f.text} className={`flex items-center gap-2.5 landing text-sm ${f.included ? "text-slate-600" : "text-slate-300"}`}>
                    {f.included
                      ? <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0"><Check className="w-2.5 h-2.5 text-slate-500" /></span>
                      : <span className="w-4 h-4 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0"><X className="w-2.5 h-2.5 text-slate-300" /></span>
                    }
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={onOpenRegister}
                className="lp-btn-secondary landing block w-full text-center py-3 rounded-full font-bold text-sm"
              >
                Commencer gratuitement
              </button>
            </div>
          </AnimateOnScroll>

          {/* Pro */}
          <AnimateOnScroll animation="fade-right" delay={100}>
            <div className="lp-card lp-pricing-popular rounded-2xl flex flex-col h-full relative overflow-hidden">
              {/* Green header band */}
              <div className="bg-gradient-to-br from-green-600 to-green-500 px-7 pt-7 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="landing text-xs font-bold text-green-200 uppercase tracking-widest block mb-2">Pro</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="landing-heading text-4xl font-extrabold text-white">
                        {formatPrice(displayPrice)}
                      </span>
                      <span className="landing text-green-200 text-base font-bold">FCFA</span>
                      <span className="landing text-green-200 text-sm">/mois</span>
                    </div>
                    {annual && (
                      <p className="landing text-xs text-green-200 mt-1">Facturé 62 400 FCFA/an · économise 15 600 FCFA</p>
                    )}
                    {!annual && (
                      <p className="landing text-xs text-green-200 mt-1">Soit moins d'un café par semaine ☕</p>
                    )}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>

                <button
                  onClick={onOpenRegister}
                  className="landing block w-full text-center py-3 rounded-full font-bold text-sm bg-white text-green-700 hover:bg-green-50 transition-colors shadow-lg"
                >
                  Passer Pro — {formatPrice(displayPrice)} FCFA/mois
                </button>
              </div>

              {/* Features */}
              <div className="p-7 flex flex-col flex-1">
                <ul className="flex-1 space-y-2.5 mb-6">
                  {PRO_FEATURES.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5 landing text-sm text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </span>
                      <span className={f.bold ? "font-semibold text-slate-900" : ""}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Trust badges */}
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    <span className="landing text-xs text-slate-400">Annulez à tout moment, sans engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                    <span className="landing text-xs text-slate-400">Accès immédiat à toutes les fonctionnalités</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

        </div>

        {/* Bottom social proof */}
        <AnimateOnScroll animation="fade-up" delay={200} className="text-center mt-10">
          <p className="landing text-sm text-slate-400">
            Rejoins <span className="font-semibold text-slate-600">+50 freelances</span> qui suivent déjà leur cash avec Daily Cash.
          </p>
        </AnimateOnScroll>

      </div>
    </section>
  );
}
