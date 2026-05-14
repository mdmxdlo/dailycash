"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const FAQS = [
  {
    q: "C'est quoi Daily Cash exactement ?",
    a: "Daily Cash est un tableau de bord financier conçu spécifiquement pour les freelances africains. Il te permet de suivre tes revenus, gérer tes clients et prospects, organiser tes tâches en Kanban, et mesurer ta discipline au quotidien — le tout dans un seul outil.",
  },
  {
    q: "La version gratuite est-elle vraiment gratuite ?",
    a: "Oui, 100% gratuite sans carte bancaire. Tu peux créer un compte, accéder au tableau de bord, gérer jusqu'à 3 clients et 20 tâches, et suivre tes revenus sans payer quoi que ce soit.",
  },
  {
    q: "Quelle est la différence entre le plan Gratuit et le plan Pro ?",
    a: "Le plan Gratuit est parfait pour démarrer. Le plan Pro (6 500 FCFA/mois) débloque les clients et tâches illimités, l'export CSV de tes revenus, les objectifs mensuels personnalisés, les graphiques avancés et le support prioritaire.",
  },
  {
    q: "Comment puis-je payer l'abonnement Pro ?",
    a: "Nous acceptons les paiements par carte bancaire internationale. D'autres modes de paiement adaptés à l'Afrique (Mobile Money, Wave, Orange Money) seront disponibles très prochainement.",
  },
  {
    q: "Puis-je annuler mon abonnement à tout moment ?",
    a: "Oui, sans aucun engagement. Tu peux annuler quand tu veux depuis les paramètres de ton compte. Tu gardes l'accès Pro jusqu'à la fin de la période déjà payée.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Absolument. Toutes tes données sont stockées de manière sécurisée via Supabase (infrastructure PostgreSQL chiffrée). Nous ne vendons ni ne partageons tes données avec des tiers.",
  },
  {
    q: "Daily Cash fonctionne-t-il sur mobile ?",
    a: "Oui, l'application est entièrement responsive et optimisée pour mobile. Tu peux suivre ton activité depuis ton téléphone à tout moment, sans avoir besoin d'installer quoi que ce soit.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <AnimateOnScroll animation="fade-up" delay={index * 60}>
      <div className={`lp-card rounded-2xl overflow-hidden transition-all duration-300 ${open ? "shadow-md" : ""}`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        >
          <span className={`landing-heading font-semibold text-sm md:text-base transition-colors duration-200 ${open ? "text-green-600" : "text-slate-900"}`}>
            {q}
          </span>
          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${open ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"}`}>
            {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </span>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
          <p className="landing text-sm text-slate-500 leading-relaxed px-6 pb-5">
            {a}
          </p>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

export function FAQ() {
  return (
    <section className="landing lp-section bg-white" id="faq">
      <div className="lp-container mx-auto max-w-3xl">

        <AnimateOnScroll animation="fade-up" className="text-center mb-12">
          <span className="landing inline-block text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 border border-green-100 px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Tes questions, nos réponses.
          </h2>
          <p className="landing text-base text-slate-500 max-w-lg mx-auto">
            Tout ce que tu dois savoir avant de te lancer.
          </p>
        </AnimateOnScroll>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
