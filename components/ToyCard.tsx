"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { Toy } from "@/lib/sheets";
import { cldUrl } from "@/lib/cloudinary";
import { formatAgeRange } from "@/lib/age";
import { categoryColor } from "@/lib/categories";
import { PriceBadge } from "./PriceBadge";

/** Deterministic small tilt (-4..4deg) from the toy id, stable across re-renders. */
function rotationForId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const normalized = ((hash % 800) + 800) % 800; // 0..799
  return (normalized / 800) * 8 - 4;
}

interface ToyCardProps {
  toy: Toy;
  /** Opens the product modal (card body click). */
  onOpen?: () => void;
  /** Triggers the order flow directly from the grid (order button click). */
  onOrder?: () => void;
  priority?: boolean;
  className?: string;
}

export function ToyCard({ toy, onOpen, onOrder, priority = false, className }: ToyCardProps) {
  const rotation = rotationForId(toy.id);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      aria-label={toy.name}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-cloud shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg ${className ?? ""}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cloud p-3">
        <Image
          src={cldUrl(toy.image, 600)}
          alt={toy.name}
          fill
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-contain"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
        <PriceBadge price={toy.price} rotation={rotation} className="absolute top-2 start-2 z-10" />

        {/* Star sparkle on hover (Step 4 wires the reveal timing; static here). */}
        <span className="pointer-events-none absolute bottom-2 end-2 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ✦
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {toy.category && (
          <span
            className="w-fit rounded-full px-2 py-0.5 text-[11px] font-medium text-plum"
            style={{ backgroundColor: categoryColor(toy.category) }}
          >
            {toy.category}
          </span>
        )}
        <h3 className="line-clamp-1 font-display text-base font-bold text-plum">{toy.name}</h3>
        <p className="text-xs text-plum/70">
          {formatAgeRange(toy.ageMin, toy.ageMax)}
          {toy.sex ? ` · ${toy.sex}` : ""}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOrder?.();
          }}
          className="mt-1 w-full rounded-full bg-berry px-3 py-2 text-xs font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          اطلب عبر إنستغرام
        </button>
      </div>
    </div>
  );
}
