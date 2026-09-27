-- UltraStore SQLite Database Schema
-- Strict types, foreign keys, and status validation

PRAGMA foreign_keys = ON;

-- 1. Brands
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  country TEXT,
  official_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

-- 2. Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  specs_json TEXT NOT NULL DEFAULT '{}',
  box_contents_json TEXT NOT NULL DEFAULT '[]',
  warranty_info TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  primary_image TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);

-- 4. Product Variants
CREATE TABLE IF NOT EXISTS variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  part_number TEXT,
  attributes_json TEXT NOT NULL DEFAULT '{}',
  price INTEGER NOT NULL CHECK (price >= 0),
  weight_grams INTEGER NOT NULL CHECK (weight_grams > 0),
  media_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON variants(sku);

-- 5. Preorder Batches
CREATE TABLE IF NOT EXISTS preorder_batches (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  variant_id TEXT NOT NULL REFERENCES variants(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'open', 'closed', 'inbound', 'received', 'completed', 'cancelled')),
  quota_total INTEGER NOT NULL CHECK (quota_total > 0),
  quota_reserved INTEGER NOT NULL DEFAULT 0 CHECK (quota_reserved >= 0),
  quota_committed INTEGER NOT NULL DEFAULT 0 CHECK (quota_committed >= 0),
  eta_range TEXT NOT NULL,
  current_stage TEXT NOT NULL CHECK (current_stage IN ('opened', 'closed', 'supplier_production', 'transit', 'qc_received', 'shipping')),
  delayed INTEGER NOT NULL DEFAULT 0 CHECK (delayed IN (0, 1)),
  timeline_notes_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_batches_slug ON preorder_batches(slug);
CREATE INDEX IF NOT EXISTS idx_batches_variant ON preorder_batches(variant_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON preorder_batches(status);

-- 6. Offers (READY or PREORDER)
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  variant_id TEXT NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('READY', 'PREORDER')),
  price INTEGER NOT NULL CHECK (price >= 0),
  status TEXT NOT NULL CHECK (status IN ('active', 'closed', 'sold_out')),
  batch_id TEXT REFERENCES preorder_batches(id) ON DELETE SET NULL,
  estimated_shipping TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_offers_variant ON offers(variant_id);
CREATE INDEX IF NOT EXISTS idx_offers_batch ON offers(batch_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

-- 7. Stock Balances
CREATE TABLE IF NOT EXISTS stock_balances (
  variant_id TEXT PRIMARY KEY REFERENCES variants(id) ON DELETE CASCADE,
  on_hand INTEGER NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  allocated INTEGER NOT NULL DEFAULT 0 CHECK (allocated >= 0),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 8. Stock Movements (Audit Ledger)
CREATE TABLE IF NOT EXISTS stock_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  variant_id TEXT NOT NULL REFERENCES variants(id) ON DELETE RESTRICT,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('restock', 'reserve', 'release', 'allocate', 'ship', 'adjustment')),
  quantity INTEGER NOT NULL,
  reference_id TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_movements_variant ON stock_movements(variant_id);

-- 9. Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  group_key TEXT NOT NULL,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('READY', 'PREORDER')),
  batch_id TEXT REFERENCES preorder_batches(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending_payment', 'confirmed', 'on_hold', 'cancelled', 'completed')),
  fulfillment_status TEXT NOT NULL CHECK (fulfillment_status IN ('unallocated', 'waiting_supplier', 'received_qc', 'ready_to_ship', 'shipped', 'delivered', 'returned')),
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address_json TEXT NOT NULL,
  items_json TEXT NOT NULL,
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  shipping_fee INTEGER NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  guest_access_token TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);

-- 10. Payment Obligations & Attempts
CREATE TABLE IF NOT EXISTS payment_attempts (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_reference TEXT NOT NULL,
  provider TEXT NOT NULL,
  transaction_id TEXT,
  payment_type TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (status IN ('created', 'pending', 'succeeded', 'failed', 'expired', 'cancelled')),
  snap_token TEXT,
  redirect_url TEXT,
  va_number TEXT,
  bank TEXT,
  expiry_time TEXT NOT NULL,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payment_attempts(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_attempts(status);

-- 11. Idempotency Records
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 12. Outbox Events
CREATE TABLE IF NOT EXISTS outbox_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  processed INTEGER NOT NULL DEFAULT 0 CHECK (processed IN (0, 1)),
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 13. Operational Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
