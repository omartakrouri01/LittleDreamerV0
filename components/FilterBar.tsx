"use client";

import { useEffect, useRef, useState } from "react";
import { AGE_BUCKETS } from "@/lib/age";
import type { CategoryInfo } from "@/lib/categories";
import type { ToyFilters } from "@/lib/filterToys";

interface FilterBarProps {
  filters: ToyFilters;
  applyPatch: (patch: Partial<ToyFilters>) => void;
  clearAll: () => void;
  hasActiveFilters: boolean;
  resultCount: number;
  categories: CategoryInfo[];
  sexValues: string[];
}

export function FilterBar({ filters, applyPatch, clearAll, hasActiveFilters, resultCount, categories, sexValues }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [condensed, setCondensed] = useState(false);

  // Keep the input in sync if the URL changes from elsewhere (e.g. "مسح الفلاتر").
  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  // Condenses once the bar has actually stuck to the top of the viewport.
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setCondensed(window.scrollY > 120);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyPatch({ q: value }), 200);
  }

  const selectClass =
    "min-h-11 rounded-full border border-petal/50 bg-cloud px-3 py-2 text-center text-sm text-plum focus-visible:outline-berry";

  return (
    // top-16 == the header's real 64px height; the previous top-[60px] left the
    // bar's top 4px tucked under the header once both were stuck.
    <div
      className={`sticky top-16 z-30 border-b border-petal/30 bg-blush/90 backdrop-blur-md transition-[padding,box-shadow] duration-300 ${
        condensed ? "px-4 py-1.5 shadow-md sm:px-6" : "px-4 py-3 sm:px-6"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[160px] sm:flex-1">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="ابحث عن لعبة..."
            className="min-h-11 w-full rounded-full border border-petal/50 bg-cloud px-4 py-2 text-sm text-plum placeholder:text-plum/40 focus-visible:outline-berry"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              aria-label="مسح البحث"
              className="absolute inset-y-0 start-2 grid place-items-center text-plum/50"
            >
              ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:contents">
          <select value={filters.age} onChange={(e) => applyPatch({ age: e.target.value })} className={selectClass} aria-label="العمر">
            <option value="">كل الأعمار</option>
            {AGE_BUCKETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>

          <select value={filters.cat} onChange={(e) => applyPatch({ cat: e.target.value })} className={selectClass} aria-label="الفئة">
            <option value="">كل الفئات</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:contents">
          <select value={filters.sex} onChange={(e) => applyPatch({ sex: e.target.value })} className={selectClass} aria-label="التصفية حسب الأولاد أو البنات">
            <option value="">كل الأطفال</option>
            {sexValues.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => applyPatch({ sort: e.target.value as ToyFilters["sort"] })}
            className={selectClass}
            aria-label="الترتيب"
          >
            <option value="">الأحدث</option>
            <option value="price-asc">السعر: من الأقل</option>
            <option value="price-desc">السعر: من الأعلى</option>
          </select>
        </div>

        <div className="flex items-center justify-between sm:contents">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-berry hover:bg-cloud/60"
            >
              مسح الفلاتر
            </button>
          ) : (
            <span />
          )}
          <span className="whitespace-nowrap text-sm text-plum/60 sm:ms-auto">{resultCount} لعبة</span>
        </div>
      </div>
    </div>
  );
}
