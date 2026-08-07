import { LogoFull } from "./brand/LogoFull";
import { Cloud } from "./deco/Cloud";

/**
 * Word-stagger reveal + scroll parallax land in Step 4; this is the
 * static structure and content.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 text-center sm:pb-24 sm:pt-16">
      <Cloud variant="a" className="pointer-events-none absolute -start-10 top-6 h-28 w-48 text-cloud opacity-70 sm:h-36 sm:w-64" aria-hidden />
      <Cloud variant="c" className="pointer-events-none absolute -end-14 top-24 h-24 w-44 text-cloud opacity-60 sm:h-32 sm:w-56" aria-hidden />

      <div className="relative mx-auto max-w-2xl">
        <LogoFull size={220} className="mx-auto mb-6 sm:size-[260px]" priority />

        <h1 className="font-display text-3xl font-extrabold leading-tight text-plum sm:text-5xl">ألعاب تصنع أجمل الذكريات</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-plum/70 sm:text-base">
          تسوّقي أجمل الألعاب والهدايا لأطفالك، بلمسة حالمة وناعمة — واطلبي مباشرة عبر إنستغرام.
        </p>
      </div>

      <div className="relative mt-10 flex flex-col items-center gap-1 text-plum/50">
        <span className="text-xs">مرري للأسفل</span>
        <span aria-hidden className="text-lg leading-none">
          ⌄
        </span>
      </div>
    </section>
  );
}
