import type { Metadata } from "next";
import { getToys, SheetFetchError } from "@/lib/sheets";
import { deriveCategories } from "@/lib/categories";
import { derivePlaces, isOutdoorToy } from "@/lib/place";
import { deriveDistinctValues } from "@/lib/facets";
import { cldUrl } from "@/lib/cloudinary";
import { CURRENCY, SHOP_NAME_EN, SHOP_TAGLINE } from "@/lib/config";
import { PRODUCT_GRID_ID } from "@/lib/constants";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ShopExperience } from "@/components/ShopExperience";
import { Footer } from "@/components/Footer";
import { ErrorState } from "@/components/ErrorState";

export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const params = await searchParams;
  const toyId = typeof params.toy === "string" ? params.toy : undefined;

  const defaultMeta: Metadata = {
    title: `${SHOP_NAME_EN} • ${SHOP_TAGLINE}`,
    description: "أجمل الألعاب والهدايا للأطفال، بألوان حالمة وهادئة. تسوّقي الآن واطلبي عبر إنستغرام.",
  };
  if (!toyId) return defaultMeta;

  try {
    const toys = await getToys();
    const toy = toys.find((t) => t.id === toyId);
    if (!toy) return defaultMeta;

    const price = toy.price % 1 === 0 ? toy.price : toy.price.toFixed(2);
    const title = `${toy.name} — ${price}${CURRENCY} | ${SHOP_NAME_EN}`;
    const description = toy.description || `${toy.name} من ${SHOP_NAME_EN} • ${SHOP_TAGLINE}`;
    const image = cldUrl(toy.image, 1000);

    return {
      title,
      description,
      openGraph: { title, description, images: [image] },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    };
  } catch {
    return defaultMeta;
  }
}

export default async function Page() {
  try {
    const toys = await getToys();
    const categories = deriveCategories(toys);
    const placeInfo = derivePlaces(toys);
    const sexValues = deriveDistinctValues(toys, (t) => t.sex);
    const outdoorToys = toys.filter((t) => isOutdoorToy(t, placeInfo.outdoorValue));

    return (
      <>
        <Header />
        <main>
          <Hero gridId={PRODUCT_GRID_ID} />
          <ShopExperience toys={toys} outdoorToys={outdoorToys} categories={categories} sexValues={sexValues} />
        </main>
        <Footer />
      </>
    );
  } catch (err) {
    const message = err instanceof SheetFetchError ? err.userMessage : "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.";
    if (err instanceof SheetFetchError) console.error(`[page] ${err.message}`);
    else console.error("[page] unexpected error loading toys:", err);

    return (
      <>
        <Header />
        <ErrorState message={message} />
        <Footer />
      </>
    );
  }
}
