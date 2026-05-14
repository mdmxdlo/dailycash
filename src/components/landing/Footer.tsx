import Link from "next/link";
import { TrendingUp } from "lucide-react";

const FOOTER_LINKS = {
  Produit: [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "Connexion", href: "/login" },
  ],
  Ressources: [
    { label: "Aide", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "Conditions d'utilisation", href: "#" },
  ],
  Réseaux: [
    { label: "Twitter / X", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="landing bg-slate-50 border-t border-slate-100">
      <div className="lp-container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-10 py-12">

        {/* Brand column */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="landing-heading font-bold text-slate-900 text-base">Daily Cash</span>
          </Link>
          <p className="landing text-xs text-slate-400 leading-relaxed">
            © 2026 Daily Cash.<br />
            Propulsé par la rigueur financière.<br />
            Construit pour les freelances africains.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, items]) => (
          <div key={title} className="flex flex-col gap-3">
            <h4 className="landing text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              {title}
            </h4>
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="landing text-xs text-slate-400 hover:text-green-600 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}

      </div>
    </footer>
  );
}
