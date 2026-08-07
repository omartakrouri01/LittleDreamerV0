import type { Toy } from "./sheets";
import { AGE_BUCKETS, ageOverlapsBucket } from "./age";
import { matchesSearch } from "./search";

export type SortOption = "" | "price-asc" | "price-desc";

export interface ToyFilters {
  age: string;
  cat: string;
  sex: string;
  sort: SortOption;
  q: string;
}

export const EMPTY_FILTERS: ToyFilters = { age: "", cat: "", sex: "", sort: "", q: "" };

export function filterAndSortToys(toys: Toy[], filters: ToyFilters): Toy[] {
  const bucket = AGE_BUCKETS.find((b) => b.id === filters.age);

  const filtered = toys.filter((toy) => {
    if (bucket && !ageOverlapsBucket(toy, bucket)) return false;
    if (filters.cat && toy.category.trim() !== filters.cat) return false;
    if (filters.sex && toy.sex.trim().toLowerCase() !== filters.sex.trim().toLowerCase()) return false;
    if (filters.q && !matchesSearch(filters.q, [toy.name, toy.category])) return false;
    return true;
  });

  if (filters.sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
  return filtered;
}
