import { LogoFull } from "./brand/LogoFull";
import { ParallaxCloudField } from "./deco/ParallaxCloudField";
import { WordReveal } from "./reveal/WordReveal";
import { Reveal } from "./reveal/Reveal";
import { ScrollCue } from "./ScrollCue";

export function Hero({ gridId }: { gridId: string }) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-6 text-center sm:pb-14 sm:pt-10">
      <ParallaxCloudField />

      <div className="relative mx-auto max-w-2xl">
        <Reveal>
          <LogoFull width={225} className="mx-auto mb-5 w-[190px] sm:w-[225px]" priority />
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

      <ScrollCue targetId={gridId} />
    </section>
  );
}
