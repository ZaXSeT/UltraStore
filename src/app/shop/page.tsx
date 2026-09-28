import { getAllProducts, getBrands, getCategories } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import { ShopSidebar } from "../../components/ShopSidebar";
import Link from "next/link";
import { Filter, RotateCcw, X } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; offer?: string; q?: string }>;
}) {
  const { category, brand, offer, q } = await searchParams;
  let products = getAllProducts(category, offer, brand);
  const allBrands = getBrands();
  const allCategories = getCategories();

  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  // Find active category & brand metadata
  const activeCategoryObj = allCategories.find((c) => c.slug === category);
  const activeBrandObj = allBrands.find((b) => b.slug === brand);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Editorial Header */}
      <div className="border-b border-[#D9DDD5] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E4ECE6] border border-[#184E46]/30 text-[10px] font-mono font-bold text-[#184E46] tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#184E46]"></span>
            <span>VERIFIED HARDWARE ARCHIVE // JAKARTA HUB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202724] font-mono uppercase">
            Katalog Hardware Presisi
          </h1>
          <p className="text-xs sm:text-sm text-[#59635E] mt-1 font-mono">
            Peripheral teknis terkurasi: keyboard Hall Effect, mouse ultralight, precision glasspads, switch enthusiast.
          </p>
        </div>

        <div className="text-xs font-mono text-[#59635E] text-left md:text-right space-y-0.5">
          <div className="text-[11px] uppercase tracking-wider text-[#202724] font-bold">
            GARANSI RESMI DISTRIBUTOR
          </div>
          <div className="text-[11px] text-[#184E46]">
            100% PRODUK ASLI · NON-AI CATALOG
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Left Sticky Sidebar + Right Product Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Column: Sticky Sidebar (Fixed on scroll, does not scroll away with catalog) */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-28 self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <ShopSidebar
            allCategories={allCategories}
            allBrands={allBrands}
            currentCategory={category}
            currentBrand={brand}
            currentOffer={offer}
            searchQuery={q}
            totalProducts={products.length}
          />
        </aside>

        {/* Right Column: Catalog Grid & Active Filter Spec Bar */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Active Filter Chips & Summary Telemetry Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#59635E] border-b border-[#D9DDD5] pb-3 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 font-bold text-[#202724]">
                <span className="w-2 h-2 rounded-full bg-[#184E46]"></span>
                <span>{products.length} GEAR TERSEDIA</span>
              </span>

              {/* Active Category Chip */}
              {activeCategoryObj && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#202724] text-[#202724] hover:bg-[#F4F1EA] transition-colors shadow-[1px_1px_0px_#202724]"
                >
                  <span>Kategori: {activeCategoryObj.name}</span>
                  <X className="w-3 h-3 text-[#A84329]" />
                </Link>
              )}

              {/* Active Brand Chip */}
              {activeBrandObj && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#202724] text-[#202724] hover:bg-[#F4F1EA] transition-colors shadow-[1px_1px_0px_#202724]"
                >
                  <span>Brand: {activeBrandObj.name}</span>
                  <X className="w-3 h-3 text-[#A84329]" />
                </Link>
              )}

              {/* Active Offer Chip */}
              {offer && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(brand ? { brand } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#202724] text-[#202724] hover:bg-[#F4F1EA] transition-colors shadow-[1px_1px_0px_#202724]"
                >
                  <span>Status: {offer === "READY" ? "Ready Stock" : "Pre-Order"}</span>
                  <X className="w-3 h-3 text-[#A84329]" />
                </Link>
              )}

              {/* Active Search Query Chip */}
              {q && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4E5DC] border border-[#A84329] text-[#A84329] hover:bg-[#F4E5DC]/80 transition-colors"
                >
                  <span>Cari: "{q}"</span>
                  <X className="w-3 h-3 text-[#A84329]" />
                </Link>
              )}
            </div>

            <span className="text-[10px] text-[#59635E] uppercase tracking-wider">
              SORT: TERAKREDITASI DISTRIBUTOR
            </span>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="bg-white border border-[#D9DDD5] rounded-md p-10 text-center space-y-4 max-w-md mx-auto my-8">
              <div className="w-10 h-10 rounded border border-[#D9DDD5] bg-[#F4F1EA] flex items-center justify-center mx-auto text-[#59635E]">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#202724] font-mono uppercase">
                  Tidak Ada Peripheral Sesuai Filter
                </h3>
                <p className="text-xs text-[#59635E] mt-1 font-mono leading-relaxed">
                  Kombinasi kategori atau filter brand saat ini tidak memiliki stok aktif. Silakan reset filter pencarian di sidebar kiri.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#202724] text-white text-xs font-bold font-mono rounded shadow-[2px_2px_0px_#184E46] hover:bg-[#184E46] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
