/**
 * Throwaway Step-1 verification script — NOT part of the shipped app.
 * Run with: npx tsx scripts/verify-sheets.ts
 *
 * 1. Fetches the real, live Google Sheet via getToys() and prints the
 *    parsed Toy[], derived categories, and place derivation.
 * 2. Runs parseRow() against an in-memory fixture covering every skip /
 *    edge case from the spec, so those paths are verified without having
 *    to plant fake rows in the real sheet.
 */
import { readFileSync } from "node:fs";
import { getToys, parseRow } from "../lib/sheets";
import { deriveCategories } from "../lib/categories";
import { derivePlaces } from "../lib/place";
import { AGE_BUCKETS, ageOverlapsBucket, formatAgeRange } from "../lib/age";

// Minimal .env.local loader so this standalone script sees SHEET_ID /
// SHEETS_API_KEY without adding a dotenv dependency (Next itself loads
// .env.local automatically at runtime; this script runs outside Next).
function loadEnvLocal() {
  try {
    const contents = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    console.warn("No .env.local found; relying on already-set environment variables.");
  }
}
loadEnvLocal();

async function verifyLiveSheet() {
  console.log("\n=== 1) Live sheet: getToys() ===");
  const toys = await getToys();
  console.log(`Parsed ${toys.length} active toy(s):`);
  console.dir(toys, { depth: null });

  console.log("\n=== 2) Derived categories (count desc, hashed colors) ===");
  console.dir(deriveCategories(toys), { depth: null });

  console.log("\n=== 3) Derived place info (outdoor shelf) ===");
  console.dir(derivePlaces(toys), { depth: null });

  console.log("\n=== 4) Age display + bucket overlap for each toy ===");
  for (const t of toys) {
    const buckets = AGE_BUCKETS.filter((b) => ageOverlapsBucket(t, b)).map((b) => b.id);
    console.log(`- ${t.name}: ${formatAgeRange(t.ageMin, t.ageMax)} -> buckets [${buckets.join(", ")}]`);
  }
}

function verifyEdgeCaseFixture() {
  console.log("\n=== 5) parseRow() edge-case fixture ===");
  // Columns: id, name, category, age_min, age_max, sex, place, price, description, image, images, active
  const fixtureRows: { label: string; row: string[] }[] = [
    {
      label: "valid row, Arabic-Indic numerals in age/price",
      row: ["A100", "دباديب قطيفة", "دمى", "٢", "٦", "للجميع", "داخلي", "١٥.٩٩", "دبدوب ناعم جداً", "https://res.cloudinary.com/demo/image/upload/x.jpg", "https://res.cloudinary.com/demo/image/upload/y.jpg, https://res.cloudinary.com/demo/image/upload/z.jpg", "TRUE"],
    },
    {
      label: "valid row, age_max >= 99 (and up)",
      row: ["A101", "دراجة هوائية", "دراجات", "8", "99", "ولد", "خارجي", "40", "دراجة للأطفال الكبار", "https://res.cloudinary.com/demo/image/upload/bike.jpg", "", "TRUE"],
    },
    {
      label: "valid row, age_min === age_max",
      row: ["A102", "لغز خشبي", "ألعاب تعليمية", "5", "5", "بنت", "داخلي", "9", "لغز خشبي لعمر خمس سنوات بالضبط", "https://res.cloudinary.com/demo/image/upload/puzzle.jpg", "", "TRUE"],
    },
    {
      label: "skip: active is FALSE",
      row: ["A103", "لعبة معطلة", "دمى", "0", "3", "للجميع", "داخلي", "5", "", "https://res.cloudinary.com/demo/image/upload/off.jpg", "", "FALSE"],
    },
    {
      label: "skip: active mixed case/whitespace should still COUNT (true, extra spaces)",
      row: ["A104", "لعبة صحيحة بحالة أحرف مختلفة", "دمى", "1", "4", "بنت", "داخلي", "7", "", "https://res.cloudinary.com/demo/image/upload/mixedcase.jpg", "", "  TrUe  "],
    },
    {
      label: "skip: missing id",
      row: ["", "لعبة بلا رقم", "دمى", "0", "3", "للجميع", "داخلي", "5", "", "https://res.cloudinary.com/demo/image/upload/noid.jpg", "", "TRUE"],
    },
    {
      label: "skip: missing name",
      row: ["A105", "", "دمى", "0", "3", "للجميع", "داخلي", "5", "", "https://res.cloudinary.com/demo/image/upload/noname.jpg", "", "TRUE"],
    },
    {
      label: "skip: missing image",
      row: ["A106", "لعبة بلا صورة", "دمى", "0", "3", "للجميع", "داخلي", "5", "", "", "", "TRUE"],
    },
    {
      label: "skip: price does not parse",
      row: ["A107", "لعبة بسعر غير صالح", "دمى", "0", "3", "للجميع", "داخلي", "غير معروف", "", "https://res.cloudinary.com/demo/image/upload/badprice.jpg", "", "TRUE"],
    },
  ];

  for (const { label, row } of fixtureRows) {
    console.log(`\n--- ${label} ---`);
    const result = parseRow(row, 0);
    if (result) {
      console.log(`KEPT: ${result.name} | price=${result.price} | age=${formatAgeRange(result.ageMin, result.ageMax)} | images=${JSON.stringify(result.images)}`);
    } else {
      console.log("SKIPPED (see warning above)");
    }
  }
}

async function main() {
  await verifyLiveSheet();
  verifyEdgeCaseFixture();
}

main().catch((err) => {
  console.error("verify-sheets failed:", err);
  process.exit(1);
});
