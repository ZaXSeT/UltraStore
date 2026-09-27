"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Menu, X, Compass } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { totalItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#202724]/15">
      {/* Top Ticker / Meta Bar */}
      <div className="bg-[#202724] text-[#F4F1EA] text-[11px] py-1.5 px-4 font-mono overflow-hidden border-b border-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#184E46] animate-pulse"></span>
            <span className="tracking-wider uppercase">ULTRASTORE // HARDWARE ARCHIVE</span>
            <span className="hidden sm:inline text-[#59635E]">|</span>
            <span className="hidden sm:inline text-neutral-300">AUTHORIZED ENTHUSIAST GEAR DISTRIBUTOR</span>
          </div>
          <div className="flex items-center gap-4 text-[#D9DDD5]">
            <span className="hidden md:inline font-mono">JKT-ID // WAL-SQLITE</span>
            <Link href="/track-order" className="hover:text-white transition-colors flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#184E46]" />
              <span>LACAK ORDER</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Creative Precision Monogram & Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 bg-[#202724] border border-[#202724] rounded flex items-center justify-center text-[#F4F1EA] shadow-[2px_2px_0px_#184E46] group-hover:shadow-[3px_3px_0px_#184E46] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-[#F4F1EA] transition-transform duration-300 group-hover:scale-105"
            >
              <path
                d="M7 6V18C7 22.9706 11.0294 27 16 27C20.9706 27 25 22.9706 25 18V6H20V18C20 20.2091 18.2091 22 16 22C13.7909 22 12 20.2091 12 18V6H7Z"
                fill="currentColor"
              />
              <circle cx="16" cy="14" r="2" fill="#184E46" />
              <line x1="16" y1="9" x2="16" y2="12" stroke="#184E46" strokeWidth="1.5" />
              <line x1="16" y1="16" x2="16" y2="19" stroke="#184E46" strokeWidth="1.5" />
            </svg>
            <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-[#184E46] text-[#F4F1EA] px-1 rounded-sm leading-tight">
              01
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tighter text-[#202724] uppercase font-mono group-hover:text-[#184E46] transition-colors">
                ULTRA<span className="text-[#184E46]">STORE</span>
              </span>
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#202724]/5 border border-[#202724]/20 text-[#202724] font-semibold">
                LABS
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#59635E] uppercase -mt-1 flex items-center gap-1">
              <span>PRECISION GEAR ARCHIVE</span>
              <span className="text-[#A84329]">_</span>
            </span>
          </div>
        </Link>

        {/* Categories Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-mono font-semibold tracking-wider text-[#202724] uppercase">
          <Link href="/shop" className="hover:text-[#184E46] transition-colors py-2 border-b-2 border-transparent hover:border-[#184E46]">
            // SEMUA GEAR
          </Link>
          <Link href="/shop?category=keyboard" className="hover:text-[#184E46] transition-colors py-2 border-b-2 border-transparent hover:border-[#184E46]">
            KEYBOARDS
          </Link>
          <Link href="/shop?category=mouse" className="hover:text-[#184E46] transition-colors py-2 border-b-2 border-transparent hover:border-[#184E46]">
            MICE
          </Link>
          <Link href="/shop?category=mousepad" className="hover:text-[#184E46] transition-colors py-2 border-b-2 border-transparent hover:border-[#184E46]">
            MOUSEPADS
          </Link>
          <Link href="/shop?category=switches-parts" className="hover:text-[#184E46] transition-colors py-2 border-b-2 border-transparent hover:border-[#184E46]">
            SWITCHES
          </Link>
          <Link
            href="/shop?offer=PREORDER"
            className="text-[#A84329] hover:text-[#88341f] py-2 border-b-2 border-transparent hover:border-[#A84329] flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A84329] animate-ping"></span>
            PRE-ORDER BATCH
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/cart"
            className="relative px-3.5 py-2 rounded bg-[#FFFFFF] border border-[#202724] text-[#202724] hover:bg-[#184E46] hover:text-[#F4F1EA] transition-all flex items-center gap-2 font-mono text-xs font-bold shadow-[2px_2px_0px_#202724]"
            aria-label="Keranjang"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">CART</span>
            {totalItemCount > 0 && (
              <span className="bg-[#184E46] text-[#F4F1EA] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalItemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded border border-[#202724] bg-white text-[#202724] hover:bg-[#F4F1EA] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4F1EA] border-b-2 border-[#202724] px-4 pt-4 pb-6 space-y-4">
          <div className="text-[11px] font-mono text-[#59635E] uppercase border-b border-[#202724]/20 pb-2">
            // INDEX KATEGORI PERIPHERAL
          </div>
          <nav className="grid grid-cols-2 gap-2 text-xs font-mono font-bold uppercase">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-white border border-[#202724] hover:bg-[#184E46] hover:text-white transition-colors"
            >
              Semua Gear
            </Link>
            <Link
              href="/shop?category=keyboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-white border border-[#202724] hover:bg-[#184E46] hover:text-white transition-colors"
            >
              Keyboards
            </Link>
            <Link
              href="/shop?category=mouse"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-white border border-[#202724] hover:bg-[#184E46] hover:text-white transition-colors"
            >
              Mice
            </Link>
            <Link
              href="/shop?category=mousepad"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-white border border-[#202724] hover:bg-[#184E46] hover:text-white transition-colors"
            >
              Mousepads
            </Link>
            <Link
              href="/shop?category=switches-parts"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-white border border-[#202724] hover:bg-[#184E46] hover:text-white transition-colors"
            >
              Switches & Gear
            </Link>
            <Link
              href="/shop?offer=PREORDER"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded bg-[#F4E5DC] text-[#A84329] border border-[#A84329] hover:bg-[#A84329] hover:text-white transition-colors"
            >
              Pre-Order Drop
            </Link>
          </nav>

          <div className="pt-2 border-t border-[#202724]/20 flex items-center justify-between text-xs font-mono">
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#184E46] hover:underline flex items-center gap-1 font-semibold"
            >
              <Compass className="w-3.5 h-3.5" />
              Lacak Status Pesanan
            </Link>
            <span className="text-[#59635E]">v2.6 // PROD</span>
          </div>
        </div>
      )}
    </header>
  );
}
