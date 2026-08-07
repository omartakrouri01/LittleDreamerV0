import { LogoFull } from "./brand/LogoFull";
import { ParallaxCloudField } from "./deco/ParallaxCloudField";
import { WordReveal } from "./reveal/WordReveal";
import { Reveal } from "./reveal/Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 text-center sm:pb-24 sm:pt-16">
      <ParallaxCloudField />

      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <LogoFull size={220} className="mx-auto mb-6 sm:size-[260px]" priority />
        </Reveal>

        <WordReveal
          as="h1"
          text="ألعاب تصنع أجمل الذكريات"
          className="font-display text-3xl font-extrabold leading-tight text-plum sm:text-5xl"
        />
        <Reveal delayMs={200}>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-plum/70 sm:text-base">
            تسوّقي أجمل الألعاب والهدايا لأطفالك، بلمسة حالمة وناعمة — واطلبي مباشرة عبر إنستغرام.
          </p>
        </Reveal>
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
