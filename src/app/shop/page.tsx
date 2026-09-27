import { getAllProducts, getBrands, getCategories } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import Link from "next/link";
import { Filter, Search, RotateCcw, Tag } from "lucide-react";

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
    { label: "Semua", slug: "" },
    { label: "Keyboard", slug: "keyboard" },
    { label: "Mouse", slug: "mouse" },
    { label: "Mousepad", slug: "mousepad" },
    { label: "Switches & Parts", slug: "switches-parts" },
    { label: "Audio", slug: "audio" },
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-teal-600 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>// ARCHIVE HARDWARE ENTHUSIAST</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1 font-mono uppercase">
            Precision Gear Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-mono">
            Katalog gear enthusiast: WLMouse, ATK/VXE, Lamzu, GLSSWRKS, X-Raypad, Wooting, dan lainnya.
          </p>
        </div>

        {/* Search Bar Form */}
        <form method="GET" action="/shop" className="relative w-full md:w-80">
          {category && <input type="hidden" name="category" value={category} />}
          {brand && <input type="hidden" name="brand" value={brand} />}
          {offer && <input type="hidden" name="offer" value={offer} />}
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Cari model atau brand..."
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 pl-10 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </form>
      </div>

      {/* Filter Matrix */}
      <div className="space-y-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        {/* Row 1: Categories */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-900 uppercase min-w-[110px] flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-teal-600" />
            KATEGORI:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((c) => {
              const isActive = (category || "") === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/shop?${new URLSearchParams({
                    ...(c.slug ? { category: c.slug } : {}),
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                    isActive
                      ? "bg-teal-600 border-teal-600 text-white font-bold shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Row 2: Brands */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-mono font-bold text-slate-900 uppercase min-w-[110px]">
            // BRAND:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              href={`/shop?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(offer ? { offer } : {}),
                ...(q ? { q } : {}),
              }).toString()}`}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${
                !brand
                  ? "bg-slate-900 border-slate-900 text-white font-bold"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
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
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all flex items-center gap-1 ${
                    isBrandActive
                      ? "bg-teal-600 border-teal-600 text-white font-bold shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] opacity-60">({b.count})</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Row 3: Offer Status & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase min-w-[110px]">
              STATUS OPSI:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  !offer ? "bg-white text-slate-900 font-bold shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Semua
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  offer: "READY",
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  offer === "READY"
                    ? "bg-teal-600 text-white font-bold shadow-sm"
                    : "text-slate-500 hover:text-teal-600"
                }`}
              >
                Ready Stock
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  offer: "PREORDER",
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  offer === "PREORDER"
                    ? "bg-orange-600 text-white font-bold shadow-sm"
                    : "text-slate-500 hover:text-orange-600"
                }`}
              >
                Pre-Order
              </Link>
            </div>
          </div>

          {(category || brand || offer || q) && (
            <Link
              href="/shop"
              className="text-xs font-mono text-orange-600 hover:underline flex items-center gap-1 self-start sm:self-auto font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Semua Filter
            </Link>
          )}
        </div>
      </div>

      {/* Meta Count */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-200 pb-2">
        <span>// MENAMPILKAN {products.length} GEAR TERVERIFIKASI</span>
        <span>AUTH DISTRIBUTOR · PENGIRIMAN DARI JAKARTA</span>
      </div>

      {/* Product Grid (Full Width Responsive Grid) */}
      {products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Filter className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-900 font-mono uppercase">Tidak ada gear yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-mono">
            Kombinasi kategori atau filter brand saat ini belum memiliki stok terdaftar.
          </p>
          <Link
            href="/shop"
            className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold font-mono rounded-xl mt-2 shadow-sm hover:bg-teal-600 transition-colors"
          >
            Reset Filter
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
