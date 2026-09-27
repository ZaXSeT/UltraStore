import { getAllProducts } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; offer?: string; q?: string }>;
}) {
  const { category, offer, q } = await searchParams;
  let products = getAllProducts(category, offer);

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
    { label: "Audio", slug: "audio" },
    { label: "Desk Gear", slug: "desk-gear" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#D9DDD5] pb-6">
        <div className="text-xs font-mono uppercase tracking-widest text-[#59635E]">
          Katalog Peripheral
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#202724] mt-1">
          Koleksi Precision Workshop
        </h1>
        <p className="text-sm text-[#59635E] mt-1">
          Menampilkan {products.length} pilihan gear terverifikasi spesifikasi resmi.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => {
            const isActive = (category || "") === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/shop?${new URLSearchParams({
                  ...(c.slug ? { category: c.slug } : {}),
                  ...(offer ? { offer } : {}),
                }).toString()}`}
                className={`px-3.5 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                  isActive
                    ? "bg-[#184E46] text-[#F4F1EA]"
                    : "bg-[#FFFFFF] border border-[#D9DDD5] text-[#202724] hover:border-[#184E46]"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Offer Filter Switch */}
        <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#D9DDD5] p-1 rounded text-xs font-mono">
          <Link
            href={`/shop?${new URLSearchParams({
              ...(category ? { category } : {}),
            }).toString()}`}
            className={`px-2.5 py-1 rounded transition-colors ${
              !offer ? "bg-[#202724] text-[#F4F1EA]" : "text-[#59635E] hover:text-[#202724]"
            }`}
          >
            Semua
          </Link>
          <Link
            href={`/shop?${new URLSearchParams({
              ...(category ? { category } : {}),
              offer: "READY",
            }).toString()}`}
            className={`px-2.5 py-1 rounded transition-colors ${
              offer === "READY"
                ? "bg-[#184E46] text-[#F4F1EA]"
                : "text-[#59635E] hover:text-[#184E46]"
            }`}
          >
            Ready Stock
          </Link>
          <Link
            href={`/shop?${new URLSearchParams({
              ...(category ? { category } : {}),
              offer: "PREORDER",
            }).toString()}`}
            className={`px-2.5 py-1 rounded transition-colors ${
              offer === "PREORDER"
                ? "bg-[#A84329] text-[#F4F1EA]"
                : "text-[#59635E] hover:text-[#A84329]"
            }`}
          >
            Pre-Order
          </Link>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-12 text-center space-y-3">
          <Filter className="w-8 h-8 text-[#59635E] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#202724]">Tidak ada gear yang cocok</h3>
          <p className="text-xs text-[#59635E] max-w-sm mx-auto">
            Coba atur ulang filter atau kata kunci pencarian kamu untuk melihat katalog lainnya.
          </p>
          <Link
            href="/shop"
            className="inline-block px-4 py-2 bg-[#184E46] text-[#F4F1EA] text-xs font-semibold rounded mt-2"
          >
            Reset filter
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
