import { chromium } from "playwright";

const BASE = process.env.QA_BASE || "http://localhost:3200";

const OUT = process.argv[2];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
const page = await context.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("PAGE ERROR:", msg.text());
});
page.on("pageerror", (err) => console.log("PAGE EXCEPTION:", err.message));

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

// 1) Open a modal by clicking a card
await page.getByRole("button", { name: "دبدوب قطيفة كبير" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/modal-open.png` });
console.log("url after open:", page.url());

// 2) Thumbnail strip / share button check, then close via Escape
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
console.log("url after escape:", page.url());
await page.screenshot({ path: `${OUT}/modal-closed.png` });

// 3) Open again, then browser back should close it
await page.getByRole("button", { name: "دبدوب قطيفة كبير" }).click();
await page.waitForTimeout(300);
console.log("url after open2:", page.url());
await page.goBack();
await page.waitForTimeout(300);
console.log("url after back:", page.url());
await page.screenshot({ path: `${OUT}/modal-after-back.png` });

// 4) Order button inside modal -> overlay
await page.getByRole("button", { name: "دبدوب قطيفة كبير" }).click();
await page.waitForTimeout(300);
const dialog = page.getByRole("dialog");
await dialog.getByRole("button", { name: "اطلب عبر إنستغرام" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/order-overlay.png` });

// 5) Search
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.getByPlaceholder("ابحث عن لعبة...").fill("دباديب");
await page.waitForTimeout(400);
console.log("search url:", page.url());
await page.screenshot({ path: `${OUT}/search-empty.png` });

await page.getByPlaceholder("ابحث عن لعبة...").fill("دبدوب");
await page.waitForTimeout(400);
console.log("search url2:", page.url());
await page.screenshot({ path: `${OUT}/search-match.png` });

// 6) direct ?toy= link (shared-link scenario)
await page.goto(`${BASE}/?toy=x`, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/direct-toy-link.png` });

await browser.close();
console.log("done");
