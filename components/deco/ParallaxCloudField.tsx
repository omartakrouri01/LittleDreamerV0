"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Cloud } from "./Cloud";

interface Layer {
  variant: "a" | "b" | "c";
  speed: number;
  top: string;
  side: "start" | "end";
  size: string;
  opacityClass: string;
}

const LAYERS: Layer[] = [
  { variant: "a", speed: 0.2, top: "6%", side: "start", size: "h-24 w-40", opacityClass: "opacity-40" },
  { variant: "b", speed: 0.4, top: "42%", side: "end", size: "h-20 w-36", opacityClass: "opacity-30" },
  { variant: "c", speed: 0.6, top: "74%", side: "start", size: "h-16 w-28", opacityClass: "opacity-25" },
];

/**
 * Decorative cloud field drifting at 3 scroll speeds behind section
 * content. useScrollProgress is a no-op (returns 0) below the 768px
 * breakpoint, so on mobile these render as static, listener-free
 * decoration per the performance budget.
 */
export function ParallaxCloudField({ className }: { className?: string }) {
  const scrollY = useScrollProgress();

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden>
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          className={`absolute text-cloud ${layer.side === "start" ? "start-[-8%]" : "end-[-8%]"} ${layer.size} ${layer.opacityClass}`}
          style={{ top: layer.top, transform: `translateY(${scrollY * layer.speed * -0.12}px)` }}
        >
          <Cloud variant={layer.variant} className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}
