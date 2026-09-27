import { NextRequest, NextResponse } from "next/server";
import { getDb, runInTransaction } from "../../../lib/db";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      groupKey,
      items,
      shippingAddress,
      customerEmail,
      customerPhone,
      idempotencyKey,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }

    if (!customerEmail || !customerPhone || !shippingAddress?.fullAddress) {
      return NextResponse.json(
        { error: "Lengkapi data pengiriman dan kontak" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check Idempotency Key
    if (idempotencyKey) {
      const existing = db
        .prepare("SELECT response_json FROM idempotency_keys WHERE key = ?")
        .get(idempotencyKey) as any;
      if (existing) {
        return NextResponse.json(JSON.parse(existing.response_json));
      }
    }

    // Atomic Transaction for Reservation & Order Generation
    const result = runInTransaction((tx) => {
      let subtotal = 0;
      const orderItems = [];

      for (const it of items) {
        const variantRow = tx
          .prepare("SELECT * FROM variants WHERE id = ?")
          .get(it.variantId) as any;
        if (!variantRow) {
          throw new Error(`Varian tidak ditemukan: ${it.variantId}`);
        }

        const isReady = it.offerType === "READY";

        if (isReady) {
          // Check stock on_hand - reserved - allocated
          const stockRow = tx
            .prepare(
              "SELECT on_hand, reserved, allocated FROM stock_balances WHERE variant_id = ?"
            )
            .get(it.variantId) as any;

          if (!stockRow) {
            throw new Error(`Saldo stok tidak terdaftar untuk SKU ${variantRow.sku}`);
          }

          const available = stockRow.on_hand - stockRow.reserved - stockRow.allocated;
          if (available < it.quantity) {
            throw new Error(
              `Stok tidak mencukupi untuk ${variantRow.name}. Tersisa: ${available}`
            );
          }

          // Atomically reserve
          tx.prepare(
            "UPDATE stock_balances SET reserved = reserved + ? WHERE variant_id = ?"
          ).run(it.quantity, it.variantId);

          tx.prepare(
            "INSERT INTO stock_movements (variant_id, movement_type, quantity, note) VALUES (?, 'reserve', ?, 'Order invoice reservation')"
          ).run(it.variantId, it.quantity);
        } else {
          // Preorder Batch check
          const batchRow = tx
            .prepare(
              "SELECT quota_total, quota_reserved, quota_committed FROM preorder_batches WHERE variant_id = ? AND status = 'open'"
            )
            .get(it.variantId) as any;

          if (!batchRow) {
            throw new Error(`Batch pre-order untuk ${variantRow.name} telah ditutup.`);
          }

          const availableQuota =
            batchRow.quota_total - batchRow.quota_reserved - batchRow.quota_committed;
          if (availableQuota < it.quantity) {
            throw new Error(
              `Sisa kuota batch tidak cukup untuk ${variantRow.name}. Tersisa: ${availableQuota}`
            );
          }

          // Atomically reserve quota
          tx.prepare(
            "UPDATE preorder_batches SET quota_reserved = quota_reserved + ? WHERE variant_id = ?"
          ).run(it.quantity, it.variantId);
        }

        const lineTotal = it.price * it.quantity;
        subtotal += lineTotal;
        orderItems.push({
          variantId: it.variantId,
          productName: it.productName,
          variantName: it.variantName,
          sku: variantRow.sku,
          quantity: it.quantity,
          unitPrice: it.price,
          totalPrice: lineTotal,
        });
      }

      const shippingFee = 25000;
      const totalAmount = subtotal + shippingFee;
      const orderId = `ord_${crypto.randomUUID()}`;
      const reference = `UST-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
      const guestAccessToken = crypto.randomBytes(24).toString("hex");

      tx.prepare(`
        INSERT INTO orders (
          id, reference, group_key, offer_type, batch_id, status, fulfillment_status,
          customer_email, customer_phone, shipping_address_json, items_json,
          subtotal, shipping_fee, total_amount, guest_access_token
        ) VALUES (?, ?, ?, ?, ?, 'pending_payment', 'unallocated', ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderId,
        reference,
        groupKey,
        items[0].offerType,
        items[0].batchId || null,
        customerEmail,
        customerPhone,
        JSON.stringify(shippingAddress),
        JSON.stringify(orderItems),
        subtotal,
        shippingFee,
        totalAmount,
        guestAccessToken
      );

      // Create Payment Attempt (Sandbox Mock / Midtrans-compatible)
      const attemptId = `pay_${crypto.randomUUID()}`;
      const expiry = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins expiry

      tx.prepare(`
        INSERT INTO payment_attempts (
          id, order_id, order_reference, provider, amount, status,
          snap_token, va_number, bank, expiry_time
        ) VALUES (?, ?, ?, 'mock_sandbox', ?, 'pending', ?, '88019283746152', 'BCA', ?)
      `).run(
        attemptId,
        orderId,
        reference,
        totalAmount,
        `SNAP-TOKEN-${reference}`,
        expiry
      );

      return {
        orderId,
        reference,
        guestAccessToken,
        totalAmount,
        expiryTime: expiry,
        paymentAttempt: {
          id: attemptId,
          provider: "mock_sandbox",
          amount: totalAmount,
          vaNumber: "88019283746152",
          bank: "BCA Virtual Account",
          expiryTime: expiry,
        },
      };
    });

    if (idempotencyKey) {
      db.prepare(
        "INSERT INTO idempotency_keys (key, resource_type, resource_id, response_json) VALUES (?, 'order', ?, ?)"
      ).run(idempotencyKey, result.orderId, JSON.stringify(result));
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal memproses pesanan" },
      { status: 400 }
    );
  }
}
