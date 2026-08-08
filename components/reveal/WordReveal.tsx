"use client";

import { useReveal } from "@/hooks/useReveal";

interface WordRevealProps {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  wordClassName?: string;
}

/**
 * Splits Arabic text by WORD (never by character — Arabic letters connect,
 * splitting by character visually destroys the script) and reveals each
 * word with a ~60ms stagger, rise + fade, once on scroll into view.
 */
export function WordReveal({ text, as = "h1", className, wordClassName }: WordRevealProps) {
  const { ref, revealed } = useReveal<HTMLHeadingElement>();
  const words = text.split(/\s+/).filter(Boolean);

  // No overflow-hidden on the per-word wrapper: it clipped the hamza on أ, which
  // rides above the line box. The reveal only travels 12px, so the mask that
  // clipping paid for bought very little.
  const content = words.map((word, i) => (
    <span key={i} className="inline-block py-1 align-bottom">
      <span
        data-reveal
        className={`inline-block transition-[opacity,transform] duration-[400ms] ease-out ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        } ${wordClassName ?? ""}`}
        style={{ transitionDelay: `${i * 45}ms` }}
      >
        {word}
        {i < words.length - 1 ? " " : ""}
      </span>
    </span>
  ));

  if (as === "h2") {
    return (
      <h2 ref={ref} className={className}>
        {content}
      </h2>
    );
  }
  if (as === "p") {
    return (
      <p ref={ref as unknown as React.RefObject<HTMLParagraphElement>} className={className}>
        {content}
      </p>
    );
  }
  return (
    <h1 ref={ref} className={className}>
      {content}
    </h1>
  );
}
