import type { Toy } from "./sheets";

/** Formats a toy's own age range for display, per the shop's exact display rules. */
export function formatAgeRange(ageMin: number, ageMax: number): string {
  if (ageMax >= 99) return `+${ageMin} سنة`;
  if (ageMin === ageMax) return `${ageMin} سنوات`;
  return `${ageMin}-${ageMax} سنوات`;
}

export interface AgeBucket {
  id: string;
  label: string;
  min: number;
  max: number;
}

/** Fixed age filter buckets shown as chips. Last bucket is labeled "+12". */
export const AGE_BUCKETS: AgeBucket[] = [
  { id: "0-3", label: "0-3", min: 0, max: 3 },
  { id: "3-6", label: "3-6", min: 3, max: 6 },
  { id: "6-9", label: "6-9", min: 6, max: 9 },
  { id: "9-12", label: "9-12", min: 9, max: 12 },
  { id: "12+", label: "+12", min: 12, max: 99 },
];

/**
 * A toy matches a bucket when its [ageMin, ageMax] range OVERLAPS the
 * bucket's range — not when the bucket contains the toy. A 4-10 toy
 * therefore appears under 3-6, 6-9 and 9-12.
 */
export function ageOverlapsBucket(toy: Pick<Toy, "ageMin" | "ageMax">, bucket: AgeBucket): boolean {
  return toy.ageMin <= bucket.max && toy.ageMax >= bucket.min;
}
