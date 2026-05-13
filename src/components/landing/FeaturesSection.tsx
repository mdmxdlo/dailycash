import { BarChart3, CheckSquare, Users, TrendingUp } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const FEATURES = [
  {
    Icon: BarChart3,
    num: "01",
    title: "Suivi des revenus",
    description:
      "Pilote ton cash-flow en temps réel. Fixe tes objectifs mensuels et suis ta progression au jour le jour.",
  },
  {
    Icon: CheckSquare,
    num: "02",
    title: "Gestion des tâches",
    description:
      "Focalise-toi sur l'essentiel chaque matin. Transforme tes objectifs globaux en actions quotidiennes exécutables.",
  },
  {
    Icon: Users,
    num: "03",
    title: "Suivi clients & prospects",
    description:
      "Ne laisse plus passer aucune opportunité. Un CRM minimaliste pour gérer tes deals en cours et tes relances.",
  },
  {
    Icon: TrendingUp,
    num: "04",
    title: "Tableau de progression",
    description:
      "Visualise ton ascension financière. Des analytics clairs pour comprendre ce qui fonctionne et ajuster ta stratégie.",
  },
];

export function FeaturesSection() {
  return (
    <section className="landing lp-section bg-white" id="fonctionnalites">
      <div className="lp-container mx-auto">

        <AnimateOnScroll animation="fade-up" className="text-center mb-12 md:mb-16">
          <h2 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            Transforme tes actions en revenu chaque jour.
          </h2>
          <p className="landing text-lg font-bold text-green-600">No action, no cash.</p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {FEATURES.map((f, i) => (
            <AnimateOnScroll
              key={f.num}
              animation={i % 2 === 0 ? "fade-left" : "fade-right"}
              delay={i * 100}
            >
              <div className="lp-card lp-card-hover rounded-2xl p-7 md:p-8 group transition-colors duration-300 hover:bg-slate-50/60 h-full">
                <div className="flex items-start justify-between mb-7">
                  <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 group-hover:border-green-300 group-hover:bg-green-100/60 transition-all duration-300">
                    <f.Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full tracking-wider">
                    {f.num}
                  </span>
                </div>
                <h3 className="landing-heading text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="landing text-slate-500 leading-relaxed text-[15px]">{f.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
