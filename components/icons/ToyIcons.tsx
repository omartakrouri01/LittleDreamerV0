import type { SVGProps } from "react";

/**
 * Small line icons for the category chips. Stroke-based and drawn on a 24x24
 * grid so they stay legible at the ~14px they render at, matching the weight of
 * InstagramIcon rather than the filled deco kit.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Plush toy / doll. */
export function TeddyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6.5" cy="6.5" r="2.6" />
      <circle cx="17.5" cy="6.5" r="2.6" />
      <circle cx="12" cy="14" r="6.4" />
      <circle cx="10" cy="13" r="0.6" fill="currentColor" />
      <circle cx="14" cy="13" r="0.6" fill="currentColor" />
      <path d="M10.4 16.4c1 .8 2.2.8 3.2 0" />
    </svg>
  );
}

/** Building blocks / educational. */
export function BlocksIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="12.5" width="8.5" height="8.5" rx="1.6" />
      <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="1.6" />
      <rect x="7.75" y="3.5" width="8.5" height="8.5" rx="1.6" />
    </svg>
  );
}

/** Ball / outdoor play. */
export function BallIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.4 9.5c5.6 1 11.6 1 17.2 0M3.4 14.5c5.6-1 11.6-1 17.2 0" />
      <path d="M12 3c-2.4 2.6-2.4 15.4 0 18M12 3c2.4 2.6 2.4 15.4 0 18" />
    </svg>
  );
}

/** Ride-on / bikes / vehicles. */
export function CarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 14.5h18M4.5 14.5l1.8-5a2 2 0 0 1 1.9-1.3h7.6a2 2 0 0 1 1.9 1.3l1.8 5" />
      <path d="M3 14.5v3h18v-3" />
      <circle cx="7.5" cy="18" r="1.9" />
      <circle cx="16.5" cy="18" r="1.9" />
    </svg>
  );
}

/** Bath toys. */
export function DuckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16.5c2.6 2.4 7 2.6 9.8.6 2.4-1.7 3.4-4.3 3.4-7" />
      <circle cx="15.6" cy="7.2" r="3.4" />
      <path d="M18.8 6.2h2.6l-2 2" />
      <circle cx="14.8" cy="6.4" r="0.6" fill="currentColor" />
      <path d="M3 16.5c-.6-1.5-.3-3 .8-4" />
    </svg>
  );
}

/** Pretend play / dress-up / party. */
export function BalloonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 15.5c3 0 5.4-2.9 5.4-6.2S15 3 12 3 6.6 6 6.6 9.3s2.4 6.2 5.4 6.2Z" />
      <path d="M12 15.5v1.4M12 16.9c-1.4.9.9 1.8-.5 2.6" />
    </svg>
  );
}

/** Fallback when a category doesn't match anything known. */
export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c.7 4.6 1.7 5.6 6.3 6.3-4.6.7-5.6 1.7-6.3 6.3-.7-4.6-1.7-5.6-6.3-6.3C10.3 8.6 11.3 7.6 12 3Z" />
      <path d="M18 16.5c.3 1.8.7 2.2 2.5 2.5-1.8.3-2.2.7-2.5 2.5-.3-1.8-.7-2.2-2.5-2.5 1.8-.3 2.2-.7 2.5-2.5Z" />
    </svg>
  );
}

/**
 * Categories come from the owner's sheet as free Arabic text, so match on
 * keywords rather than an exact list — a newly typed category still gets a
 * sensible icon, and anything unrecognised falls back to the sparkle.
 */
const KEYWORD_ICONS: Array<[RegExp, (p: IconProps) => React.ReactElement]> = [
  [/دمى|دمية|دبدوب|عروس|قطيفة|طري/, TeddyIcon],
  [/تعليم|مكعب|لغز|تركيب|ذكاء|حروف|أرقام/, BlocksIcon],
  [/كرة|خارج|حديقة|رياض/, BallIcon],
  [/دراج|سيار|عرب|مركب|ركوب/, CarIcon],
  [/استحمام|حمام|ماء|مسبح|بحر/, DuckIcon],
  [/تظاهر|تمثيل|مطبخ|حفل|أزياء|تنكر/, BalloonIcon],
];

export function categoryIcon(name: string): (p: IconProps) => React.ReactElement {
  const found = KEYWORD_ICONS.find(([re]) => re.test(name));
  return found ? found[1] : SparkleIcon;
}
