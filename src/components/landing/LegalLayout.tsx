import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";

interface Section {
  title: string;
  content: string | string[];
}

export function LegalLayout({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: Section[];
}) {
  return (
    <div className="landing min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="lp-container mx-auto flex items-center justify-between h-16 px-4 md:px-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="landing-heading font-bold text-slate-900">Daily Cash</span>
          </Link>
          <Link
            href="/"
            className="landing flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="lp-container mx-auto px-4 md:px-10 py-10 md:py-16 max-w-3xl">
        <div className="mb-8">
          <h1 className="landing-heading text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {title}
          </h1>
          <p className="landing text-sm text-slate-400">Dernière mise à jour : {lastUpdated}</p>
        </div>

        <div className="flex flex-col gap-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h2 className="landing-heading text-lg font-bold text-slate-900 mb-3">
                {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="space-y-2">
                  {section.content.map((item, j) => (
                    <li key={j} className="landing text-sm text-slate-600 leading-relaxed flex gap-2">
                      <span className="text-green-600 font-bold mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="landing text-sm text-slate-600 leading-relaxed">{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-100 py-6 mt-4">
        <div className="lp-container mx-auto px-4 text-center landing text-xs text-slate-400">
          © 2026 Daily Cash. Tous droits réservés. —{" "}
          <Link href="/confidentialite" className="hover:text-green-600 transition-colors">Confidentialité</Link>
          {" · "}
          <Link href="/conditions" className="hover:text-green-600 transition-colors">Conditions</Link>
        </div>
      </footer>
    </div>
  );
}
