import { Cloud } from "./Cloud";
import { Star } from "./Star";

/**
 * The page's living background: soft colour washes plus clouds that drift and
 * stars that twinkle behind everything, the whole way down the site.
 *
 * Deliberately CSS-only. The existing parallax is driven by a scroll listener
 * and is therefore desktop-only under the performance budget; pure keyframe
 * animation runs on the compositor, costs no scroll work, and so can run on
 * phones too. Everything animates transform/opacity only, and the global
 * prefers-reduced-motion rule in globals.css freezes all of it.
 *
 * Fixed and non-interactive, so it never affects layout or hit-testing. Page
 * content sits above it on z-10 (see app/layout.tsx).
 */
export function DreamyBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Colour washes — break up the flat blush without competing with product photos. */}
      <div className="absolute -start-1/4 top-[-10%] h-[60vh] w-[80vw] rounded-full bg-petal/25 blur-3xl" />
      <div className="absolute -end-1/4 top-[25%] h-[55vh] w-[70vw] rounded-full bg-sky/25 blur-3xl" />
      <div className="absolute -start-[10%] top-[62%] h-[50vh] w-[75vw] rounded-full bg-gold/[0.10] blur-3xl" />
      <div className="absolute -end-[15%] bottom-[-10%] h-[45vh] w-[65vw] rounded-full bg-petal/20 blur-3xl" />

      {/* Drifting clouds. Long, offset durations so they never march in step. */}
      <Cloud variant="a" className="absolute top-[8%] h-24 w-40 animate-[drift-a_75s_linear_infinite] text-cloud/70 sm:h-32 sm:w-56" />
      <Cloud variant="c" className="absolute top-[34%] h-20 w-36 animate-[drift-b_95s_linear_infinite] text-cloud/55 sm:h-28 sm:w-48" />
      <Cloud variant="b" className="absolute top-[58%] h-16 w-28 animate-[drift-a_110s_linear_infinite] text-cloud/45 sm:h-24 sm:w-40" />
      <Cloud variant="a" className="absolute top-[80%] h-20 w-32 animate-[drift-b_85s_linear_infinite] text-cloud/50 sm:h-28 sm:w-44" />

      {/* Twinkling stars — opacity only, so they cost nothing to paint. */}
      <Star className="absolute start-[12%] top-[18%] h-3 w-3 animate-[twinkle_5s_ease-in-out_infinite] text-gold/50" />
      <Star className="absolute end-[16%] top-[30%] h-2.5 w-2.5 animate-[twinkle_7s_ease-in-out_infinite_1s] text-gold/40" />
      <Star className="absolute start-[22%] top-[52%] h-2 w-2 animate-[twinkle_6s_ease-in-out_infinite_2s] text-moon/45" />
      <Star className="absolute end-[10%] top-[68%] h-3 w-3 animate-[twinkle_8s_ease-in-out_infinite_.5s] text-gold/40" />
      <Star className="absolute start-[8%] top-[88%] h-2.5 w-2.5 animate-[twinkle_6.5s_ease-in-out_infinite_1.5s] text-gold/35" />
    </div>
  );
}
