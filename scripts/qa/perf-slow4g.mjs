import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:3100/dev/shop";
const skipPreloader = process.argv.includes("--skip-preloader");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const client = await context.newCDPSession(page);

if (skipPreloader) {
  // Simulate a visitor already past the once-per-session intro, to
  // isolate real asset/hydration time from the preloader's intentional gate.
  await context.addInitScript(() => {
    sessionStorage.setItem("ld_preloader_shown", "1");
  });
}

// Lighthouse's "Slow 4G" mobile default: 150ms RTT, 1.6Mbps down, 750Kbps up, 4x CPU slowdown.
await client.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

const navStart = Date.now();
await page.goto(URL, { waitUntil: "domcontentloaded" });
const dclTime = Date.now() - navStart;

await page.waitForLoadState("load");
const loadTime = Date.now() - navStart;

// "Interactive" = a real click on the first product card's order button
// actually works (hydration complete, handlers attached).
let interactiveTime = null;
try {
  await page.getByRole("button", { name: "اطلب عبر إنستغرام" }).first().waitFor({ state: "visible", timeout: 20000 });
  await page.getByRole("button", { name: "اطلب عبر إنستغرام" }).first().click({ timeout: 20000 });
  interactiveTime = Date.now() - navStart;
} catch (e) {
  console.log("interactive click failed:", e.message);
}

const metrics = await page.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const paint = performance.getEntriesByType("paint");
  const fcp = paint.find((p) => p.name === "first-contentful-paint");
  const resources = performance.getEntriesByType("resource");
  const totalTransfer = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0) + (nav?.transferSize || 0);
  const byType = {};
  for (const r of resources) {
    const t = r.initiatorType || "other";
    byType[t] = (byType[t] || 0) + (r.transferSize || 0);
  }
  return {
    documentTransferSize: nav?.transferSize,
    domContentLoaded: nav?.domContentLoadedEventEnd,
    loadEvent: nav?.loadEventEnd,
    fcp: fcp?.startTime,
    totalTransferBytes: totalTransfer,
    resourceCount: resources.length,
    transferByInitiatorType: byType,
  };
});

console.log(JSON.stringify(
  {
    url: URL,
    domContentLoaded_ms: dclTime,
    windowLoad_ms: loadTime,
    firstOrderButtonInteractive_ms: interactiveTime,
    performanceAPI: metrics,
  },
  null,
  2,
));

await browser.close();
