"use client";

import { useCart } from "../../context/CartContext";
import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, QrCode, Lock } from "lucide-react";
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
        <h2 className="text-xl font-bold text-[#202724]">Kelompok pesanan tidak ditemukan</h2>
        <p className="text-xs text-[#59635E]">
          Silakan kembali ke keranjang untuk memilih kelompok item yang ingin diproses.
        </p>
        <Link
          href="/cart"
          className="inline-block px-5 py-2.5 bg-[#184E46] text-white text-xs font-mono font-bold rounded"
        >
          Kembali ke Keranjang
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
        href="/cart"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#59635E] hover:text-[#202724]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Keranjang</span>
      </Link>

      <div className="border-b border-[#D9DDD5] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#59635E]">
          Proses Transaksi Aman
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[#202724] mt-1">
          Checkout Kelompok: {currentGroup.offerType === "READY" ? "Ready Stock" : "Pre-Order"}
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#A12D2D]/10 border border-[#A12D2D]/40 text-[#A12D2D] rounded text-xs font-mono">
          {errorMsg}
        </div>
      )}

      {/* Payment Active Modal / Overlay */}
      {paymentData && (
        <div className="bg-[#FFFFFF] border-2 border-[#184E46] p-6 sm:p-10 rounded shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E4ECE6] flex items-center justify-center text-[#184E46]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-[#184E46] font-bold uppercase">
                Invoice Telah Diterbitkan & Stok Direservasi (30 Menit)
              </span>
              <h2 className="text-xl font-bold text-[#202724] font-mono">
                Order Ref: {paymentData.reference}
              </h2>
            </div>
          </div>

          <div className="bg-[#F4F1EA] p-5 rounded border border-[#D9DDD5] space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-[#D9DDD5] pb-2">
              <span className="text-[#59635E]">Metode Pembayaran</span>
              <span className="font-bold text-[#202724]">BCA Virtual Account (Sandbox)</span>
            </div>
            <div className="flex justify-between border-b border-[#D9DDD5] pb-2">
              <span className="text-[#59635E]">Nomor VA</span>
              <span className="font-bold text-base text-[#184E46] tracking-wider">
                88019283746152
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D9DDD5] pb-2">
              <span className="text-[#59635E]">Total Tagihan</span>
              <span className="font-bold text-[#202724]">
                {formatIdr(paymentData.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-[#59635E]">
              <span>Masa Berlaku Reservasi</span>
              <span>30 Menit (Otomatis lepas jika kedaluwarsa)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isSimulatingPayment}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#184E46] text-white text-xs font-mono font-bold uppercase tracking-wider rounded hover:bg-[#123d37] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSimulatingPayment ? "Memproses Webhook..." : "Simulasi Bayar Sukses (Sandbox)"}
              </span>
            </button>

            <span className="text-xs text-[#59635E] font-mono">
              Memverifikasi pembayaran secara server-side dan memindahkan stok ke alokasi pasti.
            </span>
          </div>
        </div>
      )}

      {!paymentData && (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Shipping Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-[#202724] border-b border-[#D9DDD5] pb-3">
              Alamat Pengiriman Domestik
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-[#59635E] mb-1 font-bold">Nama Penerima</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724] focus:outline-none focus:border-[#184E46]"
                />
              </div>

              <div>
                <label className="block text-[#59635E] mb-1 font-bold">Nomor Handphone / WA</label>
                <input
                  type="text"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724] focus:outline-none focus:border-[#184E46]"
                />
              </div>

              <div>
                <label className="block text-[#59635E] mb-1 font-bold">Provinsi</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724]"
                />
              </div>

              <div>
                <label className="block text-[#59635E] mb-1 font-bold">Kota / Kabupaten</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724]"
                />
              </div>

              <div>
                <label className="block text-[#59635E] mb-1 font-bold">Kecamatan</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724]"
                />
              </div>

              <div>
                <label className="block text-[#59635E] mb-1 font-bold">Kode Pos</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724]"
                />
              </div>
            </div>

            <div className="text-xs font-mono">
              <label className="block text-[#59635E] mb-1 font-bold">Alamat Lengkap</label>
              <textarea
                rows={3}
                required
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724]"
              />
            </div>

            <div className="text-xs font-mono">
              <label className="block text-[#59635E] mb-1 font-bold">Catatan Pengiriman (Opsional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 bg-[#F4F1EA] border border-[#78857C] rounded text-[#202724]"
              />
            </div>
          </div>

          {/* Summary Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-6 self-start shadow-sm">
            <h2 className="text-lg font-bold text-[#202724] border-b border-[#D9DDD5] pb-3">
              Ringkasan Pembayaran
            </h2>

            <div className="space-y-3 divide-y divide-[#D9DDD5]/50">
              {currentGroup.items.map((item) => (
                <div key={`${item.variantId}-${item.offerId}`} className="pt-3 first:pt-0 flex items-center justify-between text-xs font-mono">
                  <div className="truncate pr-2">
                    <span className="font-bold text-[#202724]">{item.productName}</span>
                    <span className="text-[#59635E] block truncate">{item.variantName} (x{item.quantity})</span>
                  </div>
                  <div className="font-bold text-[#202724] shrink-0">
                    {formatIdr(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F4F1EA] p-4 rounded border border-[#D9DDD5] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#59635E]">
                <span>Subtotal Barang:</span>
                <span className="text-[#202724] font-bold">{formatIdr(currentGroup.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#59635E]">
                <span>Biaya Pengiriman:</span>
                <span className="text-[#202724] font-bold">{formatIdr(currentGroup.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#202724] pt-2 border-t border-[#D9DDD5]">
                <span>Total Biaya:</span>
                <span>{formatIdr(currentGroup.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 text-white text-xs font-mono font-bold uppercase tracking-wider rounded shadow-sm transition-colors ${
                currentGroup.offerType === "PREORDER"
                  ? "bg-[#A84329] hover:bg-[#8e3822]"
                  : "bg-[#184E46] hover:bg-[#123d37]"
              }`}
            >
              {isSubmitting
                ? "Membuat Invoice & Reservasi..."
                : `Bayar Tagihan ${currentGroup.offerType === "PREORDER" ? "Pre-Order" : "Ready Stock"}`}
            </button>

            <div className="text-[11px] font-mono text-[#59635E] space-y-1">
              <p>• Stok/kuota direservasi selama 30 menit saat invoice dibuat.</p>
              <p>• Pembayaran diverifikasi server-side melalui webhook resmi.</p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center font-mono text-xs py-20">Memuat sesi checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
