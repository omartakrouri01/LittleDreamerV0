import type { CSSProperties } from "react";
import { CURRENCY } from "@/lib/config";

const CLOUD_PATH =
  "M20,58 C10,58 4,50 6,42 C7,33 16,28 24,30 C24,18 34,10 46,10 C54,10 61,14 65,20 " +
  "C70,12 79,8 88,10 C99,12 106,21 106,31 C116,31 124,38 124,47 C124,56 116,62 107,61 " +
  "L28,61 C24,61 20,60 20,58 Z";

interface PriceBadgeProps {
  price: number;
  /** Small deterministic tilt in degrees, derived from the toy id by the caller. */
  rotation?: number;
  className?: string;
}

/**
 * The shop's signature element: the price tucked into a small white puffy
 * cloud with a gold outline and soft shadow. Used on grid cards and in the
 * product modal.
 */
export function PriceBadge({ price, rotation = 0, className }: PriceBadgeProps) {
  const style: CSSProperties = { transform: `rotate(${rotation}deg)` };
  return (
    <div className={`relative h-[38px] w-[70px] drop-shadow-[0_3px_6px_rgba(62,34,55,0.25)] ${className ?? ""}`} style={style}>
      <svg viewBox="0 0 140 76" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={CLOUD_PATH} fill="var(--cloud)" stroke="var(--gold)" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      <span className="relative flex h-full w-full items-center justify-center pb-1 text-[13px] font-bold text-plum">
        <bdi className="price-isolate">
          {price % 1 === 0 ? price : price.toFixed(2)}
          {CURRENCY}
        </bdi>
      </span>
    </div>
  );
}
