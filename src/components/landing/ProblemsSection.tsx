import { TrendingDown, CalendarClock, UserX } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const PROBLEMS = [
  {
    Icon: TrendingDown,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    ringColor: "border-red-100",
    title: "Revenus instables",
    description:
      "Tu travailles dur, mais ton compte en banque joue au yoyo chaque fin de mois.",
  },
  {
    Icon: CalendarClock,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-500",
    ringColor: "border-slate-200",
    title: "Manque d'organisation",
    description:
      "Les tâches s'accumulent, la procrastination s'installe, l'exécution en pâtit.",
  },
  {
    Icon: UserX,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    ringColor: "border-blue-100",
    title: "Absence de suivi clients",
    description:
      "Des prospects oubliés, des relances ignorées. De l'argent laissé sur la table.",
  },
];

export function ProblemsSection() {
  return (
    <section className="landing lp-section lp-section-alt">
      <div className="lp-container mx-auto">

        <AnimateOnScroll animation="fade-up" className="text-center mb-12 md:mb-16">
          <h2 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Pourquoi Daily Cash ?
          </h2>
          <p className="landing text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Comparé aux autres apps, ici on parle de cash. Terminé la motivation abstraite :
            place aux actions, objectifs et résultats mesurables.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {PROBLEMS.map((p, i) => (
            <AnimateOnScroll key={p.title} animation="fade-up" delay={i * 120}>
              <div className="lp-card lp-card-hover rounded-2xl p-7 md:p-8 text-center h-full">
                <div className={`w-12 h-12 ${p.iconBg} border ${p.ringColor} rounded-full flex items-center justify-center mx-auto mb-5`}>
                  <p.Icon className={`w-5 h-5 ${p.iconColor}`} />
                </div>
                <h3 className="landing-heading text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="landing text-sm text-slate-500 leading-relaxed">{p.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
