import type { SVGProps } from "react";

interface CloudProps extends SVGProps<SVGSVGElement> {
  variant?: "a" | "b" | "c";
}

/**
 * A soft, rounded decorative puff of overlapping circles — NOT a
 * recreation of the logo's clouds, just generic atmosphere shapes for the
 * parallax field and static decoration. Fill defaults to currentColor;
 * control opacity/color from the wrapping element so overlapping circles
 * composite as one flat shape instead of showing seams.
 */
export function Cloud({ variant = "a", ...props }: CloudProps) {
  const shapes: Record<string, { cx: number; cy: number; r: number }[]> = {
    a: [
      { cx: 30, cy: 42, r: 20 },
      { cx: 55, cy: 30, r: 24 },
      { cx: 80, cy: 40, r: 18 },
      { cx: 58, cy: 46, r: 22 },
    ],
    b: [
      { cx: 25, cy: 38, r: 16 },
      { cx: 48, cy: 24, r: 22 },
      { cx: 70, cy: 34, r: 26 },
      { cx: 50, cy: 44, r: 20 },
    ],
    c: [
      { cx: 20, cy: 40, r: 14 },
      { cx: 38, cy: 28, r: 18 },
      { cx: 60, cy: 26, r: 19 },
      { cx: 80, cy: 36, r: 15 },
      { cx: 55, cy: 44, r: 20 },
    ],
  };

  return (
    <svg viewBox="0 0 100 60" fill="none" aria-hidden="true" {...props}>
      <g fill="currentColor">
        {shapes[variant].map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
        ))}
      </g>
    </svg>
  );
}
