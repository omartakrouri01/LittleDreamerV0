"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "./brand/LogoMark";
import { InstagramIcon } from "./icons/InstagramIcon";
import { INSTAGRAM_URL } from "@/lib/config";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled ? "bg-blush/85 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* min-h-11: the mark is landscape (44x36), so the link needs its own
            height to stay a 44px tap target. */}
        <a href="#" aria-label="الصفحة الرئيسية" className="inline-flex min-h-11 items-center">
          <LogoMark width={44} className="w-11" priority />
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="إنستغرام"
          className="grid h-11 w-11 place-items-center rounded-full text-berry transition-colors hover:bg-cloud/60"
        >
          <InstagramIcon className="h-6 w-6" />
        </a>
      </div>
    </header>
  );
}
