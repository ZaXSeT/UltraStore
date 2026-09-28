import Link from "next/link";
import type { Product } from "../lib/types";
import { ProductImage } from "./ProductImage";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const primaryOffer = product.offers[0];
  const primaryVariant = product.variants[0];
  const isPreorder = product.offers.some((o) => o.offerType === "PREORDER");
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-950 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* 1:1 Product Image Studio Canvas */}
      <div className="relative aspect-square w-full bg-neutral-50/70 flex items-center justify-center p-6 border-b border-neutral-100 overflow-hidden">
        <ProductImage
          src={primaryVariant?.media[0]?.url || product.primaryImage}
          alt={product.name}
          category={product.category.name}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5">
          {isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold tracking-tight rounded-md bg-neutral-900 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              PRE-ORDER
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold tracking-tight rounded-md bg-white text-emerald-800 border border-emerald-300 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              READY STOCK
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-950 transition-colors">
              {product.brand.name}
            </span>
            <span className="font-mono text-[10px] uppercase font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
              {product.category.name}
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-neutral-950 group-hover:text-[#0E52FF] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Variant attributes teaser */}
          {primaryVariant && (
            <p className="text-xs text-neutral-500 mt-1.5 line-clamp-1 font-normal">
              {Object.entries(primaryVariant.attributes)
                .map(([_, v]) => `${v}`)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block leading-none mb-1">
              {isPreorder ? "Mulai Dari" : "Harga"}
            </span>
            <div className="text-sm sm:text-base font-extrabold text-neutral-950 font-tabular tracking-tight">
              {formatIdr(minPrice)}
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-900 text-xs font-semibold group-hover:bg-neutral-950 group-hover:text-white transition-all duration-200 shrink-0">
            <span>Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
