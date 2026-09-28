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

export async function PATCH(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { id, name, description, primary_image, published } = body;

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
    if (primary_image !== undefined) {
      updates.push("primary_image = ?");
      params.push(primary_image);
    }
    if (published !== undefined) {
      updates.push("published = ?");
      params.push(published ? 1 : 0);
    }

    if (updates.length === 0) {
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
