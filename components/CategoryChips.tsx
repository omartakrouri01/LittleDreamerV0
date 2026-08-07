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
  if (categories.length === 0) return null;

  function handleSelect(name: string) {
    onSelect(name === active ? "" : name);
    document.getElementById(gridId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto mb-4 max-w-xs text-center">
        <WordReveal as="h2" text="تسوق حسب الفئة" className="font-display text-xl font-extrabold text-plum sm:text-2xl" />
        <RevealDivider className="mx-auto mt-1 h-3 w-24" />
      </div>
      <Reveal className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
        {categories.map((cat) => {
          const isActive = active === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleSelect(cat.name)}
              aria-pressed={isActive}
              style={{ backgroundColor: isActive ? "var(--berry)" : cat.color }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-transform active:scale-[0.96] ${isActive ? "text-white" : "text-plum"}`}
            >
              {cat.name}
              <span className="ms-1.5 opacity-60">({cat.count})</span>
            </button>
          );
        })}
      </Reveal>
    </section>
  );
}
