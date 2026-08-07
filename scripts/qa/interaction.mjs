import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 500, height: 500 } });
await page.goto("http://localhost:3100/dev/preview", { waitUntil: "networkidle" });

const card = page.getByRole("button", { name: "دبدوب قطيفة كبير" });
await card.hover();
await page.waitForTimeout(400);
await card.screenshot({ path: process.argv[2] });

// keyboard focus ring check: tab from body until we hit the card
await page.keyboard.press("Tab");
await page.waitForTimeout(150);
await card.screenshot({ path: process.argv[3] });

await browser.close();
console.log("saved", process.argv[2], process.argv[3]);
