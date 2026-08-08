import Image from "next/image";
import { SHOP_NAME_EN } from "@/lib/config";

/** Intrinsic size of public/logo-mark.png (the illustration cropped out of the lockup). */
const W = 353;
const H = 288;

interface LogoMarkProps {
  /** Rendered width in px, used for the `sizes` hint. Control the actual box with `className`. */
  width?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Just the illustration — moon, clouds and stars — cropped from the same artwork.
 * Used wherever the lockup would be too small to read its wordmark: header, footer,
 * favicon, apple-icon.
 */
export function LogoMark({ width = 44, className, priority = false }: LogoMarkProps) {
  return (
    <Image
      src="/logo-mark.png"
      alt={SHOP_NAME_EN}
      width={W}
      height={H}
      sizes={`${width}px`}
      priority={priority}
      className={`h-auto ${className ?? ""}`}
    />
  );
}
