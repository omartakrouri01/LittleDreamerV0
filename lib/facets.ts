import type { Toy } from "./sheets";

/** Distinct, trimmed values for a free-text-ish column (e.g. `sex`), in first-seen order — nothing hardcoded, the owner can add/rename freely. */
export function deriveDistinctValues(toys: Toy[], pick: (toy: Toy) => string): string[] {
  const seen = new Map<string, string>();
  for (const toy of toys) {
    const trimmed = pick(toy).trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) seen.set(key, trimmed);
  }
  return [...seen.values()];
}
