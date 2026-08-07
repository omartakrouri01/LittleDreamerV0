import type { Metadata } from "next";
import { Baloo_Bhaijaan_2, IBM_Plex_Sans_Arabic } from "next/font/google";
import { SHOP_NAME_EN, SHOP_TAGLINE } from "@/lib/config";
import "./globals.css";

const baloo = Baloo_Bhaijaan_2({
  variable: "--font-baloo",
  subsets: ["arabic"],
  weight: ["700", "800"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SHOP_NAME_EN} • ${SHOP_TAGLINE}`,
  description: "أجمل الألعاب والهدايا للأطفال، بألوان حالمة وهادئة. تسوّقي الآن واطلبي عبر إنستغرام.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${baloo.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-blush">{children}</body>
    </html>
  );
}
