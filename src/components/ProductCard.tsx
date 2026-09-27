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
      className="group block bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-teal-500/70 hover:shadow-[0_12px_32px_rgba(13,148,136,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* 1:1 Product Image Studio Canvas */}
      <div className="relative aspect-square w-full bg-slate-50/80 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
        <ProductImage
          src={primaryVariant?.media[0]?.url || product.primaryImage}
          alt={product.name}
          category={product.category.name}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Floating Minimalist Status Badge */}
        <div className="absolute top-3.5 left-3.5">
          {isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-orange-50/90 backdrop-blur-sm text-orange-700 border border-orange-200 font-mono tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              PRE-ORDER
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-teal-50/90 backdrop-blur-sm text-teal-700 border border-teal-200 font-mono tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              READY
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-teal-600 mb-1 flex items-center justify-between">
            <span>// {product.brand.name}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              {product.category.name}
            </span>
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Varian attributes teaser */}
          {primaryVariant && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-mono">
              {Object.entries(primaryVariant.attributes)
                .map(([_, v]) => `${v}`)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* Price & Premium Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block leading-none mb-1">
              {isPreorder ? "EST. BATCH" : "READY STOCK"}
            </span>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 font-mono tracking-tight">
              {formatIdr(minPrice)}
            </div>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-bold group-hover:bg-teal-600 group-hover:border-teal-600 group-hover:text-white transition-all duration-200 shadow-sm shrink-0">
            <span>Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
