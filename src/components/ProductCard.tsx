import Link from "next/link";
import type { Product } from "../lib/types";

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
      className="group block bg-[#FFFFFF] border border-[#202724]/20 rounded overflow-hidden hover:border-[#202724] hover:shadow-[4px_4px_0px_#202724] transition-all flex flex-col justify-between"
    >
      {/* 1:1 Product Image Container (Neat, Padded, No Overflow) */}
      <div className="relative aspect-square w-full bg-[#FFFFFF] flex items-center justify-center p-5 sm:p-6 border-b border-[#202724]/10 overflow-hidden">
        <img
          src={primaryVariant?.media[0]?.url || product.primaryImage}
          alt={product.name}
          className="max-h-full max-w-full w-auto h-auto object-contain object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge Overlay */}
        <div className="absolute top-3 left-3">
          {isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded bg-[#F4E5DC] text-[#A84329] border border-[#A84329]/30 font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A84329] animate-pulse"></span>
              PRE-ORDER
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded bg-[#E4ECE6] text-[#184E46] border border-[#184E46]/30 font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#184E46]"></span>
              READY
            </span>
          )}
        </div>

        {/* Corner Crosshair Notch */}
        <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#59635E]/40 select-none">
          +
        </span>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-[#FFFFFF]">
        <div>
          <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#184E46] mb-1.5 flex items-center justify-between">
            <span>// {product.brand.name}</span>
            <span className="text-[#59635E] font-normal">{product.category.name}</span>
          </div>
          <h3 className="font-bold text-sm sm:text-base text-[#202724] group-hover:text-[#184E46] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Varian attributes teaser */}
          {primaryVariant && (
            <p className="text-xs text-[#59635E] mt-1.5 line-clamp-1 font-mono">
              {Object.entries(primaryVariant.attributes)
                .map(([k, v]) => `${v}`)
                .join(" / ")}
            </p>
          )}
        </div>

        {/* Price & ETA */}
        <div className="mt-4 pt-3 border-t border-[#202724]/10 flex items-baseline justify-between">
          <div className="text-base font-extrabold text-[#202724] font-mono tracking-tight">
            {formatIdr(minPrice)}
          </div>
          <div className="text-[11px] text-[#59635E] font-mono text-right">
            {isPreorder
              ? `${primaryOffer?.estimatedShipping || "Batch PO"}`
              : "Siap kirim"}
          </div>
        </div>
      </div>
    </Link>
  );
}
