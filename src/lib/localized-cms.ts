import {
  AnnouncementConfig, DEFAULT_ANNOUNCEMENT_CONFIG,
  DEFAULT_FOOTER_CONFIG, DEFAULT_HERO_CONFIG, DEFAULT_SECTION_HEADERS_CONFIG,
  FooterConfig, HeroConfig, SectionHeadersConfig,
} from "./cms-types";
import { StoreLocale } from "./locale";

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
  const localized = defaultsInEnglish(value, DEFAULT_ANNOUNCEMENT_CONFIG, {
    badge: "OFFICIAL DISTRIBUTOR",
    primaryText: "Mechanical keyboards and lightweight gaming mice, selected with care",
    secondaryText: "Ships from Jakarta",
    trackLinkText: "Track Order",
  }, locale);
  return withMerchantEnglish<AnnouncementConfig>(localized, value.english, locale);
}

export function localizeFooter(value: FooterConfig, locale: StoreLocale) {
  return defaultsInEnglish(value, DEFAULT_FOOTER_CONFIG, {
    brandTagline: "Precision Gaming Gear",
    copyrightText: "© 2026 UltraStore. All rights reserved.",
  }, locale);
}

export function localizeHero(value: HeroConfig, locale: StoreLocale) {
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
  return defaultsInEnglish(value, DEFAULT_SECTION_HEADERS_CONFIG, {
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
}
