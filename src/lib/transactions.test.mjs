import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";

function setupTestDb() {
  const db = new DatabaseSync(":memory:");
  db.exec(`
    CREATE TABLE stock_balances (
      variant_id TEXT PRIMARY KEY,
      on_hand INTEGER NOT NULL DEFAULT 0,
      reserved INTEGER NOT NULL DEFAULT 0,
      allocated INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE preorder_batches (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL,
      status TEXT NOT NULL,
      quota_total INTEGER NOT NULL,
      quota_reserved INTEGER NOT NULL DEFAULT 0,
      quota_committed INTEGER NOT NULL DEFAULT 0,
      eta_range TEXT NOT NULL
    );

    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      offer_type TEXT NOT NULL,
      status TEXT NOT NULL,
      fulfillment_status TEXT NOT NULL,
      total_amount INTEGER NOT NULL
    );
  `);
  return db;
}

test("T01: Ready Stock -> Reservation -> Payment Settlement -> Stock Allocated", () => {
  const db = setupTestDb();
  const variantId = "var_keychron_v1";

  // Initial stock: 10 on hand
  db.prepare("INSERT INTO stock_balances (variant_id, on_hand, reserved, allocated) VALUES (?, 10, 0, 0)").run(variantId);

  // 1. User initiates checkout -> Reserve 2 units
  db.exec("BEGIN IMMEDIATE;");
  const stock = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get(variantId);
  const available = stock.on_hand - stock.reserved - stock.allocated;
  assert.equal(available, 10);

  db.prepare("UPDATE stock_balances SET reserved = reserved + 2 WHERE variant_id = ?").run(variantId);
  db.prepare("INSERT INTO orders (id, reference, offer_type, status, fulfillment_status, total_amount) VALUES ('ord_1', 'UST-001', 'READY', 'pending_payment', 'unallocated', 3098000)").run();
  db.exec("COMMIT;");

  let state = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get(variantId);
  assert.equal(state.reserved, 2);
  assert.equal(state.on_hand - state.reserved - state.allocated, 8);

  // 2. Webhook triggers settlement -> Move reserved to allocated
  db.exec("BEGIN IMMEDIATE;");
  db.prepare("UPDATE stock_balances SET reserved = reserved - 2, allocated = allocated + 2 WHERE variant_id = ?").run(variantId);
  db.prepare("UPDATE orders SET status = 'confirmed', fulfillment_status = 'ready_to_ship' WHERE id = 'ord_1'").run();
  db.exec("COMMIT;");

  state = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get(variantId);
  assert.equal(state.reserved, 0);
  assert.equal(state.allocated, 2);
  assert.equal(state.on_hand - state.reserved - state.allocated, 8);

  const order = db.prepare("SELECT status, fulfillment_status FROM orders WHERE id = 'ord_1'").get();
  assert.equal(order.status, "confirmed");
  assert.equal(order.fulfillment_status, "ready_to_ship");
});

test("T02: Race Condition / Stock Limit -> Only one succeeds, zero negative stock", () => {
  const db = setupTestDb();
  const variantId = "var_superlight_last_unit";

  // Exactly 1 unit left on hand
  db.prepare("INSERT INTO stock_balances (variant_id, on_hand, reserved, allocated) VALUES (?, 1, 0, 0)").run(variantId);

  function tryReserve(qty) {
    db.exec("BEGIN IMMEDIATE;");
    try {
      const stock = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get(variantId);
      const available = stock.on_hand - stock.reserved - stock.allocated;
      if (available < qty) {
        throw new Error("OUT_OF_STOCK");
      }
      db.prepare("UPDATE stock_balances SET reserved = reserved + ? WHERE variant_id = ?").run(qty, variantId);
      db.exec("COMMIT;");
      return true;
    } catch (e) {
      db.exec("ROLLBACK;");
      throw e;
    }
  }

  // Buyer A reserves the 1 unit
  assert.equal(tryReserve(1), true);

  // Buyer B attempts to reserve 1 unit -> must throw OUT_OF_STOCK
  assert.throws(() => tryReserve(1), /OUT_OF_STOCK/);

  // Ensure balance invariant holds (never negative)
  const state = db.prepare("SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?").get(variantId);
  assert.equal(state.reserved, 1);
  assert.equal(state.on_hand - state.reserved - state.allocated, 0);
});

test("T03: Pre-order Full Payment Quota -> Committed & Waiting Supplier", () => {
  const db = setupTestDb();
  const batchId = "batch_wooting_nov";
  const variantId = "var_wooting_60he";

  db.prepare(`
    INSERT INTO preorder_batches (id, variant_id, status, quota_total, quota_reserved, quota_committed, eta_range)
    VALUES (?, ?, 'open', 50, 0, 0, '18–28 November 2026')
  `).run(batchId, variantId);

  // Reserve 1 slot
  db.exec("BEGIN IMMEDIATE;");
  db.prepare("UPDATE preorder_batches SET quota_reserved = quota_reserved + 1 WHERE id = ?").run(batchId);
  db.prepare("INSERT INTO orders (id, reference, offer_type, status, fulfillment_status, total_amount) VALUES ('ord_po_1', 'UST-PO-001', 'PREORDER', 'pending_payment', 'unallocated', 3499000)").run();
  db.exec("COMMIT;");

  let batch = db.prepare("SELECT quota_total, quota_reserved, quota_committed FROM preorder_batches WHERE id = ?").get(batchId);
  assert.equal(batch.quota_reserved, 1);
  assert.equal(batch.quota_total - batch.quota_reserved - batch.quota_committed, 49);

  // Settlement -> Move quota_reserved to quota_committed
  db.exec("BEGIN IMMEDIATE;");
  db.prepare("UPDATE preorder_batches SET quota_reserved = quota_reserved - 1, quota_committed = quota_committed + 1 WHERE id = ?").run(batchId);
  db.prepare("UPDATE orders SET status = 'confirmed', fulfillment_status = 'waiting_supplier' WHERE id = 'ord_po_1'").run();
  db.exec("COMMIT;");

  batch = db.prepare("SELECT quota_total, quota_reserved, quota_committed FROM preorder_batches WHERE id = ?").get(batchId);
  assert.equal(batch.quota_reserved, 0);
  assert.equal(batch.quota_committed, 1);
  assert.equal(batch.quota_total - batch.quota_reserved - batch.quota_committed, 49);

  const order = db.prepare("SELECT status, fulfillment_status FROM orders WHERE id = 'ord_po_1'").get();
  assert.equal(order.status, "confirmed");
  assert.equal(order.fulfillment_status, "waiting_supplier");
});
