"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, TrendingUp } from "lucide-react";

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Ressources", href: "#ressources" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className={`landing lp-navbar fixed top-0 w-full z-50 ${scrolled ? "lp-navbar-scrolled" : ""}`}>
        <div className="lp-container flex items-center justify-between h-[72px] px-4 md:px-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm shadow-green-200 group-hover:scale-105 transition-transform duration-200">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="landing-heading font-extrabold text-xl text-slate-900 tracking-tight">
              Daily Cash
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="landing lp-nav-link">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="/login" className="landing lp-nav-link font-semibold">
              Connexion
            </Link>
            <Link
              href="/register"
              className="lp-btn-primary px-5 py-2.5 rounded-full text-sm font-bold"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="landing fixed inset-0 z-[100] flex flex-col bg-white lp-mobile-menu-enter md:hidden">
          {/* Mobile header */}
          <div className="flex items-center justify-between h-[72px] px-4 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="landing-heading font-extrabold text-xl text-slate-900">Daily Cash</span>
            </Link>
            <button
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile links */}
          <nav className="flex-1 flex flex-col gap-1 p-5 overflow-y-auto">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="landing text-[17px] font-semibold text-slate-700 hover:text-green-600 py-3.5 px-4 rounded-xl hover:bg-green-50 transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
            <div className="my-3 border-t border-slate-100" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="landing text-[17px] font-semibold text-slate-700 hover:text-green-600 py-3.5 px-4 rounded-xl hover:bg-green-50 transition-all duration-200"
            >
              Connexion
            </Link>
          </nav>

          {/* Mobile CTA */}
          <div className="p-5 border-t border-slate-100">
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="lp-btn-primary block text-center py-4 rounded-full text-base font-bold"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
