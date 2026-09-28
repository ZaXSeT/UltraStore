import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import { CartDrawer } from "../components/CartDrawer";

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
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
