import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const query = search
      ? `
        SELECT p.*, b.name as brand_name, c.name as category_name,
               (SELECT MIN(v.price) FROM variants v WHERE v.product_id = p.id) as min_price,
               (SELECT SUM(sb.on_hand) FROM stock_balances sb JOIN variants v ON sb.variant_id = v.id WHERE v.product_id = p.id) as total_stock
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? OR b.name LIKE ?
        ORDER BY p.created_at DESC
        LIMIT 50
      `
      : `
        SELECT p.*, b.name as brand_name, c.name as category_name,
               (SELECT MIN(v.price) FROM variants v WHERE v.product_id = p.id) as min_price,
               (SELECT SUM(sb.on_hand) FROM stock_balances sb JOIN variants v ON sb.variant_id = v.id WHERE v.product_id = p.id) as total_stock
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
        LIMIT 50
      `;

    const products = search
      ? db.prepare(query).all(`%${search}%`, `%${search}%`)
      : db.prepare(query).all();

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { name, brand_id, category_id, price, stock, primary_image, is_preorder } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const prodId = `prod_${Date.now()}`;
    const variantId = `var_${Date.now()}`;
    const brand = brand_id || "brd_other";
    const category = category_id || "cat_pad";
    const priceIdr = Number(price) || 1500000;
    const stockQty = Number(stock) || 10;
    const imgUrl = primary_image || "";

    db.prepare(`
      INSERT INTO products (id, slug, name, brand_id, category_id, description, specs_json, box_contents_json, warranty_info, published, primary_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      prodId,
      slug,
      name,
      brand,
      category,
      `Official verified hardware ${name}. Distributed by UltraStore Central Hub.`,
      JSON.stringify({ Official: "Authentic Original" }),
      JSON.stringify(["1x " + name, "1x Manual & Warranty"]),
      "Garansi resmi 1 tahun toko UltraStore.",
      imgUrl
    );

    db.prepare(`
      INSERT INTO variants (id, product_id, sku, name, part_number, attributes_json, price, weight_grams, media_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      variantId,
      prodId,
      `SKU-${slug.slice(0, 15).toUpperCase()}`,
      "Standard Edition",
      null,
      JSON.stringify({ edition: "Standard" }),
      priceIdr,
      500,
      JSON.stringify([{ url: imgUrl, alt: name, isPrimary: true }])
    );

    db.prepare(`
      INSERT INTO stock_balances (variant_id, on_hand, reserved, allocated)
      VALUES (?, ?, 0, 0)
    `).run(variantId, stockQty);

    db.prepare(`
      INSERT INTO offers (id, variant_id, offer_type, price, status, batch_id, estimated_shipping)
      VALUES (?, ?, ?, ?, 'active', null, '1-2 hari kerja')
    `).run(`off_${variantId}`, variantId, is_preorder ? "PREORDER" : "READY", priceIdr);

    return NextResponse.json({ success: true, message: "Product created successfully", id: prodId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    const variants = db.prepare("SELECT id FROM variants WHERE product_id = ?").all(id) as { id: string }[];
    for (const v of variants) {
      db.prepare("DELETE FROM offers WHERE variant_id = ?").run(v.id);
      db.prepare("DELETE FROM stock_balances WHERE variant_id = ?").run(v.id);
    }
    db.prepare("DELETE FROM variants WHERE product_id = ?").run(id);
    db.prepare("DELETE FROM products WHERE id = ?").run(id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { id, name, description, description_en, primary_image, published } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      params.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }
    if (description_en !== undefined) {
      updates.push("description_en = ?");
      params.push(description_en);
    }
    if (primary_image !== undefined) {
      updates.push("primary_image = ?");
      params.push(primary_image);
    }
    if (published !== undefined) {
      updates.push("published = ?");
      params.push(published ? 1 : 0);
    }

    if (body.stock !== undefined) {
      const stockQty = Number(body.stock) || 0;
      db.prepare(`
        UPDATE stock_balances
        SET on_hand = ?
        WHERE variant_id IN (SELECT id FROM variants WHERE product_id = ?)
      `).run(stockQty, id);
    }

    if (updates.length === 0 && body.stock === undefined) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    params.push(id);

    db.prepare(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`).run(...params);

    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update product" }, { status: 500 });
  }
}
