export interface HeroConfig {
  english?: Partial<Pick<HeroConfig, "badgeText" | "description" | "availability" | "ctaText" | "secondaryCtaText">>;
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
  titleEn?: string;
  specEn?: string;
  index: string;
  title: string;
  spec: string;
  href: string;
  image: string;
}

export interface AnnouncementConfig {
  english?: Partial<Pick<AnnouncementConfig, "primaryText" | "secondaryText" | "trackLinkText">>;
  badge: string;
  primaryText: string;
  secondaryText: string;
  trackLinkText: string;
  active: boolean;
}

export interface SectionHeadersConfig {
  translations?: {
    id?: Partial<Omit<SectionHeadersConfig, "translations">>;
    en?: Partial<Omit<SectionHeadersConfig, "translations">>;
  };
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

export interface BrandLogoConfig {
  id: string;
  name: string;
  logoUrl?: string; // Optional image URL; if empty, renders authentic typographic logo badge
  href: string;
  active: boolean;
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
  imageUrl: "/api/r2/cms/hero-zofia.png",
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
    image: "/api/r2/cms/category-keyboards.jpg",
  },
  {
    index: "02",
    title: "Gaming Mice",
    spec: "Magnesium & PAW3950 8K",
    href: "/shop?category=mouse",
    image: "/api/r2/cms/category-mice.jpg",
  },
  {
    index: "03",
    title: "Precision Glasspads",
    spec: "Aluminosilicate Micro-Etch",
    href: "/shop?category=mousepad",
    image: "/api/r2/cms/category-glasspads.png",
  },
  {
    index: "04",
    title: "Artisan Switches",
    spec: "Magnetic HE & Custom Linear",
    href: "/shop?category=switches-parts",
    image: "/api/r2/cms/category-switches.jpg",
  },
  {
    index: "05",
    title: "Pre-Order Drops",
    spec: "Verified Manufacturer Batches",
    href: "/shop?offer=PREORDER",
    image: "/api/r2/cms/category-preorder.png",
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

export const DEFAULT_BRAND_LOGOS_CONFIG: BrandLogoConfig[] = [
  { id: "x-raypad", name: "X-RAYPAD", logoUrl: "/api/r2/brands/x-raypad.svg", href: "/shop?brand=x-raypad", active: true },
  { id: "talon-games", name: "TALON GAMES", logoUrl: "/api/r2/brands/talon-games.svg", href: "/shop?brand=talon-games", active: true },
  { id: "deadline-studio", name: "DEADLINE STUDIO", logoUrl: "/api/r2/brands/deadline-studio.svg", href: "/shop?brand=deadline-studio", active: true },
  { id: "darmoshark", name: "DARMOSHARK", logoUrl: "/api/r2/brands/darmoshark.svg", href: "/shop?brand=darmoshark", active: true },
  { id: "dysphoria", name: "DYSPHORIA", logoUrl: "/api/r2/brands/dysphoria.svg", href: "/shop?brand=dysphoria", active: true },
  { id: "atk-gear", name: "ATK GEAR", logoUrl: "/api/r2/brands/atk-gear.svg", href: "/shop?brand=atk-gear", active: true },
  { id: "ipi", name: "IPI", logoUrl: "/api/r2/brands/ipi.svg", href: "/shop?brand=ipi", active: true },
  { id: "glsswrks", name: "GLSSWRKS", logoUrl: "/api/r2/brands/glsswrks.svg", href: "/shop?brand=glsswrks", active: true },
  { id: "lamzu", name: "LAMZU", logoUrl: "/api/r2/brands/lamzu.svg", href: "/shop?brand=lamzu", active: true },
  { id: "aimstar", name: "AIMSTAR", logoUrl: "/api/r2/brands/aimstar.svg", href: "/shop?brand=aimstar", active: true },
  { id: "wlmouse", name: "WLMOUSE", logoUrl: "/api/r2/brands/wlmouse.svg", href: "/shop?brand=wlmouse", active: true },
  { id: "pulsar", name: "PULSAR", logoUrl: "/api/r2/brands/pulsar.png", href: "/shop?brand=pulsar", active: true },
  { id: "keychron", name: "KEYCHRON", logoUrl: "/api/r2/brands/keychron.svg", href: "/shop?brand=keychron", active: true },
  { id: "aeboards", name: "AEBOARDS", logoUrl: "/api/r2/brands/aeboards.svg", href: "/shop?brand=aeboards", active: true },
  { id: "uncle-panda", name: "UNCLE PANDA", logoUrl: "/api/r2/brands/uncle-panda.svg", href: "/shop?brand=uncle-panda", active: true },
  { id: "xvx", name: "XVX", logoUrl: "/api/r2/brands/xvx.svg", href: "/shop?brand=xvx", active: true },
];

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandTitle: "UltraStore",
  brandTagline: "Toko Periferal & Hardware Presisi",
  copyrightText: "© 2026 UltraStore. Hak cipta dilindungi.",
};
