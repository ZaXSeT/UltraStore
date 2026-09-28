import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getBrands } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { ArrowUpRight, ArrowRight, Disc3 } from "lucide-react";
import { getSiteSetting, DEFAULT_HERO_CONFIG, DEFAULT_CATEGORIES_CONFIG, HeroConfig, MacroCategoryConfig } from "../lib/cms";

export default function HomePage() {
  const products = getAllProducts();
  const brands = getBrands();

  const hero = getSiteSetting<HeroConfig>("hero_config", DEFAULT_HERO_CONFIG);
  const macroCategoriesConfig = getSiteSetting<MacroCategoryConfig[]>("categories_config", DEFAULT_CATEGORIES_CONFIG);

  const readyProducts = products
    .filter((p) => p.offers.some((o) => o.offerType === "READY"))
    .slice(0, 10);

  const preorderBatches = products
    .filter((p) => p.offers.some((o) => o.offerType === "PREORDER"))
    .slice(0, 8);

  const macroCategories = macroCategoriesConfig.map((cat) => ({
    ...cat,
    count: cat.href.includes("offer=PREORDER")
      ? preorderBatches.length
      : products.filter((p) => p.category.slug === cat.href.replace("/shop?category=", "")).length,
  }));

  return (
    <div className="w-full space-y-16 lg:space-y-24 pb-28">
      {/* 1. EDITORIAL BRAND TICKER BAR */}
      <section className="w-full border-b border-neutral-200/80 bg-white/70 backdrop-blur-md py-3 text-xs tracking-tight">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-6 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono uppercase text-[11px] font-bold text-neutral-900 tracking-wider">
              AUTHORISED DISTRIBUTOR
            </span>
          </div>

          <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5 text-neutral-500 font-medium">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/shop?brand=${b.slug}`}
                className="hover:text-neutral-950 transition-colors shrink-0"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. AWWWARDS-CALIBER EDITORIAL HERO */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="relative border border-neutral-200/90 rounded-3xl bg-white overflow-hidden shadow-[0_2px_40px_rgba(0,0,0,0.03)]">
          {/* Subtle Technical Grid Blueprint Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] items-stretch">
            {/* Left Editorial Copy (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10 space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-900 bg-neutral-100 px-3 py-1 rounded-md border border-neutral-200">
                  {hero.badgeText}
                </span>
                <span className="font-mono text-xs text-neutral-400">
                  {hero.tagline}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-neutral-950 leading-[0.98] uppercase">
                  {hero.titleLine1}<br />
                  <span className="text-neutral-400 font-light">{hero.titleAccent}</span> {hero.titleLine2}
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 max-w-xl font-normal leading-relaxed">
                  {hero.description}
                </p>
              </div>

              {/* Technical Spec Matrix */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-neutral-100 max-w-lg">
                <div>
                  <span className="block font-mono text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">Dimensi</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-900">{hero.dimensions}</span>
                </div>
                <div>
                  <span className="block font-mono text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">Tebal</span>
                  <span className="font-bold text-xs sm:text-sm text-neutral-900">{hero.thickness}</span>
                </div>
                <div>
                  <span className="block font-mono text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">Ketersediaan</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-emerald-800 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {hero.availability}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={hero.ctaLink}
                  className="px-8 py-4 bg-neutral-950 hover:bg-[#0E52FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-2 group shadow-sm"
                >
                  <span>{hero.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={hero.secondaryCtaLink}
                  className="px-7 py-4 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 border-2 border-neutral-300 hover:border-neutral-950 shadow-xs"
                >
                  {hero.secondaryCtaText}
                </Link>
              </div>
            </div>

            {/* Right Hero Stage (5 cols) - Natural Sizing with Zero Blank Void */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 pb-2">
                <span>{hero.subBadgeTopLeft}</span>
                <span>{hero.subBadgeTopRight}</span>
              </div>

              <div className="relative my-auto py-2">
                <div className="relative aspect-square max-w-[420px] mx-auto overflow-hidden rounded-2xl border border-neutral-200 shadow-md">
                  <Image
                    src={hero.imageUrl}
                    alt={hero.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/60">
                <span>{hero.subBadgeBottomLeft}</span>
                <span>{hero.subBadgeBottomRight}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL CATEGORY DIRECTORY */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0E52FF] block mb-1">
              ARSITEKTUR PERIFERAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
              5 Spesialisasi Gear Presisi
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-400">
            DISTRIBUSI JAKARTA HUB 2026
          </span>
        </div>

        {/* 5-Column Precision Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {macroCategories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative bg-white border border-neutral-200/80 rounded-2xl p-5 hover:border-neutral-950 transition-all duration-300 flex flex-col justify-between h-[360px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            >
              {/* Card Header: Index & Product Count */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-3">
                <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-neutral-950 transition-colors">
                  {cat.index}
                </span>
                <span className="font-mono text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                  {cat.count} ITEMS
                </span>
              </div>

              {/* 1:1 Studio Product Frame */}
              <div className="relative aspect-square w-full my-auto flex items-center justify-center p-4">
                <div className="relative w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </div>
              </div>

              {/* Card Footer: Typography & Direction Arrow */}
              <div className="border-t border-neutral-100 pt-3 flex items-end justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-neutral-950 group-hover:text-[#0E52FF] transition-colors leading-tight">
                    {cat.title}
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400 tracking-tight mt-0.5">
                    {cat.spec}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. READY STOCK CATALOG GRID */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>SIAP KIRIM · JAKARTA CENTRAL HUB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
              Ready Stock Terverifikasi
            </h2>
          </div>
          <Link
            href="/shop?offer=READY"
            className="font-mono text-xs font-bold text-neutral-950 hover:text-[#0E52FF] flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <span>Semua Ready Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {readyProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. PRE-ORDER DROPS */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1 flex items-center gap-2">
              <Disc3 className="w-3.5 h-3.5 text-[#0E52FF]" />
              <span>BATCH RESMI TERJADWAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
              Pre-Order Drops
            </h2>
          </div>
          <Link
            href="/shop?offer=PREORDER"
            className="font-mono text-xs font-bold text-neutral-950 hover:text-[#0E52FF] flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <span>Semua Batch Pre-Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {preorderBatches.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
