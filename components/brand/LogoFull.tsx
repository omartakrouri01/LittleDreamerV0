import Image from "next/image";
import { SHOP_NAME_EN, SHOP_TAGLINE } from "@/lib/config";

/** Intrinsic size of public/logo.png — the lockup is landscape, not square. */
const W = 578;
const H = 485;

interface LogoFullProps {
  /** Rendered width in px, used for the `sizes` hint. Control the actual box with `className`. */
  width?: number;
  className?: string;
  priority?: boolean;
}

/**
 * The full logo lockup (illustration + "Little Dreamer" + "Kids Shop") — for the
 * hero and preloader, where there's room to read it. Small placements should use
 * LogoMark instead; the wordmark is unreadable below ~120px wide.
 *
 * Height is left to `h-auto` so the real 578x485 aspect is preserved: the previous
 * square width/height forced the old circular badge into shape but would squash this.
 */
export function LogoFull({ width = 225, className, priority = false }: LogoFullProps) {
  return (
    <Image
      src="/logo.png"
      alt={`${SHOP_NAME_EN} • ${SHOP_TAGLINE}`}
      width={W}
      height={H}
      sizes={`${width}px`}
      priority={priority}
      className={`h-auto ${className ?? ""}`}
    />
  );
}
