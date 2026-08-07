"use client";

import { AGE_BUCKETS } from "@/lib/age";
import { Cloud } from "./deco/Cloud";

const VARIANTS: Array<"a" | "b" | "c"> = ["a", "b", "c"];

interface AgeChipsProps {
  active: string;
  onSelect: (bucketId: string) => void;
  gridId: string;
}

export function AgeChips({ active, onSelect, gridId }: AgeChipsProps) {
  function handleSelect(bucketId: string) {
    onSelect(bucketId === active ? "" : bucketId);
    document.getElementById(gridId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="px-4 py-6 sm:px-6">
      <h2 className="mb-4 text-center font-display text-xl font-extrabold text-plum sm:text-2xl">تسوق حسب العمر</h2>
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2">
        {AGE_BUCKETS.map((bucket, i) => {
          const isActive = active === bucket.id;
          return (
            <button
              key={bucket.id}
              type="button"
              onClick={() => handleSelect(bucket.id)}
              aria-pressed={isActive}
              className="relative h-16 w-24 shrink-0 transition-transform duration-150 active:scale-[0.96]"
            >
              <Cloud variant={VARIANTS[i % VARIANTS.length]} className={`absolute inset-0 h-full w-full drop-shadow-sm ${isActive ? "text-berry" : "text-cloud"}`} />
              <span className={`relative flex h-full items-center justify-center pb-1 text-sm font-bold ${isActive ? "text-white" : "text-plum"}`}>
                {bucket.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
