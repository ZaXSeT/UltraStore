"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Menu, X, Compass, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const { totalItemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Notification Strip (Full Width) */}
      <div className="bg-[#090D16] text-slate-300 text-xs py-2 border-b border-slate-800/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-medium text-slate-200">
              Distributor Resmi Mechanical Keyboards &amp; Ultralight Mice
            </span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-slate-400">
              Pengiriman Cepat dari Hub Jakarta
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <Link
              href="/track-order"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>Lacak Pesanan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Full Width Edge-to-Edge) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-18 py-3.5 flex items-center justify-between">
        {/* Brand Logo - Pure typography ala infinitas.id */}
        <Link href="/" className="flex items-center group">
          <span className="text-2xl font-black tracking-[-0.05em] uppercase text-slate-900 group-hover:text-blue-600 transition-colors">
            ULTRASTORE
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link
            href="/shop"
            className="hover:text-[#2563EB] transition-colors py-2 border-b-2 border-transparent hover:border-[#2563EB]"
          >
            Semua Produk
          </Link>
          <Link
            href="/shop?offer=PREORDER"
            className="hover:text-[#2563EB] transition-colors py-2 border-b-2 border-transparent hover:border-[#2563EB] flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
            <span>Pre-Order Drops</span>
          </Link>
          <Link
            href="/track-order"
            className="hover:text-[#2563EB] transition-colors py-2 border-b-2 border-transparent hover:border-[#2563EB]"
          >
            Lacak Pesanan
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#090D16] hover:bg-[#2563EB] text-white text-sm font-medium transition-all shadow-sm"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Keranjang</span>
            {mounted && totalItemCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-[#2563EB] text-white">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none"
            aria-label="Buka menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-900 font-medium hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
          >
            <span>Semua Produk</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            href="/shop?offer=PREORDER"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-900 font-medium hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              <span>Pre-Order Drops</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-900 font-medium hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2563EB]" />
              <span>Lacak Pesanan</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      )}
    </header>
  );
}
