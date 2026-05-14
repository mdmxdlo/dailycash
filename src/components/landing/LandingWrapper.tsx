"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ProblemsSection } from "./ProblemsSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorks } from "./HowItWorks";
import { Testimonials } from "./Testimonials";
import { Pricing } from "./Pricing";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";

export function LandingWrapper({ fontClasses }: { fontClasses: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lp-theme");
      if (stored === "dark") setDark(true);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      try { localStorage.setItem("lp-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  }, []);

  return (
    <div
      className={`${fontClasses} landing min-h-screen bg-white`}
      data-lp-dark={dark ? "true" : undefined}
    >
      <Navbar isDark={dark} onToggleTheme={toggleTheme} />
      <main>
        <HeroSection />
        <ProblemsSection />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
