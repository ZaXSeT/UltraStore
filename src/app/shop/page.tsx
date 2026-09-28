import { getAllProducts, getBrands } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import { ShopFilters } from "../../components/ShopFilters";
import Link from "next/link";
import { Filter, Search, RotateCcw, X } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; offer?: string; q?: string }>;
}) {
  const { category, brand, offer, q } = await searchParams;
  let products = getAllProducts(category, offer, brand);
  const allBrands = getBrands();

  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-6">
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

        {/* Search Bar */}
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

      {/* Left-Aligned Clean Filter Bar with Dropdown Brand Selector */}
      <ShopFilters
        allBrands={allBrands}
        currentCategory={category}
        currentBrand={brand}
        currentOffer={offer}
        searchQuery={q}
        totalProducts={products.length}
      />

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
