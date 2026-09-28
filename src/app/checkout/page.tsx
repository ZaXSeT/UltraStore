"use client";

import { useCart } from "../../context/CartContext";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Lock } from "lucide-react";
import Link from "next/link";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetGroupKey = searchParams.get("group") || "READY";

  const { getGroupedItems, removeItem } = useCart();
  const groups = getGroupedItems();
  const currentGroup = groups.find((g) => g.groupKey === targetGroupKey) || groups[0];

  const [formData, setFormData] = useState({
    recipientName: "Budi Santoso",
    phoneNumber: "081234567890",
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    district: "Kebayoran Baru",
    postalCode: "12180",
    fullAddress: "Jl. Senopati No. 42B, RT 01 / RW 03",
    notes: "Titip di pos security jika sedang tidak di tempat.",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!currentGroup || currentGroup.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Kelompok pesanan tidak ditemukan</h2>
        <p className="text-xs text-slate-500">
          Silakan kembali ke keranjang untuk memilih kelompok item yang ingin diproses.
        </p>
        <Link
          href="/shop"
          className="inline-block px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
        >
          Kembali ke Belanja
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupKey: currentGroup.groupKey,
          items: currentGroup.items,
          shippingAddress: formData,
          customerEmail: "pelanggan@ultrastore.id",
          customerPhone: formData.phoneNumber,
          idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pesanan");
      }

      // Remove checked out items from cart
      for (const item of currentGroup.items) {
        removeItem(item.variantId, item.offerId);
      }

      setPaymentData(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!paymentData) return;
    setIsSimulatingPayment(true);

    try {
      const res = await fetch("/api/webhooks/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderReference: paymentData.reference,
          transactionStatus: "settlement",
        }),
      });

      if (!res.ok) throw new Error("Gagal simulasi webhook bayar");

      router.push(
        `/orders/${paymentData.reference}?token=${paymentData.guestAccessToken}`
      );
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Belanja</span>
      </Link>

      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Proses Transaksi Aman
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
          Checkout Kelompok: {currentGroup.offerType === "READY" ? "Ready Stock" : "Pre-Order"}
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          {errorMsg}
        </div>
      )}

      {/* Payment Active Modal / Overlay */}
      {paymentData && (
        <div className="bg-white border-2 border-emerald-500 p-6 sm:p-10 rounded-2xl shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-emerald-700 font-bold uppercase tracking-wide">
                Invoice Telah Diterbitkan · Reservasi Stok 30 Menit
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Referensi Order: {paymentData.reference}
              </h2>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Metode Pembayaran</span>
              <span className="font-semibold text-slate-900">BCA Virtual Account (Sandbox)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Nomor Virtual Account</span>
              <span className="font-bold text-base text-blue-600 font-tabular tracking-wider">
                88019283746152
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Total Tagihan</span>
              <span className="font-bold text-slate-900 font-tabular text-sm">
                {formatIdr(paymentData.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Masa Berlaku Reservasi</span>
              <span className="font-medium text-slate-700">30 Menit (Otomatis lepas jika kedaluwarsa)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isSimulatingPayment}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSimulatingPayment ? "Memproses Webhook..." : "Simulasi Bayar Sukses (Sandbox)"}
              </span>
            </button>

            <span className="text-xs text-slate-500">
              Memverifikasi pembayaran secara server-side dan memindahkan stok ke alokasi pasti.
            </span>
          </div>
        </div>
      )}

      {!paymentData && (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Shipping Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Alamat Pengiriman Domestik
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Nama Penerima</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Nomor Handphone / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Provinsi</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Kota / Kabupaten</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Kecamatan</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5 font-semibold">Kode Pos</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 mb-1.5 font-semibold">Alamat Lengkap</label>
              <textarea
                rows={3}
                required
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
              />
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 mb-1.5 font-semibold">Catatan Pengiriman (Opsional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Summary Column (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 self-start shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Ringkasan Pembayaran
            </h2>

            <div className="space-y-3 divide-y divide-slate-100">
              {currentGroup.items.map((item) => (
                <div key={`${item.variantId}-${item.offerId}`} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <span className="font-semibold text-slate-900">{item.productName}</span>
                    <span className="text-slate-500 block truncate">{item.variantName} (x{item.quantity})</span>
                  </div>
                  <div className="font-bold text-slate-900 shrink-0 font-tabular">
                    {formatIdr(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Barang:</span>
                <span className="text-slate-900 font-bold font-tabular">{formatIdr(currentGroup.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Biaya Pengiriman:</span>
                <span className="text-slate-900 font-bold font-tabular">{formatIdr(currentGroup.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200 font-tabular">
                <span>Total Biaya:</span>
                <span>{formatIdr(currentGroup.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors ${
                currentGroup.offerType === "PREORDER"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {isSubmitting
                ? "Membuat Invoice & Reservasi..."
                : `Bayar Tagihan ${currentGroup.offerType === "PREORDER" ? "Pre-Order" : "Ready Stock"}`}
            </button>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Stok dan kuota direservasi selama 30 menit saat invoice dibuat.</p>
              <p>• Pembayaran diverifikasi server-side melalui gateway resmi.</p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs py-20 text-slate-500">Memuat sesi checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
