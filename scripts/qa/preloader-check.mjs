import { chromium } from "playwright";

const OUT = process.argv[2];
const SEL = '[data-testid="preloader"]';
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

// 1) Fresh session, first load: preloader should show, then hard-timeout to done.
{
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/dev/shop", { waitUntil: "networkidle" });
  await page.waitForTimeout(400); // past hydration
  console.log("preloader visible shortly after load:", (await page.locator(SEL).count()) > 0);
  await page.screenshot({ path: `${OUT}/preloader-active.png` });

  const gridExists = await page.locator("#product-grid").count();
  console.log("grid present under preloader (not blocked):", gridExists > 0);

  await page.waitForTimeout(2500 + 700 + 300); // hard timeout + exit transition + buffer
  console.log("preloader gone after hard timeout+exit:", (await page.locator(SEL).count()) === 0);
  await page.screenshot({ path: `${OUT}/preloader-done.png` });

  // 2) Same session, re-navigate: must NOT show again.
  await page.goto("http://localhost:3100/dev/shop", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  console.log("preloader skipped on 2nd nav (same session):", (await page.locator(SEL).count()) === 0);
  await context.close();
}

// 3) Fresh session, arriving with ?toy= — must be skipped entirely.
{
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/dev/shop?toy=P001", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  console.log("preloader skipped with ?toy= present:", (await page.locator(SEL).count()) === 0);
  await context.close();
}

// 4) Fresh session, prefers-reduced-motion — must be skipped entirely.
{
  const context = await browser.newContext({ viewport: { width: 420, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/dev/shop", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  console.log("preloader skipped under prefers-reduced-motion:", (await page.locator(SEL).count()) === 0);
  await context.close();
}

// 5) Tap-to-skip.
{
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/dev/shop", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  console.log("preloader present before tap:", (await page.locator(SEL).count()) > 0);
  await page.mouse.click(210, 450);
  await page.waitForTimeout(700 + 300);
  console.log("preloader gone after tap-to-skip:", (await page.locator(SEL).count()) === 0);
  await context.close();
}

await browser.close();
console.log("done");
