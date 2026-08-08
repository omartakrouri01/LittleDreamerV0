import Image from "next/image";
import { SHOP_NAME_EN, SHOP_TAGLINE } from "@/lib/config";

interface LogoFullProps {
  /** Rendered square size in px. Header ~44-56, hero ~200-260. */
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * The full logo lockup (moon, clouds, stars, wordmark) — used in the
 * header and the preloader. Wraps /public/logo.png directly; the artwork
 * is never redrawn.
 */
export function LogoFull({ size = 56, className, priority = false }: LogoFullProps) {
  return (
    <Image
      src="/logo.png"
      alt={`${SHOP_NAME_EN} • ${SHOP_TAGLINE}`}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={className}
    />
  );
}
