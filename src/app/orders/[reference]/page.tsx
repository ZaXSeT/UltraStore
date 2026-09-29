import { getDb } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { getServerLocale } from "../../../lib/server-locale";
import { copy, formatRupiah, orderStatus } from "../../../lib/locale";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { reference } = await params;
  const { token } = await searchParams;
  const locale = await getServerLocale();
  const t = (id: string, en: string) => copy(locale, id, en);

  const db = getDb();
  const order = db
    .prepare("SELECT * FROM orders WHERE reference = ?")
    .get(reference) as any;

  if (!order) {
    notFound();
  }

  // Security check: Guest token or direct access
  if (token && order.guest_access_token !== token) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">{t("Tautan Tidak Valid", "Invalid Access Link")}</h2>
        <p className="text-xs text-slate-500">
          {t("Tautan ini tidak cocok dengan pesanan yang diminta.", "This access link does not match the requested order.")}
        </p>
        <Link href="/track-order" className="text-xs text-[var(--theme-accent)] underline">
          {t("Kembali ke pelacakan", "Back to Order Tracking")}
        </Link>
      </div>
    );
  }

  const items = JSON.parse(order.items_json);
  const address = JSON.parse(order.shipping_address_json);
  const isConfirmed = order.status === "confirmed";

  const formatIdr = (val: number) => formatRupiah(val, locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[var(--theme-ink)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("Kembali ke Beranda", "Back to Home")}</span>
      </Link>

      {/* Confirmation Banner */}
      <div className="bg-[var(--theme-surface)] border border-emerald-200/80 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              {isConfirmed ? t("Pembayaran Diterima · Pesanan Dikonfirmasi", "Payment Received · Order Confirmed") : t("Menunggu Pembayaran", "Awaiting Payment")}
            </div>
            <h1 className="text-2xl font-bold text-[var(--theme-ink)] mt-0.5">
              {t("Referensi", "Reference")}: {order.reference}
            </h1>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs">
          <span className="text-slate-500 block">{t("Waktu Pemesanan", "Order Placed")}</span>
          <div className="font-semibold text-slate-800">{order.created_at}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card 1 */}
        <div className="bg-[var(--theme-surface)] border border-slate-200/80 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("Status Pembayaran", "Payment Status")}</span>
          <div className="text-sm font-bold text-emerald-600 uppercase">
            {orderStatus(order.status, locale)}
          </div>
          <p className="text-xs text-slate-500">{isConfirmed ? t("Dibayar melalui Virtual Account", "Paid by Virtual Account") : t("Pembayaran belum diterima", "Payment pending")}</p>
        </div>

        {/* Status Card 2 */}
        <div className="bg-[var(--theme-surface)] border border-slate-200/80 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("Status Pengiriman", "Fulfillment Status")}</span>
          <div className="text-sm font-bold text-[var(--theme-ink)] uppercase">
            {orderStatus(order.fulfillment_status, locale)}
          </div>
          <p className="text-xs text-slate-500">
            {order.offer_type === "READY"
              ? t("Stok dialokasikan, siap dikirim", "Stock allocated and ready to ship")
              : t("Kuota batch telah dialokasikan", "Batch capacity allocated")}
          </p>
        </div>

        {/* Status Card 3 */}
        <div className="bg-[var(--theme-surface)] border border-slate-200/80 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("Jenis Pesanan", "Order Type")}</span>
          <div className="text-sm font-bold text-[var(--theme-accent)] uppercase">
            {order.offer_type === "READY" ? t("Stok Tersedia", "In Stock") : "Pre-Order"}
          </div>
          <p className="text-xs text-slate-500">
            {order.offer_type === "READY" ? t("Dikirim dalam 1–2 hari kerja", "Ships in 1–2 business days") : t("Mengikuti jadwal batch", "Follows the batch schedule")}
          </p>
        </div>
      </div>

      {/* Items & Invoice Snapshot */}
      <div className="bg-[var(--theme-surface)] border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--theme-ink)] border-b border-slate-100 pb-3">
          {t("Rincian Pesanan", "Order Items")}
        </h2>

        <div className="divide-y divide-slate-100">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[var(--theme-ink)] text-sm block">{it.productName}</span>
                <span className="text-slate-500">{it.variantName} (SKU: {it.sku})</span>
                <div className="text-slate-500 mt-0.5">{t("Jumlah", "Qty")}: {it.quantity} × {formatIdr(it.unitPrice)}</div>
              </div>
              <div className="font-bold text-[var(--theme-ink)] text-sm font-tabular">
                {formatIdr(it.totalPrice)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span className="text-[var(--theme-ink)] font-bold font-tabular">{formatIdr(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>{t("Ongkos Kirim", "Shipping")}:</span>
            <span className="text-[var(--theme-ink)] font-bold font-tabular">{formatIdr(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[var(--theme-ink)] pt-2 border-t border-slate-200 font-tabular">
            <span>{t("Total Pembayaran", "Order Total")}:</span>
            <span>{formatIdr(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address Snapshot */}
      <div className="bg-[var(--theme-surface)] border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--theme-ink)] border-b border-slate-100 pb-3">
          {t("Alamat Pengiriman", "Shipping Address")}
        </h2>
        <div className="text-xs space-y-1 text-slate-700">
          <div className="font-bold text-[var(--theme-ink)]">{address.recipientName} ({address.phoneNumber})</div>
          <div>{address.fullAddress}</div>
          <div>{address.district}, {address.city}, {address.province} {address.postalCode}</div>
          {address.notes && (
            <div className="text-slate-500 pt-1">{t("Catatan", "Notes")}: {address.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
