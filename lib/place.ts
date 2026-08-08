import type { Toy } from "./sheets";

export interface PlaceInfo {
  /** The exact `place` value (as seen in the data) treated as "outdoor", or null when the outdoor shelf should be hidden entirely. */
  outdoorValue: string | null;
  /** All distinct `place` values present in the data, in first-seen order. */
  distinctValues: string[];
}

/**
 * Derives which `place` value means "outdoor" without ever matching the
 * literal string 'خارجي': whichever distinct value matches /خارج/ wins,
 * falling back to the second distinct value found. With fewer than two
 * distinct values there's nothing to shelve separately, so the caller
 * should hide the outdoor shelf section (outdoorValue === null).
 */
export function derivePlaces(toys: Pick<Toy, "place">[]): PlaceInfo {
  const seen = new Map<string, string>(); // normalized key -> display value (first-seen casing/spacing)
  for (const toy of toys) {
    const trimmed = toy.place.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) seen.set(key, trimmed);
  }
  const distinctValues = [...seen.values()];

  if (distinctValues.length < 2) {
    return { outdoorValue: null, distinctValues };
  }

  const outdoorMatch = distinctValues.find((v) => /خارج/.test(v));
  return { outdoorValue: outdoorMatch ?? distinctValues[1], distinctValues };
}

export function isOutdoorToy(toy: Pick<Toy, "place">, outdoorValue: string | null): boolean {
  if (!outdoorValue) return false;
  return toy.place.trim().toLowerCase() === outdoorValue.trim().toLowerCase();
}
