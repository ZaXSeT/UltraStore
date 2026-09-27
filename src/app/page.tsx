import Link from "next/link";
import { getAllProducts, getBrands } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { ArrowRight, Sparkles, Terminal, Flame, ShieldCheck, Compass } from "lucide-react";

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
      {/* 1. BRAND TICKER / MARQUEE (Full Width) */}
      <section className="bg-slate-900 text-slate-200 py-3 border-b border-slate-800 overflow-hidden font-mono text-xs w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="bg-teal-500 text-slate-950 px-2 py-0.5 rounded font-bold uppercase text-[10px] tracking-wider shrink-0">
            OFFICIAL DISTRIBUTOR
          </span>
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/shop?brand=${b.slug}`}
              className="hover:text-teal-400 transition-colors flex items-center gap-2 group shrink-0"
            >
              <span className="font-bold tracking-wider">{b.name}</span>
              <span className="text-slate-600 group-hover:text-teal-400">/</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. HERO SECTION (Full Width Edge-to-Edge) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-teal-700 uppercase bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200 shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-teal-600" />
              <span>PRECISION HARDWARE ARCHIVE // 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-mono uppercase">
              Find your next <br />
              <span className="text-teal-600 underline decoration-teal-400/40 decoration-4 underline-offset-8">
                Endgame Setup
              </span>
              <span className="text-orange-500 animate-pulse">_</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-mono leading-relaxed">
              Koleksi peripheral presisi berlisensi resmi: mouse magnesium 39g, keyboard Hall Effect rapid trigger 0.1mm, mousepad tempered glass, dan clacky linear switches.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop?offer=READY"
                className="px-6 py-3.5 bg-slate-900 text-white text-xs font-bold font-mono rounded-xl hover:bg-teal-600 transition-all flex items-center gap-2 shadow-sm"
              >
                <span>EXPLORE READY STOCK</span>
                <ArrowRight className="w-4 h-4 text-teal-300" />
              </Link>

              <Link
                href="/shop?offer=PREORDER"
                className="px-6 py-3.5 bg-white border border-slate-300 text-slate-800 hover:border-orange-500 hover:text-orange-600 text-xs font-bold font-mono rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                <span>DROP BATCH SCHEDULE</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              </Link>
            </div>

            {/* Invariant Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="block font-bold text-slate-900 uppercase">// DISTRIBUTOR</span>
                <span className="text-[11px] text-slate-500">100% Terverifikasi</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="block font-bold text-teal-600 uppercase">// ATOMIC STOCK</span>
                <span className="text-[11px] text-slate-500">Zero overselling</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="block font-bold text-orange-600 uppercase">// DROP LEDGER</span>
                <span className="text-[11px] text-slate-500">Lacak batch PO</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) Featured Hero Graphic */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-teal-500 transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-mono font-bold text-teal-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  FEATURED DROPS // 01
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200">
                  8000Hz POLLING
                </span>
              </div>

              <div className="aspect-square w-full bg-slate-50/70 rounded-xl flex items-center justify-center p-6 border border-slate-100 overflow-hidden">
                <ProductImage
                  src="/images/products/wlmouse-beast-x-magnesium.jpg"
                  alt="WLMouse Beast X Magnesium"
                  category="mouse"
                  className="hover:scale-105"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-teal-600">// WLMOUSE</div>
                  <div className="text-base font-bold text-slate-900 font-mono">Beast X Magnesium 39g</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mb-0.5">READY STOCK</div>
                  <div className="text-base font-mono font-extrabold text-slate-900">Rp2.150.000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY PILLARS (Full Width) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="border-b border-slate-200 pb-3 mb-6 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-slate-900 tracking-wider">
            // EXPLORE BY GEAR CATEGORY
          </span>
          <Link href="/shop" className="text-xs font-mono font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            Lihat semua katalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/shop?category=keyboard"
            className="p-5 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-mono font-bold text-teal-600 mb-1">
              [ 01 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase text-slate-900 group-hover:text-teal-600 transition-colors">Keyboards</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Hall Effect, Rapid Trigger, Custom Kits
            </p>
          </Link>

          <Link
            href="/shop?category=mouse"
            className="p-5 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-mono font-bold text-teal-600 mb-1">
              [ 02 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase text-slate-900 group-hover:text-teal-600 transition-colors">Mice</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Magnesium 39g, 4K/8K Polling, Optical
            </p>
          </Link>

          <Link
            href="/shop?category=mousepad"
            className="p-5 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-mono font-bold text-teal-600 mb-1">
              [ 03 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase text-slate-900 group-hover:text-teal-600 transition-colors">Mousepads</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Acid Etched Glass, Poron Base, Hybrid
            </p>
          </Link>

          <Link
            href="/shop?category=switches-parts"
            className="p-5 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="text-xs font-mono font-bold text-teal-600 mb-1">
              [ 04 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase text-slate-900 group-hover:text-teal-600 transition-colors">Switches & Gear</h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              HMX Linears, Keycaps, Osu Keypads
            </p>
          </Link>
        </div>
      </section>

      {/* 4. READY STOCK SHOWCASE (Full Width Edge-to-Edge) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              // READY TO DISPATCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1 font-mono uppercase">
              Stok Tersedia di Jakarta
            </h2>
          </div>
          <Link
            href="/shop?offer=READY"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 font-mono uppercase"
          >
            Lihat semua ready stock <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {readyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. PRE-ORDER BATCH SPOTLIGHT (Full Width Edge-to-Edge) */}
      {preorderBatches.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="border-b border-orange-200 pb-4 mb-8 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                // ACTIVE DROP BATCHES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1 font-mono uppercase">
                Jadwal Rilisan Pre-Order
              </h2>
            </div>
            <Link
              href="/shop?offer=PREORDER"
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 font-mono uppercase"
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
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 text-[10px]">
                        BATCH ACTIVE
                      </span>
                      <span className="text-slate-500 font-bold">{item.brand.name}</span>
                    </div>

                    <div className="aspect-[4/3] bg-slate-50/70 rounded-xl flex items-center justify-center p-4 border border-slate-100 overflow-hidden">
                      <ProductImage
                        src={item.primaryImage}
                        alt={item.name}
                        category={item.category.name}
                        className="hover:scale-105"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        Est. Pengiriman: {poOffer?.estimatedShipping || "Jadwal Terjadwal"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-extrabold font-mono text-base text-slate-900">
                      Rp{item.variants[0]?.price.toLocaleString("id-ID")}
                    </span>
                    <Link
                      href={`/products/${item.slug}`}
                      className="px-4 py-2 bg-orange-600 text-white text-xs font-mono font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
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
