"use client";

/**
 * The hero's "scroll down" cue. It was inert decorative text; making it a real
 * button gives the one thing a shopper landing on the page most wants — a way
 * straight to the products — without changing the hero's look.
 */
export function ScrollCue({ targetId }: { targetId: string }) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
      className="relative mx-auto mt-6 flex min-h-11 flex-col items-center justify-center gap-1 rounded-full px-4 text-plum/50 transition-colors hover:text-plum/80"
    >
      <span className="text-xs">مرري للأسفل</span>
      <span aria-hidden className="text-lg leading-none">
        ⌄
      </span>
    </button>
  );
}
