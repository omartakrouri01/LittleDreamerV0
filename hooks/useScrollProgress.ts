"use client";

import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * rAF-throttled window.scrollY, active ONLY on tablet/desktop
 * (>=768px) and only without prefers-reduced-motion — the performance
 * budget requires zero scroll listeners on mobile for decorative
 * parallax. Reveals (useReveal) are unaffected and still fire everywhere.
 */
export function useScrollProgress(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    }

    function syncListener() {
      window.removeEventListener("scroll", onScroll);
      if (desktopQuery.matches && !reducedMotionQuery.matches) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        setScrollY(0);
      }
    }

    syncListener();
    desktopQuery.addEventListener("change", syncListener);
    reducedMotionQuery.addEventListener("change", syncListener);

    return () => {
      window.removeEventListener("scroll", onScroll);
      desktopQuery.removeEventListener("change", syncListener);
      reducedMotionQuery.removeEventListener("change", syncListener);
    };
  }, []);

  return scrollY;
}
