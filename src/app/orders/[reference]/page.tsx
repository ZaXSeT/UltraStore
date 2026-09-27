import { getDb } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Truck, ShieldCheck, Printer, ArrowLeft } from "lucide-react";

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
        <h2 className="text-xl font-bold text-[#A12D2D]">Akses Tidak Sah</h2>
        <p className="text-xs text-[#59635E]">
          Token akses tamu tidak cocok dengan data pesanan ini.
        </p>
        <Link href="/track-order" className="text-xs font-mono underline text-[#184E46]">
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
        className="inline-flex items-center gap-2 text-xs font-mono text-[#59635E] hover:text-[#202724]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Confirmation Banner */}
      <div className="bg-[#FFFFFF] border border-[#184E46]/30 p-6 sm:p-8 rounded shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E4ECE6] flex items-center justify-center text-[#184E46] shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-[#184E46] uppercase">
              {isConfirmed ? "Pembayaran Terverifikasi & Pesanan Diterima" : "Menunggu Pembayaran"}
            </div>
            <h1 className="text-2xl font-bold text-[#202724] font-mono mt-0.5">
              Ref: {order.reference}
            </h1>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-[#59635E]">Waktu Pemesanan:</span>
          <div className="font-bold text-[#202724]">{order.created_at}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card 1 */}
        <div className="bg-[#FFFFFF] border border-[#D9DDD5] p-5 rounded space-y-1">
          <span className="text-xs font-mono uppercase text-[#59635E]">Status Pembayaran</span>
          <div className="text-sm font-bold text-[#184E46] font-mono uppercase">
            {order.status}
          </div>
          <p className="text-[11px] text-[#59635E]">Lunas melalui Virtual Account / Webhook</p>
        </div>

        {/* Status Card 2 */}
        <div className="bg-[#FFFFFF] border border-[#D9DDD5] p-5 rounded space-y-1">
          <span className="text-xs font-mono uppercase text-[#59635E]">Status Pemenuhan</span>
          <div className="text-sm font-bold text-[#202724] font-mono uppercase">
            {order.fulfillment_status}
          </div>
          <p className="text-[11px] text-[#59635E]">
            {order.offer_type === "READY"
              ? "Stok dialokasikan, siap dipacking"
              : "Kuota batch dicatat, menunggu jadwal pabrik"}
          </p>
        </div>

        {/* Status Card 3 */}
        <div className="bg-[#FFFFFF] border border-[#D9DDD5] p-5 rounded space-y-1">
          <span className="text-xs font-mono uppercase text-[#59635E]">Tipe Penawaran</span>
          <div className="text-sm font-bold text-[#A84329] font-mono uppercase">
            {order.offer_type}
          </div>
          <p className="text-[11px] text-[#59635E]">
            {order.offer_type === "READY" ? "Pengiriman reguler 1-2 hari" : "Rilisan batch PO"}
          </p>
        </div>
      </div>

      {/* Items & Invoice Snapshot */}
      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-[#202724] border-b border-[#D9DDD5] pb-3">
          Rincian Barang yang Dipesan
        </h2>

        <div className="divide-y divide-[#D9DDD5]/60">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-[#202724] text-sm block">{it.productName}</span>
                <span className="text-[#59635E]">{it.variantName} (SKU: {it.sku})</span>
                <div className="text-[#59635E] mt-0.5">Jumlah: {it.quantity} x {formatIdr(it.unitPrice)}</div>
              </div>
              <div className="font-bold text-[#202724] text-sm">
                {formatIdr(it.totalPrice)}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#F4F1EA] p-4 rounded border border-[#D9DDD5] space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[#59635E]">
            <span>Subtotal:</span>
            <span className="text-[#202724] font-bold">{formatIdr(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#59635E]">
            <span>Ongkos Kirim:</span>
            <span className="text-[#202724] font-bold">{formatIdr(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#202724] pt-2 border-t border-[#D9DDD5]">
            <span>Total Dibayar:</span>
            <span>{formatIdr(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address Snapshot */}
      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-[#202724] border-b border-[#D9DDD5] pb-3">
          Snapshot Alamat Penerima
        </h2>
        <div className="text-xs font-mono space-y-1 text-[#202724]">
          <div className="font-bold">{address.recipientName} ({address.phoneNumber})</div>
          <div>{address.fullAddress}</div>
          <div>{address.district}, {address.city}, {address.province} {address.postalCode}</div>
          {address.notes && (
            <div className="text-[#59635E] pt-1">Catatan: {address.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
