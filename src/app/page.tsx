import Link from "next/link";
import { getAllProducts, getBrands } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Zap, Compass, Award } from "lucide-react";

export default function HomePage() {
  const products = getAllProducts();
  const brands = getBrands();

  const readyProducts = products
    .filter((p) => p.offers.some((o) => o.offerType === "READY"))
    .slice(0, 10);

  const preorderBatches = products
    .filter((p) => p.offers.some((o) => o.offerType === "PREORDER"))
    .slice(0, 8);

  const featuredKeyboard = products.find((p) => p.slug === "everglide-ae68-pro-8k-he") || products[0];

  return (
    <div className="space-y-14 sm:space-y-18 pb-20 w-full">
      {/* 1. BRAND TICKER / MARQUEE (Full Width) */}
      <section className="bg-slate-950 text-slate-300 py-2.5 border-b border-slate-800 overflow-hidden text-xs w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider shrink-0">
            Distributor Resmi
          </span>
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/shop?brand=${b.slug}`}
              className="hover:text-blue-400 transition-colors flex items-center gap-3 font-medium text-slate-300 shrink-0"
            >
              <span>{b.name}</span>
              <span className="text-slate-700">·</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. INFINITAS-INSPIRED ENTHUSIAST HERO SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-2 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>UltraStore x Enthusiast Hardware 2026</span>
            </div>

            {/* Infinitas-Inspired Signature Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-950 leading-[1.05]">
              FIND YOUR<br />
              <span className="text-blue-600">PERFECT</span><br />
              KEYBOARD<span className="text-blue-600 animate-pulse">_</span>
            </h1>

            <div className="space-y-2 max-w-xl">
              <p className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
                One-stop Gaming &amp; Custom Peripheral Enthusiast Store
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Koleksi hardware pilihan: 8K Hall Effect magnetic keyboard dengan 0.001mm rapid trigger, ultralight magnesium gaming mouse, precision tempered glasspad, dan artisan switches bergaransi distributor resmi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-7 py-3.5 bg-slate-950 hover:bg-blue-600 text-white text-sm font-bold tracking-wide rounded-xl transition-all flex items-center gap-2.5 shadow-md hover:shadow-blue-500/20"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop?offer=PREORDER"
                className="px-6 py-3.5 bg-white border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-600 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Pre-Order Drops</span>
              </Link>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="block font-bold text-slate-900 mb-0.5">100% Original</span>
                <span className="text-slate-500">Pabrikan resmi &amp; garansi 1 tahun</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="block font-bold text-emerald-700 mb-0.5">Ready Hub Jakarta</span>
                <span className="text-slate-500">Kirim 1-2 hari kerja terlindungi</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="block font-bold text-blue-700 mb-0.5">Enthusiast QC</span>
                <span className="text-slate-500">Pengecekan fungsi sebelum kirim</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Hardware Showcase (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 relative shadow-lg hover:border-blue-500/60 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  FLAGSHIP SHOWCASE
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  8000Hz · 0.001mm RT
                </span>
              </div>

              <div className="aspect-square w-full bg-slate-50/70 rounded-2xl flex items-center justify-center p-6 border border-slate-100 overflow-hidden relative group">
                <ProductImage
                  src={featuredKeyboard.primaryImage}
                  alt={featuredKeyboard.name}
                  category={featuredKeyboard.category.name}
                  className="group-hover:scale-105 transition-transform duration-300 max-h-[85%] max-w-[85%] object-contain"
                />
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
                    Pre-Order Batch 1
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-blue-600">{featuredKeyboard.brand.name}</div>
                  <div className="text-base font-extrabold text-slate-900 tracking-tight">{featuredKeyboard.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Harga</div>
                  <div className="text-base font-extrabold text-slate-900">
                    Rp {featuredKeyboard.variants[0]?.price.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              <Link
                href={`/products/${featuredKeyboard.slug}`}
                className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Lihat Spesifikasi &amp; Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. READY STOCK PICKS (Full Width Fluid) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Siap Kirim dari Jakarta Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Ready Stock Terverifikasi
            </h2>
          </div>
          <Link
            href="/shop?offer=READY"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua Ready</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
          {readyProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. PRE-ORDER DROPS (Full Width Fluid) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Batch Pabrikan Terjadwal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Pre-Order Drops
            </h2>
          </div>
          <Link
            href="/shop?offer=PREORDER"
            className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua Pre-Order</span>
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
