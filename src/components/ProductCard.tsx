"use client";

import Link from "next/link";
import type { Product } from "../lib/types";
import { ProductImage } from "./ProductImage";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { brandLabel, categoryLabel, formatRupiah } from "../lib/locale";

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLanguage();
  const primaryOffer = product.offers[0];
  const primaryVariant = product.variants[0];
  const isPreorder = product.offers.some((o) => o.offerType === "PREORDER");
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  const formatIdr = (val: number) => formatRupiah(val, locale);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block bg-[var(--theme-surface)] border border-neutral-200/90 overflow-hidden hover:border-[var(--theme-ink)] hover:shadow-[0_16px_36px_rgba(14,82,255,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* 1:1 Product Image Studio Canvas with Ambient Hover Shift */}
      <div className="relative aspect-square w-full bg-neutral-100 group-hover:bg-[var(--theme-accent-soft)] flex items-center justify-center border-b border-neutral-100 group-hover:border-neutral-200 transition-colors duration-300 overflow-hidden">
        <ProductImage
          src={primaryVariant?.media[0]?.url || product.primaryImage}
          alt={product.name}
          category={product.category.name}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Architectural Editorial Status Tag (Non-AI Slop, Swiss Precision Grid) */}
        <div className="absolute top-0 left-0 z-10">
          <div className="flex items-center font-mono text-[9px] uppercase tracking-[0.16em] font-semibold border-b border-r border-[var(--theme-ink-border)] bg-[var(--theme-surface-95)] backdrop-blur-xs text-[var(--theme-ink)]">
            <span
              className={`w-1.5 h-1.5 self-stretch ${
                isPreorder ? "bg-[var(--theme-accent)]" : "bg-[var(--theme-ink)]"
              }`}
            />
            <span className="px-2 py-0.5">
              {isPreorder ? t("BATCH PO", "PRE-ORDER") : t("TERSEDIA", "IN STOCK")}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-2.5 sm:p-5 flex flex-col justify-between flex-1 bg-[var(--theme-surface)] group-hover:bg-[var(--theme-surface-hover)] transition-colors duration-300">
        <div>
          <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-1.5">
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 group-hover:text-[var(--theme-ink)] transition-colors truncate">
              {brandLabel(product.brand.slug, product.brand.name, locale)}
            </span>
            <span className="font-mono text-[8px] sm:text-[10px] uppercase font-semibold text-neutral-400 bg-neutral-100 px-1 sm:px-2 py-0.5 rounded-none shrink-0">
              {categoryLabel(product.category.slug, product.category.name, locale)}
            </span>
          </div>

          <h3 className="font-bold text-xs sm:text-base text-[var(--theme-ink)] group-hover:text-[var(--theme-accent)] transition-colors line-clamp-2 leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Variant attributes teaser */}
          {primaryVariant && (
            <p className="text-[10px] sm:text-xs text-neutral-500 mt-1 sm:mt-1.5 line-clamp-1 font-normal">
              {Object.entries(primaryVariant.attributes)
                .map(([_, v]) => `${v}`)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3.5 border-t border-neutral-100 flex items-end justify-between gap-1">
          <div className="min-w-0 pr-0.5">
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider text-neutral-400 block leading-none mb-0.5 sm:mb-1">
              {isPreorder ? t("Mulai dari", "From") : t("Harga", "Price")}
            </span>
            <div className="text-[11px] sm:text-sm font-extrabold text-[var(--theme-ink)] font-tabular tracking-tight truncate">
              {formatIdr(minPrice)}
            </div>
          </div>

          <div className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 border border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white text-[9px] sm:text-[11px] font-mono font-bold uppercase tracking-wider group-hover:bg-[var(--theme-accent-hover)] group-hover:border-[var(--theme-accent-hover)] transition-all duration-200 shrink-0 whitespace-nowrap shadow-sm">
            <span>{t("Lihat", "View")}</span>
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
