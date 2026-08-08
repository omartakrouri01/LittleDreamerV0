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

  const content = words.map((word, i) => (
    <span key={i} className="inline-block overflow-hidden py-1 align-bottom">
      <span
        className={`inline-block transition-[opacity,transform] duration-500 ease-out ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${wordClassName ?? ""}`}
        style={{ transitionDelay: `${i * 60}ms` }}
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
