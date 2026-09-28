import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getBrands } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers, Flame } from "lucide-react";

// ponytail: static category tiles & featured collab banner. Upgrade to dynamic CMS when marketing team needs frequent banner swaps.
export default function HomePage() {
  const products = getAllProducts();
  const brands = getBrands();

  const readyProducts = products
    .filter((p) => p.offers.some((o) => o.offerType === "READY"))
    .slice(0, 10);

  const preorderBatches = products
    .filter((p) => p.offers.some((o) => o.offerType === "PREORDER"))
    .slice(0, 8);

  const macroCategories = [
    {
      title: "Keyboards",
      subtitle: "8K Hall Effect & Custom Kits",
      href: "/shop?category=keyboard",
      count: products.filter((p) => p.category.slug === "keyboard").length,
      image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/d7a0e34b71cf46ef9044ee844081c7f5_tplv-aphluv4xwc-origin-jpeg.jpg?v=1790226462&width=1200",
    },
    {
      title: "Gaming Mice",
      subtitle: "Ultralight Magnesium & Optical",
      href: "/shop?category=mouse",
      count: products.filter((p) => p.category.slug === "mouse").length,
      image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/sg-11134201-7ra2g-mbc156lnc0h339.jpg?v=1790226462&width=1200",
    },
    {
      title: "Precision Glasspads",
      subtitle: "Tempered Glass & Poron Cloth",
      href: "/shop?category=mousepad",
      count: products.filter((p) => p.category.slug === "mousepad").length,
      image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/image_2026-09-04_135924269.png?v=1790226462&width=1200",
    },
    {
      title: "Artisan Switches",
      subtitle: "Linear, Tactile & HE Magnetic",
      href: "/shop?category=switches-parts",
      count: products.filter((p) => p.category.slug === "switches-parts").length,
      image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/image_2026-09-24_155403291.png?v=1790240106&width=1200",
    },
    {
      title: "Pre-Order Drops",
      subtitle: "Batch Terjadwal Pabrikan",
      href: "/shop?offer=PREORDER",
      count: preorderBatches.length,
      image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/1d78c62c931144a2ac537cc52cc4023d_tplv-aphluv4xwc-origin-jpeg.jpg?v=1790232073&width=1200",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 w-full">
      {/* 1. BRAND TICKER (Full Width) */}
      <section className="bg-[#0B0F17] text-slate-300 py-2.5 border-b border-slate-800 overflow-hidden text-xs w-full">
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

      {/* 2. FEATURED COLLABORATION HERO BANNER */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Banner Copy (7 cols) */}
            <div className="p-8 sm:p-12 lg:p-14 lg:col-span-7 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>LIMITED COLLABORATION DROP 2026</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                  GLSSWRKS <span className="text-blue-400">ZOFIA</span><br />
                  TEMPERED GLASS_
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Surface kaca aluminosilikat etched micro-texture dengan base full silicone molded. Kontrol presisi mikroskopis untuk mouse gaming kompetitif.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                  490 x 420 x 3.8 mm
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                  CNC Beveled Edges
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                  Ready Stock Hub Jakarta
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/products/glsswrks-zofia-tempered-glass"
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <span>DAPATKAN SEKARANG</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/shop"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-white/20"
                >
                  JELAJAHI KATALOG
                </Link>
              </div>
            </div>

            {/* Banner Visual Artwork (5 cols) */}
            <div className="relative lg:col-span-5 h-72 sm:h-96 lg:h-full min-h-[320px] flex items-center justify-center p-6 overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0723/4908/9929/files/image_2026-09-04_135924269.png?v=1790226462&width=1200"
                  alt="GLSSWRKS Zofia Art Edition Glasspad"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5-COLUMN MACRO CATEGORY SHOWCASE */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Kategori Gear Presisi</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">5 Spesialisasi Periferal</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {macroCategories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 hover:border-blue-500 hover:shadow-xl transition-all flex flex-col justify-end aspect-[4/5] p-5 text-white"
            >
              {/* Background Photo with Subtle Dark Gradient */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

              {/* Category Info Overlay */}
              <div className="relative z-10 space-y-1">
                <span className="text-[11px] font-mono text-blue-400 font-semibold block uppercase tracking-wider">
                  {cat.count} Produk
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-blue-300 transition-colors leading-tight">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. READY STOCK CATALOG GRID */}
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

      {/* 5. PRE-ORDER DROPS */}
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
