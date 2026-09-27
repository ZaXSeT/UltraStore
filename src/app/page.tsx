import Link from "next/link";
import { getAllProducts, getBrands } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
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
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. BRAND TICKER / MARQUEE (Enthusiast Brands from Infinitas) */}
      <section className="bg-[#202724] text-[#F4F1EA] py-3 border-y-2 border-black overflow-hidden font-mono text-xs">
        <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar px-4">
          <span className="bg-[#184E46] text-[#F4F1EA] px-2 py-0.5 rounded font-bold uppercase text-[10px]">
            OFFICIAL DISTRIBUTOR
          </span>
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/shop?brand=${b.slug}`}
              className="hover:text-[#184E46] transition-colors flex items-center gap-2 group"
            >
              <span className="font-bold tracking-wider">{b.name}</span>
              <span className="text-[#59635E] group-hover:text-[#184E46]">/</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#184E46] uppercase bg-[#E4ECE6] px-3 py-1 rounded border border-[#184E46]/30">
              <Terminal className="w-3.5 h-3.5" />
              <span>PRECISION HARDWARE ARCHIVE // 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-[#202724] leading-[1.05] uppercase font-mono">
              Find your next <br />
              <span className="text-[#184E46] underline decoration-4 underline-offset-8">
                Endgame Setup
              </span>
              <span className="text-[#A84329] animate-pulse">_</span>
            </h1>

            <p className="text-sm sm:text-base text-[#59635E] max-w-xl font-mono leading-relaxed">
              Koleksi peripheral presisi berlisensi resmi: mouse magnesium 39g, keyboard Hall Effect rapid trigger 0.1mm, mousepad tempered glass, dan clacky linear switches.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shop?offer=READY"
                className="px-6 py-3.5 bg-[#184E46] text-[#F4F1EA] text-xs font-bold font-mono rounded hover:bg-[#123d37] transition-all flex items-center gap-2 shadow-[3px_3px_0px_#202724]"
              >
                <span>EXPLORE READY STOCK</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop?offer=PREORDER"
                className="px-6 py-3.5 bg-[#FFFFFF] border-2 border-[#202724] text-[#202724] hover:bg-[#F4F1EA] text-xs font-bold font-mono rounded transition-all shadow-[3px_3px_0px_#202724] flex items-center gap-2"
              >
                <span>DROP BATCH SCHEDULE</span>
                <span className="w-2 h-2 rounded-full bg-[#A84329] animate-ping"></span>
              </Link>
            </div>

            {/* Invariant Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#202724]/15 text-xs font-mono">
              <div className="p-2.5 rounded bg-white border border-[#202724]/10 shadow-sm">
                <span className="block font-bold text-[#202724] uppercase">// DISTRIBUTOR</span>
                <span className="text-[11px] text-[#59635E]">100% Terverifikasi</span>
              </div>
              <div className="p-2.5 rounded bg-white border border-[#202724]/10 shadow-sm">
                <span className="block font-bold text-[#184E46] uppercase">// ATOMIC STOCK</span>
                <span className="text-[11px] text-[#59635E]">Zero overselling</span>
              </div>
              <div className="p-2.5 rounded bg-white border border-[#202724]/10 shadow-sm">
                <span className="block font-bold text-[#A84329] uppercase">// DROP LEDGER</span>
                <span className="text-[11px] text-[#59635E]">Lacak batch PO</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) Featured Hero Graphic */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] border-2 border-[#202724] rounded p-6 relative shadow-[6px_6px_0px_#202724]">
              <div className="flex items-center justify-between border-b border-[#202724]/10 pb-3 mb-4">
                <span className="text-xs font-mono font-bold text-[#184E46]">
                  FEATURED DROPS // 01
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4ECE6] text-[#184E46] font-bold">
                  8000Hz POLLING
                </span>
              </div>

              <div className="aspect-square w-full bg-[#F9F8F6] rounded flex items-center justify-center p-6 border border-[#202724]/10 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"
                  alt="WLMouse Beast X Magnesium"
                  className="max-h-full max-w-full w-auto h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-[#202724]/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#184E46]">// WLMOUSE</div>
                  <div className="text-sm font-bold text-[#202724]">Beast X Magnesium 39g</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#59635E]">READY STOCK</div>
                  <div className="text-sm font-mono font-bold text-[#202724]">Rp2.150.000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY PILLARS (Infinitas Style Navigation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b-2 border-[#202724] pb-3 mb-6 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-[#202724]">
            // EXPLORE BY GEAR CATEGORY
          </span>
          <Link href="/shop" className="text-xs font-mono font-semibold text-[#184E46] hover:underline flex items-center gap-1">
            Lihat semua katalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/shop?category=keyboard"
            className="p-5 bg-white border border-[#202724] rounded shadow-[3px_3px_0px_#202724] hover:bg-[#184E46] hover:text-white transition-all group"
          >
            <div className="text-xs font-mono font-bold text-[#184E46] group-hover:text-white mb-1">
              [ 01 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase">Keyboards</h3>
            <p className="text-xs text-[#59635E] group-hover:text-neutral-200 font-mono mt-1">
              Hall Effect, Rapid Trigger, Custom Kits
            </p>
          </Link>

          <Link
            href="/shop?category=mouse"
            className="p-5 bg-white border border-[#202724] rounded shadow-[3px_3px_0px_#202724] hover:bg-[#184E46] hover:text-white transition-all group"
          >
            <div className="text-xs font-mono font-bold text-[#184E46] group-hover:text-white mb-1">
              [ 02 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase">Mice</h3>
            <p className="text-xs text-[#59635E] group-hover:text-neutral-200 font-mono mt-1">
              Magnesium 39g, 4K/8K Polling, Optical
            </p>
          </Link>

          <Link
            href="/shop?category=mousepad"
            className="p-5 bg-white border border-[#202724] rounded shadow-[3px_3px_0px_#202724] hover:bg-[#184E46] hover:text-white transition-all group"
          >
            <div className="text-xs font-mono font-bold text-[#184E46] group-hover:text-white mb-1">
              [ 03 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase">Mousepads</h3>
            <p className="text-xs text-[#59635E] group-hover:text-neutral-200 font-mono mt-1">
              Acid Etched Glass, Poron Base, Hybrid
            </p>
          </Link>

          <Link
            href="/shop?category=switches-parts"
            className="p-5 bg-white border border-[#202724] rounded shadow-[3px_3px_0px_#202724] hover:bg-[#184E46] hover:text-white transition-all group"
          >
            <div className="text-xs font-mono font-bold text-[#184E46] group-hover:text-white mb-1">
              [ 04 // CAT ]
            </div>
            <h3 className="font-extrabold text-base font-mono uppercase">Switches & Gear</h3>
            <p className="text-xs text-[#59635E] group-hover:text-neutral-200 font-mono mt-1">
              HMX Linears, Keycaps, Osu Keypads
            </p>
          </Link>
        </div>
      </section>

      {/* 4. READY STOCK SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b-2 border-[#202724] pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#184E46] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#184E46]"></span>
              // READY TO DISPATCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#202724] mt-1 font-mono uppercase">
              Stok Tersedia di Jakarta
            </h2>
          </div>
          <Link
            href="/shop?offer=READY"
            className="text-xs font-bold text-[#184E46] hover:text-[#123d37] flex items-center gap-1 font-mono uppercase"
          >
            Lihat semua ready stock <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {readyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. PRE-ORDER BATCH SPOTLIGHT */}
      {preorderBatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b-2 border-[#A84329] pb-4 mb-8 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#A84329] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A84329] animate-pulse"></span>
                // ACTIVE DROP BATCHES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#202724] mt-1 font-mono uppercase">
                Jadwal Rilisan Pre-Order
              </h2>
            </div>
            <Link
              href="/shop?offer=PREORDER"
              className="text-xs font-bold text-[#A84329] hover:underline flex items-center gap-1 font-mono uppercase"
            >
              Semua batch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preorderBatches.map((item) => {
              const poOffer = item.offers.find((o) => o.offerType === "PREORDER");
              return (
                <div
                  key={item.id}
                  className="bg-white border-2 border-[#202724] rounded p-6 shadow-[5px_5px_0px_#A84329] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#A84329] bg-[#F4E5DC] px-2 py-0.5 rounded border border-[#A84329]/30">
                        BATCH ACTIVE
                      </span>
                      <span className="text-[#59635E]">{item.brand.name}</span>
                    </div>

                    <div className="aspect-[4/3] bg-[#F9F8F6] rounded flex items-center justify-center p-4 border border-[#202724]/10 overflow-hidden">
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="max-h-full max-w-full w-auto h-auto object-contain hover:scale-105 transition-transform"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-[#202724] line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#59635E] font-mono mt-1">
                        Est. Pengiriman: {poOffer?.estimatedShipping || "Jadwal Terjadwal"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#202724]/10 flex items-center justify-between">
                    <span className="font-extrabold font-mono text-base text-[#202724]">
                      Rp{item.variants[0]?.price.toLocaleString("id-ID")}
                    </span>
                    <Link
                      href={`/products/${item.slug}`}
                      className="px-3.5 py-1.5 bg-[#A84329] text-white text-xs font-mono font-bold rounded shadow-[2px_2px_0px_#202724] hover:bg-[#8e3822] transition-colors"
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
