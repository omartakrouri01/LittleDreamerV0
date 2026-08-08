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
 * Copies synchronously, and returns whether it worked.
 *
 * This has to finish inside the click handler. navigator.clipboard.writeText()
 * returns a Promise, and the anchor navigates the moment the handler returns —
 * iOS then backgrounds the page and hands over to the Instagram app, abandoning
 * the pending write, so the customer arrives in the DM with nothing to paste.
 * document.execCommand("copy") is synchronous and completes before navigation.
 *
 * The selection dance is the long-standing iOS recipe: Safari will not copy from
 * a readOnly field, needs an explicit Range as well as setSelectionRange, and
 * zooms the page if the font is under 16px.
 */
function copySynchronously(text: string): boolean {
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", ""); // stops iOS opening the keyboard
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.opacity = "0";
    el.style.fontSize = "16px"; // stops iOS zooming the page toward the field
    document.body.appendChild(el);

    el.select(); // the part that actually establishes the copy selection
    el.setSelectionRange(0, text.length); // iOS additionally wants an explicit range

    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    if (ok) return true;
  } catch {
    // fall through to the async API below
  }
  // Backstop for anything that has dropped execCommand. Fire-and-forget: if the
  // navigation cuts it short there is nothing further we can do here, and the
  // caller has already been told the synchronous attempt failed.
  try {
    void navigator.clipboard?.writeText(text);
  } catch {
    /* nothing left to try */
  }
  return false;
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
    // Synchronous, so it is done before the browser follows the link. It also
    // reports success immediately: the old async .catch() often never ran,
    // because navigation tore the page down first — which meant a failed copy
    // looked exactly like a successful one and the fallback never appeared.
    if (!copySynchronously(message)) setCopyFailed(true);
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
