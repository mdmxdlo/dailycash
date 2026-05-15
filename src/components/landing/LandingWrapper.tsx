"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ProblemsSection } from "./ProblemsSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorks } from "./HowItWorks";
import { Testimonials } from "./Testimonials";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export function LandingWrapper({ fontClasses }: { fontClasses: string }) {
  const [dark, setDark] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

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

  const openLogin = useCallback(() => { setRegisterOpen(false); setLoginOpen(true); }, []);
  const openRegister = useCallback(() => { setLoginOpen(false); setRegisterOpen(true); }, []);

  return (
    <div
      className={`${fontClasses} landing min-h-screen bg-white`}
      data-lp-dark={dark ? "true" : undefined}
    >
      <Navbar isDark={dark} onToggleTheme={toggleTheme} onOpenLogin={openLogin} onOpenRegister={openRegister} />
      <main>
        <HeroSection onOpenRegister={openRegister} />
        <ProblemsSection />
        <FeaturesSection />
        <HowItWorks />
        <Testimonials />
        <Pricing onOpenRegister={openRegister} />
        <FAQ />
        <CtaSection onOpenRegister={openRegister} />
      </main>
      <Footer />

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onOpenRegister={openRegister} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} onOpenLogin={openLogin} />
    </div>
  );
}
