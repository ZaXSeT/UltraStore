import Link from "next/link";
import type { Product } from "../lib/types";
import { ProductImage } from "./ProductImage";

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
      className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-teal-500 hover:shadow-[0_8px_24px_rgba(13,148,136,0.12)] transition-all flex flex-col justify-between h-full"
    >
      {/* 1:1 Product Image Container (Neat, Padded, Robust Fallback) */}
      <div className="relative aspect-square w-full bg-slate-50/70 flex items-center justify-center p-5 sm:p-6 border-b border-slate-100 overflow-hidden">
        <ProductImage
          src={primaryVariant?.media[0]?.url || product.primaryImage}
          alt={product.name}
          category={product.category.name}
          className="group-hover:scale-105"
        />

        {/* Badge Overlay */}
        <div className="absolute top-3 left-3">
          {isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-mono tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              PRE-ORDER
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              READY
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-teal-600 mb-1.5 flex items-center justify-between">
            <span>// {product.brand.name}</span>
            <span className="text-slate-400 font-normal">{product.category.name}</span>
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Varian attributes teaser */}
          {primaryVariant && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-mono">
              {Object.entries(primaryVariant.attributes)
                .map(([k, v]) => `${v}`)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* Price & ETA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div className="text-base font-extrabold text-slate-900 font-mono tracking-tight">
            {formatIdr(minPrice)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono text-right font-medium">
            {isPreorder
              ? `${primaryOffer?.estimatedShipping || "Batch PO"}`
              : "Ready Kirim"}
          </div>
        </div>
      </div>
    </Link>
  );
}
