"use client";

import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";
import { X, Trash2, ArrowRight, ShoppingBag, Minus, Plus, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getGroupedItems,
    totalItemCount,
    isCartOpen,
    closeCart,
  } = useCart();

  const groups = getGroupedItems();

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isCartOpen, closeCart]);

  const formatIdr = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleCheckoutGroup = (groupKey: string) => {
    closeCart();
    router.push(`/checkout?group=${encodeURIComponent(groupKey)}`);
  };

  const grandTotal = groups.reduce((sum, g) => sum + g.total, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[460px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 font-mono uppercase tracking-wide">
                Keranjang
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                {totalItemCount} item · {groups.length} kelompok
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-mono">
                Keranjang Kosong
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono max-w-xs">
                Belum ada gear yang ditambahkan. Jelajahi katalog untuk menemukan peripheral favoritmu.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push("/shop");
                }}
                className="mt-5 px-5 py-2.5 bg-slate-950 text-white text-xs font-mono font-bold rounded-xl hover:bg-teal-600 transition-colors"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {groups.map((group, idx) => {
                const isReady = group.offerType === "READY";
                return (
                  <div key={group.groupKey}>
                    {/* Group Label */}
                    <div
                      className={`px-5 py-2.5 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isReady
                          ? "bg-teal-50/80 text-teal-800 border-b border-teal-200/70"
                          : "bg-orange-50/80 text-orange-800 border-b border-orange-200/70"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isReady ? "bg-teal-600" : "bg-orange-600 animate-pulse"
                          }`}
                        />
                        <span>{isReady ? "Ready Stock" : "Pre-Order"}</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          ({group.batchName || "Langsung"})
                        </span>
                      </div>
                      <span className="text-[10px] font-normal text-slate-500">
                        {group.etaRange}
                      </span>
                    </div>

                    {/* Items */}
                    {group.items.map((item) => (
                      <div
                        key={`${item.variantId}-${item.offerId}`}
                        className="px-5 py-4 flex gap-3.5 items-start hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                          <ProductImage
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[13px] text-slate-900 truncate leading-tight">
                            {item.productName}
                          </h4>
                          <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                            {item.variantName}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            {/* Qty stepper */}
                            <div className="inline-flex items-center gap-0.5 border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.variantId,
                                    item.offerId,
                                    item.quantity - 1
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-mono font-bold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.variantId,
                                    item.offerId,
                                    item.quantity + 1
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="text-xs font-mono font-extrabold text-slate-900">
                              {formatIdr(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId, item.offerId)}
                          className="mt-1 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Group Checkout Button */}
                    <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs font-mono">
                        <span className="text-slate-500">Subtotal: </span>
                        <span className="font-bold text-slate-900">{formatIdr(group.subtotal)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCheckoutGroup(group.groupKey)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-white rounded-xl shadow-sm transition-colors ${
                          isReady
                            ? "bg-teal-600 hover:bg-teal-700"
                            : "bg-orange-600 hover:bg-orange-700"
                        }`}
                      >
                        <span>Checkout</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer (Grand Total) */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <Truck className="w-3.5 h-3.5 text-teal-600" />
                <span>Ongkir dihitung per kelompok saat checkout</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-bold text-slate-900">
                Total Semua
              </span>
              <span className="text-lg font-mono font-extrabold text-slate-900 tracking-tight">
                {formatIdr(grandTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                closeCart();
                router.push(`/checkout?group=${encodeURIComponent(groups[0]?.groupKey || "READY")}`);
              }}
              className="w-full py-3.5 bg-slate-950 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl hover:bg-teal-600 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Checkout Semua Kelompok</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
