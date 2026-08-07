"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Toy } from "@/lib/sheets";
import { cldUrl } from "@/lib/cloudinary";
import { formatAgeRange } from "@/lib/age";
import { categoryColor } from "@/lib/categories";
import { PriceBadge } from "./PriceBadge";
import { OrderButtons } from "./OrderButtons";

interface ProductModalProps {
  toy: Toy;
  onClose: () => void;
  /** Element to restore focus to when the modal closes (the card that opened it). */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ProductModal({ toy, onClose, returnFocusRef }: ProductModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const images = [toy.image, ...toy.images];
  const [activeImage, setActiveImage] = useState(0);
  const [shareLabel, setShareLabel] = useState("مشاركة");

  // Body scroll lock while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus the close button on open, restore focus to the triggering card on close.
  useEffect(() => {
    closeButtonRef.current?.focus();
    const elementToRestore = returnFocusRef?.current;
    return () => {
      elementToRestore?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape to close + a simple focus trap.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?toy=${encodeURIComponent(toy.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: toy.name, text: toy.name, url });
      } catch {
        // user cancelled the share sheet — no-op
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("تم نسخ الرابط ✓");
      window.setTimeout(() => setShareLabel("مشاركة"), 2000);
    } catch {
      setShareLabel("تعذّر النسخ");
      window.setTimeout(() => setShareLabel("مشاركة"), 2000);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-plum/60 p-0 sm:items-center sm:p-4" onClick={onClose} role="presentation">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={toy.name}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-cloud shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-petal/40 p-4">
          <button type="button" onClick={handleShare} className="rounded-full px-3 py-1.5 text-sm font-semibold text-berry hover:bg-blush">
            {shareLabel}
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="grid h-9 w-9 place-items-center rounded-full text-plum hover:bg-blush"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-blush">
              <Image src={cldUrl(images[activeImage], 1000)} alt={toy.name} fill sizes="(max-width: 640px) 90vw, 45vw" className="object-contain p-4" />
              <PriceBadge price={toy.price} className="absolute top-3 start-3 z-10" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`صورة ${i + 1}`}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-blush ${
                      i === activeImage ? "border-berry" : "border-transparent"
                    }`}
                  >
                    <Image src={cldUrl(img, 600)} alt="" fill sizes="64px" className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="font-display text-2xl font-extrabold text-plum">{toy.name}</h2>

            <div className="mt-2 flex flex-wrap gap-2">
              {toy.category && (
                <span className="rounded-full px-2.5 py-1 text-xs font-medium text-plum" style={{ backgroundColor: categoryColor(toy.category) }}>
                  {toy.category}
                </span>
              )}
              <span className="rounded-full bg-blush px-2.5 py-1 text-xs font-medium text-plum">{formatAgeRange(toy.ageMin, toy.ageMax)}</span>
              {toy.sex && <span className="rounded-full bg-blush px-2.5 py-1 text-xs font-medium text-plum">{toy.sex}</span>}
            </div>

            {toy.description && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-plum/80">{toy.description}</p>}

            <div className="mt-auto pt-5">
              <OrderButtons toy={toy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
