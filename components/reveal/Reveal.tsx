"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

/** Fades in and rises 24px on scroll-into-view, once. */
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-reveal
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-[opacity,transform] duration-[450ms] ease-out ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
