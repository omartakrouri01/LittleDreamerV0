import { chromium } from "playwright";

const [, , url, outPath, widthStr, heightStr] = process.argv;
const width = parseInt(widthStr || "390", 10);
const height = parseInt(heightStr || "844", 10);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log("saved", outPath, `${width}x${height}`);
