import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CartProvider } from "../context/CartContext";

export const metadata: Metadata = {
  title: "UltraStore — Gear pilihan. Setup dengan karakter.",
  description: "Toko peripheral presisi terkurasi untuk setup kerja dan gaming berkualias tinggi. Mendukung ready stock dan pre-order batch transparan.",
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
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
