"use client";

import { useEffect, useRef, useState } from "react";

type Animation = "fade-up" | "fade-left" | "fade-right" | "scale-in" | "fade-in";

interface Props {
  children: React.ReactNode;
  className?: string;
  animation?: Animation;
  delay?: number;
  threshold?: number;
}

export function AnimateOnScroll({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${className} scroll-anim scroll-anim-${animation} ${visible ? "scroll-anim-visible" : ""}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
