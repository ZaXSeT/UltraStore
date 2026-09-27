import { getDb, runInTransaction } from "./db.ts";
import type { Product, ProductVariant, Offer, PreorderBatch, StockBalance } from "./types.ts";
import catalogResearch from "../data/catalog-research.json" with { type: "json" };

export function seedCatalogIfEmpty() {
  const db = getDb();
  const countRow = db.prepare("SELECT count(*) as count FROM products").get() as { count: number };
  if (countRow.count > 0) return;

  runInTransaction((tx) => {
    // 1. Seed Categories
    const categories = [
      { id: "cat_kbd", name: "Keyboard", slug: "keyboard", desc: "Mechanical, Hall Effect, custom kits, keycaps" },
      { id: "cat_mou", name: "Mouse", slug: "mouse", desc: "Ultralight, optical sensor, ergonomic & symmetrical" },
      { id: "cat_aud", name: "Audio", slug: "audio", desc: "Reference open-back, studio monitor, DAC/Amp" },
      { id: "cat_dsk", name: "Desk Gear", slug: "desk-gear", desc: "Precision mousepads, desk mats, accessories" },
    ];
    const catStmt = tx.prepare("INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)");
    for (const c of categories) {
      catStmt.run(c.id, c.name, c.slug, c.desc);
    }

    // 2. Seed Brands
    const brands = [
      { id: "brd_keychron", name: "Keychron", slug: "keychron", country: "Hong Kong", url: "https://www.keychron.com" },
      { id: "brd_wooting", name: "Wooting", slug: "wooting", country: "Netherlands", url: "https://wooting.io" },
      { id: "brd_logitechg", name: "Logitech G", slug: "logitech-g", country: "Switzerland", url: "https://www.logitechg.com" },
      { id: "brd_pulsar", name: "Pulsar", slug: "pulsar", country: "Korea", url: "https://www.pulsar.gg" },
      { id: "brd_sennheiser", name: "Sennheiser", slug: "sennheiser", country: "Germany", url: "https://www.sennheiser-hearing.com" },
      { id: "brd_artisan", name: "ARTISAN", slug: "artisan", country: "Japan", url: "https://www.artisan-jp.com" },
    ];
    const brdStmt = tx.prepare("INSERT INTO brands (id, name, slug, country, official_url) VALUES (?, ?, ?, ?, ?)");
    for (const b of brands) {
      brdStmt.run(b.id, b.name, b.slug, b.country, b.url);
    }

    // 3. Seed Products, Variants, Stock, Offers, and Batches
    const prodStmt = tx.prepare(`
      INSERT INTO products (id, slug, name, brand_id, category_id, description, specs_json, box_contents_json, warranty_info, published, primary_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const varStmt = tx.prepare(`
      INSERT INTO variants (id, product_id, sku, name, part_number, attributes_json, price, weight_grams, media_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const stockStmt = tx.prepare(`
      INSERT INTO stock_balances (variant_id, on_hand, reserved, allocated)
      VALUES (?, ?, ?, ?)
    `);
    const offerStmt = tx.prepare(`
      INSERT INTO offers (id, variant_id, offer_type, price, status, batch_id, estimated_shipping)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const batchStmt = tx.prepare(`
      INSERT INTO preorder_batches (id, slug, name, variant_id, status, quota_total, quota_reserved, quota_committed, eta_range, current_stage, delayed, timeline_notes_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of catalogResearch.items) {
      const brandId = brands.find((b) => b.name.toLowerCase() === item.brandCanonical.toLowerCase())?.id || "brd_keychron";
      const catId = categories.find((c) => c.name.toLowerCase() === item.category.toLowerCase())?.id || "cat_kbd";

      prodStmt.run(
        item.id,
        item.slug,
        item.officialProductName,
        brandId,
        catId,
        `Peripheral presisi ${item.brandCanonical} ${item.manufacturerModel} dengan spesifikasi diverifikasi resmi untuk setup kerja dan gaming berkurasi tinggi.`,
        JSON.stringify(item.specs),
        JSON.stringify(["1x " + item.officialProductName, "1x Kabel USB-C Braided", "1x Quick Start Guide & Manual Garansi"]),
        "Garansi distributor resmi 1 tahun toko UltraStore.",
        1,
        item.sourceImageUrl
      );

      for (const v of item.variants as any[]) {
        const variantId = `var_${v.sku.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
        varStmt.run(
          variantId,
          item.id,
          v.sku,
          v.name,
          item.manufacturerPartNumber,
          JSON.stringify({ color: v.color, layout: v.layout, switch: v.switchType }),
          v.priceIdr,
          650,
          JSON.stringify([{ url: v.imageUrl, alt: v.name, isPrimary: true }])
        );

        if (v.offerType === "READY") {
          stockStmt.run(variantId, v.stockOnHand || 10, 0, 0);
          offerStmt.run(`off_rdy_${variantId}`, variantId, "READY", v.priceIdr, "active", null, "1-2 hari kerja");
        } else if (v.offerType === "PREORDER") {
          stockStmt.run(variantId, 0, 0, 0);
          const batchId = v.batchId || `batch_${variantId}`;
          batchStmt.run(
            batchId,
            `${item.slug}-batch-04`,
            `${item.officialProductName} - Batch Rilisan 04`,
            variantId,
            "open",
            50,
            0,
            12,
            v.estimatedShipping || "18–28 November 2026",
            "opened",
            0,
            JSON.stringify([
              { date: "2026-09-15", stage: "opened", note: "Batch dibuka untuk 50 slot produksi.", actor: "UltraStore Operations" },
              { date: "2026-09-25", stage: "supplier_production", note: "Konfirmasi slot awal masuk pabrik perakitan.", actor: "Wooting Supplier Ops" }
            ])
          );
          offerStmt.run(`off_po_${variantId}`, variantId, "PREORDER", v.priceIdr, "active", batchId, v.estimatedShipping);
        }
      }
    }
  });
}

export function getAllProducts(categorySlug?: string, offerFilter?: string): Product[] {
  seedCatalogIfEmpty();
  const db = getDb();

  let query = `
    SELECT p.*, b.name as brand_name, b.slug as brand_slug, b.country as brand_country, b.official_url as brand_url,
           c.name as cat_name, c.slug as cat_slug, c.description as cat_desc
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE p.published = 1
  `;
  const params: any[] = [];

  if (categorySlug && categorySlug !== "all") {
    query += " AND c.slug = ?";
    params.push(categorySlug);
  }

  const rows = db.prepare(query).all(...params) as any[];

  return rows.map((r) => {
    const variantsRaw = db.prepare("SELECT * FROM variants WHERE product_id = ?").all(r.id) as any[];
    const variants: ProductVariant[] = variantsRaw.map((v) => ({
      id: v.id,
      productId: v.product_id,
      sku: v.sku,
      name: v.name,
      manufacturerPartNumber: v.part_number,
      attributes: JSON.parse(v.attributes_json),
      price: v.price,
      weightGrams: v.weight_grams,
      media: JSON.parse(v.media_json),
    }));

    const offersRaw = db.prepare(`
      SELECT o.* FROM offers o
      JOIN variants v ON o.variant_id = v.id
      WHERE v.product_id = ?
    `).all(r.id) as any[];

    const offers: Offer[] = offersRaw.map((o) => ({
      id: o.id,
      variantId: o.variant_id,
      offerType: o.offer_type,
      price: o.price,
      status: o.status,
      batchId: o.batch_id,
      estimatedShipping: o.estimated_shipping,
    }));

    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      brand: { id: r.brand_id, name: r.brand_name, slug: r.brand_slug, country: r.brand_country, officialUrl: r.brand_url },
      category: { id: r.category_id, name: r.cat_name, slug: r.cat_slug, description: r.cat_desc },
      description: r.description,
      specs: JSON.parse(r.specs_json),
      boxContents: JSON.parse(r.box_contents_json),
      warrantyInfo: r.warranty_info,
      variants,
      offers,
      published: Boolean(r.published),
      primaryImage: r.primary_image,
    };
  }).filter((p) => {
    if (!offerFilter || offerFilter === "ALL") return true;
    return p.offers.some((o) => o.offerType === offerFilter);
  });
}

export function getProductBySlug(slug: string): Product | null {
  seedCatalogIfEmpty();
  const db = getDb();
  const r = db.prepare(`
    SELECT p.*, b.name as brand_name, b.slug as brand_slug, b.country as brand_country, b.official_url as brand_url,
           c.name as cat_name, c.slug as cat_slug, c.description as cat_desc
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.published = 1
  `).get(slug) as any;

  if (!r) return null;

  const variantsRaw = db.prepare("SELECT * FROM variants WHERE product_id = ?").all(r.id) as any[];
  const variants: ProductVariant[] = variantsRaw.map((v) => ({
    id: v.id,
    productId: v.product_id,
    sku: v.sku,
    name: v.name,
    manufacturerPartNumber: v.part_number,
    attributes: JSON.parse(v.attributes_json),
    price: v.price,
    weightGrams: v.weight_grams,
    media: JSON.parse(v.media_json),
  }));

  const offersRaw = db.prepare(`
    SELECT o.* FROM offers o
    JOIN variants v ON o.variant_id = v.id
    WHERE v.product_id = ?
  `).all(r.id) as any[];

  const offers: Offer[] = offersRaw.map((o) => ({
    id: o.id,
    variantId: o.variant_id,
    offerType: o.offer_type,
    price: o.price,
    status: o.status,
    batchId: o.batch_id,
    estimatedShipping: o.estimated_shipping,
  }));

  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: { id: r.brand_id, name: r.brand_name, slug: r.brand_slug, country: r.brand_country, officialUrl: r.brand_url },
    category: { id: r.category_id, name: r.cat_name, slug: r.cat_slug, description: r.cat_desc },
    description: r.description,
    specs: JSON.parse(r.specs_json),
    boxContents: JSON.parse(r.box_contents_json),
    warrantyInfo: r.warranty_info,
    variants,
    offers,
    published: Boolean(r.published),
    primaryImage: r.primary_image,
  };
}

export function getPreorderBatchBySlug(slug: string): PreorderBatch | null {
  seedCatalogIfEmpty();
  const db = getDb();
  const r = db.prepare("SELECT * FROM preorder_batches WHERE slug = ?").get(slug) as any;
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    variantId: r.variant_id,
    status: r.status,
    quotaTotal: r.quota_total,
    quotaReserved: r.quota_reserved,
    quotaCommitted: r.quota_committed,
    etaRange: r.eta_range,
    currentStage: r.current_stage,
    delayed: Boolean(r.delayed),
    timelineNotes: JSON.parse(r.timeline_notes_json),
  };
}
