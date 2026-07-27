// Screenshot harness for the design pass.
// Replays ONE real /api/recipe + /api/videos response (captured live into
// design-pass/fixtures/) so every shot is deterministic and repeated passes
// don't burn API quota. The content on screen is real, not placeholder.
//
// Usage: node design-pass/shoot.mjs <label>   → design-pass/shots/<label>/*.png

import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const label = process.argv[2];
if (!label) throw new Error("usage: node design-pass/shoot.mjs <label>");

const BASE = "http://localhost:3000";
const OUT = `design-pass/shots/${label}`;
mkdirSync(OUT, { recursive: true });

const recipePayload = JSON.parse(
  readFileSync("design-pass/fixtures/recipe.json", "utf8"),
);
const videosPayload = JSON.parse(
  readFileSync("design-pass/fixtures/videos.json", "utf8"),
);

const DISH = recipePayload.recipe.dish;

const HISTORY = [
  { id: "h1", dish: "Chicken Adobo", at: Date.parse("2026-07-27T05:00:00") },
  { id: "h2", dish: "Shakshuka", at: Date.parse("2026-07-26T19:12:00") },
  { id: "h3", dish: "Pad See Ew", at: Date.parse("2026-07-25T18:40:00") },
];
const FAVORITES = [
  { id: "f1", dish: DISH, at: Date.parse("2026-07-27T05:01:00"), recipe: recipePayload.recipe },
  {
    id: "f2",
    dish: "Shakshuka",
    at: Date.parse("2026-07-26T19:15:00"),
    recipe: { ...recipePayload.recipe, dish: "Shakshuka" },
  },
];

/** @param {import('playwright').Page} page */
async function seed(page, { history = [], favorites = [] } = {}) {
  await page.addInitScript(
    ([h, f]) => {
      localStorage.setItem("recipe-now:history", JSON.stringify(h));
      localStorage.setItem("recipe-now:favorites", JSON.stringify(f));
    },
    [history, favorites],
  );
}

/** @param {import('playwright').Page} page */
async function routes(page, opts = {}) {
  const {
    recipeDelay = 0,
    recipeError = null,
    videosDelay = 0,
    videosError = null,
    stripTips = false,
  } = opts;

  await page.route("**/api/recipe", async (route) => {
    if (recipeDelay) await new Promise((r) => setTimeout(r, recipeDelay));
    if (recipeError) {
      return route.fulfill({ status: 500, json: { error: recipeError } });
    }
    const body = stripTips
      ? { ...recipePayload, recipe: { ...recipePayload.recipe, tips: [] } }
      : recipePayload;
    return route.fulfill({ json: body });
  });

  await page.route("**/api/videos**", async (route) => {
    if (videosDelay) await new Promise((r) => setTimeout(r, videosDelay));
    if (videosError) {
      return route.fulfill({ status: 502, json: { error: videosError } });
    }
    return route.fulfill({ json: videosPayload });
  });

  // Thumbnails: 1x1 grey pixel so shots don't depend on the network.
  await page.route("https://i.ytimg.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==",
        "base64",
      ),
    }),
  );
}

const shots = [];
async function shot(page, name, { full = false } = {}) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: full });
  shots.push(name);
  console.log(`  ${name}${full ? " (full)" : ""}`);
}

async function search(page) {
  await page.locator('input').fill("chicken adobo");
  await page.locator('button[type="submit"]').click();
}

async function tab(page, name) {
  await page.locator("nav button", { hasText: new RegExp(name, "i") }).click();
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

console.log(`shooting → ${OUT}`);

// 1. idle / empty
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page);
  await page.goto(BASE);
  await page.waitForTimeout(400);
  await shot(page, "01-idle");

  // 2. input filled → submit enabled
  await page.locator("input").fill("chicken adobo");
  await shot(page, "02-input-filled");
  await page.close();
}

// 3. loading
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page, { recipeDelay: 4000 });
  await page.goto(BASE);
  await search(page);
  await page.waitForTimeout(600);
  await shot(page, "03-loading");
  await page.close();
}

// 4. recipe error
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page, { recipeError: "Could not get that recipe." });
  await page.goto(BASE);
  await search(page);
  await page.waitForTimeout(600);
  await shot(page, "04-recipe-error");
  await page.close();
}

// 5-8. recipe loaded (videos pending → loaded), favorited, full page
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page, { videosDelay: 3000 });
  await page.goto(BASE);
  await search(page);
  await page.waitForTimeout(700);
  await shot(page, "05-recipe-videos-loading");
  await page.waitForTimeout(3200);
  await shot(page, "06-recipe-top");
  await page.getByRole("heading", { name: "Videos" }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await shot(page, "07-recipe-videos");
  await page.mouse.wheel(0, -20000);
  await page.waitForTimeout(300);
  await page.locator("button", { hasText: /Favorite/ }).first().click();
  await page.waitForTimeout(300);
  await shot(page, "08-favorited");
  await shot(page, "09-recipe-fullpage", { full: true });
  await page.close();
}

// 10. recipe with no tips
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page, { stripTips: true });
  await page.goto(BASE);
  await search(page);
  await page.waitForTimeout(900);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(300);
  await shot(page, "10-recipe-no-tips");
  await page.close();
}

// 11. videos error (quota)
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page, { videosError: "YouTube quota is used up for today." });
  await page.goto(BASE);
  await search(page);
  await page.waitForTimeout(900);
  await page.mouse.wheel(0, 20000);
  await page.waitForTimeout(300);
  await shot(page, "11-videos-error");
  await page.close();
}

// 12-13. history empty / populated
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page);
  await page.goto(BASE);
  await tab(page, "history");
  await page.waitForTimeout(300);
  await shot(page, "12-history-empty");
  await page.close();
}
{
  const page = await ctx.newPage();
  await seed(page, { history: HISTORY, favorites: FAVORITES });
  await routes(page);
  await page.goto(BASE);
  await tab(page, "history");
  await page.waitForTimeout(300);
  await shot(page, "13-history-populated");
  await page.close();
}

// 14-15. favorites empty / populated
{
  const page = await ctx.newPage();
  await seed(page);
  await routes(page);
  await page.goto(BASE);
  await tab(page, "favorites");
  await page.waitForTimeout(300);
  await shot(page, "14-favorites-empty");
  await page.close();
}
{
  const page = await ctx.newPage();
  await seed(page, { history: HISTORY, favorites: FAVORITES });
  await routes(page);
  await page.goto(BASE);
  await tab(page, "favorites");
  await page.waitForTimeout(300);
  await shot(page, "15-favorites-populated");
  await page.close();
}

await browser.close();
console.log(`done — ${shots.length} shots in ${OUT}`);
