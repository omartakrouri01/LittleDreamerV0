"use client";

import { useEffect, useRef, useState } from "react";
import { LogoFull } from "./brand/LogoFull";
import { Cloud } from "./deco/Cloud";
import { CloudDivider } from "./deco/CloudDivider";

const SESSION_KEY = "ld_preloader_shown";
const HARD_TIMEOUT_MS = 2500;
const EXIT_DURATION_MS = 700;

type Phase = "pending" | "active" | "exiting" | "done";

/**
 * Full-screen intro, once per session. Never blocks the page underneath —
 * the real page always renders and is interactive behind it. Guardrails:
 * sessionStorage once-per-session, hard 2.5s force-complete, tap-anywhere
 * to skip, fully skipped under prefers-reduced-motion or when arriving
 * with ?toy= (a shared product link).
 */
export function Preloader() {
  const [phase, setPhase] = useState<Phase>("pending");
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasToyParam = new URLSearchParams(window.location.search).has("toy");
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";

    if (reducedMotion || hasToyParam || alreadyShown) {
      setPhase("done");
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("active");

    function finish() {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setProgress(100);
      setPhase("exiting");
      window.setTimeout(() => setPhase("done"), EXIT_DURATION_MS);
    }

    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const elapsed = now - start;
      setProgress(Math.min(100, Math.round((elapsed / HARD_TIMEOUT_MS) * 100)));
      if (elapsed >= HARD_TIMEOUT_MS) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  if (phase === "pending" || phase === "done") return null;

  const exiting = phase === "exiting";

  return (
    <div
      onClick={() => {
        if (!finishedRef.current) {
          finishedRef.current = true;
          setProgress(100);
          setPhase("exiting");
          window.setTimeout(() => setPhase("done"), EXIT_DURATION_MS);
        }
      }}
      role="presentation"
      aria-hidden="true"
      data-testid="preloader"
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-blush transition-transform duration-700 ease-in-out"
      style={{ transform: exiting ? "translateY(-100%)" : "translateY(0)" }}
    >
      <Cloud
        variant="a"
        className={`pointer-events-none absolute top-1/4 h-24 w-40 text-cloud opacity-80 transition-transform duration-1000 ease-out ${
          exiting ? "" : "delay-150"
        }`}
        style={{ transform: phase === "active" ? "translateX(0)" : "translateX(-140%)", insetInlineStart: "-2%" }}
      />
      <Cloud
        variant="c"
        className="pointer-events-none absolute bottom-1/4 h-20 w-36 text-cloud opacity-70 transition-transform delay-150 duration-1000 ease-out"
        style={{ transform: phase === "active" ? "translateX(0)" : "translateX(140%)", insetInlineEnd: "-2%" }}
      />

      <div
        className="relative transition-[transform,opacity] duration-700 ease-out"
        style={{ transform: phase === "active" ? "scale(1)" : "scale(0.9)" }}
      >
        <div className="animate-[float_2.4s_ease-in-out_infinite]">
          <LogoFull width={150} className="w-[150px]" priority />
        </div>
      </div>

      <div className="relative mt-6 font-display text-2xl font-extrabold text-plum">
        <bdi className="price-isolate">{progress}%</bdi>
      </div>
      <div className="relative mt-3 h-0.5 w-40 overflow-hidden rounded-full bg-petal/30">
        <div className="h-full bg-berry transition-[width] duration-150 ease-linear" style={{ width: `${progress}%` }} />
      </div>

      <CloudDivider flip className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-cloud/70" />
    </div>
  );
}
