import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const schemaSqlPath = path.resolve("./src/db/schema.sql");
const schemaSql = fs.readFileSync(schemaSqlPath, "utf-8");

test("F01: Schema migration creates all 13 core tables", () => {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(schemaSql);

  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
    .all()
    .map((r) => r.name);

  const expectedTables = [
    "brands",
    "categories",
    "products",
    "variants",
    "preorder_batches",
    "offers",
    "stock_balances",
    "stock_movements",
    "orders",
    "payment_attempts",
    "idempotency_keys",
    "outbox_events",
    "audit_logs",
  ];

  for (const expected of expectedTables) {
    assert.ok(tables.includes(expected), `Table ${expected} must exist after migration`);
  }
  assert.equal(tables.length, 13);
});

test("F02: Schema enforces foreign key constraint integrity", () => {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(schemaSql);

  // Inserting variant without existing product must fail
  assert.throws(() => {
    db.prepare(`
      INSERT INTO variants (id, product_id, sku, name, price, weight_grams)
      VALUES ('var_test', 'nonexistent_prod', 'SKU-001', 'Test', 100000, 500)
    `).run();
  }, /FOREIGN KEY constraint failed/);
});

test("F03: Schema enforces CHECK constraints on status enums and positive integers", () => {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(schemaSql);

  // Setup valid parent product
  db.prepare("INSERT INTO brands (id, name, slug) VALUES ('b1', 'Brand 1', 'b1')").run();
  db.prepare("INSERT INTO categories (id, name, slug) VALUES ('c1', 'Cat 1', 'c1')").run();
  db.prepare(`
    INSERT INTO products (id, slug, name, brand_id, category_id, description, warranty_info, primary_image)
    VALUES ('p1', 'p1-slug', 'Product 1', 'b1', 'c1', 'Desc', 'Warranty', 'img.png')
  `).run();
  db.prepare(`
    INSERT INTO variants (id, product_id, sku, name, price, weight_grams)
    VALUES ('v1', 'p1', 'SKU-V1', 'Variant 1', 1500000, 700)
  `).run();

  // Invalid offer_type (neither READY nor PREORDER) must fail CHECK constraint
  assert.throws(() => {
    db.prepare(`
      INSERT INTO offers (id, variant_id, offer_type, price, status)
      VALUES ('off_invalid', 'v1', 'INVALID_TYPE', 1500000, 'active')
    `).run();
  }, /CHECK constraint failed/);

  // Negative price must fail CHECK constraint
  assert.throws(() => {
    db.prepare(`
      INSERT INTO offers (id, variant_id, offer_type, price, status)
      VALUES ('off_neg', 'v1', 'READY', -500, 'active')
    `).run();
  }, /CHECK constraint failed/);
});
