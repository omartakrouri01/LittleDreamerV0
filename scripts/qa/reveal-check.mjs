import { chromium } from "playwright";

const OUT = process.argv[2];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });

// Desktop: parallax should move with scroll.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/dev/shop?toy=P001", { waitUntil: "networkidle" }); // ?toy= skips preloader
  await page.waitForTimeout(300);
  const before = await page.evaluate(() => {
    const el = document.querySelector('[aria-hidden="true"] .text-cloud, .text-cloud');
    return null;
  });
  // grab first parallax layer transform before/after scroll
  const getTransform = () =>
    page.evaluate(() => {
      const layer = document.querySelector("section .pointer-events-none.absolute.inset-0 > div");
      return layer ? getComputedStyle(layer).transform : null;
    });
  const t0 = await getTransform();
  await page.mouse.click(640, 400); // close the toy modal opened via ?toy=
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);
  const t1 = await getTransform();
  console.log("desktop parallax transform before:", t0);
  console.log("desktop parallax transform after 500px scroll:", t1);
  console.log("desktop parallax changed with scroll:", t0 !== t1);
  await context.close();
}

// Mobile: parallax should NOT move with scroll (frozen / no listeners).
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/dev/shop?toy=P001", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const getTransform = () =>
    page.evaluate(() => {
      const layer = document.querySelector("section .pointer-events-none.absolute.inset-0 > div");
      return layer ? getComputedStyle(layer).transform : null;
    });
  const t0 = await getTransform();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);
  const t1 = await getTransform();
  console.log("mobile parallax transform before:", t0);
  console.log("mobile parallax transform after 500px scroll:", t1);
  console.log("mobile parallax frozen (no change):", t0 === t1);
  await context.close();
}

// Scroll-triggered word/section reveals + card stagger + sticky filter bar condense.
{
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/dev/shop", { waitUntil: "networkidle" });
  await page.waitForTimeout(3600); // let preloader finish+exit
  await page.screenshot({ path: `${OUT}/reveal-top.png` });

  await page.evaluate(() => document.getElementById("product-grid")?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/reveal-grid-just-scrolled.png` });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/reveal-grid-settled.png` });

  await context.close();
}

await browser.close();
console.log("done");
