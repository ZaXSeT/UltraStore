import { NextRequest, NextResponse } from "next/server";
import { getDb, runInTransaction } from "../../../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderReference, transactionStatus } = body;

    if (!orderReference) {
      return NextResponse.json({ error: "orderReference diperlukan" }, { status: 400 });
    }

    const db = getDb();
    const order = db
      .prepare("SELECT * FROM orders WHERE reference = ?")
      .get(orderReference) as any;

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (order.status === "confirmed") {
      // Idempotent: already confirmed
      return NextResponse.json({ message: "Pesanan sudah berstatus confirmed sebelumnya." });
    }

    if (transactionStatus === "settlement" || transactionStatus === "paid" || transactionStatus === "capture") {
      runInTransaction((tx) => {
        // 1. Mark payment attempt succeeded
        tx.prepare(`
          UPDATE payment_attempts
          SET status = 'succeeded', paid_at = datetime('now')
          WHERE order_reference = ?
        `).run(orderReference);

        const items = JSON.parse(order.items_json);
        const isReady = order.offer_type === "READY";

        // 2. Transition stock / quota
        for (const item of items) {
          if (isReady) {
            // Move reserved to allocated
            tx.prepare(`
              UPDATE stock_balances
              SET reserved = reserved - ?, allocated = allocated + ?
              WHERE variant_id = ?
            `).run(item.quantity, item.quantity, item.variantId);

            tx.prepare(`
              INSERT INTO stock_movements (variant_id, movement_type, quantity, reference_id, note)
              VALUES (?, 'allocate', ?, ?, 'Payment settled: reserved -> allocated')
            `).run(item.variantId, item.quantity, order.id);
          } else {
            // Move quota_reserved to quota_committed
            tx.prepare(`
              UPDATE preorder_batches
              SET quota_reserved = quota_reserved - ?, quota_committed = quota_committed + ?
              WHERE variant_id = ?
            `).run(item.quantity, item.quantity, item.variantId);
          }
        }

        // 3. Mark order confirmed
        const nextFulfillment = isReady ? "ready_to_ship" : "waiting_supplier";
        tx.prepare(`
          UPDATE orders
          SET status = 'confirmed', fulfillment_status = ?
          WHERE reference = ?
        `).run(nextFulfillment, orderReference);
      });

      return NextResponse.json({
        success: true,
        orderReference,
        status: "confirmed",
      });
    }

    return NextResponse.json({ message: "Status diterima tanpa mutasi" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
