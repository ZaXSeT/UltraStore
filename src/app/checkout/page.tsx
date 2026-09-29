"use client";

import { useCart } from "../../context/CartContext";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { formatRupiah } from "../../lib/locale";

function CheckoutContent() {
  const { locale, t } = useLanguage();
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

  const formatIdr = (val: number) => formatRupiah(val, locale);

  if (!currentGroup || currentGroup.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 font-mono">
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--theme-ink)]">{t("Tidak Ada Kelompok Pesanan", "No Order Group Selected")}</h2>
        <p className="text-xs text-neutral-500">
          {t("Pilih kelompok produk dari keranjang untuk melanjutkan pembayaran.", "Choose a group from your cart to continue to checkout.")}
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
        >
          {t("Kembali ke Katalog", "Back to Shop")}
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
        throw new Error(t("Gagal membuat pesanan. Silakan coba lagi.", "We couldn't place your order. Please try again."));
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

      if (!res.ok) throw new Error(t("Simulasi pembayaran gagal.", "Payment simulation failed."));

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-[var(--theme-ink)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t("Kembali ke Katalog", "Back to Shop")}</span>
      </Link>

      <div className="border-b border-neutral-200/90 pb-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
          {t("PEMBAYARAN PESANAN", "SECURE CHECKOUT")}
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--theme-ink)] mt-1">
          {t("Checkout", "Checkout")}: {currentGroup.offerType === "READY" ? t("Stok Tersedia", "In-Stock Items") : "Pre-Order"}
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-mono text-xs">
          {errorMsg}
        </div>
      )}

      {/* Payment Active Modal / Overlay */}
      {paymentData && (
        <div className="bg-[var(--theme-surface)] border-2 border-emerald-500 p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs text-emerald-700 font-bold uppercase tracking-wider">
                {t("Tagihan Dibuat · Batas Pembayaran 30 Menit", "Invoice Ready · 30-Minute Payment Window")}
              </span>
              <h2 className="text-xl font-bold font-mono text-[var(--theme-ink)] mt-0.5">
                {t("Referensi", "Reference")}: {paymentData.reference}
              </h2>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 border border-neutral-200 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500 uppercase">{t("Metode Pembayaran", "Payment Method")}</span>
              <span className="font-bold text-[var(--theme-ink)]">BCA Virtual Account (Sandbox)</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500 uppercase">{t("Nomor Virtual Account", "Virtual Account Number")}</span>
              <span className="font-bold text-base text-[var(--theme-accent)] font-tabular tracking-wider">
                88019283746152
              </span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500 uppercase">{t("Total Pembayaran", "Amount Due")}</span>
              <span className="font-bold text-[var(--theme-ink)] font-tabular text-sm">
                {formatIdr(paymentData.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span className="uppercase">{t("Batas Waktu", "Payment Window")}</span>
              <span className="font-medium text-neutral-700">{t("30 menit (otomatis berakhir)", "30 minutes (expires automatically)")}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isSimulatingPayment}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSimulatingPayment ? t("Memproses pembayaran...", "Processing payment...") : t("Simulasikan Pembayaran Berhasil (Sandbox)", "Simulate Successful Payment (Sandbox)")}
              </span>
            </button>

            <span className="font-mono text-[11px] text-neutral-500">
              {t("Simulasi ini mengonfirmasi pesanan dan mengalokasikan stok yang dipesan.", "This simulation confirms the order and allocates reserved stock.")}
            </span>
          </div>
        </div>
      )}

      {!paymentData && (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping Form (7 cols) */}
          <div className="lg:col-span-7 bg-[var(--theme-surface)] border border-neutral-200/90 p-6 sm:p-8 space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--theme-ink)] border-b border-neutral-100 pb-3">
              {t("Alamat Pengiriman", "Shipping Address")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Nama Penerima", "Recipient Name")}</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Nomor Telepon / WhatsApp", "Phone / WhatsApp")}</label>
                <input
                  type="text"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Provinsi", "Province")}</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Kota / Kabupaten", "City / Regency")}</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Kecamatan", "District")}</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Kode Pos", "Postal Code")}</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
                />
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Alamat Lengkap", "Street Address")}</label>
              <textarea
                rows={3}
                required
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
              />
            </div>

            <div className="font-mono text-xs">
              <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">{t("Catatan Pengiriman (Opsional)", "Delivery Notes (Optional)")}</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[var(--theme-ink)] focus:bg-[var(--theme-surface)] focus:outline-none focus:border-[var(--theme-ink)] transition-all"
              />
            </div>
          </div>

          {/* Summary Column (5 cols) */}
          <div className="lg:col-span-5 bg-[var(--theme-surface)] border border-neutral-200/90 p-6 sm:p-8 space-y-6 self-start">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--theme-ink)] border-b border-neutral-100 pb-3">
              {t("Ringkasan Pembayaran", "Order Summary")}
            </h2>

            <div className="space-y-3 divide-y divide-neutral-100 font-mono">
              {currentGroup.items.map((item) => (
                <div key={`${item.variantId}-${item.offerId}`} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <span className="font-bold uppercase text-[var(--theme-ink)] block truncate">{item.productName}</span>
                    <span className="text-neutral-500 text-[11px] block truncate">{item.variantName} (x{item.quantity})</span>
                  </div>
                  <div className="font-bold text-[var(--theme-ink)] shrink-0 font-tabular">
                    {formatIdr(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 p-4 border border-neutral-200/90 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-500 uppercase">
                <span>{t("Subtotal Produk", "Items Subtotal")}</span>
                <span className="text-[var(--theme-ink)] font-bold font-tabular">{formatIdr(currentGroup.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 uppercase">
                <span>{t("Ongkos Kirim", "Shipping")}</span>
                <span className="text-[var(--theme-ink)] font-bold font-tabular">{formatIdr(currentGroup.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[var(--theme-ink)] pt-2 border-t border-neutral-200 font-tabular uppercase">
                <span>{t("Total Pembayaran", "Total Due")}</span>
                <span>{formatIdr(currentGroup.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting
                ? t("Membuat Tagihan...", "Creating Invoice...")
                : `${t("Lanjutkan Pembayaran", "Continue to Payment")} · ${currentGroup.offerType === "PREORDER" ? "Pre-Order" : t("Stok Tersedia", "In Stock")}`}
            </button>

            <div className="font-mono text-[11px] text-neutral-400 space-y-1">
              <p>• {t("Stok dicadangkan selama 30 menit setelah tagihan dibuat.", "Stock is reserved for 30 minutes after the invoice is created.")}</p>
              <p>• {t("Total pesanan diperiksa oleh server.", "Your order total is verified by the server.")}</p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="text-center text-xs py-20 text-slate-500">{t("Memuat checkout...", "Loading checkout...")}</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
