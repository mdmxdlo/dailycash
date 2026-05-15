"use client";

import {
  DollarSign, Flame, Users, Target,
  TrendingUp, CheckCircle2, BarChart3, Wallet,
} from "lucide-react";

export function HeroSection({ onOpenRegister }: { onOpenRegister: () => void }) {
  return (
    <section className="landing lp-section lp-container mx-auto text-center !pt-[120px] md:!pt-[148px]">

      {/* Badge */}
      <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider mb-8">
        <span className="w-2 h-2 bg-green-500 rounded-full lp-dot-pulse" />
        Lancement Officiel V1.0
      </div>

      {/* H1 */}
      <h1 className="hero-title landing-heading font-extrabold text-4xl sm:text-5xl md:text-[62px] lg:text-[72px] leading-[1.08] tracking-tight max-w-4xl mx-auto mb-6 text-slate-900">
        Arrête d&apos;improviser ton{" "}
        <span className="lp-gradient-text">business freelance</span>.
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle landing text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        Le premier outil de suivi financier conçu pour l&apos;exécution quotidienne
        des freelances africains. Clarté, précision, rigueur.
      </p>

      {/* CTAs */}
      <div className="hero-cta flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 md:mb-20">
        <button
          onClick={onOpenRegister}
          className="lp-btn-primary w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-center"
        >
          Commencer gratuitement
        </button>
        <a
          href="#fonctionnalites"
          className="lp-btn-secondary landing w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold"
        >
          <span className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[11px]">▶</span>
          Voir la démo
        </a>
      </div>

      {/* Hero visual with floating icons */}
      <div className="hero-preview relative max-w-5xl mx-auto px-4 md:px-0">

        {/* Floating stat cards */}
        <div className="float-icon-1 lp-stat-card absolute -top-5 left-0 md:-left-10 z-10 flex items-center gap-2.5 px-3 py-2.5 hidden sm:flex">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 leading-none font-medium">Ce mois</p>
            <p className="text-sm font-extrabold text-slate-800 leading-none mt-0.5">+340K FCFA</p>
          </div>
        </div>

        <div className="float-icon-2 lp-stat-card absolute -top-3 right-0 md:-right-8 z-10 flex items-center gap-2.5 px-3 py-2.5 hidden sm:flex">
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 leading-none font-medium">Série</p>
            <p className="text-sm font-extrabold text-slate-800 leading-none mt-0.5">7 jours 🔥</p>
          </div>
        </div>

        <div className="float-icon-3 lp-stat-card absolute bottom-10 -left-4 md:-left-14 z-10 flex items-center gap-2.5 px-3 py-2.5 hidden md:flex">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 leading-none font-medium">Clients actifs</p>
            <p className="text-sm font-extrabold text-slate-800 leading-none mt-0.5">12 clients</p>
          </div>
        </div>

        <div className="float-icon-4 lp-stat-card absolute bottom-16 right-0 md:-right-10 z-10 flex items-center gap-2.5 px-3 py-2.5 hidden md:flex">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 leading-none font-medium">Objectif</p>
            <p className="text-sm font-extrabold text-slate-800 leading-none mt-0.5">82% atteint</p>
          </div>
        </div>

        {/* Dashboard Preview mockup */}
        <div className="lp-card rounded-3xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-2xl shadow-slate-200/60">
          <div className="p-3 md:p-5 flex flex-col gap-3 md:gap-4">

            {/* Window chrome */}
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="h-2.5 w-28 bg-slate-200 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-green-100 rounded-lg" />
                <div className="h-6 w-8 bg-slate-100 rounded-lg" />
              </div>
            </div>

            {/* KPI Cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {[
                { bg: "bg-green-50", icon: <TrendingUp className="w-3.5 h-3.5 text-green-600" />, label: "Revenus", val: "340K", color: "text-green-600" },
                { bg: "bg-blue-50", icon: <Users className="w-3.5 h-3.5 text-blue-500" />, label: "Clients", val: "12", color: "text-blue-500" },
                { bg: "bg-violet-50", icon: <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />, label: "Tâches", val: "8/10", color: "text-violet-500" },
                { bg: "bg-orange-50", icon: <Flame className="w-3.5 h-3.5 text-orange-500" />, label: "Série", val: "7j", color: "text-orange-500" },
              ].map((card) => (
                <div key={card.label} className={`${card.bg} rounded-xl p-2.5 md:p-3 flex flex-col gap-1.5 border border-white`}>
                  <div className="flex items-center justify-between">
                    <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">{card.icon}</div>
                    <div className="h-1.5 w-8 bg-white/60 rounded-full" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{card.label}</p>
                  <p className={`text-sm md:text-base font-extrabold ${card.color} leading-none`}>{card.val}</p>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="bg-white rounded-xl p-3 md:p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <div className="h-3 w-24 bg-slate-100 rounded-full" />
                </div>
                <div className="flex gap-1.5">
                  {["1S", "1M", "3M"].map((t) => (
                    <div key={t} className={`h-5 w-7 rounded-md text-[9px] flex items-center justify-center font-bold ${t === "1M" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"}`}>{t}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-1 h-20 md:h-28">
                {[35, 58, 42, 72, 50, 85, 65, 78, 55, 90, 70, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-green-600 to-green-300"
                    style={{ height: `${h}%`, opacity: i === 9 || i === 11 ? 1 : 0.65 }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"].map((m) => (
                  <span key={m} className="text-[8px] text-slate-300 flex-1 text-center hidden md:block">{m}</span>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[
                { icon: <Wallet className="w-3.5 h-3.5 text-yellow-500" />, bg: "bg-yellow-50" },
                { icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />, bg: "bg-green-50" },
                { icon: <Users className="w-3.5 h-3.5 text-blue-500" />, bg: "bg-blue-50" },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-xl p-3 flex flex-col gap-2 border border-white`}>
                  <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">{item.icon}</div>
                  <div className="h-2 bg-white/70 rounded-full w-4/5" />
                  <div className="h-3 bg-white/50 rounded-full w-3/5" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
