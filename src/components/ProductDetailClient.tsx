"use client";

import React, { useState } from "react";
import type { Product, ProductVariant, Offer, OfferType } from "../lib/types";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Box, Clock, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedOfferType, setSelectedOfferType] = useState<OfferType>(
    product.offers[0]?.offerType || "READY"
  );
  const [activeImage, setActiveImage] = useState<string>(
    selectedVariant.media[0]?.url || product.primaryImage
  );
  const [addedNotice, setAddedNotice] = useState(false);

  // Match the offer for this variant & offer type
  const matchedOffer = product.offers.find(
    (o) => o.variantId === selectedVariant.id && o.offerType === selectedOfferType
  ) || product.offers.find((o) => o.offerType === selectedOfferType) || product.offers[0];

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
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* 1. GALLERY COLUMN (58% / 7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Image 1:1 Aspect Ratio */}
        <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded aspect-square flex items-center justify-center p-8 relative overflow-hidden">
          <img
            src={activeImage}
            alt={selectedVariant.name}
            className="w-full h-full object-contain"
          />

          {/* Offer Badge Overlay */}
          <div className="absolute top-4 left-4">
            {selectedOfferType === "PREORDER" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded bg-[#F4E5DC] text-[#A84329] border border-[#A84329]/30">
                <span className="w-2 h-2 rounded-full bg-[#A84329] animate-pulse"></span>
                PRE-ORDER BATCH
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded bg-[#E4ECE6] text-[#184E46] border border-[#184E46]/30">
                <span className="w-2 h-2 rounded-full bg-[#184E46]"></span>
                READY STOCK
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
                className={`w-20 h-20 bg-[#FFFFFF] border rounded p-2 flex items-center justify-center transition-all ${
                  activeImage === m.url
                    ? "border-[#184E46] ring-1 ring-[#184E46]"
                    : "border-[#D9DDD5] hover:border-[#78857C]"
                }`}
              >
                <img src={m.url} alt={m.altText} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Specifications Table */}
        <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 mt-8 space-y-4">
          <h3 className="font-bold text-base text-[#202724] border-b border-[#D9DDD5] pb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#184E46] rounded-full"></span>
            Spesifikasi Terverifikasi Resmi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs font-mono">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-[#D9DDD5]/40 py-2">
                <span className="text-[#59635E]">{key}</span>
                <span className="text-[#202724] font-semibold text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Box Contents */}
        <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-4">
          <h3 className="font-bold text-base text-[#202724] border-b border-[#D9DDD5] pb-3 flex items-center gap-2">
            <Box className="w-4 h-4 text-[#184E46]" />
            Isi Dalam Kotak Kemasan
          </h3>
          <ul className="space-y-2 text-xs font-mono text-[#202724]">
            {product.boxContents.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#184E46] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. PURCHASE PANEL COLUMN (42% / 5 cols sticky) */}
      <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-6 sticky top-28 shadow-sm">
        {/* Brand & Title */}
        <div>
          <div className="text-xs font-mono text-[#59635E] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{product.brand.name}</span>
            <span className="text-[11px] bg-[#F4F1EA] px-2 py-0.5 rounded border border-[#D9DDD5]">
              {selectedVariant.sku}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#202724] tracking-tight leading-snug">
            {product.name}
          </h1>
          <p className="text-xs text-[#59635E] mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price Tag */}
        <div className="p-4 bg-[#F4F1EA] border border-[#D9DDD5] rounded">
          <div className="text-xs font-mono text-[#59635E]">Harga Final Satuan</div>
          <div className="text-3xl font-bold text-[#202724] font-mono tracking-tight mt-0.5">
            {formatIdr(matchedOffer.price || selectedVariant.price)}
          </div>
          <div className="text-[11px] text-[#59635E] mt-1 font-mono flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#184E46]" />
            <span>Ongkir dihitung saat checkout · Pajak & bea masuk sudah termasuk</span>
          </div>
        </div>

        {/* Offer Selection (Ready Stock vs Pre-order) */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-[#202724] uppercase tracking-wider">
            Tipe Penawaran (Offer)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {product.offers.map((offer) => {
              const isSelected = selectedOfferType === offer.offerType;
              const isReady = offer.offerType === "READY";
              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setSelectedOfferType(offer.offerType)}
                  className={`p-3.5 rounded text-left border transition-all ${
                    isSelected
                      ? isReady
                        ? "border-[#184E46] bg-[#E4ECE6]/50 ring-1 ring-[#184E46]"
                        : "border-[#A84329] bg-[#F4E5DC]/50 ring-1 ring-[#A84329]"
                      : "border-[#D9DDD5] bg-[#FFFFFF] hover:border-[#78857C]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isReady ? "text-[#184E46]" : "text-[#A84329]"
                      }`}
                    >
                      {isReady ? "READY STOCK" : "PRE-ORDER"}
                    </span>
                    {isSelected && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isReady ? "bg-[#184E46]" : "bg-[#A84329]"
                        }`}
                      ></span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#59635E] mt-1 font-mono">
                    {isReady ? "Kirim 1-2 hari" : offer.estimatedShipping || "Batch jadwal"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preorder drop ledger link */}
          {selectedOfferType === "PREORDER" && (
            <div className="text-xs font-mono pt-1 text-[#A84329]">
              <Link
                href={`/drops/${product.slug}-batch-04`}
                className="underline hover:text-[#88341f] flex items-center gap-1"
              >
                <span>Periksa Drop Ledger & kuota batch ini</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Variant Selection */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#202724] uppercase tracking-wider">
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
                    className={`w-full p-3 rounded text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-[#184E46] bg-[#E4ECE6]/30 ring-1 ring-[#184E46]"
                        : "border-[#D9DDD5] bg-[#FFFFFF] hover:border-[#78857C]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#202724]">{v.name}</div>
                      <div className="text-[11px] text-[#59635E] font-mono mt-0.5">
                        {Object.entries(v.attributes)
                          .map(([k, val]) => `${k}: ${val}`)
                          .join(" · ")}
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#202724]">
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
            <div className="bg-[#E4ECE6] border border-[#184E46]/30 text-[#184E46] text-xs font-mono py-2 px-3 rounded flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Gear berhasil ditambahkan ke keranjang belanja.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 border-2 border-[#184E46] text-[#184E46] text-xs font-bold font-mono uppercase tracking-wider rounded hover:bg-[#E4ECE6] transition-colors"
            >
              + Keranjang
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className={`w-full py-3.5 text-white text-xs font-bold font-mono uppercase tracking-wider rounded shadow-sm transition-colors ${
                selectedOfferType === "PREORDER"
                  ? "bg-[#A84329] hover:bg-[#8e3822]"
                  : "bg-[#184E46] hover:bg-[#123d37]"
              }`}
            >
              {selectedOfferType === "PREORDER" ? "Pre-Order Sekarang" : "Beli Sekarang"}
            </button>
          </div>
        </div>

        {/* Invariant & Trust Notes */}
        <div className="border-t border-[#D9DDD5] pt-4 space-y-2 text-xs font-mono text-[#59635E]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#184E46]" />
            <span>Garansi resmi UltraStore 1 tahun distributor</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#184E46]" />
            <span>Pemesanan mengikat kuota dan reservasi stok atomik</span>
          </div>
        </div>
      </div>
    </div>
  );
}
