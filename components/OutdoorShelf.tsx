"use client";

import { useRef } from "react";
import type { Toy } from "@/lib/sheets";
import { ToyCard } from "./ToyCard";
import { CloudDivider } from "./deco/CloudDivider";

interface OutdoorShelfProps {
  toys: Toy[];
  onOpen: (toy: Toy) => void;
}

export function OutdoorShelf({ toys, onOpen }: OutdoorShelfProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (toys.length === 0) return null;

  function scrollBy(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  }

  return (
    <section className="relative bg-sky/45 py-10">
      <CloudDivider className="absolute -top-px h-8 w-full text-blush" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-plum sm:text-2xl">ألعاب خارجية</h2>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="السابق"
              className="grid h-9 w-9 place-items-center rounded-full bg-cloud text-plum shadow-sm transition-transform active:scale-90"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="التالي"
              className="grid h-9 w-9 place-items-center rounded-full bg-cloud text-plum shadow-sm transition-transform active:scale-90"
            >
              ‹
            </button>
          </div>
        </div>

        <div ref={scrollerRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {toys.map((toy) => (
            <ToyCard key={toy.id} toy={toy} onOpen={() => onOpen(toy)} className="w-44 shrink-0 snap-start sm:w-56" />
          ))}
        </div>
      </div>

      <CloudDivider flip className="absolute -bottom-px h-8 w-full text-blush" />
    </section>
  );
}
