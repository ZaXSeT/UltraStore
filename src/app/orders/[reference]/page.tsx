import { getDb } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Truck, ShieldCheck, ArrowLeft } from "lucide-react";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { reference } = await params;
  const { token } = await searchParams;

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
        <h2 className="text-xl font-bold text-red-600">Akses Tidak Sah</h2>
        <p className="text-xs text-slate-500">
          Token akses tamu tidak cocok dengan data pesanan ini.
        </p>
        <Link href="/track-order" className="text-xs text-blue-600 underline">
          Minta tautan akses baru
        </Link>
      </div>
    );
  }

  const items = JSON.parse(order.items_json);
  const address = JSON.parse(order.shipping_address_json);
  const isConfirmed = order.status === "confirmed";

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Confirmation Banner */}
      <div className="bg-white border border-emerald-200/80 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              {isConfirmed ? "Pembayaran Terverifikasi & Pesanan Diterima" : "Menunggu Pembayaran"}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
              Ref: {order.reference}
            </h1>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs">
          <span className="text-slate-500 block">Waktu Pemesanan</span>
          <div className="font-semibold text-slate-800">{order.created_at}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card 1 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status Pembayaran</span>
          <div className="text-sm font-bold text-emerald-600 uppercase">
            {order.status}
          </div>
          <p className="text-xs text-slate-500">Lunas via Virtual Account</p>
        </div>

        {/* Status Card 2 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status Pemenuhan</span>
          <div className="text-sm font-bold text-slate-900 uppercase">
            {order.fulfillment_status}
          </div>
          <p className="text-xs text-slate-500">
            {order.offer_type === "READY"
              ? "Stok dialokasikan, siap dikirim"
              : "Kuota batch tercatat di supplier"}
          </p>
        </div>

        {/* Status Card 3 */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe Penawaran</span>
          <div className="text-sm font-bold text-blue-600 uppercase">
            {order.offer_type === "READY" ? "Ready Stock" : "Pre-Order"}
          </div>
          <p className="text-xs text-slate-500">
            {order.offer_type === "READY" ? "Pengiriman 1-2 hari kerja" : "Rilisan batch terjadwal"}
          </p>
        </div>
      </div>

      {/* Items & Invoice Snapshot */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Rincian Barang yang Dipesan
        </h2>

        <div className="divide-y divide-slate-100">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900 text-sm block">{it.productName}</span>
                <span className="text-slate-500">{it.variantName} (SKU: {it.sku})</span>
                <div className="text-slate-500 mt-0.5">Jumlah: {it.quantity} x {formatIdr(it.unitPrice)}</div>
              </div>
              <div className="font-bold text-slate-900 text-sm font-tabular">
                {formatIdr(it.totalPrice)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span className="text-slate-900 font-bold font-tabular">{formatIdr(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Ongkos Kirim:</span>
            <span className="text-slate-900 font-bold font-tabular">{formatIdr(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200 font-tabular">
            <span>Total Dibayar:</span>
            <span>{formatIdr(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address Snapshot */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          Alamat Pengiriman
        </h2>
        <div className="text-xs space-y-1 text-slate-700">
          <div className="font-bold text-slate-900">{address.recipientName} ({address.phoneNumber})</div>
          <div>{address.fullAddress}</div>
          <div>{address.district}, {address.city}, {address.province} {address.postalCode}</div>
          {address.notes && (
            <div className="text-slate-500 pt-1">Catatan: {address.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
