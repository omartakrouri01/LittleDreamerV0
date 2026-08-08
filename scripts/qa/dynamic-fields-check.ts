/**
 * Guards the contract that the sheet is the single source of truth: renaming or
 * inventing `category` / `sex` values must flow through to the UI with no code
 * change. Feeds invented values through the real parse -> derive -> filter path.
 *
 * Run:  npx tsx --conditions=react-server scripts/qa/dynamic-fields-check.ts
 * (the condition makes `server-only`, which lib/sheets.ts imports, a no-op
 * outside Next's server runtime)
 */
import { parseRow } from "@/lib/sheets";
import { deriveCategories } from "@/lib/categories";
import { deriveDistinctValues } from "@/lib/facets";
import { derivePlaces, isOutdoorToy } from "@/lib/place";
import { filterAndSortToys } from "@/lib/filterToys";

const row = (id: string, name: string, cat: string, sex: string, place: string) =>
  [id, name, cat, "0", "4", sex, place, "10", "d", "https://res.cloudinary.com/x/image/upload/a.jpg", "", "TRUE"];

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  const ok = a === e;
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label}\n        got ${a}${ok ? "" : `\n        want ${e}`}`);
}

// Renamed sex values plus a category that appears nowhere in the codebase.
const toys = [
  parseRow(row("1", "دبدوب", "دمى", "أولاد وبنات", "داخلي"), 2)!,
  parseRow(row("2", "دراجة", "دراجات", "أولاد", "خارجي"), 3)!,
  parseRow(row("3", "عروسة", "إكسسوارات الشعر", "بنات", "داخلي"), 4)!,
];

check("values stored verbatim", toys.map((t) => `${t.category}/${t.sex}`), [
  "دمى/أولاد وبنات",
  "دراجات/أولاد",
  "إكسسوارات الشعر/بنات",
]);
check("sex options derived from data", deriveDistinctValues(toys, (t) => t.sex), ["أولاد وبنات", "أولاد", "بنات"]);
check("brand-new category is listed", deriveCategories(toys).map((c) => c.name).sort(), ["إكسسوارات الشعر", "دراجات", "دمى"].sort());
check("every category gets a colour", deriveCategories(toys).every((c) => /^#[0-9A-F]{6}$/i.test(c.color)), true);
check("filter by renamed sex", filterAndSortToys(toys, { age: "", cat: "", sex: "بنات", sort: "", q: "" }).map((t) => t.name), ["عروسة"]);
check("filter by new category", filterAndSortToys(toys, { age: "", cat: "إكسسوارات الشعر", sex: "", sort: "", q: "" }).map((t) => t.name), ["عروسة"]);

const p = derivePlaces(toys);
check("outdoor derived from data", [p.outdoorValue, toys.filter((t) => isOutdoorToy(t, p.outdoorValue)).map((t) => t.name)], ["خارجي", ["دراجة"]]);

// Renaming `place` away from خارج must hide the shelf, never silently promote
// the wrong value into a shelf headed "ألعاب خارجية".
const renamed = [
  parseRow(row("1", "دبدوب", "دمى", "أولاد", "داخل المنزل"), 2)!,
  parseRow(row("2", "دراجة", "دراجات", "أولاد", "الحديقة"), 3)!,
];
const p2 = derivePlaces(renamed);
check("unrecognised place hides the shelf", [p2.outdoorValue, renamed.filter((t) => isOutdoorToy(t, p2.outdoorValue)).map((t) => t.name)], [null, []]);

console.log(failures === 0 ? "\nall dynamic-field checks passed" : `\n${failures} check(s) FAILED`);
process.exit(failures === 0 ? 0 : 1);
