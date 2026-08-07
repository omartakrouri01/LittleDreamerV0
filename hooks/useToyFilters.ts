"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EMPTY_FILTERS, type ToyFilters } from "@/lib/filterToys";

/**
 * Filter/sort/search state lives entirely in the URL query string
 * (?age=&cat=&sex=&sort=&q=) so the shop's links stay shareable on
 * Instagram. Reads via useSearchParams, writes via router.replace with
 * scroll:false (no history entry per filter tweak, no jump).
 */
export function useToyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: ToyFilters = useMemo(
    () => ({
      age: searchParams.get("age") ?? "",
      cat: searchParams.get("cat") ?? "",
      sex: searchParams.get("sex") ?? "",
      sort: (searchParams.get("sort") as ToyFilters["sort"]) ?? "",
      q: searchParams.get("q") ?? "",
    }),
    [searchParams],
  );

  const applyPatch = useCallback(
    (patch: Partial<ToyFilters>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const clearAll = useCallback(() => {
    // Preserve ?toy= (an open modal) across a filter clear.
    const toy = searchParams.get("toy");
    const qs = toy ? `?toy=${encodeURIComponent(toy)}` : "";
    router.replace(`${pathname}${qs}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const hasActiveFilters = Boolean(filters.age || filters.cat || filters.sex || filters.sort || filters.q);

  return { filters, applyPatch, clearAll, hasActiveFilters, EMPTY_FILTERS };
}
