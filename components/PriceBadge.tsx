import type { CSSProperties } from "react";
import { CURRENCY } from "@/lib/config";

const CLOUD_PATH =
  "M20,58 C10,58 4,50 6,42 C7,33 16,28 24,30 C24,18 34,10 46,10 C54,10 61,14 65,20 " +
  "C70,12 79,8 88,10 C99,12 106,21 106,31 C116,31 124,38 124,47 C124,56 116,62 107,61 " +
  "L28,61 C24,61 20,60 20,58 Z";

interface PriceBadgeProps {
  price: number;
  className?: string;
  /** Drives the settle-in animation (scale 0.9->1, tilt easing into place) as the card reveals. Defaults to true (already-settled) for non-grid usage like the modal. */
  revealed?: boolean;
  settleDelayMs?: number;
}

/**
 * The shop's signature element: the price tucked into a small white puffy
 * cloud with a gold outline and soft shadow. Used on grid cards and in the
 * product modal.
 */
export function PriceBadge({ price, className, revealed = true, settleDelayMs = 0 }: PriceBadgeProps) {
  const style: CSSProperties = {
    transform: `scale(${revealed ? 1 : 0.9})`,
    transitionDelay: `${settleDelayMs}ms`,
  };
  return (
    <div
      className={`relative h-[46px] w-[86px] shrink-0 drop-shadow-[0_3px_6px_rgba(62,34,55,0.25)] transition-transform duration-500 ease-out ${className ?? ""}`}
      style={style}
    >
      {/* The path's own bounds are x 5.6-124, y 9.5-61.1, so its centre sits at
          (64.8, 35.3) — up and to the left of the 140x76 box centre, which left
          the price visibly off-centre inside the cloud. Shifting the viewBox
          origin by that difference recentres the artwork at identical scale, so
          a plainly centred label lands on the cloud's middle. */}
      <svg viewBox="-5.2 -2.7 140 76" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={CLOUD_PATH} fill="var(--cloud)" stroke="var(--gold)" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      <span className="relative flex h-full w-full items-center justify-center text-[15px] font-bold text-plum">
        <bdi className="price-isolate">
          {price % 1 === 0 ? price : price.toFixed(2)}
          {CURRENCY}
        </bdi>
      </span>
    </div>
  );
}
