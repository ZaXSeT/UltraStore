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
      className="group block bg-[#FFFFFF] border border-[#D9DDD5] rounded overflow-hidden hover:border-[#184E46] transition-all hover:shadow-sm"
    >
      {/* 1:1 Product Image */}
      <div className="relative aspect-square w-full bg-[#F9F8F6] flex items-center justify-center p-6 border-b border-[#D9DDD5]/60 overflow-hidden">
        <img
          src={primaryVariant?.media[0]?.url || product.primaryImage}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badge Overlay */}
        <div className="absolute top-3 left-3">
          {isPreorder ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-[#F4E5DC] text-[#A84329] border border-[#A84329]/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A84329]"></span>
              Pre-order
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-[#E4ECE6] text-[#184E46] border border-[#184E46]/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#184E46]"></span>
              Ready stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-[#59635E] mb-1">
            {product.brand.name} · {product.category.name}
          </div>
          <h3 className="font-semibold text-base text-[#202724] group-hover:text-[#184E46] transition-colors line-clamp-2 leading-snug">
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
        <div className="mt-4 pt-3 border-t border-[#D9DDD5]/50 flex items-baseline justify-between">
          <div className="text-base font-bold text-[#202724] font-mono tracking-tight">
            {formatIdr(minPrice)}
          </div>
          <div className="text-[11px] text-[#59635E] font-mono">
            {isPreorder
              ? `${primaryOffer?.estimatedShipping || "Batch Terjadwal"}`
              : "Siap kirim"}
          </div>
        </div>
      </div>
    </Link>
  );
}
