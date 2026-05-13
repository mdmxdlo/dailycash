import Link from "next/link";
import { AnimateOnScroll } from "./AnimateOnScroll";

const FREE_FEATURES = [
  "Objectif mensuel",
  "Tâches basiques",
  "Score discipline",
];

const PRO_FEATURES = [
  "Tout le plan Gratuit",
  "Scripts avancés",
  "Suivi clients complet",
  "Historique de revenus illimité",
];

export function Pricing() {
  return (
    <section className="landing lp-section lp-section-alt" id="tarifs">
      <div className="lp-container mx-auto">

        <AnimateOnScroll animation="fade-up" className="text-center mb-12 md:mb-16">
          <h2 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Tarifs
          </h2>
          <p className="landing text-base md:text-lg text-slate-500">Simple et transparent.</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-center">

          <AnimateOnScroll animation="fade-left" delay={0}>
            <div className="lp-card rounded-2xl p-8 flex flex-col">
              <div className="mb-7">
                <span className="landing text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Gratuit</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="landing-heading text-5xl font-extrabold text-slate-900">0€</span>
                  <span className="landing text-slate-400 text-sm">/mois</span>
                </div>
              </div>
              <ul className="flex-1 space-y-3.5 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 landing text-slate-500 text-sm">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 flex-shrink-0 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="lp-btn-secondary landing block text-center py-3 rounded-full font-bold text-sm">
                Commencer
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-right" delay={120}>
            <div className="lp-card lp-pricing-popular rounded-2xl p-8 flex flex-col relative overflow-hidden md:-translate-y-3 shadow-xl shadow-green-100/60">
              <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl">Populaire</div>
              <div className="mb-7">
                <span className="landing text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">Pro</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="landing-heading text-5xl font-extrabold text-slate-900">10€</span>
                  <span className="landing text-slate-400 text-sm">/mois</span>
                </div>
              </div>
              <ul className="flex-1 space-y-3.5 mb-8">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 landing text-slate-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs text-green-600 flex-shrink-0 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="lp-btn-primary block text-center py-3 rounded-full font-bold text-sm">
                Passer Pro
              </Link>
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}
