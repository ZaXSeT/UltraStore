"use client";

import React, { useState } from "react";
import type { Product, ProductVariant, Offer, OfferType } from "../lib/types";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Box, Clock, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "./ProductImage";

export function ProductDetailClient({ product }: { product: Product }) {
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

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

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
        <div className="bg-white border border-slate-200/80 rounded-2xl aspect-square flex items-center justify-center p-8 relative overflow-hidden shadow-sm">
          <ProductImage
            src={activeImage}
            alt={selectedVariant.name}
            category={product.category.name}
            className="w-full h-full object-contain"
          />

          {/* Offer Badge Overlay */}
          <div className="absolute top-4 left-4">
            {selectedOfferType === "PREORDER" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Pre-Order Batch
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ready Stock
              </span>
            )}
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
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Spesifikasi Terverifikasi Resmi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-slate-100 py-2">
                <span className="text-slate-500">{key}</span>
                <span className="text-slate-900 font-medium text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Box Contents */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-600" />
            Isi Dalam Kotak Kemasan
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {product.boxContents.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. PURCHASE PANEL COLUMN (5 cols sticky) */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-sm">
        {/* Brand & Title */}
        <div>
          <div className="text-xs text-blue-600 font-semibold tracking-wide mb-1.5 flex items-center justify-between">
            <span>{product.brand.name}</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              SKU: {selectedVariant.sku}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price Tag */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Harga Final Satuan</div>
          <div className="text-3xl font-extrabold text-slate-900 font-tabular tracking-tight mt-0.5">
            {formatIdr(matchedOffer.price || selectedVariant.price)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Ongkir dihitung saat checkout · Pajak &amp; bea masuk sudah termasuk</span>
          </div>
        </div>

        {/* Offer Selection (Ready Stock vs Pre-order) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-900 tracking-wide block">
            Pilihan Ketersediaan
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
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? isReady
                        ? "border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600"
                        : "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isReady ? "text-emerald-700" : "text-blue-700"
                      }`}
                    >
                      {isReady ? "Ready Stock" : "Pre-Order"}
                    </span>
                    {isSelected && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isReady ? "bg-emerald-500" : "bg-blue-600"
                        }`}
                      ></span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {isReady ? "Kirim 1-2 hari" : targetOffer?.estimatedShipping || "Batch jadwal"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preorder drop ledger link */}
          {selectedOfferType === "PREORDER" && (
            <div className="text-xs pt-1 text-blue-600">
              <Link
                href={`/drops/${product.slug}-batch-04`}
                className="hover:underline flex items-center gap-1 font-medium"
              >
                <span>Lihat rincian jadwal batch ini</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-900 tracking-wide block">
              Pilih Varian
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
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{v.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {Object.entries(v.attributes)
                          .map(([k, val]) => `${k}: ${val}`)
                          .join(" · ")}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-900 font-tabular">
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
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Gear berhasil ditambahkan ke keranjang belanja.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              + Keranjang
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className={`w-full py-3.5 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors ${
                selectedOfferType === "PREORDER"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-[#090D16] hover:bg-[#2563EB]"
              }`}
            >
              {selectedOfferType === "PREORDER" ? "Pre-Order Sekarang" : "Beli Sekarang"}
            </button>
          </div>
        </div>

        {/* Invariant & Trust Notes */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garansi resmi UltraStore 1 tahun distributor</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Pemesanan mengikat kuota dan reservasi stok atomik</span>
          </div>
        </div>
      </div>
    </div>
  );
}
