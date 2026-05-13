const STEPS = [
  {
    num: "1",
    title: "Fixe tes objectifs",
    description: "Définis tes objectifs de revenus mensuels de manière claire et réaliste.",
  },
  {
    num: "2",
    title: "Planifie tes actions",
    description: "Découpe tes objectifs en tâches quotidiennes concrètes et exécutables.",
  },
  {
    num: "3",
    title: "Exécute et encaisse",
    description: "Valide tes tâches, suis tes prospects et regarde tes revenus augmenter.",
  },
];

export function HowItWorks() {
  return (
    <section className="landing lp-section lp-section-alt">
      <div className="lp-container mx-auto">

        <div className="text-center mb-12 md:mb-16">
          <h2 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Comment ça marche
          </h2>
          <p className="landing text-base md:text-lg text-slate-500 max-w-xl mx-auto">
            Une méthode simple pour des résultats concrets.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0" />

          {STEPS.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-extrabold mb-5 shadow-lg shadow-green-200/60 border-4 border-white">
                {step.num}
              </div>
              <h3 className="landing-heading text-lg font-bold text-slate-900 mb-2.5">{step.title}</h3>
              <p className="landing text-sm text-slate-500 leading-relaxed max-w-[240px]">{step.description}</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
