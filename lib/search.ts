/**
 * Normalises Arabic text for fuzzy, typing-tolerant search matching:
 * strips diacritics (harakat) and tatweel, folds alef/hamza variants
 * (أ إ آ -> ا), ة -> ه, ى -> ي, and
 * case-folds. Two strings that a person would consider "the same word"
 * normalize to the same value.
 */
export function normalizeArabicText(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[ً-ٰٟۖ-ۭ]/g, "") // harakat / Quranic annotation marks
    .replace(/ـ/g, "") // tatweel
    .replace(/[أإآ]/g, "ا") // أ إ آ -> ا (alef/hamza variants -> bare alef)
    .replace(/ة/g, "ه") // ة -> ه (ta marbuta -> ha)
    .replace(/ى/g, "ي") // ى -> ي (alef maksura -> ya)
    .toLowerCase()
    .trim();
}

/** True if `query` (normalized) is a substring of any of `fields` (each normalized). An empty query always matches. */
export function matchesSearch(query: string, fields: string[]): boolean {
  const q = normalizeArabicText(query);
  if (!q) return true;
  return fields.some((field) => normalizeArabicText(field).includes(q));
}
