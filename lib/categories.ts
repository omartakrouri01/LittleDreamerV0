import type { Toy } from "./sheets";

// Curated pastel hues, deliberately distinct from --berry (reserved for
// primary/active UI states). A category is hashed into one of these so a
// brand-new category the owner types gets a stable colour with zero code
// changes, and re-renders never reshuffle existing colours.
const CATEGORY_PALETTE = [
  "#F5A9C4", // petal pink
  "#A8D8F0", // sky blue
  "#FFD98E", // soft gold
  "#B9E4C9", // mint
  "#D9C6F0", // lavender
  "#FFC2A6", // peach
  "#C9D6F0", // periwinkle
  "#F0C6DC", // rose
] as const;

/** djb2 string hash, deterministic across runs/platforms. */
function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

/** Deterministic pastel colour for a category name, stable regardless of insertion order. */
export function categoryColor(name: string): string {
  const idx = djb2(name.trim().toLowerCase()) % CATEGORY_PALETTE.length;
  return CATEGORY_PALETTE[idx];
}

export interface CategoryInfo {
  name: string;
  count: number;
  color: string;
}

/** Categories present in the data, sorted by product count descending. */
export function deriveCategories(toys: Toy[]): CategoryInfo[] {
  const counts = new Map<string, number>();
  for (const toy of toys) {
    const name = toy.category.trim();
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, color: categoryColor(name) }))
    .sort((a, b) => b.count - a.count);
}
