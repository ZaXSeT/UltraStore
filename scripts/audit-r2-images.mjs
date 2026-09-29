import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { DEFAULT_HERO_CONFIG, DEFAULT_CATEGORIES_CONFIG, DEFAULT_BRAND_LOGOS_CONFIG } from "../src/lib/cms-types.ts";

const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
if (!publicBase?.startsWith("https://")) {
  throw new Error("R2_PUBLIC_URL must be an HTTPS public URL");
}

const db = new DatabaseSync("data/ultrastore.db", { readOnly: true });
const catalog = JSON.parse(readFileSync("src/data/catalog-research.json", "utf8"));
const paths = new Set();
const add = (value) => {
  if (typeof value === "string" && value.startsWith("/api/r2/")) {
    paths.add(value.slice("/api/r2/".length));
  }
};

for (const row of db.prepare("SELECT primary_image FROM products").all()) add(row.primary_image);
for (const row of db.prepare("SELECT media_json FROM variants").all()) {
  for (const image of JSON.parse(row.media_json)) add(image.url);
}
for (const item of catalog.items) {
  add(item.sourceImageUrl);
  for (const variant of item.variants) add(variant.imageUrl);
}
add(DEFAULT_HERO_CONFIG.imageUrl);
for (const category of DEFAULT_CATEGORIES_CONFIG) add(category.image);
for (const brand of DEFAULT_BRAND_LOGOS_CONFIG) add(brand.logoUrl);
for (const row of db.prepare("SELECT value_json FROM site_settings").all()) {
  const visit = (value) => {
    if (typeof value === "string") add(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(JSON.parse(row.value_json));
}

const results = [];
const queue = [...paths];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const key = queue.shift();
    try {
      const response = await fetch(`${publicBase}/${key}`, {
        method: "HEAD",
        signal: AbortSignal.timeout(15000),
      });
      results.push({ key, status: response.status, type: response.headers.get("content-type") });
    } catch (error) {
      results.push({ key, error: error.message });
    }
  }
}));

const failed = results.filter((result) => result.status !== 200 || !result.type?.startsWith("image/"));
console.log(`Checked ${results.length} unique R2 images; failed: ${failed.length}`);
for (const result of failed) console.log(result);
if (failed.length) process.exitCode = 1;
