import Image from "next/image";
import { SHOP_NAME_EN } from "@/lib/config";

interface LogoMarkProps {
  /** Rendered square size in px. Footer ~32-40. */
  size?: number;
  className?: string;
}

/**
 * The same logo image as LogoFull, rendered smaller — used in the footer.
 * Same underlying /public/logo.png, no separate crop or redraw.
 */
export function LogoMark({ size = 36, className }: LogoMarkProps) {
  return <Image src="/logo.png" alt={SHOP_NAME_EN} width={size} height={size} sizes={`${size}px`} className={className} />;
}
