import { AnimateOnScroll } from "./AnimateOnScroll";

const TESTIMONIALS = [
  {
    quote:
      "Daily Cash a complètement changé ma façon de voir mon activité. Avant je faisais des tâches, maintenant je génère des revenus prévisibles.",
    name: "Marc D.",
    role: "Développeur Freelance",
    initials: "MD",
    avatarBg: "bg-green-100",
    avatarText: "text-green-700",
  },
  {
    quote:
      "Le tracker de discipline est le coup de pied aux fesses dont j'avais besoin. Mes relances clients sont à jour et mon CA a fait +40%.",
    name: "Sophie L.",
    role: "Consultante Marketing",
    initials: "SL",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-700",
  },
];

export function Testimonials() {
  return (
    <section className="landing lp-section bg-white">
      <div className="lp-container mx-auto">

        <AnimateOnScroll animation="fade-up" className="text-center mb-12 md:mb-16">
          <h2 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ils ont arrêté d&apos;improviser
          </h2>
          <p className="landing text-base md:text-lg text-slate-500 max-w-xl mx-auto">
            Rejoins les freelances qui maîtrisent leur croissance.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <AnimateOnScroll key={t.name} animation={i === 0 ? "fade-left" : "fade-right"} delay={i * 120}>
              <div className="lp-card lp-card-hover rounded-2xl p-7 md:p-8 h-full">
                <div className="lp-stars text-lg mb-4 tracking-wide">★★★★★</div>
                <p className="landing text-slate-600 italic leading-relaxed mb-6 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-full ${t.avatarBg} flex items-center justify-center font-bold text-sm ${t.avatarText} flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="landing-heading font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="landing text-xs text-slate-400 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
