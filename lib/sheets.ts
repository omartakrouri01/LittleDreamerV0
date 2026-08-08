import "server-only";

/** A single product parsed from the `toys` sheet tab. */
export interface Toy {
  id: string;
  name: string;
  category: string;
  ageMin: number;
  ageMax: number;
  sex: string;
  place: string;
  price: number;
  description: string;
  image: string;
  /** Extra images beyond the primary `image`, parsed from the `images` column. */
  images: string[];
}

const SHEET_TAB = "toys";
const SHEET_RANGE = `${SHEET_TAB}!A2:L1000`;
// Column order is fixed by the sheet contract:
// id, name, category, age_min, age_max, sex, place, price, description, image, images, active
const COL = {
  id: 0,
  name: 1,
  category: 2,
  ageMin: 3,
  ageMax: 4,
  sex: 5,
  place: 6,
  price: 7,
  description: 8,
  image: 9,
  images: 10,
  active: 11,
} as const;

/** Thrown when the sheet can't be read. `message` is safe to show the owner in Arabic UI; `reason` is the diagnosable detail, always logged server-side. */
export class SheetFetchError extends Error {
  constructor(
    public readonly userMessage: string,
    reason: string,
  ) {
    super(reason);
    this.name = "SheetFetchError";
  }
}

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Normalises Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) to Latin (0123456789) so numeric parsing works regardless of the owner's keyboard. */
export function normalizeArabicIndicDigits(input: string): string {
  return input.replace(/[٠-٩]/g, (ch) => String(ARABIC_INDIC_DIGITS.indexOf(ch)));
}

/** Case- and whitespace-insensitive comparison key for enum-ish cells (active, sex, place). */
function enumKey(cell: string): string {
  return cell.trim().toLowerCase();
}

function parseNumberCell(cell: string): number | null {
  const normalized = normalizeArabicIndicDigits(cell.trim());
  if (normalized === "") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Parses one raw sheet row into a Toy, or returns null with a server-side
 * console.warn explaining why the row was skipped so the owner's data-entry
 * mistakes are diagnosable.
 */
export function parseRow(row: string[], sheetRowNumber: number): Toy | null {
  const get = (i: number) => (row[i] ?? "").trim();
  const skip = (reason: string) => {
    console.warn(`[sheets] row ${sheetRowNumber} skipped: ${reason}`);
    return null;
  };

  const id = get(COL.id);
  const name = get(COL.name);
  const image = get(COL.image);
  const activeRaw = get(COL.active);
  const priceRaw = get(COL.price);

  if (!id) return skip("missing id");
  if (!name) return skip("missing name");
  if (!image) return skip("missing image");
  if (enumKey(activeRaw) !== "true") return skip(`active is "${activeRaw}", expected TRUE`);

  const price = parseNumberCell(priceRaw);
  if (price === null) return skip(`price "${priceRaw}" did not parse as a number`);

  const ageMinRaw = get(COL.ageMin);
  const ageMaxRaw = get(COL.ageMax);
  let ageMin = parseNumberCell(ageMinRaw);
  let ageMax = parseNumberCell(ageMaxRaw);
  if (ageMin === null) {
    console.warn(`[sheets] row ${sheetRowNumber}: age_min "${ageMinRaw}" did not parse, defaulting to 0`);
    ageMin = 0;
  }
  if (ageMax === null) {
    console.warn(`[sheets] row ${sheetRowNumber}: age_max "${ageMaxRaw}" did not parse, defaulting to 99`);
    ageMax = 99;
  }

  const images = get(COL.images)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id,
    name,
    category: get(COL.category),
    ageMin,
    ageMax,
    sex: get(COL.sex),
    place: get(COL.place),
    price,
    description: get(COL.description),
    image,
    images,
  };
}

/**
 * Fetches and parses the live product list from Google Sheets.
 * Server-only. Revalidated every 60s via Next's fetch cache.
 */
export async function getToys(): Promise<Toy[]> {
  const sheetId = process.env.SHEET_ID;
  const apiKey = process.env.SHEETS_API_KEY;

  if (!sheetId || !apiKey) {
    throw new SheetFetchError(
      "تعذّر تحميل المنتجات حالياً، يرجى المحاولة لاحقاً.",
      "Missing SHEET_ID or SHEETS_API_KEY environment variable(s).",
    );
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(SHEET_RANGE)}?key=${apiKey}`;

  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: 60 } });
  } catch (err) {
    throw new SheetFetchError(
      "تعذّر الاتصال بمصدر البيانات، يرجى المحاولة لاحقاً.",
      `Network error fetching Google Sheet: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new SheetFetchError(
      "تعذّر تحميل المنتجات حالياً، يرجى المحاولة لاحقاً.",
      `Google Sheets API responded ${res.status} ${res.statusText}: ${body.slice(0, 500)}`,
    );
  }

  const data = (await res.json()) as { values?: string[][] };
  const rows = data.values ?? [];

  const toys: Toy[] = [];
  rows.forEach((row, i) => {
    // Data starts at sheet row 2 (row 1 is the header, excluded by the range).
    const toy = parseRow(row, i + 2);
    if (toy) toys.push(toy);
  });

  return toys;
}
