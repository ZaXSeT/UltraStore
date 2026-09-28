import { getAllProducts, getBrands, getCategories } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import { ShopSidebar } from "../../components/ShopSidebar";
import Link from "next/link";
import { Filter, RotateCcw, X, ShieldCheck } from "lucide-react";

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header Section */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700 mb-3 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Distributor Resmi Terverifikasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Katalog Peripheral Presisi
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Koleksi hardware pilihan: mechanical keyboard, ultralight gaming mice, precision glasspads, dan switch enthusiast bergaransi resmi.
          </p>
        </div>

        <div className="text-xs text-slate-500 text-left md:text-right space-y-1">
          <div className="font-semibold text-slate-800">
            Gudang Hub: Jakarta Selatan
          </div>
          <div className="text-teal-600 font-medium">
            100% Produk Original Pabrikan
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Left Sticky Sidebar + Right Product Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Column: Sticky Sidebar (Fixed on scroll) */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
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

        {/* Right Column: Catalog Grid & Active Filter Pills */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Active Filter Chips & Summary Telemetry Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 border-b border-slate-200/80 pb-3 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 font-semibold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <span>{products.length} Produk Ditemukan</span>
              </span>

              {/* Active Category Chip */}
              {activeCategoryObj && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors text-xs font-medium"
                >
                  <span>Kategori: {activeCategoryObj.name}</span>
                  <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors text-xs font-medium"
                >
                  <span>Brand: {activeBrandObj.name}</span>
                  <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors text-xs font-medium"
                >
                  <span>Status: {offer === "READY" ? "Ready Stock" : "Pre-Order"}</span>
                  <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100 transition-colors text-xs font-medium"
                >
                  <span>Cari: "{q}"</span>
                  <X className="w-3.5 h-3.5 text-teal-600" />
                </Link>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Katalog Terverifikasi UltraStore
            </span>
          </div>

          {/* Product Grid */}
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
