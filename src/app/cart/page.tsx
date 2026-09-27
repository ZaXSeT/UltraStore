"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Trash2, ArrowRight, ShieldAlert, ShoppingBag, Truck, Info } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#D9DDD5] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#59635E]">
            Keranjang Belanja
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#202724] mt-1">
            Pesanan Berdasarkan Kelompok
          </h1>
        </div>
        <div className="text-xs font-mono text-[#59635E]">
          Total {totalItemCount} item dalam {groups.length} kelompok pemenuhan
        </div>
      </div>

      {/* FR-03 Warning / Policy Notice */}
      <div className="bg-[#FFFFFF] border-l-4 border-[#184E46] p-4 rounded text-xs font-mono text-[#202724] space-y-1 shadow-sm">
        <div className="font-bold flex items-center gap-1.5 text-[#184E46]">
          <Info className="w-4 h-4" />
          <span>Aturan Transaksi Keranjang Campuran (FR-03 PRD)</span>
        </div>
        <p className="text-[#59635E]">
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
              className={`bg-[#FFFFFF] border rounded overflow-hidden shadow-sm ${
                isReady ? "border-[#184E46]/40" : "border-[#A84329]/40"
              }`}
            >
              {/* Group Header */}
              <div
                className={`p-4 sm:px-6 border-b flex flex-wrap items-center justify-between gap-2 ${
                  isReady ? "bg-[#E4ECE6]/40 border-[#184E46]/20" : "bg-[#F4E5DC]/40 border-[#A84329]/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isReady ? "bg-[#184E46]" : "bg-[#A84329]"
                    }`}
                  ></span>
                  <span
                    className={`font-mono font-bold text-xs uppercase tracking-wider ${
                      isReady ? "text-[#184E46]" : "text-[#A84329]"
                    }`}
                  >
                    Kelompok {idx + 1}: {isReady ? "Ready Stock" : "Pre-Order"}
                  </span>
                  <span className="text-xs font-mono text-[#59635E]">
                    ({group.batchName || "Pengiriman Langsung"})
                  </span>
                </div>

                <div className="text-xs font-mono text-[#59635E]">
                  Estimasi Kirim: <strong className="text-[#202724]">{group.etaRange}</strong>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#D9DDD5]/60 p-4 sm:p-6">
                {group.items.map((item) => (
                  <div key={`${item.variantId}-${item.offerId}`} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-contain bg-[#F9F8F6] border border-[#D9DDD5] rounded p-1"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#202724] truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs font-mono text-[#59635E] truncate">
                        {item.variantName}
                      </p>
                      <div className="text-xs font-mono font-bold text-[#202724] mt-1">
                        {formatIdr(item.price)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 border border-[#D9DDD5] rounded px-2 py-1 bg-[#F4F1EA]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.offerId, item.quantity - 1)}
                        className="text-xs font-bold text-[#59635E] hover:text-[#202724] w-5 text-center"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.offerId, item.quantity + 1)}
                        className="text-xs font-bold text-[#59635E] hover:text-[#202724] w-5 text-center"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId, item.offerId)}
                      className="p-2 text-[#59635E] hover:text-[#A12D2D] transition-colors"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Group Footer & Checkout Action */}
              <div className="bg-[#F9F8F6] border-t border-[#D9DDD5] p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono space-y-1 w-full sm:w-auto">
                  <div className="flex justify-between sm:justify-start gap-4 text-[#59635E]">
                    <span>Subtotal Barang:</span>
                    <strong className="text-[#202724]">{formatIdr(group.subtotal)}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start gap-4 text-[#59635E]">
                    <span>Estimasi Ongkir:</span>
                    <strong className="text-[#202724]">{formatIdr(group.shippingFee)}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start gap-4 text-sm font-bold text-[#202724] pt-1">
                    <span>Total Kelompok Ini:</span>
                    <span>{formatIdr(group.total)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCheckoutGroup(group.groupKey)}
                  className={`w-full sm:w-auto px-6 py-3 text-white text-xs font-mono font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-sm transition-colors ${
                    isReady ? "bg-[#184E46] hover:bg-[#123d37]" : "bg-[#A84329] hover:bg-[#8e3822]"
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
