"use client";

import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";
import { X, Trash2, ArrowRight, ShoppingBag, Minus, Plus, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { deliveryEstimate, formatRupiah } from "../lib/locale";

export function CartDrawer() {
  const { locale, t } = useLanguage();
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

  const formatIdr = (val: number) => formatRupiah(val, locale);

  const handleCheckoutGroup = (groupKey: string) => {
    closeCart();
    router.push(`/checkout?group=${encodeURIComponent(groupKey)}`);
  };

  const grandTotal = groups.reduce((sum, g) => sum + g.total, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t("Keranjang Belanja", "Shopping Cart")}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {totalItemCount} {t("produk", "items")} · {groups.length} {t("kelompok pengiriman", "shipping groups")}
              </span>
            </div>
          </div>

          <button
            aria-label={t("Tutup keranjang", "Close cart")}
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
              <h3 className="text-base font-bold text-slate-900">
                {t("Keranjang Masih Kosong", "Your Cart Is Empty")}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                {t("Belum ada produk di keranjang. Jelajahi katalog untuk menemukan perlengkapan yang Anda cari.", "Nothing in your cart yet. Browse the catalog to find gear for your setup.")}
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push("/shop");
                }}
                className="mt-5 px-5 py-2.5 bg-[#090D16] text-white text-xs font-semibold rounded-xl hover:bg-[#2563EB] transition-colors"
              >
                {t("Jelajahi Katalog", "Browse Products")}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {groups.map((group) => {
                const isReady = group.offerType === "READY";
                return (
                  <div key={group.groupKey}>
                    {/* Group Label */}
                    <div
                      className={`px-6 py-2.5 flex items-center justify-between text-xs font-semibold ${
                        isReady
                          ? "bg-emerald-50 text-emerald-900 border-b border-emerald-100"
                          : "bg-blue-50 text-blue-900 border-b border-blue-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isReady ? "bg-emerald-500" : "bg-blue-600"
                          }`}
                        />
                        <span>{isReady ? t("Stok Tersedia", "In Stock") : "Pre-Order"}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          ({group.batchName ? group.batchName.replace("Batch Rilisan", t("Batch Rilisan", "Batch")) : t("Langsung", "Ready to ship")})
                        </span>
                      </div>
                      <span className="text-[11px] font-normal text-slate-500">
                        {deliveryEstimate(group.etaRange, locale)}
                      </span>
                    </div>

                    {/* Items */}
                    {group.items.map((item) => (
                      <div
                        key={`${item.variantId}-${item.offerId}`}
                        className="px-6 py-4 flex gap-3.5 items-start hover:bg-slate-50/50 transition-colors"
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
                          <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate leading-tight">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {item.variantName}
                          </p>

                          <div className="flex items-center justify-between mt-2.5">
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
                              <span className="w-8 text-center text-xs font-semibold text-slate-900 font-tabular">
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
                            <span className="text-xs font-bold text-slate-900 font-tabular">
                              {formatIdr(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId, item.offerId)}
                          className="mt-1 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                          title={t("Hapus", "Remove")}
                          aria-label={t("Hapus produk", "Remove item")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Group Checkout Button */}
                    <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-slate-500">Subtotal: </span>
                        <span className="font-bold text-slate-900 font-tabular">{formatIdr(group.subtotal)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCheckoutGroup(group.groupKey)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-colors ${
                          isReady
                            ? "bg-[#090D16] hover:bg-[#2563EB]"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        <span>{t("Lanjut ke Checkout", "Checkout")}</span>
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
          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("Ongkir dihitung per kelompok saat checkout", "Shipping is calculated for each group at checkout")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                {t("Total Semua Kelompok", "Total for All Groups")}
              </span>
              <span className="text-lg font-bold text-slate-900 font-tabular tracking-tight">
                {formatIdr(grandTotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                closeCart();
                router.push(`/checkout?group=${encodeURIComponent(groups[0]?.groupKey || "READY")}`);
              }}
              className="w-full py-3.5 bg-[#090D16] text-white text-xs font-semibold rounded-xl hover:bg-[#2563EB] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t("Lanjut ke Pembayaran", "Continue to Checkout")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
