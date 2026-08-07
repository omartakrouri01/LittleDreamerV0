import type { SVGProps } from "react";

/** A four-pointed sparkle star, used for price-badge accents and card hover sparkle. */
export function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5c.6 4.6 2 6.9 6.8 7.5-4.8.6-6.2 2.9-6.8 7.5-.6-4.6-2-6.9-6.8-7.5 4.8-.6 6.2-2.9 6.8-7.5Z" />
    </svg>
  );
}
