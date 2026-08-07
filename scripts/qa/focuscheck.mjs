import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 500, height: 500 } });
await page.goto("http://localhost:3100/dev/preview", { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
await page.waitForTimeout(150);
const active = await page.evaluate(() => {
  const el = document.activeElement;
  return el ? { tag: el.tagName, role: el.getAttribute('role'), text: el.textContent?.slice(0,30) } : null;
});
console.log("active element:", JSON.stringify(active));
await page.screenshot({ path: process.argv[2] });
await browser.close();
