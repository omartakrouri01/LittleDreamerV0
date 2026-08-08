"use client";

import { useMemo, useRef } from "react";
import type { Toy } from "@/lib/sheets";
import type { CategoryInfo } from "@/lib/categories";
import { filterAndSortToys } from "@/lib/filterToys";
import { useToyFilters } from "@/hooks/useToyFilters";
import { useToyModal } from "@/hooks/useToyModal";
import { AgeChips } from "./AgeChips";
import { CategoryChips } from "./CategoryChips";
import { OutdoorShelf } from "./OutdoorShelf";
import { FilterBar } from "./FilterBar";
import { ToyCard } from "./ToyCard";
import { EmptyState } from "./EmptyState";
import { ProductModal } from "./ProductModal";

const GRID_ID = "product-grid";

interface ShopExperienceProps {
  toys: Toy[];
  outdoorToys: Toy[];
  categories: CategoryInfo[];
  sexValues: string[];
}

export function ShopExperience({ toys, outdoorToys, categories, sexValues }: ShopExperienceProps) {
  const { filters, applyPatch, clearAll, hasActiveFilters } = useToyFilters();
  const { openToyId, open, close } = useToyModal();
  const triggerRef = useRef<HTMLElement | null>(null);

  const filteredToys = useMemo(() => filterAndSortToys(toys, filters), [toys, filters]);
  const selectedToy = openToyId ? toys.find((t) => t.id === openToyId) : undefined;

  function handleOpen(toy: Toy) {
    triggerRef.current = document.activeElement as HTMLElement;
    open(toy.id);
  }

  return (
    <>
      <AgeChips active={filters.age} onSelect={(age) => applyPatch({ age })} gridId={GRID_ID} />
      <CategoryChips categories={categories} active={filters.cat} onSelect={(cat) => applyPatch({ cat })} gridId={GRID_ID} />
      <OutdoorShelf toys={outdoorToys} onOpen={handleOpen} />

      <FilterBar
        filters={filters}
        applyPatch={applyPatch}
        clearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredToys.length}
        categories={categories}
        sexValues={sexValues}
      />

      <section id={GRID_ID} className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {filteredToys.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredToys.map((toy, i) => (
              <ToyCard key={toy.id} toy={toy} onOpen={() => handleOpen(toy)} priority={i < 4} index={i % 4} />
            ))}
          </div>
        )}
      </section>

      {selectedToy && <ProductModal toy={selectedToy} onClose={close} returnFocusRef={triggerRef} />}
    </>
  );
}
