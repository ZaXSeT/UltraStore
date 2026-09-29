import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { StorefrontChrome } from "../components/StorefrontChrome";
import { LanguageProvider } from "../context/LanguageContext";
import { getServerLocale } from "../lib/server-locale";
import { getSiteSetting } from "../lib/cms";
import { DEFAULT_THEME_CONFIG, normalizeTheme } from "../lib/theme";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: locale === "en" ? "UltraStore | Precision Gaming Gear" : "UltraStore | Periferal & Hardware Presisi",
    description: locale === "en"
      ? "Explore mechanical keyboards, lightweight gaming mice, precision mousepads, and switches at UltraStore."
      : "Jelajahi keyboard mekanis, mouse gaming ringan, mousepad presisi, dan switch pilihan di UltraStore.",
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const theme = normalizeTheme(getSiteSetting("theme_config", DEFAULT_THEME_CONFIG));
  const themeStyle = {
    "--theme-accent": theme.accent,
    "--theme-canvas": theme.canvas,
    "--theme-surface": theme.surface,
    "--theme-ink": theme.ink,
  } as React.CSSProperties;
  return (
    <html lang={locale} className="h-full" style={themeStyle}>
      <body className="min-h-screen flex flex-col bg-[var(--theme-canvas)] text-[var(--theme-ink)] antialiased">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <StorefrontChrome>{children}</StorefrontChrome>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
