"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CURRENCY, ENABLE_WHATSAPP, INSTAGRAM_DM, WHATSAPP_PHONE } from "@/lib/config";
import type { Toy } from "@/lib/sheets";

interface OrderButtonsProps {
  toy: Toy;
  className?: string;
}

/**
 * The message the customer pastes into the DM. The direct link to the product is
 * appended so the shop can tell exactly which toy is meant — names repeat and
 * chat crops photos, the `?toy=` link never does.
 *
 * Kept pure and given the URL, rather than reading window.location itself: this
 * runs during render, and a value that differs between server and client would
 * be a hydration mismatch the moment it reaches the DOM.
 */
function orderMessage(toy: Toy, productUrl: string): string {
  const price = toy.price % 1 === 0 ? toy.price : toy.price.toFixed(2);
  const line = `مرحباً! أرغب بطلب: ${toy.name} — ${price}${CURRENCY}`;
  return productUrl ? `${line}\n${productUrl}` : line;
}

/**
 * PRIMARY (Instagram): a real link straight to the shop's DM, with the order
 * message copied to the clipboard on the way out.
 *
 * It must stay an <a> that the browser navigates itself. The previous version
 * copied, showed an overlay, then called window.open() from a 1.5s setTimeout —
 * by which point the tap's user-activation had expired, so mobile browsers
 * blocked it as a pop-up and the customer never reached Instagram. Anchor
 * navigation is never pop-up blocked, and firing the clipboard write inside the
 * click handler keeps it within the gesture that permits it.
 *
 * SECONDARY (WhatsApp): only rendered when ENABLE_WHATSAPP is true — WhatsApp
 * pre-fills the text itself, so there's no clipboard step at all.
 */
export function OrderButtons({ toy, className }: OrderButtonsProps) {
  const [copyFailed, setCopyFailed] = useState(false);
  // Resolved after mount so server and first client render agree; the clipboard
  // write only ever happens on a tap, long after this has filled in.
  const [productUrl, setProductUrl] = useState("");
  useEffect(() => {
    setProductUrl(`${window.location.origin}${window.location.pathname}?toy=${encodeURIComponent(toy.id)}`);
  }, [toy.id]);

  const message = orderMessage(toy, productUrl);

  function copyOnTheWayOut() {
    // Fire-and-forget: never await, never block the navigation. If the browser
    // refuses (insecure context, permission denied), flag it — the fallback
    // below is then waiting when the customer comes back to this tab.
    try {
      navigator.clipboard.writeText(message).catch(() => setCopyFailed(true));
    } catch {
      setCopyFailed(true);
    }
  }

  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

  return (
    <div className={className}>
      <a
        href={INSTAGRAM_DM}
        target="_blank"
        rel="noopener noreferrer"
        onClick={copyOnTheWayOut}
        className="flex min-h-11 w-full items-center justify-center rounded-full bg-berry px-4 py-2.5 text-center text-sm font-bold text-white transition-transform duration-150 active:scale-[0.97]"
      >
        اطلب عبر إنستغرام
      </a>

      {ENABLE_WHATSAPP && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex min-h-11 w-full items-center justify-center rounded-full bg-[#25D366] px-4 py-2.5 text-center text-sm font-bold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          اطلب عبر واتساب
        </a>
      )}

      {/* Only when the automatic copy failed. The customer is in Instagram by
          now, so this is waiting for them on their return rather than
          interrupting the trip out. */}
      {copyFailed &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-plum/60 p-4"
            onClick={() => setCopyFailed(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-3xl bg-cloud p-6 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-display text-xl font-extrabold text-plum">تعذّر النسخ التلقائي</h3>
              <p className="mt-2 text-sm text-plum/80">انسخي الرسالة التالية والصقيها في المحادثة:</p>
              <textarea
                readOnly
                value={message}
                rows={3}
                onFocus={(e) => e.currentTarget.select()}
                className="mt-3 w-full rounded-xl border border-petal bg-blush p-3 text-sm text-plum"
              />
              <button type="button" onClick={() => setCopyFailed(false)} className="mt-4 min-h-11 w-full rounded-full bg-berry px-4 py-2.5 text-sm font-semibold text-white">
                إغلاق
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
