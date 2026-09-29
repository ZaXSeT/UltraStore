import { getAllProducts, getBrands, getCategories } from "../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import { ShopSidebar } from "../../components/ShopSidebar";
import { StickyShopSidebar } from "../../components/StickyShopSidebar";
import Link from "next/link";
import { Filter, RotateCcw, X, ShieldCheck, Check } from "lucide-react";
import { getServerLocale } from "../../lib/server-locale";
import { brandLabel, categoryLabel, copy } from "../../lib/locale";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; offer?: string; q?: string; surface?: string; page?: string }>;
}) {
  const { category, brand, offer, q, surface, page } = await searchParams;
  const locale = await getServerLocale();
  const t = (id: string, en: string) => copy(locale, id, en);
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

  const pageSize = 24;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const requestedPage = Number(page);
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1;
  const visibleProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (offer) params.set("offer", offer);
    if (q) params.set("q", q);
    if (surface) params.set("surface", surface);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `/shop?${query}` : "/shop";
  };

  // Find active category & brand metadata
  const activeCategoryObj = allCategories.find((c) => c.slug === category);
  const activeBrandObj = allBrands.find((b) => b.slug === brand);

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 py-5 sm:py-8 space-y-4 sm:space-y-6">
      {/* Swiss Editorial Header Section */}
      <div className="border-b border-neutral-200/90 pb-4 sm:pb-6 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--theme-ink)]">
            <span className="w-1.5 h-1.5 bg-[var(--theme-accent)]"></span>
            <span>{t("PILIHAN ULTRASTORE · JAKARTA", "CURATED IN JAKARTA · GAMING GEAR")}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[var(--theme-ink)]">
            {t("Katalog Periferal", "Gaming Gear Catalog")}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-3xl font-mono leading-relaxed">
            {t("Keyboard mekanis, mouse nirkabel ringan, glasspad presisi, dan switch pilihan untuk setup Anda.", "Explore mechanical keyboards, lightweight wireless mice, precision glasspads, and carefully selected switches.")}
          </p>
        </div>

        <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs font-mono text-neutral-500 shrink-0">
          <div className="inline-flex items-center gap-2 border border-neutral-200 bg-[var(--theme-surface)] px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-[var(--theme-ink)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
            <span className="font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">{t("Garansi Resmi 1 Tahun", "Official 1-Year Warranty")}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400">
            {t("Dikirim dari Jakarta", "Ships from Jakarta")}
          </span>
        </div>
      </div>

      {/* 2-Column Full-Width Layout: Left Sticky Sidebar + Right Product Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8">
        {/* Left Column: Sticky Sidebar on Desktop / Drawer Collapsible on Mobile */}
        <StickyShopSidebar>
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
        </StickyShopSidebar>

        {/* Right Column: Catalog Grid & Active Filter Chips */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Active Filter Chips & Summary Telemetry Bar (Swiss Architecture) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-neutral-500 border-b border-neutral-200/90 pb-3 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 font-bold text-[var(--theme-ink)] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-[var(--theme-accent)]"></span>
                <span>{products.length} {t("Produk", "Products")}</span>
              </span>

              {/* Active Category Tag */}
              {activeCategoryObj && (
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(brand ? { brand } : {}),
                    ...(offer ? { offer } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-neutral-300 bg-[var(--theme-surface)] hover:border-[var(--theme-ink)] text-[var(--theme-ink)] transition-colors text-[11px] uppercase tracking-wider"
                >
                  <span>{t("Kategori", "Category")}: {categoryLabel(activeCategoryObj.slug, activeCategoryObj.name, locale)}</span>
                  <X className="w-3 h-3 text-neutral-400 hover:text-[var(--theme-ink)]" />
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-neutral-300 bg-[var(--theme-surface)] hover:border-[var(--theme-ink)] text-[var(--theme-ink)] transition-colors text-[11px] uppercase tracking-wider"
                >
                  <span>{t("Merek", "Brand")}: {brandLabel(activeBrandObj.slug, activeBrandObj.name, locale)}</span>
                  <X className="w-3 h-3 text-neutral-400 hover:text-[var(--theme-ink)]" />
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] transition-colors text-[11px] font-bold uppercase tracking-wider"
                >
                  <span>{t("Status", "Availability")}: {offer === "READY" ? t("Tersedia", "In Stock") : t("Pre-Order", "Pre-Order")}</span>
                  <X className="w-3 h-3 text-[var(--theme-accent)] hover:text-[var(--theme-ink)]" />
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[var(--theme-ink)] bg-[var(--theme-ink)] text-white hover:bg-[var(--theme-accent)] hover:border-[var(--theme-accent)] transition-colors text-[11px] uppercase tracking-wider"
                >
                  <span>{t("Permukaan", "Surface")}: {surface === "glass" ? t("Glasspad (Kaca)", "Glasspad") : t("Kain / Poron", "Cloth / Poron")}</span>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-accent-soft)] text-[var(--theme-accent-hover)] border border-[var(--theme-accent-border)] hover:bg-[var(--theme-accent-soft)] transition-colors text-xs font-medium"
                >
                  <span>{t("Pencarian", "Search")}: "{q}"</span>
                  <X className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                </Link>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              {t("Pilihan UltraStore", "Selected by UltraStore")}
            </span>
          </div>

          {/* Product Grid: Responsive from 2 up to 5/6 columns on ultra-wide */}
          {products.length === 0 ? (
            <div className="bg-[var(--theme-surface)] border border-slate-200 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--theme-ink)]">
                  {t("Produk tidak ditemukan", "No Products Found")}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {t("Coba kata kunci atau filter lain untuk menemukan produk yang Anda cari.", "Try another search term or adjust your filters to find the right gear.")}
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("Atur Ulang Filter", "Clear Filters")}</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1920px]:grid-cols-6 3xl:grid-cols-6 gap-3 sm:gap-5 xl:gap-6">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <nav aria-label={t("Halaman katalog", "Catalog pages")} className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 font-mono text-xs">
              <span className="text-neutral-500">
                {t("Menampilkan", "Showing")} {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, products.length)} {t("dari", "of")} {products.length}
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link href={pageHref(currentPage - 1)} className="border border-neutral-300 bg-[var(--theme-surface)] px-3 py-2 hover:border-[var(--theme-accent)]">
                    {t("Sebelumnya", "Previous")}
                  </Link>
                )}
                <span aria-current="page" className="px-2 text-[var(--theme-ink)]">{currentPage} / {totalPages}</span>
                {currentPage < totalPages && (
                  <Link href={pageHref(currentPage + 1)} className="border border-neutral-300 bg-[var(--theme-surface)] px-3 py-2 hover:border-[var(--theme-accent)]">
                    {t("Berikutnya", "Next")}
                  </Link>
                )}
              </div>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}
