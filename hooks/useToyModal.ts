"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Manages the `?toy=` query param that opens the product modal, with
 * proper back-button behaviour: opening pushes a history entry (so the
 * hardware/browser back button closes the modal instead of leaving the
 * page); the explicit in-app close reuses that same entry via
 * router.back() when we're the ones who pushed it, and falls back to a
 * plain replace for the "arrived with ?toy= already in the URL" case
 * (a shared product link), where there's no entry of ours to pop.
 */
export function useToyModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openToyId = searchParams.get("toy");
  const pushedByUsRef = useRef(false);

  useEffect(() => {
    if (!openToyId) pushedByUsRef.current = false;
  }, [openToyId]);

  const open = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("toy", id);
      pushedByUsRef.current = true;
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const close = useCallback(() => {
    if (pushedByUsRef.current) {
      router.back();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("toy");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
    pushedByUsRef.current = false;
  }, [router, pathname, searchParams]);

  return { openToyId, open, close };
}
