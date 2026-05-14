import Image from "next/image";
import { AnimateOnScroll } from "./AnimateOnScroll";

const TESTIMONIALS = [
  {
    quote:
      "Depuis que j'utilise Daily Cash, je sais exactement où j'en suis chaque jour. Avant je découvrais mon CA en fin de mois, maintenant j'anticipe et j'agis.",
    name: "Mohamed Diallo",
    role: "Designer Freelance",
    initials: "MD",
    avatarBg: "bg-green-100",
    avatarText: "text-green-700",
    image: "/avatars/mohamed-diallo.jpg",
  },
  {
    quote:
      "Le suivi de discipline m'a aidé à rester régulier même en période creuse. Mon chiffre d'affaires a augmenté de +35% en deux mois.",
    name: "Aminata K.",
    role: "Consultante RH Freelance",
    initials: "AK",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
    image: null,
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
                  {t.image ? (
                    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-11 h-11 rounded-full ${t.avatarBg} flex items-center justify-center font-bold text-sm ${t.avatarText} flex-shrink-0`}>
                      {t.initials}
                    </div>
                  )}
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
