"use client";

import { useEffect, useRef, useState } from "react";

let reducedMotionQuery: MediaQueryList | null = null;
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (!reducedMotionQuery) reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return reducedMotionQuery.matches;
}

/**
 * Fires once when the element scrolls into view, then stops observing.
 * Returns `true` immediately (no animation) under prefers-reduced-motion.
 * One shared IntersectionObserver-based hook used for every section/word/
 * card reveal in the scroll animation system.
 */
export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, revealed };
}
