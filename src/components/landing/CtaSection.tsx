import Link from "next/link";

export function CtaSection() {
  return (
    <section className="landing lp-section bg-white">
      <div className="lp-container mx-auto text-center">

        <div className="max-w-2xl mx-auto">
          <h2 className="landing-heading text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight tracking-tight">
            Stop improvising.<br />
            <span className="lp-gradient-text">Start executing.</span>
          </h2>
          <p className="landing text-base md:text-lg text-slate-500 mb-10 leading-relaxed">
            Utilise Daily Cash ou continue de deviner. Les freelances sérieux suivent leurs chiffres.
            Rejoins l&apos;élite.
          </p>
          <Link
            href="/register"
            className="lp-btn-primary inline-block px-10 py-4 rounded-full font-bold text-sm"
          >
            Commencer gratuitement
          </Link>
        </div>

      </div>
    </section>
  );
}
