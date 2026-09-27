"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Trash2, ArrowRight, ShieldAlert, ShoppingBag, Truck, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductImage } from "../../components/ProductImage";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getGroupedItems, totalItemCount } = useCart();
  const groups = getGroupedItems();

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCheckoutGroup = (groupKey: string) => {
    router.push(`/checkout?group=${encodeURIComponent(groupKey)}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-[#FFFFFF] border border-[#D9DDD5] rounded-full flex items-center justify-center mx-auto text-[#59635E]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#202724]">Keranjang belanja kosong</h1>
        <p className="text-sm text-[#59635E] max-w-sm mx-auto">
          Kamu belum menambahkan peripheral atau batch rilisan pre-order ke keranjang.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#184E46] text-[#F4F1EA] text-xs font-mono font-bold uppercase tracking-wider rounded mt-4"
        >
          Lihat Katalog Gear
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-teal-600 font-bold">
            Keranjang Belanja
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-mono uppercase">
            Pesanan Berdasarkan Kelompok
          </h1>
        </div>
        <div className="text-xs font-mono text-slate-500">
          Total {totalItemCount} item dalam {groups.length} kelompok pemenuhan
        </div>
      </div>

      {/* FR-03 Warning / Policy Notice */}
      <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-xl text-xs font-mono text-slate-800 space-y-1 shadow-sm">
        <div className="font-bold flex items-center gap-1.5 text-teal-700">
          <Info className="w-4 h-4" />
          <span>Aturan Transaksi Keranjang Campuran (FR-03 PRD)</span>
        </div>
        <p className="text-slate-600">
          Setiap kelompok (Ready Stock vs Batch Pre-Order) memiliki jalur logistik dan estimasi waktu yang berbeda. Checkout dan invoice diterbitkan per kelompok agar pengiriman barang ready stock kamu tidak tertahan oleh jadwal batch pabrik.
        </p>
      </div>

      {/* Grouped Checkout Cards */}
      <div className="space-y-8">
        {groups.map((group, idx) => {
          const isReady = group.offerType === "READY";
          return (
            <div
              key={group.groupKey}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${
                isReady ? "border-teal-300" : "border-orange-300"
              }`}
            >
              {/* Group Header */}
              <div
                className={`p-4 sm:px-6 border-b flex flex-wrap items-center justify-between gap-2 ${
                  isReady ? "bg-teal-50/70 border-teal-200" : "bg-orange-50/70 border-orange-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isReady ? "bg-teal-600" : "bg-orange-600"
                    }`}
                  ></span>
                  <span
                    className={`font-mono font-bold text-xs uppercase tracking-wider ${
                      isReady ? "text-teal-800" : "text-orange-800"
                    }`}
                  >
                    Kelompok {idx + 1}: {isReady ? "Ready Stock" : "Pre-Order"}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ({group.batchName || "Pengiriman Langsung"})
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  Estimasi Kirim: <strong className="text-slate-900">{group.etaRange}</strong>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 p-4 sm:p-6">
                {group.items.map((item) => (
                  <div key={`${item.variantId}-${item.offerId}`} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                      <ProductImage
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs font-mono text-slate-500 truncate">
                        {item.variantName}
                      </p>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                        {formatIdr(item.price)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.offerId, item.quantity - 1)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 w-5 text-center"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold w-6 text-center text-slate-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.offerId, item.quantity + 1)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 w-5 text-center"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId, item.offerId)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Group Footer & Checkout Action */}
              <div className="bg-slate-50/70 border-t border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono space-y-1 w-full sm:w-auto">
                  <div className="flex justify-between sm:justify-start gap-4 text-slate-500">
                    <span>Subtotal Barang:</span>
                    <strong className="text-slate-900">{formatIdr(group.subtotal)}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start gap-4 text-slate-500">
                    <span>Estimasi Ongkir:</span>
                    <strong className="text-slate-900">{formatIdr(group.shippingFee)}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start gap-4 text-sm font-bold text-slate-900 pt-1">
                    <span>Total Kelompok Ini:</span>
                    <span>{formatIdr(group.total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCheckoutGroup(group.groupKey)}
                  className={`w-full sm:w-auto px-6 py-3 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors ${
                    isReady ? "bg-teal-600 hover:bg-teal-700" : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  <span>Checkout Kelompok {isReady ? "Ready Stock" : "Pre-Order"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
