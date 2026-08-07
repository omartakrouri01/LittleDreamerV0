"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CURRENCY, ENABLE_WHATSAPP, INSTAGRAM_DM, WHATSAPP_PHONE } from "@/lib/config";
import type { Toy } from "@/lib/sheets";

interface OrderButtonsProps {
  toy: Toy;
  className?: string;
}

type OverlayState = null | "copied" | "manual";

function orderMessage(toy: Toy): string {
  const price = toy.price % 1 === 0 ? toy.price : toy.price.toFixed(2);
  return `مرحباً! أرغب بطلب: ${toy.name} — ${price}${CURRENCY}`;
}

/**
 * PRIMARY (Instagram): copy the order message, show a prominent overlay
 * with paste instructions, then open the shop's Instagram DM.
 * SECONDARY (WhatsApp): only rendered when ENABLE_WHATSAPP is true — one
 * tap, no clipboard step, WhatsApp pre-fills the text itself.
 */
export function OrderButtons({ toy, className }: OrderButtonsProps) {
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const message = orderMessage(toy);

  const copyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setOverlay("copied");
      window.setTimeout(() => {
        window.open(INSTAGRAM_DM, "_blank", "noopener,noreferrer");
      }, 1500);
    } catch {
      setOverlay("manual");
    }
  };

  const recopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setOverlay("copied");
    } catch {
      setOverlay("manual");
    }
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={copyAndOpen}
        className="w-full rounded-full bg-berry px-4 py-2.5 text-sm font-bold text-white transition-transform duration-150 active:scale-[0.97]"
      >
        اطلب عبر إنستغرام
      </button>

      {ENABLE_WHATSAPP && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block w-full rounded-full bg-[#25D366] px-4 py-2.5 text-center text-sm font-bold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          اطلب عبر واتساب
        </a>
      )}

      {overlay &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-plum/60 p-4"
            onClick={() => setOverlay(null)}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-3xl bg-cloud p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
              {overlay === "copied" ? (
                <>
                  <h3 className="font-display text-xl font-extrabold text-plum">تم نسخ الرسالة ✓</h3>
                  <div className="mt-3 rounded-xl border border-petal bg-blush p-3 text-sm text-plum">{message}</div>
                  <ol className="mt-4 space-y-1.5 text-start text-sm text-plum/80">
                    <li>١. سيتم فتح إنستغرام</li>
                    <li>٢. اضغط مطولاً في حقل الكتابة واختر &quot;لصق&quot;</li>
                    <li>٣. أرسل الرسالة</li>
                  </ol>
                  <button type="button" onClick={recopy} className="mt-4 w-full rounded-full bg-berry px-4 py-2.5 text-sm font-semibold text-white">
                    نسخ مرة أخرى
                  </button>
                  <button type="button" onClick={() => setOverlay(null)} className="mt-2 w-full py-1 text-sm font-medium text-plum/60">
                    إغلاق
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-display text-xl font-extrabold text-plum">تعذّر النسخ التلقائي</h3>
                  <p className="mt-2 text-sm text-plum/80">يرجى نسخ الرسالة التالية يدوياً ثم فتح إنستغرام ولصقها:</p>
                  <textarea
                    readOnly
                    value={message}
                    rows={3}
                    onFocus={(e) => e.currentTarget.select()}
                    className="mt-3 w-full rounded-xl border border-petal bg-blush p-3 text-sm text-plum"
                  />
                  <button
                    type="button"
                    onClick={() => window.open(INSTAGRAM_DM, "_blank", "noopener,noreferrer")}
                    className="mt-4 w-full rounded-full bg-berry px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    فتح إنستغرام
                  </button>
                  <button type="button" onClick={() => setOverlay(null)} className="mt-2 w-full py-1 text-sm font-medium text-plum/60">
                    إغلاق
                  </button>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
