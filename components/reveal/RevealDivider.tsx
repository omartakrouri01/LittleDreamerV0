"use client";

import { useReveal } from "@/hooks/useReveal";
import { CloudDivider } from "../deco/CloudDivider";

/** The cloud-edge divider under a section heading, wiping in from the right (RTL) on reveal. */
export function RevealDivider({ className }: { className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-reveal className={`overflow-hidden ${className ?? ""}`}>
      <div
        className={`origin-right transition-transform duration-700 ease-out ${revealed ? "scale-x-100" : "scale-x-0"}`}
        style={{ transitionDelay: "150ms" }}
      >
        <CloudDivider className="h-4 w-full text-petal/50" />
      </div>
    </div>
  );
}
