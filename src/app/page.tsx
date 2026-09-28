import Link from "next/link";
import { getAllProducts, getBrands } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Layers } from "lucide-react";

export default function HomePage() {
  const products = getAllProducts();
  const brands = getBrands();

  const readyProducts = products.filter((p) =>
    p.offers.some((o) => o.offerType === "READY")
  ).slice(0, 8);

  const preorderBatches = products.filter((p) =>
    p.offers.some((o) => o.offerType === "PREORDER")
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 w-full">
      {/* 1. BRAND TICKER / MARQUEE */}
      <section className="bg-[#090D16] text-slate-200 py-3 border-b border-slate-800/80 overflow-hidden text-xs w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider shrink-0">
            Distributor Resmi
          </span>
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/shop?brand=${b.slug}`}
              className="hover:text-blue-400 transition-colors flex items-center gap-3 font-medium text-slate-300 shrink-0"
            >
              <span>{b.name}</span>
              <span className="text-slate-600">·</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. HERO SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Koleksi Hardware Presisi 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Endgame Setup untuk Kerja &amp; Gaming Presisi
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Koleksi peripheral bergaransi resmi: keyboard magnetic rapid trigger 0.1mm, mouse magnesium super-ringan 39g, mousepad tempered glass, dan switch enthusiast pilihan.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop?offer=READY"
                className="px-6 py-3.5 bg-[#090D16] text-white text-sm font-semibold rounded-xl hover:bg-[#2563EB] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Lihat Ready Stock</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </Link>

              <Link
                href="/shop?offer=PREORDER"
                className="px-6 py-3.5 bg-white border border-slate-300 text-slate-800 hover:border-blue-600 hover:text-blue-600 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <span>Jadwal Pre-Order Drops</span>
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              </Link>
            </div>

            {/* Invariant Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <span className="block font-bold text-slate-900 mb-0.5">Distributor Resmi</span>
                <span className="text-slate-500">100% Produk Original Pabrikan</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <span className="block font-bold text-emerald-700 mb-0.5">Stok Terjamin</span>
                <span className="text-slate-500">Sinkronisasi stok fisik Jakarta</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <span className="block font-bold text-blue-700 mb-0.5">Transparansi Pre-Order</span>
                <span className="text-slate-500">Jadwal estimasi batch faktual</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) Featured Hero Graphic */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Produk Unggulan
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  8000Hz Polling
                </span>
              </div>

              <div className="aspect-square w-full bg-slate-50/70 rounded-xl flex items-center justify-center p-6 border border-slate-100 overflow-hidden">
                <ProductImage
                  src="/images/products/wlmouse-beast-x-magnesium.jpg"
                  alt="WLMouse Beast X Magnesium"
                  category="mouse"
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-blue-600">WLMouse</div>
                  <div className="text-base font-bold text-slate-900">Beast X Magnesium 39g</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mb-0.5">
                    Ready Stock
                  </div>
                  <div className="text-base font-bold text-slate-900 font-tabular">Rp2.150.000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY PILLARS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="border-b border-slate-200/80 pb-3 mb-6 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Jelajahi Berdasarkan Kategori
          </span>
          <Link href="/shop" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Lihat semua katalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/shop?category=keyboard"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-semibold text-blue-600 mb-1">Kategori 01</div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">Keyboards</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Hall Effect, Rapid Trigger, Custom Kits
            </p>
          </Link>

          <Link
            href="/shop?category=mouse"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-semibold text-blue-600 mb-1">Kategori 02</div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">Mice</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Magnesium 39g, 4K/8K Polling, Optical
            </p>
          </Link>

          <Link
            href="/shop?category=mousepad"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-semibold text-blue-600 mb-1">Kategori 03</div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">Mousepads</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Acid Etched Glass, Poron Base, Hybrid
            </p>
          </Link>

          <Link
            href="/shop?category=switches-parts"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-semibold text-blue-600 mb-1">Kategori 04</div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">Switches &amp; Aksesoris</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              HMX Linears, Custom Keycaps, Osu Keypads
            </p>
          </Link>
        </div>
      </section>

      {/* 4. READY STOCK SHOWCASE */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Produk Siap Kirim
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              Stok Tersedia di Hub Jakarta
            </h2>
          </div>
          <Link
            href="/shop?offer=READY"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase"
          >
            Lihat semua ready stock <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {readyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. PRE-ORDER BATCH SPOTLIGHT */}
      {preorderBatches.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="border-b border-slate-200/80 pb-4 mb-8 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-blue-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Pre-Order Batch
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
                Jadwal Rilisan Pre-Order
              </h2>
            </div>
            <Link
              href="/shop?offer=PREORDER"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase"
            >
              Semua batch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {preorderBatches.map((item) => {
              const poOffer = item.offers.find((o) => o.offerType === "PREORDER");
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 text-xs">
                        Batch Aktif
                      </span>
                      <span className="text-slate-500 font-medium">{item.brand.name}</span>
                    </div>

                    <div className="aspect-[4/3] bg-slate-50/70 rounded-xl flex items-center justify-center p-4 border border-slate-100 overflow-hidden">
                      <ProductImage
                        src={item.primaryImage}
                        alt={item.name}
                        category={item.category.name}
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Estimasi Pengiriman: {poOffer?.estimatedShipping || "Jadwal Terjadwal"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-base text-slate-900 font-tabular">
                      Rp{item.variants[0]?.price.toLocaleString("id-ID")}
                    </span>
                    <Link
                      href={`/products/${item.slug}`}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Ikut Batch
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
