import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { StorefrontChrome } from "../components/StorefrontChrome";
import { LanguageProvider } from "../context/LanguageContext";
import { getServerLocale } from "../lib/server-locale";

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
  return (
    <html lang={locale} className="h-full">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <StorefrontChrome>{children}</StorefrontChrome>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
