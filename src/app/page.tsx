import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getBrands } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { ArrowUpRight, ArrowRight, Disc3 } from "lucide-react";
import { getServerLocale } from "../lib/server-locale";
import { brandLabel, categorySpec, copy } from "../lib/locale";
import { localizeHero, localizeSections } from "../lib/localized-cms";
import {
  getSiteSetting,
  DEFAULT_HERO_CONFIG,
  DEFAULT_CATEGORIES_CONFIG,
  DEFAULT_SECTION_HEADERS_CONFIG,
  DEFAULT_BRAND_LOGOS_CONFIG,
  HeroConfig,
  MacroCategoryConfig,
  SectionHeadersConfig,
  BrandLogoConfig,
} from "../lib/cms";
import { BrandMarquee } from "../components/BrandMarquee";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getServerLocale();
  const t = (id: string, en: string) => copy(locale, id, en);
  const products = getAllProducts();
  const brands = getBrands();

  const hero = localizeHero(getSiteSetting<HeroConfig>("hero_config", DEFAULT_HERO_CONFIG), locale);
  const macroCategoriesConfig = getSiteSetting<MacroCategoryConfig[]>("categories_config", DEFAULT_CATEGORIES_CONFIG);
  const sections = localizeSections(getSiteSetting<SectionHeadersConfig>("section_headers_config", DEFAULT_SECTION_HEADERS_CONFIG), locale);
  const brandLogos = getSiteSetting<BrandLogoConfig[]>("brand_logos_config", DEFAULT_BRAND_LOGOS_CONFIG);

  const readyProducts = products
    .filter((p) => p.offers.some((o) => o.offerType === "READY"))
    .slice(0, 10);

  const preorderBatches = products
    .filter((p) => p.offers.some((o) => o.offerType === "PREORDER"))
    .slice(0, 8);

  const macroCategories = macroCategoriesConfig.map((cat) => {
    const slug = cat.href.replace("/shop?category=", "").replace("/shop?", "");
    let count = 0;
    if (cat.href.includes("offer=PREORDER")) {
      count = products.filter((p) => p.offers.some((o) => o.offerType === "PREORDER")).length;
    } else {
      count = products.filter((p) => p.category.slug === slug).length;
    }

    return {
      ...cat,
      title: locale === "en" ? cat.titleEn || cat.title : cat.title === "Keyboards" ? "Keyboard" : cat.title === "Gaming Mice" ? "Mouse Gaming" : cat.title === "Precision Glasspads" ? "Glasspad Presisi" : cat.title === "Artisan Switches" ? "Switch Pilihan" : cat.title === "Pre-Order Drops" ? "Rilis Pre-Order" : cat.title,
      spec: locale === "en" ? cat.specEn || cat.spec : categorySpec(cat.spec, locale),
      count,
    };
  });

  return (
    <div className="w-full">
      {/* 1. EDITORIAL BRAND TICKER BAR */}
      <section className="w-full border-b border-neutral-200/80 bg-white/70 backdrop-blur-md py-2 text-xs tracking-tight m-0 overflow-hidden">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4 sm:gap-6 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono uppercase text-[10px] sm:text-[11px] font-bold text-neutral-900 tracking-wider whitespace-nowrap">
              {sections.tickerLabel}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5 text-neutral-500 font-medium text-[11px] sm:text-xs">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/shop?brand=${b.slug}`}
                className="hover:text-neutral-950 transition-colors shrink-0"
              >
                {brandLabel(b.slug, b.name, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. AWWWARDS-CALIBER EDITORIAL HERO (FLUSH ZERO GAP TO TICKER) */}
      <section className="w-full border-b border-neutral-200/90 bg-white/60 backdrop-blur-xs m-0 p-0 overflow-hidden">
        <div className="w-full m-0 p-0">
          <div className="relative border-none bg-transparent overflow-hidden m-0 p-0">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[720px] items-stretch">
            {/* Left Editorial Copy (6 cols) */}
            <div className="lg:col-span-6 px-4 py-6 sm:p-10 lg:p-16 flex flex-col justify-between z-10 space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden box-border">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-900 bg-neutral-100 px-2.5 sm:px-3 py-1 border border-neutral-200">
                  {hero.badgeText}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-neutral-400">
                  {hero.tagline}
                </span>
              </div>

              <div className="space-y-3 sm:space-y-5 w-full max-w-full">
                <h1 className="text-3xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-[-0.04em] sm:tracking-[-0.05em] text-neutral-950 leading-[0.95] sm:leading-[0.92] uppercase break-words">
                  {hero.titleLine1}<br />
                  <span className="text-[#0E52FF] font-black">{hero.titleAccent}</span> {hero.titleLine2}
                </h1>
                <p className="text-xs sm:text-lg text-neutral-600 w-full max-w-[330px] sm:max-w-xl font-normal leading-relaxed break-normal text-left">
                  {hero.description}
                </p>
              </div>

              {/* Technical Spec Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6 border-t border-neutral-100 max-w-lg">
                <div>
                  <span className="block font-mono text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">{t("Dimensi", "Dimensions")}</span>
                  <span className="font-bold text-xs sm:text-base text-neutral-900">{hero.dimensions}</span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">{t("Ketebalan", "Thickness")}</span>
                  <span className="font-bold text-xs sm:text-base text-neutral-900">{hero.thickness}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block font-mono text-[10px] sm:text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">{t("Ketersediaan", "Availability")}</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-base text-emerald-800 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {hero.availability}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
                <Link
                  href={hero.ctaLink}
                  className="w-full sm:w-auto px-6 sm:px-9 py-3.5 sm:py-4 bg-neutral-950 hover:bg-[#0E52FF] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group shadow-md shadow-blue-500/10"
                >
                  <span>{hero.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={hero.secondaryCtaLink}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 border-2 border-neutral-300 hover:border-neutral-950 text-center shadow-xs"
                >
                  {hero.secondaryCtaText}
                </Link>
              </div>
            </div>

            {/* Right Hero Stage (6 cols) - Dominant Master Artwork Viewport */}
            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-neutral-200/80 bg-neutral-50/60 p-3 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs text-neutral-400 pb-3 gap-2 px-1">
                <span className="font-bold text-neutral-600 uppercase truncate">{hero.subBadgeTopLeft}</span>
                <span className="font-bold text-neutral-600 uppercase truncate">{hero.subBadgeTopRight}</span>
              </div>

              <div className="relative w-full flex-1 flex items-center justify-center py-2 sm:py-4">
                <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[620px] overflow-hidden border-2 border-neutral-300/80 bg-white shadow-lg">
                  <Image
                    src={hero.imageUrl}
                    alt={hero.imageAlt}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[9px] sm:text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/60 gap-2 px-1">
                <span className="truncate">{hero.subBadgeBottomLeft}</span>
                <span className="truncate">{hero.subBadgeBottomRight}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* 2.5 AUTHENTIC BRAND PARTNER LOGOS MARQUEE (INFINITE LEFTWARD TICKER) */}
      <BrandMarquee brands={brandLogos} />

      {/* 3. EDITORIAL CATEGORY DIRECTORY */}
      <section className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-16 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 border-b border-neutral-200 pb-3 sm:pb-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#0E52FF] block mb-0.5 sm:mb-1">
              {sections.categoryEyebrow}
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
              {sections.categoryTitle}
            </h2>
          </div>
          <span className="font-mono text-[10px] sm:text-xs text-neutral-400">
            {sections.categoryTagline}
          </span>
        </div>

        {/* 5-Column Precision Gallery on Desktop, Compact 2-Column Grid on Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {macroCategories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative bg-white border border-neutral-200/90 p-3 sm:p-5 hover:border-neutral-950 transition-all duration-300 flex flex-col justify-between min-h-[200px] sm:min-h-[360px] shadow-xs hover:shadow-md"
            >
              {/* Card Header: Index & Product Count */}
              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-1.5 sm:pb-3">
                <span className="font-mono text-[10px] sm:text-xs font-bold text-neutral-400 group-hover:text-neutral-950 transition-colors">
                  {cat.index}
                </span>
                <span className="font-mono text-[9px] sm:text-[11px] font-bold text-neutral-600 bg-neutral-100 px-1.5 sm:px-2 py-0.5">
                  {cat.count} {t("PRODUK", "ITEMS")}
                </span>
              </div>

              {/* 1:1 Studio Product Frame */}
              <div className="relative aspect-square w-full my-auto flex items-center justify-center p-2 sm:p-4">
                <div className="relative w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              </div>

              {/* Card Footer: Typography & Direction Arrow */}
              <div className="border-t border-neutral-100 pt-2 sm:pt-3 flex items-end justify-between gap-1">
                <div className="min-w-0 pr-1">
                  <h3 className="font-extrabold text-xs sm:text-sm text-neutral-950 group-hover:text-[#0E52FF] transition-colors leading-tight truncate">
                    {cat.title}
                  </h3>
                  <p className="font-mono text-[9px] sm:text-[10px] text-neutral-400 tracking-tight mt-0.5 truncate">
                    {cat.spec}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. READY STOCK CATALOG GRID */}
      <section className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-16 space-y-4 sm:space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-3 sm:pb-4">
          <div>
            <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 mb-0.5 sm:mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{sections.readyEyebrow}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
              {sections.readyTitle}
            </h2>
          </div>
          <Link
            href="/shop?offer=READY"
            className="font-mono text-[10px] sm:text-xs font-bold text-neutral-950 hover:text-[#0E52FF] flex items-center gap-1 sm:gap-1.5 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>{sections.readyCtaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5">
          {readyProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 5. PRE-ORDER DROPS */}
      <section className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-16 space-y-4 sm:space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-3 sm:pb-4">
          <div>
            <div className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 mb-0.5 sm:mb-1 flex items-center gap-2">
              <Disc3 className="w-3.5 h-3.5 text-[#0E52FF]" />
              <span>{sections.preorderEyebrow}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
              {sections.preorderTitle}
            </h2>
          </div>
          <Link
            href="/shop?offer=PREORDER"
            className="font-mono text-[10px] sm:text-xs font-bold text-neutral-950 hover:text-[#0E52FF] flex items-center gap-1 sm:gap-1.5 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>{sections.preorderCtaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5">
          {preorderBatches.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
