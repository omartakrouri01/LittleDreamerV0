import type { Metadata } from "next";
import { Baloo_Bhaijaan_2, IBM_Plex_Sans_Arabic } from "next/font/google";
import { SHOP_NAME_EN, SHOP_TAGLINE } from "@/lib/config";
import { Preloader } from "@/components/Preloader";
import { DreamyBackdrop } from "@/components/deco/DreamyBackdrop";
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

// Vercel sets VERCEL_URL automatically at build/runtime; falls back to
// localhost for local dev. Needed so the file-based default OG image
// resolves to an absolute URL for social previews.
const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
      <head>
        {/* Reveal-on-scroll elements start at opacity-0 and are un-hidden by an
            IntersectionObserver. Without JS that observer never runs, so the page
            would render blank below the hero — force them visible instead. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full bg-blush">
        <Preloader />
        <DreamyBackdrop />
        {/* Content rides above the fixed backdrop; the backdrop is z-0. */}
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
