"use client";

import { useEffect, useRef, useState } from "react";

let reducedMotionQuery: MediaQueryList | null = null;
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (!reducedMotionQuery) reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return reducedMotionQuery.matches;
}

interface RevealOptions extends IntersectionObserverInit {
  /**
   * Keep animating every time the element crosses the viewport instead of
   * firing once. Default true — the shop wants the page to feel alive on
   * every scroll, not only on first load.
   */
  repeat?: boolean;
}

/**
 * Drives the scroll reveal animations. By default it keeps observing, so an
 * element animates out as it leaves the viewport and back in when it returns —
 * scrolling up gives the same motion as scrolling down.
 *
 * Returns `true` immediately and never animates under prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement>(options?: RevealOptions) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  const { repeat = true, ...observerInit } = options ?? {};
  // Primitive deps so callers can pass an inline object without re-subscribing
  // the observer on every render.
  const { threshold, root, rootMargin } = observerInit;

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
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            setRevealed(false);
          }
        }
      },
      {
        threshold: threshold ?? 0.15,
        rootMargin: rootMargin ?? "0px 0px -10% 0px",
        root: root ?? null,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat, threshold, root, rootMargin]);

  return { ref, revealed };
}
