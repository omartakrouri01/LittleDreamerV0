"use client";

import type { CategoryInfo } from "@/lib/categories";
import { WordReveal } from "./reveal/WordReveal";
import { RevealDivider } from "./reveal/RevealDivider";
import { Reveal } from "./reveal/Reveal";

interface CategoryChipsProps {
  categories: CategoryInfo[];
  active: string;
  onSelect: (category: string) => void;
  gridId: string;
}

export function CategoryChips({ categories, active, onSelect, gridId }: CategoryChipsProps) {
  // With a single category there is nothing to choose between, so the heading,
  // divider and lone chip are ~150px of height that filters nothing. Mirrors the
  // outdoor shelf, which already hides itself when there's only one place value.
  // Reappears on its own once the sheet has real category variety.
  if (categories.length < 2) return null;

  function handleSelect(name: string) {
    onSelect(name === active ? "" : name);
    document.getElementById(gridId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto mb-4 max-w-xs text-center">
        <WordReveal as="h2" text="تسوق حسب الفئة" className="font-display text-xl font-extrabold text-plum sm:text-2xl" />
        <RevealDivider className="mx-auto mt-1 h-3 w-24" />
      </div>
      {/* Scroller outside, content-width row inside: the row centres when it fits
          and scrolls when it doesn't, without justify-center clipping the first chip. */}
      <Reveal className="overflow-x-auto pb-1">
        <div className="mx-auto flex w-max max-w-full gap-2 sm:flex-wrap sm:justify-center">
          {categories.map((cat) => {
            const isActive = active === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleSelect(cat.name)}
                aria-pressed={isActive}
                style={{ backgroundColor: isActive ? "var(--berry)" : cat.color }}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-transform active:scale-[0.96] ${
                  isActive ? "text-white" : "text-plum"
                }`}
              >
                {cat.name}
                <span className="ms-1.5 opacity-60">({cat.count})</span>
              </button>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
