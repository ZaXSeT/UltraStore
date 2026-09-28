import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Set isolated test database
const testDbPath = path.resolve("./data/test_catalog.db");
if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
process.env.DATABASE_PATH = testDbPath;

test("Catalog seeding and product retrieval", async () => {
  // Dynamic import ts/js
  const { seedCatalogIfEmpty, getAllProducts, getProductBySlug, getBrands } = await import("./catalog.ts");

  seedCatalogIfEmpty();

  const allProducts = getAllProducts();
  assert.ok(allProducts.length >= 6, `Expected at least 6 products, got ${allProducts.length}`);

  // Test filter
  const keyboards = getAllProducts("keyboard");
  assert.ok(keyboards.length >= 2, `Expected at least 2 keyboards, got ${keyboards.length}`);

  // Test slug retrieval
  const wooting = getProductBySlug("wooting-60he-plus");
  assert.ok(wooting, "Wooting product must exist");
  assert.equal(wooting.brand.name, "Wooting");
  assert.ok(wooting.offers.some(o => o.offerType === "PREORDER"), "Wooting must have PREORDER offer");

  // Test brand filter & dropdown data
  const brands = getBrands();
  assert.ok(brands.length > 0, "Brands must be populated for dropdown selector");
  const wootingFiltered = getAllProducts(undefined, undefined, "wooting");
  assert.equal(wootingFiltered.length, 1, "Brand filter must return products matching brand slug");

  // Success verified
});
