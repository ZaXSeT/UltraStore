import { getAllProducts, getBrands, getCategories } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import { ShopSidebar } from "../../components/ShopSidebar";
import Link from "next/link";
import { Filter, RotateCcw, X, ShieldCheck, Check } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; offer?: string; q?: string; surface?: string }>;
}) {
  const { category, brand, offer, q, surface } = await searchParams;
  let products = getAllProducts(category, offer, brand, surface);
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
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6">
      {/* Swiss Editorial Header Section */}
      <div className="border-b border-neutral-200/90 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#111215]">
            <span className="w-1.5 h-1.5 bg-[#0E52FF]"></span>
            <span>OFFICIAL CENTRAL HUB · JAKARTA INVENTORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111215]">
            Hardware Directory
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-3xl font-mono leading-relaxed">
            Mechanical keyboards, ultralight wireless mice, precision glasspads, and custom artisan switches with official warranty.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs font-mono text-neutral-500 shrink-0">
          <div className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-3 py-1.5 text-xs text-[#111215]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0E52FF]" />
            <span className="font-bold uppercase tracking-wider text-[11px]">1-Year Official Warranty</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400">
            Direct Dispatch: 24H Turnaround
          </span>
        </div>
      </div>

      {/* 2-Column Full-Width Layout: Left Sticky Sidebar + Right Product Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Column: Sticky Sidebar (Fixed on scroll) */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <ShopSidebar
            allCategories={allCategories}
            allBrands={allBrands}
            currentCategory={category}
            currentBrand={brand}
            currentOffer={offer}
            currentSurface={surface}
            searchQuery={q}
            totalProducts={products.length}
          />
        </aside>

        {/* Right Column: Catalog Grid & Active Filter Chips */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Active Filter Chips & Summary Telemetry Bar (Swiss Architecture) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-neutral-500 border-b border-neutral-200/90 pb-3 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 font-bold text-[#111215] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-[#0E52FF]"></span>
                <span>{products.length} Items Listed</span>
              </span>

              {/* Active Category Tag */}
              {activeCategoryObj && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-neutral-300 bg-white hover:border-[#111215] text-[#111215] transition-colors text-[11px] uppercase tracking-wider"
                >
                  <span>Category: {activeCategoryObj.name}</span>
                  <X className="w-3 h-3 text-neutral-400 hover:text-[#111215]" />
                </Link>
              )}

              {/* Active Brand Tag */}
              {activeBrandObj && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-neutral-300 bg-white hover:border-[#111215] text-[#111215] transition-colors text-[11px] uppercase tracking-wider"
                >
                  <span>Brand: {activeBrandObj.name}</span>
                  <X className="w-3 h-3 text-neutral-400 hover:text-[#111215]" />
                </Link>
              )}

              {/* Active Offer Tag */}
              {offer && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(brand ? { brand } : {}),
                    ...(surface ? { surface } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#0E52FF] bg-[#0E52FF]/10 text-[#0E52FF] transition-colors text-[11px] font-bold uppercase tracking-wider"
                >
                  <span>Offer: {offer}</span>
                  <X className="w-3 h-3 text-[#0E52FF] hover:text-[#111215]" />
                </Link>
              )}

              {/* Active Mousepad Surface Tag */}
              {surface && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#111215] bg-[#111215] text-white hover:bg-[#0E52FF] hover:border-[#0E52FF] transition-colors text-[11px] uppercase tracking-wider"
                >
                  <span>Surface: {surface === "glass" ? "Glasspad (Kaca)" : "Cloth / Poron"}</span>
                  <X className="w-3 h-3 text-neutral-300 hover:text-white" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors text-xs font-medium"
                >
                  <span>Cari: "{q}"</span>
                  <X className="w-3.5 h-3.5 text-blue-600" />
                </Link>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Katalog Terverifikasi UltraStore
            </span>
          </div>

          {/* Product Grid: Responsive from 2 up to 5/6 columns on ultra-wide */}
          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tidak Ada Produk Sesuai Filter
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kombinasi kategori atau filter brand saat ini belum memiliki produk yang cocok. Silakan atur ulang filter pencarian Anda.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1920px]:grid-cols-6 3xl:grid-cols-6 gap-5 xl:gap-6">
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
