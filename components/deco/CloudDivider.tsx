import type { SVGProps } from "react";

const BUMP_PATH =
  "M0,34 Q90,4 180,34 Q270,4 360,34 Q450,4 540,34 Q630,4 720,34 " +
  "Q810,4 900,34 Q990,4 1080,34 Q1170,4 1260,34 Q1350,4 1440,34 L1440,60 L0,60 Z";

/**
 * A full-width cloud-edge divider: a row of soft scalloped bumps. Used
 * between sections (e.g. around the outdoor shelf) and as the wipe-in
 * underline beneath section headings. `flip` mirrors it vertically so it
 * can cap either the top or the bottom of a section.
 */
export function CloudDivider({ flip = false, ...props }: SVGProps<SVGSVGElement> & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      {...props}
    >
      <path d={BUMP_PATH} />
    </svg>
  );
}
