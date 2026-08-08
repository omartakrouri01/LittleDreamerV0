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
import { categoryIcon } from "./icons/ToyIcons";

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
  const { ref, revealed } = useReveal<HTMLDivElement>();
  const delayMs = Math.min(index * 45, 180);

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
      style={{
        transitionDelay: revealed ? `${delayMs}ms` : "0ms",
        // Each card is tinted by its category, so a grid reads as a varied set
        // rather than identical white tiles. Kept faint: --plum text on this
        // over white stays far above contrast minimums.
        background: toy.category
          ? `linear-gradient(170deg, ${categoryColor(toy.category)}33, ${categoryColor(toy.category)}12), var(--cloud)`
          : "var(--cloud)",
      }}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl shadow-sm transition-[opacity,transform,box-shadow] duration-[400ms] ease-out hover:-translate-y-1 hover:shadow-lg ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className ?? ""}`}
    >
      {/* Padding lives on the <Image>, not the wrapper: `fill` positions against
          the padding box, so wrapper padding would sit under the photo. On the
          image it insets the picture, letting the card tint show as a frame. */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={cldUrl(toy.image, 600)}
          alt={toy.name}
          fill
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-contain p-3"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
        {/* Star sparkle on hover. */}
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
            className="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-plum"
            style={{ backgroundColor: categoryColor(toy.category) }}
          >
            {(() => {
              const Icon = categoryIcon(toy.category);
              return <Icon className="h-3 w-3" />;
            })()}
            {toy.category}
          </span>
        )}
        {/* Name and price share a row: in RTL the name reads from the right and
            the badge sits at the end, i.e. to its left. */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 min-w-0 flex-1 font-display text-base font-bold text-plum">{toy.name}</h3>
          <PriceBadge price={toy.price} revealed={revealed} settleDelayMs={delayMs + 120} />
        </div>
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
