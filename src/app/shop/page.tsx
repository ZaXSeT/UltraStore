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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#202724] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#184E46] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#184E46]"></span>
            <span>// ARCHIVE HARDWARE ENTHUSIAST</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#202724] mt-1 font-mono uppercase">
            Precision Gear Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#59635E] mt-1 font-mono">
            Katalog gear enthusiast: WLMouse, ATK/VXE, Lamzu, GLSSWRKS, X-Raypad, Wooting, dan lainnya.
          </p>
        </div>

        {/* Search Bar Form */}
        <form method="GET" action="/shop" className="relative w-full md:w-72">
          {category && <input type="hidden" name="category" value={category} />}
          {brand && <input type="hidden" name="brand" value={brand} />}
          {offer && <input type="hidden" name="offer" value={offer} />}
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Cari model atau brand..."
            className="w-full bg-[#FFFFFF] border border-[#202724] rounded px-3.5 py-2 pl-9 text-xs font-mono text-[#202724] placeholder-[#59635E] focus:outline-none focus:ring-1 focus:ring-[#184E46] shadow-[2px_2px_0px_#202724]"
          />
          <Search className="w-4 h-4 text-[#59635E] absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Filter Matrix */}
      <div className="space-y-4 bg-[#FFFFFF] border border-[#202724]/20 p-4 sm:p-5 rounded shadow-sm">
        {/* Row 1: Categories */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#202724] uppercase min-w-[110px] flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#184E46]" />
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
                  className={`px-3 py-1 text-xs font-mono rounded border transition-all ${
                    isActive
                      ? "bg-[#184E46] border-[#184E46] text-[#F4F1EA] font-bold shadow-[2px_2px_0px_#202724]"
                      : "bg-[#F4F1EA] border-[#202724]/20 text-[#202724] hover:border-[#202724]"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Row 2: Brands (Dropdown / Chips inspired by Infinitas screenshots) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-[#202724]/10">
          <span className="text-xs font-mono font-bold text-[#202724] uppercase min-w-[110px]">
            // BRAND:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              href={`/shop?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(offer ? { offer } : {}),
                ...(q ? { q } : {}),
              }).toString()}`}
              className={`px-2.5 py-1 text-xs font-mono rounded border transition-all ${
                !brand
                  ? "bg-[#202724] border-[#202724] text-[#F4F1EA] font-bold"
                  : "bg-white border-[#202724]/20 text-[#59635E] hover:border-[#202724] hover:text-[#202724]"
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
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-all flex items-center gap-1 ${
                    isBrandActive
                      ? "bg-[#184E46] border-[#184E46] text-[#F4F1EA] font-bold shadow-[2px_2px_0px_#202724]"
                      : "bg-white border-[#202724]/20 text-[#202724] hover:border-[#202724]"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#202724]/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#202724] uppercase min-w-[110px]">
              STATUS OPSI:
            </span>
            <div className="flex items-center gap-1 bg-[#F4F1EA] p-1 rounded border border-[#202724]/20 text-xs font-mono">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(brand ? { brand } : {}),
                  ...(q ? { q } : {}),
                }).toString()}`}
                className={`px-2.5 py-1 rounded transition-colors ${
                  !offer ? "bg-[#202724] text-[#F4F1EA] font-bold" : "text-[#59635E] hover:text-[#202724]"
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
                className={`px-2.5 py-1 rounded transition-colors ${
                  offer === "READY"
                    ? "bg-[#184E46] text-[#F4F1EA] font-bold"
                    : "text-[#59635E] hover:text-[#184E46]"
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
                className={`px-2.5 py-1 rounded transition-colors ${
                  offer === "PREORDER"
                    ? "bg-[#A84329] text-[#F4F1EA] font-bold"
                    : "text-[#59635E] hover:text-[#A84329]"
                }`}
              >
                Pre-Order
              </Link>
            </div>
          </div>

          {(category || brand || offer || q) && (
            <Link
              href="/shop"
              className="text-xs font-mono text-[#A84329] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Semua Filter
            </Link>
          )}
        </div>
      </div>

      {/* Meta Count */}
      <div className="flex items-center justify-between text-xs font-mono text-[#59635E] border-b border-[#202724]/10 pb-2">
        <span>// MENAMPILKAN {products.length} GEAR</span>
        <span>AUTH DISTRIBUTOR · PENGIRIMAN DARI JAKARTA</span>
      </div>

      {/* Product Grid (Responsive: 1 col mobile, 2 col sm, 3 col lg, 4 col xl) */}
      {products.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#202724] rounded p-12 text-center space-y-3 shadow-[4px_4px_0px_#202724]">
          <Filter className="w-8 h-8 text-[#59635E] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#202724] font-mono uppercase">Tidak ada gear yang cocok</h3>
          <p className="text-xs text-[#59635E] max-w-sm mx-auto font-mono">
            Kombinasi kategori atau filter brand saat ini belum memiliki stok terdaftar.
          </p>
          <Link
            href="/shop"
            className="inline-block px-4 py-2 bg-[#184E46] text-[#F4F1EA] text-xs font-bold font-mono rounded mt-2 shadow-[2px_2px_0px_#202724]"
          >
            Reset Filter
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
