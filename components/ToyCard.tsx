"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { Toy } from "@/lib/sheets";
import { cldUrl } from "@/lib/cloudinary";
import { formatAgeRange } from "@/lib/age";
import { categoryColor } from "@/lib/categories";
import { useReveal } from "@/hooks/useReveal";
import { PriceBadge } from "./PriceBadge";
import { OrderButtons } from "./OrderButtons";
import { Star } from "./deco/Star";

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
  priority?: boolean;
  className?: string;
  /** Position within its grid/row, used to cap the reveal stagger at ~300ms. */
  index?: number;
}

export function ToyCard({ toy, onOpen, priority = false, className, index = 0 }: ToyCardProps) {
  const rotation = rotationForId(toy.id);
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const delayMs = Math.min(index * 60, 300);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    <div
      ref={ref}
      data-reveal
      role="button"
      tabIndex={0}
      onClick={(e) => {
        // Ensure this card is document.activeElement before opening, so
        // the modal can reliably restore focus here on close (click focus
        // behaviour on non-form elements varies across browsers).
        e.currentTarget.focus();
        onOpen?.();
      }}
      onKeyDown={handleKeyDown}
      aria-label={toy.name}
      style={{ transitionDelay: revealed ? `${delayMs}ms` : "0ms" }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-cloud shadow-sm transition-[opacity,transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-lg ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className ?? ""}`}
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
        <PriceBadge
          price={toy.price}
          rotation={rotation}
          revealed={revealed}
          settleDelayMs={delayMs + 120}
          className="absolute top-2 start-2 z-10"
        />

        {/* Star sparkle on hover, near the opposite corner from the price badge. */}
        <span className="pointer-events-none absolute bottom-3 end-3 text-gold opacity-0 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
          <Star className="h-4 w-4" />
        </span>
        <span className="pointer-events-none absolute bottom-6 end-8 text-gold opacity-0 transition-[opacity,transform] delay-75 duration-300 group-hover:opacity-70 group-hover:scale-100 scale-75">
          <Star className="h-2.5 w-2.5" />
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

        <div onClick={(e) => e.stopPropagation()} className="mt-1">
          <OrderButtons toy={toy} />
        </div>
      </div>
    </div>
  );
}
