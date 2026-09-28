import {
  DEFAULT_ANNOUNCEMENT_CONFIG, DEFAULT_FOOTER_CONFIG, DEFAULT_HERO_CONFIG, DEFAULT_SECTION_HEADERS_CONFIG,
} from "./cms-types.ts";
import type { AnnouncementConfig, FooterConfig, HeroConfig, SectionHeadersConfig } from "./cms-types.ts";
import type { StoreLocale } from "./locale.ts";

// Merchant-supplied copy stays untouched. The default editorial copy has a
// separately written English version, so the storefront is complete in both languages.
function defaultsInEnglish<T extends object>(value: T, defaults: T, english: Partial<T>, locale: StoreLocale): T {
  if (locale !== "en") return value;
  const next = { ...value };
  for (const key of Object.keys(english) as (keyof T)[]) {
    if (value[key] === defaults[key]) next[key] = english[key] as T[keyof T];
  }
  return next;
}

function withMerchantEnglish<T extends object>(value: T, english: Partial<T> | undefined, locale: StoreLocale): T {
  if (locale !== "en" || !english) return value;
  return {
    ...value,
    ...Object.fromEntries(Object.entries(english).filter(([, text]) => typeof text === "string" && text.trim().length > 0)),
  };
}

export function localizeAnnouncement(value: AnnouncementConfig, locale: StoreLocale) {
  if (locale === "id") {
    return {
      ...value,
      primaryText: value.primaryText === DEFAULT_ANNOUNCEMENT_CONFIG.primaryText ? "Distributor resmi keyboard mekanis dan mouse gaming ringan" : value.primaryText,
      secondaryText: value.secondaryText === DEFAULT_ANNOUNCEMENT_CONFIG.secondaryText ? "Dikirim dari Jakarta" : value.secondaryText,
    };
  }
  const localized = defaultsInEnglish(value, DEFAULT_ANNOUNCEMENT_CONFIG, {
    badge: "OFFICIAL DISTRIBUTOR",
    primaryText: "Mechanical keyboards and lightweight gaming mice, selected with care",
    secondaryText: "Ships from Jakarta",
    trackLinkText: "Track Order",
  }, locale);
  return withMerchantEnglish<AnnouncementConfig>(localized, value.english, locale);
}

export function localizeFooter(value: FooterConfig, locale: StoreLocale) {
  if (locale === "id") return {
    ...value,
    brandTagline: value.brandTagline === DEFAULT_FOOTER_CONFIG.brandTagline ? "Periferal dan Hardware Presisi" : value.brandTagline,
  };
  return defaultsInEnglish(value, DEFAULT_FOOTER_CONFIG, {
    brandTagline: "Precision Gaming Gear",
    copyrightText: "© 2026 UltraStore. All rights reserved.",
  }, locale);
}

export function localizeHero(value: HeroConfig, locale: StoreLocale) {
  if (locale === "id") return {
    ...value,
    description: value.description === DEFAULT_HERO_CONFIG.description
      ? "Glasspad aluminosilikat bertekstur mikro dengan alas silikon cetak. Gesekan yang konsisten ke segala arah memberi kontrol bidikan yang presisi."
      : value.description,
  };
  const localized = defaultsInEnglish(value, DEFAULT_HERO_CONFIG, {
    badgeText: "SPECIAL EDITION · 2026",
    description: "A micro-etched aluminosilicate glass surface with a molded silicone base. Consistent glide in every direction for precise, competitive aim.",
    availability: "IN STOCK",
    ctaText: "Shop This Product",
    secondaryCtaText: "Explore All Gear",
  }, locale);
  return withMerchantEnglish<HeroConfig>(localized, value.english, locale);
}

export function localizeSections(value: SectionHeadersConfig, locale: StoreLocale) {
  const indonesianDefaults: Partial<SectionHeadersConfig> = {
    tickerLabel: "DISTRIBUTOR RESMI",
    categoryEyebrow: "JELAJAHI KATEGORI",
    categoryTitle: "Periferal untuk Setiap Setup",
    categoryTagline: "PILIHAN ULTRASTORE · JAKARTA",
    readyEyebrow: "STOK TERSEDIA · JAKARTA",
    readyTitle: "Siap Dikirim",
    readyCtaText: "Lihat Produk Tersedia",
    preorderEyebrow: "BATCH MENDATANG",
    preorderTitle: "Rilis Pre-Order",
    preorderCtaText: "Jelajahi Pre-Order",
  };
  const editorial: Record<string, [string, string]> = {
    "Direct Atelier Pre-Orders": ["Pre-Order Pilihan", "Upcoming Pre-Orders"],
    "SCHEDULED PRODUCTION BATCHES": ["BATCH PRODUKSI TERJADWAL", "UPCOMING BATCHES"],
    "Explore All In-Stock": ["Lihat Produk Tersedia", "Shop In-Stock Gear"],
    "View Active Batches": ["Lihat Batch Aktif", "Explore Active Batches"],
    "SPEC MASTER DIRECTORY": ["JELAJAHI KATEGORI", "EXPLORE CATEGORIES"],
    "Certified Physical Inventory": ["Stok Siap Kirim", "Ready to Ship"],
    "JAKARTA CENTRAL ATELIER � 2026": ["PILIHAN ULTRASTORE · JAKARTA", "CURATED IN JAKARTA · 2026"],
    "READY SHIPMENT � 24H DISPATCH": ["STOK TERSEDIA · DIKIRIM DARI JAKARTA", "IN STOCK · SHIPPING FROM JAKARTA"],
    "High-Precision Armament": ["Periferal untuk Setup Anda", "Gear for Your Setup"],
    "EXCLUSIVE PERIPHERAL ATELIER": ["PILIHAN PERIFERAL ULTRASTORE", "CURATED GAMING GEAR"],
  };
  const localized = defaultsInEnglish(value, DEFAULT_SECTION_HEADERS_CONFIG, {
    tickerLabel: "AUTHORISED DISTRIBUTOR",
    categoryEyebrow: "FIND YOUR SETUP",
    categoryTitle: "Gear for Every Detail",
    categoryTagline: "CURATED IN JAKARTA · 2026",
    readyEyebrow: "READY TO SHIP · JAKARTA",
    readyTitle: "In Stock Now",
    readyCtaText: "Shop In-Stock Gear",
    preorderEyebrow: "UPCOMING RELEASES",
    preorderTitle: "Pre-Order Drops",
    preorderCtaText: "Explore Pre-Orders",
  }, locale);
  const next = { ...localized };
  for (const key of Object.keys(DEFAULT_SECTION_HEADERS_CONFIG) as Array<keyof Omit<SectionHeadersConfig, "translations">>) {
    const original = value[key];
    const pair = editorial[original];
    if (pair) next[key] = pair[locale === "en" ? 1 : 0];
    else if (locale === "id" && original === DEFAULT_SECTION_HEADERS_CONFIG[key]) next[key] = indonesianDefaults[key] || original;
  }
  return {
    ...next,
    ...Object.fromEntries(Object.entries(value.translations?.[locale] || {}).filter(([, text]) => typeof text === "string" && text.trim().length > 0)),
  };
}
