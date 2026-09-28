import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { variant_id, on_hand } = body;

    if (!variant_id || on_hand === undefined) {
      return NextResponse.json({ success: false, error: "variant_id and on_hand are required" }, { status: 400 });
    }

    const qty = Math.max(0, parseInt(on_hand, 10));
    db.prepare(`
      INSERT INTO stock_balances (variant_id, on_hand, reserved, allocated, updated_at)
      VALUES (?, ?, 0, 0, datetime('now'))
      ON CONFLICT(variant_id) DO UPDATE SET
        on_hand = excluded.on_hand,
        updated_at = datetime('now')
    `).run(variant_id, qty);

    return NextResponse.json({ success: true, message: `Stock for ${variant_id} set to ${qty}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update stock" }, { status: 500 });
  }
}
