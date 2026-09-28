"use client";

import React, { useState } from "react";
import type { Product, ProductVariant, Offer, OfferType } from "../lib/types";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Box, Clock, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { useLanguage } from "../context/LanguageContext";
import { boxItem, brandLabel, deliveryEstimate, formatRupiah } from "../lib/locale";

export function ProductDetailClient({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const { addItem, openCart, closeCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedOfferType, setSelectedOfferType] = useState<OfferType>(
    product.offers[0]?.offerType || "READY"
  );
  const [activeImage, setActiveImage] = useState<string>(
    selectedVariant.media[0]?.url || product.primaryImage
  );
  const [addedNotice, setAddedNotice] = useState(false);

  // Distinct offer types to prevent duplicate buttons
  const distinctOfferTypes: OfferType[] = Array.from(
    new Set(product.offers.map((o) => o.offerType))
  );

  // Match the offer for this variant & offer type
  const matchedOffer =
    product.offers.find(
      (o) => o.variantId === selectedVariant.id && o.offerType === selectedOfferType
    ) ||
    product.offers.find((o) => o.offerType === selectedOfferType) ||
    product.offers[0];

  const formatIdr = (val: number) => formatRupiah(val, locale);

  const handleAddToCart = () => {
    addItem({
      offerId: matchedOffer.id,
      variantId: selectedVariant.id,
      productSlug: product.slug,
      productName: product.name,
      variantName: selectedVariant.name,
      price: matchedOffer.price || selectedVariant.price,
      quantity: 1,
      offerType: selectedOfferType,
      batchId: matchedOffer.batchId,
      batchName: selectedOfferType === "PREORDER" ? "Batch Rilisan 04" : null,
      etaRange: matchedOffer.estimatedShipping,
      image: activeImage,
    });
    setAddedNotice(true);
    openCart();
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    closeCart();
    router.push(`/checkout?group=${encodeURIComponent(selectedOfferType === "PREORDER" ? `PREORDER:${matchedOffer.batchId || "default"}` : "READY")}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* 1. GALLERY COLUMN (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Main Image 1:1 Aspect Ratio */}
        <div className="bg-white border border-slate-200/80 aspect-square flex items-center justify-center p-4 sm:p-6 relative overflow-hidden shadow-sm">
          <ProductImage
            src={activeImage}
            alt={selectedVariant.name}
            category={product.category.name}
            className="w-full h-full object-contain"
          />

          {/* Offer Badge Overlay (Editorial Hairline Flush) */}
          <div className="absolute top-0 left-0 z-10">
            <div className="flex items-center font-mono text-[10px] uppercase tracking-[0.16em] font-semibold border-b border-r border-[#111215]/20 bg-white/95 backdrop-blur-xs text-[#111215]">
              <span
                className={`w-2 h-2 self-stretch ${
                  selectedOfferType === "PREORDER" ? "bg-[#0E52FF]" : "bg-[#111215]"
                }`}
              />
              <span className="px-3 py-1">
                {selectedOfferType === "PREORDER" ? t("PENGIRIMAN: BATCH PRE-ORDER", "DISPATCH: PRE-ORDER BATCH") : t("PENGIRIMAN: STOK TERSEDIA", "DISPATCH: IN STOCK")}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {selectedVariant.media.length > 1 && (
          <div className="flex gap-3">
            {selectedVariant.media.map((m, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(m.url)}
                className={`w-20 h-20 bg-white border rounded-xl p-2 flex items-center justify-center transition-all ${
                  activeImage === m.url
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <ProductImage src={m.url} alt={m.altText} category={product.category.name} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Specifications Table */}
        <div className="bg-white border border-neutral-200/90 p-6 sm:p-8 space-y-4">
          <h3 className="font-bold font-mono uppercase text-xs tracking-wider text-[#111215] border-b border-neutral-100 pb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#0E52FF]"></span>
            <span>{t("Spesifikasi Produk", "Product Specifications")}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-mono text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-neutral-100 py-2">
                <span className="text-neutral-500 uppercase">{key}</span>
                <span className="text-[#111215] font-bold text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Box Contents */}
        <div className="bg-white border border-neutral-200/90 p-6 sm:p-8 space-y-4">
          <h3 className="font-bold font-mono uppercase text-xs tracking-wider text-[#111215] border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-[#0E52FF]" />
            <span>{t("Isi Kemasan", "What's in the Box")}</span>
          </h3>
          <ul className="space-y-2 font-mono text-xs text-neutral-700">
            {product.boxContents.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{boxItem(item, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. PURCHASE PANEL COLUMN (5 cols sticky) */}
      <div className="lg:col-span-5 bg-white border border-neutral-200/90 p-6 sm:p-8 space-y-6 sticky top-28">
        {/* Brand & Title */}
        <div>
          <div className="text-xs font-mono font-bold tracking-wider mb-2 flex items-center justify-between">
            <span className="text-[#0E52FF] uppercase">{brandLabel(product.brand.slug, product.brand.name, locale)}</span>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-600 px-2 py-0.5 font-mono uppercase">
              SKU: {selectedVariant.sku}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111215] uppercase tracking-tight leading-snug">
            {product.name}
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-2 leading-relaxed">
            {locale === "en" ? product.descriptionEn?.trim() || `${product.name} by ${product.brand.name}. Explore the specifications and choose the variant that suits your setup.` : product.description}
          </p>
        </div>

        {/* Price Tag */}
        <div className="p-4 bg-neutral-50 border border-neutral-200/90">
          <div className="text-[10px] font-mono uppercase font-bold text-neutral-500">{t("Harga per Unit", "Price per Item")}</div>
          <div className="text-3xl font-black text-[#111215] font-tabular tracking-tight mt-0.5">
            {formatIdr(matchedOffer.price || selectedVariant.price)}
          </div>
          <div className="text-[10px] font-mono text-neutral-500 mt-1 flex items-center gap-1.5 uppercase">
            <Truck className="w-3.5 h-3.5 text-[#0E52FF]" />
            <span>{t("Ongkir dihitung saat checkout · Termasuk pajak dan bea masuk", "Shipping is calculated at checkout · Taxes and duties included")}</span>
          </div>
        </div>

        {/* Offer Selection (Ready Stock vs Pre-order) */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 block">
            {t("Pilihan Ketersediaan", "Availability")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {distinctOfferTypes.map((offerType) => {
              const isSelected = selectedOfferType === offerType;
              const isReady = offerType === "READY";
              const targetOffer = product.offers.find((o) => o.offerType === offerType);
              return (
                <button
                  key={offerType}
                  type="button"
                  onClick={() => setSelectedOfferType(offerType)}
                  className={`p-3.5 text-left border transition-all font-mono ${
                    isSelected
                      ? isReady
                        ? "border-[#111215] bg-[#111215] text-white"
                        : "border-[#0E52FF] bg-[#0E52FF] text-white"
                      : "border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {isReady ? t("Stok Tersedia", "In Stock") : "Pre-Order"}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 bg-white" />
                    )}
                  </div>
                  <div className={`text-[10px] mt-1 ${isSelected ? "text-white/80" : "text-neutral-500"}`}>
                    {isReady ? t("Dikirim dalam 1–2 hari kerja", "Ships in 1–2 business days") : deliveryEstimate(targetOffer?.estimatedShipping, locale) || t("Jadwal batch", "Batch schedule")}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preorder drop ledger link */}
          {selectedOfferType === "PREORDER" && (
            <div className="text-xs pt-1">
              <Link
                href={`/drops/${product.slug}-batch-04`}
                className="hover:underline flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[#0E52FF] font-bold"
              >
                <span>{t("Lihat jadwal pre-order", "View pre-order timeline")}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 block">
              {t("Pilih Varian", "Choose a Variant")}
            </label>
            <div className="space-y-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.media[0]) setActiveImage(v.media[0].url);
                    }}
                    className={`w-full p-3 text-left border transition-all flex items-center justify-between font-mono ${
                      isSelected
                        ? "border-[#111215] bg-neutral-100 text-[#111215] font-bold"
                        : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase">{v.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        {Object.entries(v.attributes)
                          .map(([k, val]) => `${k}: ${val}`)
                          .join(" · ")}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[#111215] font-tabular">
                      {formatIdr(v.price)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {addedNotice && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-2.5 px-3.5 flex items-center gap-2 font-mono">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t("Produk ditambahkan ke keranjang.", "Added to your cart.")}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 border border-neutral-300 bg-white text-[#111215] text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
            >
              {t("+ Keranjang", "+ Add to Cart")}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-[#0E52FF] hover:bg-[#0040E0] active:scale-[0.98] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all"
            >
              {selectedOfferType === "PREORDER" ? t("Pesan Sekarang", "Pre-Order Now") : t("Beli Sekarang", "Buy Now")}
            </button>
          </div>
        </div>

        {/* Invariant & Trust Notes */}
        <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0E52FF]" />
            <span className="text-[11px] uppercase">{t("Garansi resmi UltraStore selama 1 tahun", "UltraStore official 1-year warranty")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#0E52FF]" />
            <span className="text-[11px] uppercase">{t("Stok atau kuota dialokasikan setelah pemesanan", "Stock or batch capacity is allocated when you order")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
