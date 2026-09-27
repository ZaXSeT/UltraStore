import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";

test("Database initialization and atomic transaction safety", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`
    CREATE TABLE stock_balances (
      variant_id TEXT PRIMARY KEY,
      on_hand INTEGER NOT NULL DEFAULT 0,
      reserved INTEGER NOT NULL DEFAULT 0,
      allocated INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Insert initial stock
  db.prepare("INSERT INTO stock_balances (variant_id, on_hand, reserved, allocated) VALUES (?, ?, ?, ?)").run("VAR-KEYCHRON-V1", 5, 0, 0);

  // Invariant test: atomic reserve
  function reserveStock(variantId, qty) {
    db.exec("BEGIN IMMEDIATE;");
    try {
      const row = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get(variantId);
      assert.ok(row, "Row must exist");
      const available = row.on_hand - row.reserved - row.allocated;
      if (available < qty) {
        throw new Error("INSUFFICIENT_STOCK");
      }
      db.prepare("UPDATE stock_balances SET reserved = reserved + ? WHERE variant_id = ?").run(qty, variantId);
      db.exec("COMMIT;");
      return true;
    } catch (e) {
      db.exec("ROLLBACK;");
      throw e;
    }
  }

  // 1. Reserve 3 successfully
  assert.equal(reserveStock("VAR-KEYCHRON-V1", 3), true);
  let state = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get("VAR-KEYCHRON-V1");
  assert.equal(state.reserved, 3);
  assert.equal(state.on_hand - state.reserved - state.allocated, 2);

  // 2. Reserve 3 more should fail due to insufficient available stock (only 2 left)
  assert.throws(() => reserveStock("VAR-KEYCHRON-V1", 3), /INSUFFICIENT_STOCK/);

  // State must remain uncorrupted after rollback
  state = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get("VAR-KEYCHRON-V1");
  assert.equal(state.reserved, 3);
});
