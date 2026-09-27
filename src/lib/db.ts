import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dbDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = process.env.DATABASE_PATH || path.join(dbDir, "ultrastore.db");
  const db = new DatabaseSync(dbPath);

  // Performance & Concurrency settings
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;
  `);

  initSchema(db);
  dbInstance = db;
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    -- Categories
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT
    );

    -- Brands
    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      country TEXT,
      official_url TEXT
    );

    -- Products
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand_id TEXT NOT NULL REFERENCES brands(id),
      category_id TEXT NOT NULL REFERENCES categories(id),
      description TEXT NOT NULL,
      specs_json TEXT NOT NULL,
      box_contents_json TEXT NOT NULL,
      warranty_info TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      primary_image TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Variants
    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      part_number TEXT,
      attributes_json TEXT NOT NULL,
      price INTEGER NOT NULL,
      weight_grams INTEGER NOT NULL,
      media_json TEXT NOT NULL
    );

    -- Stock Ledger & Balances
    CREATE TABLE IF NOT EXISTS stock_balances (
      variant_id TEXT PRIMARY KEY REFERENCES variants(id),
      on_hand INTEGER NOT NULL DEFAULT 0,
      reserved INTEGER NOT NULL DEFAULT 0,
      allocated INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Stock Movements (audit ledger)
    CREATE TABLE IF NOT EXISTS stock_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      variant_id TEXT NOT NULL REFERENCES variants(id),
      movement_type TEXT NOT NULL, -- 'restock', 'reserve', 'release', 'allocate', 'ship', 'adjustment'
      quantity INTEGER NOT NULL,
      reference_id TEXT, -- orderId or batchId
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Preorder Batches
    CREATE TABLE IF NOT EXISTS preorder_batches (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      variant_id TEXT NOT NULL REFERENCES variants(id),
      status TEXT NOT NULL, -- scheduled, open, closed, inbound, received, completed, cancelled
      quota_total INTEGER NOT NULL,
      quota_reserved INTEGER NOT NULL DEFAULT 0,
      quota_committed INTEGER NOT NULL DEFAULT 0,
      eta_range TEXT NOT NULL,
      current_stage TEXT NOT NULL,
      delayed INTEGER NOT NULL DEFAULT 0,
      timeline_notes_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Offers
    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL REFERENCES variants(id),
      offer_type TEXT NOT NULL, -- 'READY', 'PREORDER'
      price INTEGER NOT NULL,
      status TEXT NOT NULL, -- 'active', 'closed', 'sold_out'
      batch_id TEXT REFERENCES preorder_batches(id),
      estimated_shipping TEXT
    );

    -- Orders
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      group_key TEXT NOT NULL, -- 'READY' or 'PREORDER:<batchId>'
      offer_type TEXT NOT NULL,
      batch_id TEXT,
      status TEXT NOT NULL, -- pending_payment, confirmed, on_hold, cancelled, completed
      fulfillment_status TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address_json TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping_fee INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      guest_access_token TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Payment Obligations & Attempts
    CREATE TABLE IF NOT EXISTS payment_attempts (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id),
      order_reference TEXT NOT NULL,
      provider TEXT NOT NULL,
      transaction_id TEXT,
      payment_type TEXT,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL, -- created, pending, succeeded, failed, expired
      snap_token TEXT,
      va_number TEXT,
      bank TEXT,
      expiry_time TEXT NOT NULL,
      paid_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Idempotency Records
    CREATE TABLE IF NOT EXISTS idempotency_keys (
      key TEXT PRIMARY KEY,
      resource_type TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      response_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Outbox Events
    CREATE TABLE IF NOT EXISTS outbox_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      processed INTEGER NOT NULL DEFAULT 0,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// Transaction helper for safe atomic operations
export function runInTransaction<T>(fn: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE;");
  try {
    const result = fn(db);
    db.exec("COMMIT;");
    return result;
  } catch (err) {
    db.exec("ROLLBACK;");
    throw err;
  }
}
