import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Set isolated test database
const testDbPath = path.resolve("./data/test_catalog.db");
if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
process.env.DATABASE_PATH = testDbPath;

test("Catalog seeding and product retrieval with 80+ authentic products", async () => {
  const { seedCatalogIfEmpty, getAllProducts, getProductBySlug, getBrands } = await import("./catalog.ts");

  seedCatalogIfEmpty();

  const allProducts = getAllProducts();
  assert.ok(allProducts.length >= 80, `Expected at least 80 authentic products, got ${allProducts.length}`);

  // Test category filter
  const keyboards = getAllProducts("keyboard");
  assert.ok(keyboards.length >= 10, `Expected at least 10 keyboards, got ${keyboards.length}`);

  const mousepads = getAllProducts("mousepad");
  assert.ok(mousepads.length >= 10, `Expected at least 10 mousepads, got ${mousepads.length}`);

  // Test slug retrieval
  const wooting = getProductBySlug("wooting-60he-plus");
  assert.ok(wooting, "Wooting product must exist");
  assert.equal(wooting.brand.name, "Wooting");
  assert.ok(wooting.offers.some(o => o.offerType === "PREORDER"), "Wooting must have PREORDER offer");

  // Test brand filter & dynamic brand selector data
  const brands = getBrands();
  assert.ok(brands.length >= 30, `Expected at least 30 brands for selector, got ${brands.length}`);

  const infinitasFiltered = getAllProducts(undefined, undefined, "infinitas");
  assert.ok(infinitasFiltered.length >= 5, "Infinitas brand filter must return catalog products");
});
