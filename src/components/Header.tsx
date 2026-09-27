"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Search, Compass, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { totalItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F4F1EA]/95 backdrop-blur-sm border-b border-[#D9DDD5]">
      {/* Announcement Strip */}
      <div className="bg-[#202724] text-[#F4F1EA] text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#184E46] inline" />
        <span>Koleksi Terverifikasi Resmi · Pengiriman Jakarta · Garansi Distributor</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-[#184E46] text-[#F4F1EA] flex items-center justify-center font-bold text-lg font-mono">
            U
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-[#202724] uppercase">UltraStore</span>
            <span className="text-[10px] uppercase tracking-widest text-[#59635E] -mt-1 font-mono">Precision Workshop</span>
          </div>
        </Link>

        {/* Categories Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#202724]">
          <Link href="/shop" className="hover:text-[#184E46] transition-colors">Semua Gear</Link>
          <Link href="/shop?category=keyboard" className="hover:text-[#184E46] transition-colors">Keyboard</Link>
          <Link href="/shop?category=mouse" className="hover:text-[#184E46] transition-colors">Mouse</Link>
          <Link href="/shop?category=audio" className="hover:text-[#184E46] transition-colors">Audio</Link>
          <Link href="/shop?category=desk-gear" className="hover:text-[#184E46] transition-colors">Desk Gear</Link>
          <Link href="/shop?offer=PREORDER" className="text-[#A84329] hover:text-[#88341f] font-semibold transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#A84329] animate-pulse"></span>
            Pre-order
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          <Link href="/track-order" className="text-xs text-[#59635E] hover:text-[#202724] hidden sm:flex items-center gap-1 font-mono">
            <Compass className="w-3.5 h-3.5" />
            Lacak Order
          </Link>

          <Link href="/cart" className="relative p-2 text-[#202724] hover:text-[#184E46] transition-colors" aria-label="Keranjang">
            <ShoppingBag className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#184E46] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-tabular shadow-sm">
                {totalItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
