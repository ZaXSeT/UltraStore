import Link from "next/link";
import { getAllProducts } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  const products = getAllProducts();
  const readyProducts = products.filter((p) =>
    p.offers.some((o) => o.offerType === "READY")
  ).slice(0, 4);

  const preorderProduct = products.find((p) =>
    p.offers.some((o) => o.offerType === "PREORDER")
  );

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION (Precision Workshop 7/5 Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest text-[#184E46] uppercase bg-[#E4ECE6] px-3 py-1 rounded">
              <span>ULTRASTORE / GEAR SELECTION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#202724] leading-[1.1]">
              Gear pilihan.<br />
              <span className="text-[#184E46]">Setup dengan karakter.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#59635E] max-w-xl leading-relaxed">
              Temukan peripheral presisi untuk cara kamu bekerja dan bermain. Pilih ready stock yang siap dikirim hari ini, atau ikuti rilisan pre-order batch dengan jadwal produksi yang transparan.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop?offer=READY"
                className="px-6 py-3.5 bg-[#184E46] text-[#F4F1EA] text-sm font-semibold rounded hover:bg-[#123d37] transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Belanja ready stock</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop?offer=PREORDER"
                className="px-6 py-3.5 bg-[#F4E5DC] text-[#A84329] border border-[#A84329]/30 text-sm font-semibold rounded hover:bg-[#ebd5c8] transition-colors"
              >
                Lihat jadwal pre-order
              </Link>
            </div>

            {/* Invariant Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D9DDD5] text-xs font-mono text-[#59635E]">
              <div>
                <span className="block font-bold text-[#202724]">100% RESMI</span>
                <span>Spesifikasi pabrik faktual</span>
              </div>
              <div>
                <span className="block font-bold text-[#202724]">ATOMIK</span>
                <span>Tanpa overselling stok</span>
              </div>
              <div>
                <span className="block font-bold text-[#202724]">DROP LEDGER</span>
                <span>Progres PO terlacak</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) Featured Hero Graphic */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 relative shadow-sm">
              <div className="absolute top-4 right-4 bg-[#F4F1EA] border border-[#D9DDD5] px-2.5 py-1 text-[11px] font-mono text-[#59635E] rounded">
                FEATURED / 01
              </div>

              <div className="aspect-[4/3] w-full flex items-center justify-center p-4">
                <img
                  src="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80"
                  alt="Keychron V1 Max Custom Keyboard"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-[#D9DDD5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-[#59635E]">KEYCHRON V1 MAX</div>
                  <div className="text-sm font-bold text-[#202724]">75% Wireless Custom QMK/VIA</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-[#184E46] font-bold">READY STOCK</div>
                  <div className="text-sm font-mono font-bold text-[#202724]">Rp1.549.000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Baseline */}
        <div className="mt-14 pt-4 border-t border-[#D9DDD5] flex items-center justify-between text-xs font-mono text-[#59635E]">
          <span>01 / DESK ESSENTIALS</span>
          <span>CURATED HARDWARE FOR WORK & PLAY</span>
        </div>
      </section>

      {/* 2. SECTION: READY FOR YOUR DESK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#184E46] font-bold">Ready for your desk</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202724] mt-1">
              Siap masuk setup kamu
            </h2>
          </div>
          <Link
            href="/shop?offer=READY"
            className="text-sm font-semibold text-[#184E46] hover:text-[#123d37] flex items-center gap-1 font-mono"
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

      {/* 3. SECTION: THE NEXT DROP (Pre-order Spotlight) */}
      {preorderProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFFFFF] border-2 border-[#A84329]/30 rounded overflow-hidden p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Photo */}
              <div className="lg:col-span-5 bg-[#F9F8F6] rounded p-6 flex items-center justify-center border border-[#D9DDD5]">
                <img
                  src={preorderProduct.primaryImage}
                  alt={preorderProduct.name}
                  className="w-full h-auto max-h-72 object-contain"
                />
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F4E5DC] text-[#A84329] text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#A84329] animate-pulse"></span>
                    THE NEXT DROP · BATCH RILISAN 04
                  </span>
                  <span className="text-xs font-mono text-[#59635E]">
                    Est. Kirim: 18–28 November 2026
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#202724] tracking-tight">
                  {preorderProduct.name}
                </h3>

                <p className="text-sm sm:text-base text-[#59635E] leading-relaxed">
                  Analog Hall Effect magnetic switch dengan kapabilitas Rapid Trigger variabel hingga akurasi 0.1mm. Kuota produksi terikat langsung dengan jalur perakitan pabrik resmi.
                </p>

                {/* Quota Progress */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#59635E]">Alokasi Terisi: 12 dari 50 Unit</span>
                    <span className="text-[#A84329] font-bold">24% Terpesan</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F4F1EA] rounded-full overflow-hidden border border-[#D9DDD5]">
                    <div className="h-full bg-[#A84329] rounded-full" style={{ width: "24%" }}></div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/products/${preorderProduct.slug}`}
                    className="px-6 py-3 bg-[#A84329] text-white text-sm font-semibold rounded hover:bg-[#8e3822] transition-colors flex items-center gap-2"
                  >
                    <span>Pre-order batch ini (Rp3.499.000)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/drops/${preorderProduct.slug}-batch-04`}
                    className="text-sm font-semibold text-[#59635E] hover:text-[#202724] font-mono underline underline-offset-4"
                  >
                    Buka Drop Ledger timeline
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SECTION: PILIH BERDASARKAN KEBUTUHAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#59635E]">Kurasi Meja</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202724] mt-1">
            Pilih berdasarkan kebutuhan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link
            href="/shop?category=audio"
            className="group bg-[#FFFFFF] border border-[#D9DDD5] p-6 rounded hover:border-[#184E46] transition-all"
          >
            <div className="text-xs font-mono text-[#184E46] mb-2">01 / FOCUS & AUDIO</div>
            <h3 className="text-lg font-bold text-[#202724] group-hover:text-[#184E46] transition-colors">
              Meja kerja tenang
            </h3>
            <p className="text-xs text-[#59635E] mt-2 leading-relaxed">
              Headphone open-back reference dengan separasi instrumen jernih untuk produktivitas panjang tanpa lelah telinga.
            </p>
            <div className="mt-6 text-xs font-mono font-semibold text-[#184E46] flex items-center gap-1">
              Lihat gear audio <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/shop?category=mouse"
            className="group bg-[#FFFFFF] border border-[#D9DDD5] p-6 rounded hover:border-[#184E46] transition-all"
          >
            <div className="text-xs font-mono text-[#184E46] mb-2">02 / SPEED & AGILITY</div>
            <h3 className="text-lg font-bold text-[#202724] group-hover:text-[#184E46] transition-colors">
              Main lebih ringan
            </h3>
            <p className="text-xs text-[#59635E] mt-2 leading-relaxed">
              Mouse wireless sub-60 gram, sensor optik 32.000 DPI, dan polling rate hingga 4000 Hz untuk kontrol instingtif.
            </p>
            <div className="mt-6 text-xs font-mono font-semibold text-[#184E46] flex items-center gap-1">
              Lihat gear mouse <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/shop?category=keyboard"
            className="group bg-[#FFFFFF] border border-[#D9DDD5] p-6 rounded hover:border-[#184E46] transition-all"
          >
            <div className="text-xs font-mono text-[#184E46] mb-2">03 / TACTILE & ACOUSTIC</div>
            <h3 className="text-lg font-bold text-[#202724] group-hover:text-[#184E46] transition-colors">
              Mulai mechanical
            </h3>
            <p className="text-xs text-[#59635E] mt-2 leading-relaxed">
              Pilihan layout 75% & 60% gasket mount dengan switch Jupiter & Lekker yang siap pakai tanpa perlu modding rumit.
            </p>
            <div className="mt-6 text-xs font-mono font-semibold text-[#184E46] flex items-center gap-1">
              Lihat keyboard <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
