export interface HeroConfig {
  badgeText: string;
  tagline: string;
  titleLine1: string;
  titleLine2: string;
  titleAccent: string;
  description: string;
  dimensions: string;
  thickness: string;
  availability: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  imageAlt: string;
  subBadgeTopLeft: string;
  subBadgeTopRight: string;
  subBadgeBottomLeft: string;
  subBadgeBottomRight: string;
}

export interface MacroCategoryConfig {
  index: string;
  title: string;
  spec: string;
  href: string;
  image: string;
}

export interface AnnouncementConfig {
  badge: string;
  primaryText: string;
  secondaryText: string;
  trackLinkText: string;
  active: boolean;
}

export interface SectionHeadersConfig {
  tickerLabel: string;
  categoryEyebrow: string;
  categoryTitle: string;
  categoryTagline: string;
  readyEyebrow: string;
  readyTitle: string;
  readyCtaText: string;
  preorderEyebrow: string;
  preorderTitle: string;
  preorderCtaText: string;
}

export interface FooterConfig {
  brandTitle: string;
  brandTagline: string;
  copyrightText: string;
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  badgeText: "EDISI KHUSUS · 2026",
  tagline: "NO. 001/HUB-JKT",
  titleLine1: "GLSSWRKS",
  titleLine2: "GLASS",
  titleAccent: "ZOFIA",
  description: "Permukaan kaca aluminosilikat micro-etched dengan base molded silicone murni. Gesekan seragam omnidirectional untuk aim kompetitif kelas turnamen.",
  dimensions: "490 × 420 mm",
  thickness: "3.8 mm CNC",
  availability: "READY STOCK",
  ctaText: "Dapatkan Sekarang",
  ctaLink: "/products/glsswrks-zofia-tempered-glass",
  secondaryCtaText: "Jelajahi Semua Gear",
  secondaryCtaLink: "/shop",
  imageUrl: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/image_2026-09-04_135924266.png?v=1788505207",
  imageAlt: "GLSSWRKS Zofia Art Edition Glasspad",
  subBadgeTopLeft: "COLLAB ARTWORK",
  subBadgeTopRight: "ORIGINAL AUTHENTIC",
  subBadgeBottomLeft: "ALUMINOSILICATE ETCHED",
  subBadgeBottomRight: "490 × 420 × 3.8 MM",
};

export const DEFAULT_CATEGORIES_CONFIG: MacroCategoryConfig[] = [
  {
    index: "01",
    title: "Keyboards",
    spec: "8K HE & Custom Gasket",
    href: "/shop?category=keyboard",
    image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/d7a0e34b71cf46ef9044ee8447955120_tplv-aphluv4xwc-origin-jpeg.jpg?v=1784789080",
  },
  {
    index: "02",
    title: "Gaming Mice",
    spec: "Magnesium & PAW3950 8K",
    href: "/shop?category=mouse",
    image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/65cb153cf5f2412d85954097a64c7f9f_tplv-aphluv4xwc-origin-jpeg.jpg?v=1784968417",
  },
  {
    index: "03",
    title: "Precision Glasspads",
    spec: "Aluminosilicate Micro-Etch",
    href: "/shop?category=mousepad",
    image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/image_2026-08-13_145621677.png?v=1786607786",
  },
  {
    index: "04",
    title: "Artisan Switches",
    spec: "Magnetic HE & Custom Linear",
    href: "/shop?category=switches-parts",
    image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/a995271cced34d63be21e379f450eb8a_tplv-aphluv4xwc-origin-jpeg.jpg?v=1790229546",
  },
  {
    index: "05",
    title: "Pre-Order Drops",
    spec: "Verified Manufacturer Batches",
    href: "/shop?offer=PREORDER",
    image: "https://cdn.shopify.com/s/files/1/0723/4908/9929/files/image_2026-09-19_184652056.png?v=1789818415",
  },
];

export const DEFAULT_ANNOUNCEMENT_CONFIG: AnnouncementConfig = {
  badge: "DISTRIBUTOR RESMI",
  primaryText: "Distributor Resmi Mechanical Keyboards & Ultralight Mice",
  secondaryText: "Pengiriman Cepat dari Hub Jakarta",
  trackLinkText: "Lacak Pesanan",
  active: true,
};

export const DEFAULT_SECTION_HEADERS_CONFIG: SectionHeadersConfig = {
  tickerLabel: "AUTHORISED DISTRIBUTOR",
  categoryEyebrow: "ARSITEKTUR PERIFERAL",
  categoryTitle: "5 Spesialisasi Gear Presisi",
  categoryTagline: "DISTRIBUSI JAKARTA HUB 2026",
  readyEyebrow: "SIAP KIRIM · JAKARTA CENTRAL HUB",
  readyTitle: "Ready Stock Terverifikasi",
  readyCtaText: "Semua Ready Stock",
  preorderEyebrow: "BATCH RESMI TERJADWAL",
  preorderTitle: "Pre-Order Drops",
  preorderCtaText: "Semua Batch Pre-Order",
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandTitle: "UltraStore",
  brandTagline: "Toko Periferal & Hardware Presisi",
  copyrightText: "© 2026 UltraStore. Hak cipta dilindungi.",
};
