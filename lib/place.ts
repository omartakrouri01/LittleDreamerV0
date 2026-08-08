import type { Toy } from "./sheets";

export interface PlaceInfo {
  /** The exact `place` value (as seen in the data) treated as "outdoor", or null when the outdoor shelf should be hidden entirely. */
  outdoorValue: string | null;
  /** All distinct `place` values present in the data, in first-seen order. */
  distinctValues: string[];
}

/**
 * Derives which `place` value means "outdoor": whichever distinct value
 * contains 'خارج' wins. With fewer than two distinct values there is nothing
 * to shelve separately, so the caller hides the outdoor shelf entirely
 * (outdoorValue === null).
 *
 * It deliberately does NOT guess when nothing matches. An earlier version fell
 * back to "the second distinct value seen", which meant that renaming the
 * place column to wording without 'خارج' would quietly promote whichever value
 * happened to be second — very possibly the indoor one — into a shelf headed
 * "ألعاب خارجية". A shelf that silently lists the wrong toys is worse than no
 * shelf, so an unrecognised set now hides it instead.
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
  return { outdoorValue: outdoorMatch ?? null, distinctValues };
}

export function isOutdoorToy(toy: Pick<Toy, "place">, outdoorValue: string | null): boolean {
  if (!outdoorValue) return false;
  return toy.place.trim().toLowerCase() === outdoorValue.trim().toLowerCase();
}
