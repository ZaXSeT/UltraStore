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
      className="group block bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-blue-500/70 hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* 1:1 Product Image Studio Canvas */}
      <div className="relative aspect-square w-full bg-slate-50/60 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
        <ProductImage
          src={primaryVariant?.media[0]?.url || product.primaryImage}
          alt={product.name}
          category={product.category.name}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5">
          {isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Pre-Order
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ready Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-wide text-blue-600">
              {product.brand.name}
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {product.category.name}
            </span>
          </div>

          <h3 className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Variant attributes teaser */}
          {primaryVariant && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
              {Object.entries(primaryVariant.attributes)
                .map(([_, v]) => `${v}`)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block leading-none mb-1">
              {isPreorder ? "Mulai Dari" : "Harga"}
            </span>
            <div className="text-sm sm:text-base font-bold text-slate-900 font-tabular tracking-tight">
              {formatIdr(minPrice)}
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-200 shadow-sm shrink-0">
            <span>Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
