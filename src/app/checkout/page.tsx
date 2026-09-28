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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 font-mono">
        <h2 className="text-xl font-black uppercase tracking-tight text-[#111215]">No Active Order Group Selected</h2>
        <p className="text-xs text-neutral-500">
          Return to cart to select the inventory group you wish to authorize.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#0E52FF] hover:bg-[#0040E0] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
        >
          Return to Directory
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-[#111215] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Directory</span>
      </Link>

      <div className="border-b border-neutral-200/90 pb-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
          SECURE DISPATCH TRANSACTION
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#111215] mt-1">
          Checkout Group: {currentGroup.offerType === "READY" ? "Ready Physical Stock" : "Scheduled Pre-Order"}
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 font-mono text-xs">
          {errorMsg}
        </div>
      )}

      {/* Payment Active Modal / Overlay */}
      {paymentData && (
        <div className="bg-white border-2 border-emerald-500 p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-xs text-emerald-700 font-bold uppercase tracking-wider">
                Invoice Generated · 30-Minute Atomic Lock
              </span>
              <h2 className="text-xl font-bold font-mono text-[#111215] mt-0.5">
                Reference: {paymentData.reference}
              </h2>
            </div>
          </div>

          <div className="bg-neutral-50 p-6 border border-neutral-200 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500 uppercase">Payment Method</span>
              <span className="font-bold text-[#111215]">BCA Virtual Account (Sandbox)</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500 uppercase">VA Account Number</span>
              <span className="font-bold text-base text-[#0E52FF] font-tabular tracking-wider">
                88019283746152
              </span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500 uppercase">Total Amount</span>
              <span className="font-bold text-[#111215] font-tabular text-sm">
                {formatIdr(paymentData.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span className="uppercase">Lock Validity</span>
              <span className="font-medium text-neutral-700">30 Minutes (Automatic release on expiry)</span>
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
                {isSimulatingPayment ? "Processing Webhook..." : "Simulate Payment Success (Sandbox)"}
              </span>
            </button>

            <span className="font-mono text-[11px] text-neutral-500">
              Server-side verified transaction. Allocates reserved physical stock.
            </span>
          </div>
        </div>
      )}

      {!paymentData && (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-6 sm:p-8 space-y-6">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#111215] border-b border-neutral-100 pb-3">
              Domestic Shipping Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">Phone Number / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">Province</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">City / Regency</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">District (Kecamatan)</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
                />
              </div>

              <div>
                <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">Postal Code</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
                />
              </div>
            </div>

            <div className="font-mono text-xs">
              <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">Street Address</label>
              <textarea
                rows={3}
                required
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
              />
            </div>

            <div className="font-mono text-xs">
              <label className="block text-neutral-600 mb-1.5 uppercase font-bold text-[10px]">Delivery Instructions (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-[#111215] focus:bg-white focus:outline-none focus:border-[#111215] transition-all"
              />
            </div>
          </div>

          {/* Summary Column (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-neutral-200/90 p-6 sm:p-8 space-y-6 self-start">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#111215] border-b border-neutral-100 pb-3">
              Payment Ledger Summary
            </h2>

            <div className="space-y-3 divide-y divide-neutral-100 font-mono">
              {currentGroup.items.map((item) => (
                <div key={`${item.variantId}-${item.offerId}`} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <span className="font-bold uppercase text-[#111215] block truncate">{item.productName}</span>
                    <span className="text-neutral-500 text-[11px] block truncate">{item.variantName} (x{item.quantity})</span>
                  </div>
                  <div className="font-bold text-[#111215] shrink-0 font-tabular">
                    {formatIdr(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 p-4 border border-neutral-200/90 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-500 uppercase">
                <span>Subtotal Items</span>
                <span className="text-[#111215] font-bold font-tabular">{formatIdr(currentGroup.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 uppercase">
                <span>Direct Freight</span>
                <span className="text-[#111215] font-bold font-tabular">{formatIdr(currentGroup.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#111215] pt-2 border-t border-neutral-200 font-tabular uppercase">
                <span>Total Due</span>
                <span>{formatIdr(currentGroup.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#0E52FF] hover:bg-[#0040E0] active:scale-[0.98] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting
                ? "Allocating Lock & Generating Invoice..."
                : `Authorize Payment · ${currentGroup.offerType === "PREORDER" ? "Pre-Order" : "Ready Stock"}`}
            </button>

            <div className="font-mono text-[11px] text-neutral-400 space-y-1">
              <p>• 30-minute atomic inventory lock upon invoice generation.</p>
              <p>• Server-side verified via official payment gateway.</p>
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
