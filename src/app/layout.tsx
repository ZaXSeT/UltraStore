import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { StorefrontChrome } from "../components/StorefrontChrome";

export const metadata: Metadata = {
  title: "UltraStore — Toko Peripheral & Hardware Presisi",
  description: "Distributor resmi hardware enthusiast: mechanical keyboard, ultralight gaming mice, precision mousepad, dan switch pilihan dengan garansi resmi.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <CartProvider>
          <StorefrontChrome>{children}</StorefrontChrome>
        </CartProvider>
      </body>
    </html>
  );
}
