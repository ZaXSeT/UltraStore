import { getAllProducts, getBrands, getCategories } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import Link from "next/link";
import {
  Filter,
  Search,
  RotateCcw,
  Sparkles,
  Keyboard,
  Mouse,
  Layers,
  Sliders,
  Headphones,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; offer?: string; q?: string }>;
}) {
  const { category, brand, offer, q } = await searchParams;
  let products = getAllProducts(category, offer, brand);
  const allBrands = getBrands();
  const allCats = getCategories();

  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  const categories = [
    { label: "Semua Gear", slug: "", icon: Sparkles },
    { label: "Keyboard", slug: "keyboard", icon: Keyboard },
    { label: "Mouse", slug: "mouse", icon: Mouse },
    { label: "Mousepad", slug: "mousepad", icon: Layers },
    { label: "Switches & Parts", slug: "switches-parts", icon: Sliders },
    { label: "Audiophile", slug: "audio", icon: Headphones },
  ];

  const hasActiveFilters = Boolean(category || brand || offer || q);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="border-b border-slate-200/90 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[11px] font-mono font-bold text-teal-700 tracking-wider shadow-sm mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            <span>VERIFIED ENTHUSIAST ARCHIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-mono uppercase">
            Precision Gear Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-mono">
            Katalog hardware enthusiast terkurasi: WLMouse, ATK/VXE, Lamzu, GLSSWRKS, X-Raypad, Wooting, dan lainnya.
          </p>
        </div>

        {/* Floating Glassmorphic Search Bar */}
        <form method="GET" action="/shop" className="relative w-full lg:w-96">
          {category && <input type="hidden" name="category" value={category} />}
          {brand && <input type="hidden" name="brand" value={brand} />}
          {offer && <input type="hidden" name="offer" value={offer} />}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Cari model, switch, atau brand..."
              className="w-full bg-white border border-slate-300/80 rounded-2xl pl-11 pr-24 py-3 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all"
            />
            {q ? (
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  ...(offer ? { offer } : {}),
                }).toString()}`}
                className="absolute right-3 px-2 py-1 rounded-lg text-[10px] font-mono text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Hapus</span>
              </Link>
            ) : (
              <button
                type="submit"
                className="absolute right-2.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-mono font-bold hover:bg-teal-600 transition-colors shadow-sm"
              >
                Cari
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modern Filter Control Console */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
        {/* Tier 1: Category Segmented Tab Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Kategori Gear
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => {
              const isActive = (category || "") === c.slug;
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  href={`/shop?${new URLSearchParams({
                    ...(c.slug ? { category: c.slug } : {}),
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? "bg-slate-950 text-white font-bold shadow-md shadow-slate-950/15 ring-1 ring-slate-900"
                      : "bg-slate-50/80 border border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-slate-500"}`} />
                  <span>{c.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tier 2: Fulfillment Status & Reset Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider min-w-[90px]">
              Ketersediaan:
            </span>

            <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-mono">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 font-medium ${
                  !offer
                    ? "bg-white text-slate-950 font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-950 hover:bg-white/50"
                }`}
              >
                Semua Opsi
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  offer: "READY",
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 font-medium ${
                  offer === "READY"
                    ? "bg-teal-600 text-white font-bold shadow-sm shadow-teal-600/20"
                    : "text-slate-600 hover:text-teal-700 hover:bg-white/50"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${offer === "READY" ? "bg-white" : "bg-teal-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${offer === "READY" ? "bg-white" : "bg-teal-500"}`}></span>
                </span>
                <span>Ready Stock</span>
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  offer: "PREORDER",
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 font-medium ${
                  offer === "PREORDER"
                    ? "bg-orange-600 text-white font-bold shadow-sm shadow-orange-600/20"
                    : "text-slate-600 hover:text-orange-700 hover:bg-white/50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${offer === "PREORDER" ? "bg-white animate-pulse" : "bg-orange-500 animate-pulse"}`}></span>
                <span>Pre-Order Drops</span>
              </Link>
            </div>
          </div>

          {/* Quick Clear All Filters button */}
          {hasActiveFilters && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50/80 text-orange-700 text-xs font-mono font-bold hover:bg-orange-100 hover:border-orange-300 transition-colors shadow-sm self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </Link>
          )}
        </div>

        {/* Tier 3: Curated Enthusiast Brands Strip */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Pilih Brand ({allBrands.length} Partner Resmi)
            </span>
            {brand && (
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(offer ? { offer } : {}),
                  ...(q ? { q } : {}),
                }).toString()}`}
                className="text-[11px] font-mono text-teal-600 hover:underline"
              >
                Lihat Semua Brand →
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/shop?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(offer ? { offer } : {}),
                ...(q ? { q } : {}),
              }).toString()}`}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all duration-200 ${
                !brand
                  ? "bg-teal-600 border-teal-600 text-white font-bold shadow-sm shadow-teal-600/25"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-950"
              }`}
            >
              Semua Brand
            </Link>

            {allBrands.map((b) => {
              const isBrandActive = (brand || "") === b.slug;
              return (
                <Link
                  key={b.slug}
                  href={`/shop?${new URLSearchParams({
                    ...(category ? { category } : {}),
                    brand: b.slug,
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xl border transition-all duration-200 ${
                    isBrandActive
                      ? "bg-teal-600 border-teal-600 text-white font-bold shadow-sm shadow-teal-600/25"
                      : "bg-slate-50/70 border-slate-200/90 text-slate-700 hover:border-slate-400 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  <span>{b.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                      isBrandActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/70 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900"
                    }`}
                  >
                    {b.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meta Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-200/80 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <span>MENAMPILKAN {products.length} GEAR TERVERIFIKASI</span>
        </div>
        <span className="text-[11px] text-slate-400">
          GARANSI RESMI ULTRASTORE · PENGIRIMAN DARI HUB JAKARTA
        </span>
      </div>

      {/* Product Grid (Full Width Responsive Grid) */}
      {products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-mono uppercase">
              Tidak Ada Gear Yang Sesuai Filter
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-mono leading-relaxed">
              Kombinasi kategori atau filter brand saat ini belum memiliki stok yang cocok. Silakan atur ulang filter pencarian kamu.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white text-xs font-bold font-mono rounded-xl shadow-sm hover:bg-teal-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
