import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { resolveR2ImageUrl } from "@/lib/image-url";
import { translateCopy, TranslationError } from "@/lib/translate-copy";
import { isAdminTranslationRequest } from "@/lib/admin-translation-request";

function validSpecs(value: unknown): value is Record<string, string> {
  return !!value && typeof value === "object" && !Array.isArray(value) && Object.entries(value).every(([key, entry]) => key.trim() && typeof entry === "string");
}

function validBoxContents(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string" && entry.trim());
}

export async function GET(req: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const variantsFor = searchParams.get("variantsFor");
    if (variantsFor) {
      const variants = db.prepare(`
        SELECT v.id, v.name, v.sku, v.price, COALESCE(sb.on_hand, 0) AS stock
        FROM variants v LEFT JOIN stock_balances sb ON sb.variant_id = v.id
        WHERE v.product_id = ? ORDER BY v.name
      `).all(variantsFor);
      return NextResponse.json({ success: true, variants });
    }
    const search = searchParams.get("search") || "";

    const query = search
      ? `
        SELECT p.*, b.name as brand_name, c.name as category_name,
               (SELECT MIN(v.price) FROM variants v WHERE v.product_id = p.id) as min_price,
               (SELECT SUM(sb.on_hand) FROM stock_balances sb JOIN variants v ON sb.variant_id = v.id WHERE v.product_id = p.id) as total_stock,
               (SELECT COUNT(*) FROM variants v WHERE v.product_id = p.id) as variant_count
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? OR b.name LIKE ?
        ORDER BY p.created_at DESC
      `
      : `
        SELECT p.*, b.name as brand_name, c.name as category_name,
               (SELECT MIN(v.price) FROM variants v WHERE v.product_id = p.id) as min_price,
               (SELECT SUM(sb.on_hand) FROM stock_balances sb JOIN variants v ON sb.variant_id = v.id WHERE v.product_id = p.id) as total_stock,
               (SELECT COUNT(*) FROM variants v WHERE v.product_id = p.id) as variant_count
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
      `;

    const products = search
      ? db.prepare(query).all(`%${search}%`, `%${search}%`)
      : db.prepare(query).all();

    const brands = db.prepare("SELECT id, name FROM brands ORDER BY name").all();
    const categories = db.prepare("SELECT id, name FROM categories ORDER BY name").all();
    return NextResponse.json({
      success: true,
      products: products.map((product: any) => ({
        ...product,
        primary_image: resolveR2ImageUrl(product.primary_image),
      })),
      brands,
      categories,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { name, brand_id, category_id, price, stock, primary_image, is_preorder, description, description_en, published, specs, box_contents, warranty_info, warranty_info_en } = body;

    if (typeof name !== "string" || !name.trim() || !brand_id || !category_id || !Number.isSafeInteger(Number(price)) || Number(price) < 0 || !Number.isSafeInteger(Number(stock)) || Number(stock) < 0) {
      return NextResponse.json({ success: false, error: "Name, brand, category, non-negative price and stock are required." }, { status: 400 });
    }
    if (published && (typeof description !== "string" || !description.trim() || typeof primary_image !== "string" || !primary_image.trim() || Number(price) <= 0)) {
      return NextResponse.json({ success: false, error: "Tambahkan deskripsi Indonesia, gambar, dan harga di atas nol sebelum menerbitkan produk." }, { status: 400 });
    }
    if ((specs !== undefined && !validSpecs(specs)) || (box_contents !== undefined && !validBoxContents(box_contents))) {
      return NextResponse.json({ success: false, error: "Invalid specifications or box contents." }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const prodId = `prod_${Date.now()}`;
    const variantId = `var_${Date.now()}`;
    const brand = brand_id;
    const category = category_id;
    const priceIdr = Number(price);
    const stockQty = Number(stock);
    const imgUrl = resolveR2ImageUrl(primary_image || "");
    let englishDescription = typeof description_en === "string" ? description_en : "";
    let englishWarranty = typeof warranty_info_en === "string" ? warranty_info_en : "";
    const fieldsToTranslate = {
      ...(!englishDescription.trim() && typeof description === "string" && description.trim() ? { description } : {}),
      ...(!englishWarranty.trim() && typeof warranty_info === "string" && warranty_info.trim() ? { warranty_info } : {}),
    };
    if (Object.keys(fieldsToTranslate).length && process.env.OPENAI_API_KEY && isAdminTranslationRequest(req)) {
      const translated = await translateCopy(`Product: ${name.slice(0, 180)}`, fieldsToTranslate);
      englishDescription = translated.description || englishDescription;
      englishWarranty = translated.warranty_info || englishWarranty;
    }
    if (published && !englishDescription.trim()) {
      return NextResponse.json({ success: false, error: "Terjemahan Inggris belum tersedia. Atur OPENAI_API_KEY agar deskripsi dapat dibuat otomatis sebelum publish." }, { status: 503 });
    }

    db.exec("BEGIN");
    try {
    db.prepare(`
      INSERT INTO products (id, slug, name, brand_id, category_id, description, description_en, specs_json, box_contents_json, warranty_info, warranty_info_en, published, primary_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      prodId,
      slug,
      name,
      brand,
      category,
      typeof description === "string" ? description : "",
      englishDescription,
      JSON.stringify(specs || {}),
      JSON.stringify(box_contents || []),
      typeof warranty_info === "string" ? warranty_info : "",
      englishWarranty,
      published ? 1 : 0,
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
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }

    return NextResponse.json({ success: true, message: "Product created successfully", id: prodId, translationPending: Boolean(description && !englishDescription) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to create product" }, { status: err instanceof TranslationError ? err.status : 500 });
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

    db.exec("BEGIN");
    try {
      const variants = db.prepare("SELECT id FROM variants WHERE product_id = ?").all(id) as { id: string }[];
      for (const v of variants) {
        db.prepare("DELETE FROM offers WHERE variant_id = ?").run(v.id);
        db.prepare("DELETE FROM stock_balances WHERE variant_id = ?").run(v.id);
      }
      db.prepare("DELETE FROM variants WHERE product_id = ?").run(id);
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { id, name, description, description_en, primary_image, published, brand_id, category_id, specs, box_contents, warranty_info, warranty_info_en } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }

    if (body.variant_id) {
      const variant = db.prepare("SELECT id FROM variants WHERE id = ? AND product_id = ?").get(body.variant_id, id);
      if (!variant) return NextResponse.json({ success: false, error: "Variant not found for this product." }, { status: 404 });
      if (!Number.isSafeInteger(Number(body.price)) || Number(body.price) < 0 || !Number.isSafeInteger(Number(body.stock)) || Number(body.stock) < 0) {
        return NextResponse.json({ success: false, error: "Price and stock must be non-negative whole numbers." }, { status: 400 });
      }
      db.exec("BEGIN");
      try {
        db.prepare("UPDATE variants SET price = ? WHERE id = ?").run(Number(body.price), body.variant_id);
        db.prepare("UPDATE offers SET price = ? WHERE variant_id = ?").run(Number(body.price), body.variant_id);
        db.prepare("UPDATE stock_balances SET on_hand = ? WHERE variant_id = ?").run(Number(body.stock), body.variant_id);
        db.prepare("UPDATE products SET updated_at = datetime('now') WHERE id = ?").run(id);
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      return NextResponse.json({ success: true, message: "Variant updated successfully" });
    }

    const current = db.prepare(`
        SELECT p.description, p.description_en, p.warranty_info, p.warranty_info_en, p.primary_image, p.published,
               (SELECT MIN(v.price) FROM variants v WHERE v.product_id = p.id) AS min_price
        FROM products p WHERE p.id = ?
      `).get(id) as { description: string; description_en: string; warranty_info: string; warranty_info_en: string; primary_image: string; published: number; min_price: number | null } | undefined;
    if (!current) return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    const nextDescription = description === undefined ? current.description : description;
    let nextDescriptionEn = description_en === undefined ? current.description_en : description_en;
    const nextWarranty = warranty_info === undefined ? current.warranty_info : warranty_info;
    let nextWarrantyEn = warranty_info_en === undefined ? current.warranty_info_en : warranty_info_en;
    if (description !== undefined && description !== current.description && description_en === undefined) nextDescriptionEn = "";
    if (warranty_info !== undefined && warranty_info !== current.warranty_info && warranty_info_en === undefined) nextWarrantyEn = "";

    const fieldsToTranslate = {
      ...(!nextDescriptionEn?.trim() && typeof nextDescription === "string" && nextDescription.trim() && (description !== undefined || published === true || published === 1) ? { description: nextDescription } : {}),
      ...(!nextWarrantyEn?.trim() && typeof nextWarranty === "string" && nextWarranty.trim() && warranty_info !== undefined ? { warranty_info: nextWarranty } : {}),
    };
    if (Object.keys(fieldsToTranslate).length && process.env.OPENAI_API_KEY && isAdminTranslationRequest(req)) {
      const translated = await translateCopy(`Product: ${String(name || id).slice(0, 180)}`, fieldsToTranslate);
      nextDescriptionEn = translated.description || nextDescriptionEn;
      nextWarrantyEn = translated.warranty_info || nextWarrantyEn;
    }

    if (published === true || published === 1) {
      const nextImage = primary_image === undefined ? current.primary_image : primary_image;
      const nextPrice = body.price === undefined ? current.min_price : Number(body.price);
      if (typeof nextDescription !== "string" || !nextDescription.trim() || typeof nextImage !== "string" || !nextImage.trim() || !nextPrice || nextPrice <= 0) {
        return NextResponse.json({ success: false, error: "Tambahkan deskripsi Indonesia, gambar, dan harga di atas nol sebelum menerbitkan produk." }, { status: 400 });
      }
      if (!nextDescriptionEn?.trim()) {
        return NextResponse.json({ success: false, error: "Terjemahan Inggris belum tersedia. Atur OPENAI_API_KEY agar deskripsi dapat dibuat otomatis sebelum publish." }, { status: 503 });
      }
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) return NextResponse.json({ success: false, error: "Product name cannot be empty." }, { status: 400 });
      updates.push("name = ?");
      params.push(name);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      params.push(description);
    }
    if (description_en !== undefined || nextDescriptionEn !== current.description_en) {
      updates.push("description_en = ?");
      params.push(nextDescriptionEn);
    }
    if (specs !== undefined) {
      if (!validSpecs(specs)) return NextResponse.json({ success: false, error: "Invalid specifications." }, { status: 400 });
      updates.push("specs_json = ?");
      params.push(JSON.stringify(specs));
    }
    if (box_contents !== undefined) {
      if (!validBoxContents(box_contents)) return NextResponse.json({ success: false, error: "Invalid box contents." }, { status: 400 });
      updates.push("box_contents_json = ?");
      params.push(JSON.stringify(box_contents));
    }
    if (warranty_info !== undefined) {
      updates.push("warranty_info = ?");
      params.push(warranty_info);
    }
    if (warranty_info_en !== undefined || nextWarrantyEn !== current.warranty_info_en) {
      updates.push("warranty_info_en = ?");
      params.push(nextWarrantyEn);
    }
    if (primary_image !== undefined) {
      updates.push("primary_image = ?");
      params.push(resolveR2ImageUrl(primary_image));
    }
    if (published !== undefined) {
      updates.push("published = ?");
      params.push(published ? 1 : 0);
    }
    if (brand_id !== undefined) {
      updates.push("brand_id = ?");
      params.push(brand_id);
    }
    if (category_id !== undefined) {
      updates.push("category_id = ?");
      params.push(category_id);
    }

    if (body.price !== undefined || body.stock !== undefined) {
      const count = db.prepare("SELECT COUNT(*) AS count FROM variants WHERE product_id = ?").get(id) as { count: number };
      if (count.count !== 1) return NextResponse.json({ success: false, error: "Edit stock and price per variant for products with multiple variants." }, { status: 400 });
    }
    if (body.price !== undefined && (!Number.isSafeInteger(Number(body.price)) || Number(body.price) < 0)) {
      return NextResponse.json({ success: false, error: "Price must be a non-negative whole number." }, { status: 400 });
    }
    if (body.stock !== undefined && (!Number.isSafeInteger(Number(body.stock)) || Number(body.stock) < 0)) {
      return NextResponse.json({ success: false, error: "Stock must be a non-negative whole number." }, { status: 400 });
    }

    if (body.stock !== undefined) {
      const stockQty = Number(body.stock);
      db.prepare(`
        UPDATE stock_balances
        SET on_hand = ?
        WHERE variant_id IN (SELECT id FROM variants WHERE product_id = ?)
      `).run(stockQty, id);
    }

    if (body.price !== undefined) {
      db.prepare("UPDATE variants SET price = ? WHERE product_id = ?").run(Number(body.price), id);
      db.prepare("UPDATE offers SET price = ? WHERE variant_id IN (SELECT id FROM variants WHERE product_id = ?)").run(Number(body.price), id);
    }

    if (updates.length === 0 && body.stock === undefined && body.price === undefined) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    params.push(id);

    db.prepare(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`).run(...params);

    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update product" }, { status: err instanceof TranslationError ? err.status : 500 });
  }
}
