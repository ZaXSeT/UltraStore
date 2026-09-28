"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Menu, X, Compass, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { AnnouncementConfig, DEFAULT_ANNOUNCEMENT_CONFIG } from "../lib/cms-types";
import { useLanguage } from "../context/LanguageContext";
import { localizeAnnouncement } from "../lib/localized-cms";

export function Header() {
  const { locale, setLocale, t } = useLanguage();
  const { totalItemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(DEFAULT_ANNOUNCEMENT_CONFIG);
  const notice = localizeAnnouncement(announcement, locale);

  useEffect(() => {
    setMounted(true);
    fetch("/api/admin/settings?key=announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAnnouncement(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Notification Strip (Full Width) */}
      <div className="bg-[#090D16] text-slate-300 text-xs py-2 border-b border-slate-800/80 overflow-hidden">
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
            <span className="font-medium text-slate-200 truncate">
              {notice.primaryText}
            </span>
            {notice.secondaryText && (
              <>
                <span className="hidden md:inline text-slate-500">·</span>
                <span className="hidden md:inline text-slate-400">
                  {notice.secondaryText}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-300 shrink-0 text-[11px] sm:text-xs">
            <Link
              href="/track-order"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>{notice.trackLinkText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Full Width Edge-to-Edge) */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 h-16 sm:h-18 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Brand Logo - Pure typography ala infinitas.id with Metallic Sheen */}
        <Link href="/" aria-label="UltraStore" className="flex items-center group shrink-0">
          <span className="text-lg sm:text-2xl font-black tracking-[-0.04em] uppercase logo-shimmer select-none drop-shadow-xs" data-text="ULTRASTORE">
            ULTRASTORE
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <Link
            href="/shop"
            className="hover:text-[#2563EB] transition-colors py-2 border-b-2 border-transparent hover:border-[#2563EB]"
          >
            {t("Semua Produk", "Shop All")}
          </Link>
          <Link
            href="/shop?offer=PREORDER"
            className="hover:text-[#2563EB] transition-colors py-2 border-b-2 border-transparent hover:border-[#2563EB] flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
            <span>{t("Rilis Pre-Order", "Pre-Order Drops")}</span>
          </Link>
          <Link
            href="/track-order"
            className="hover:text-[#2563EB] transition-colors py-2 border-b-2 border-transparent hover:border-[#2563EB]"
          >
            {t("Lacak Pesanan", "Track Order")}
          </Link>
        </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="inline-flex h-[38px] sm:h-[42px] border border-slate-200 bg-white text-[11px] sm:text-xs font-bold" role="group" aria-label={t("Pilihan bahasa", "Language preference")}>
              <button
                type="button"
                onClick={() => setLocale("id")}
                aria-pressed={locale === "id"}
                className={`h-full px-2.5 sm:px-3.5 flex items-center justify-center transition-colors font-mono font-bold ${
                  locale === "id" ? "bg-[#0E52FF] text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
                className={`h-full px-2.5 sm:px-3.5 flex items-center justify-center transition-colors font-mono font-bold ${
                  locale === "en" ? "bg-[#0E52FF] text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center justify-center w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] border border-[#0E52FF] bg-[#0E52FF] hover:bg-[#0040E0] active:scale-[0.98] text-white transition-all shadow-sm shrink-0"
              aria-label={t("Buka keranjang belanja", "Open shopping cart")}
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {mounted && totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-white text-[#0E52FF] text-[10px] font-bold font-mono border border-[#0E52FF] shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-[38px] h-[38px] border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none shrink-0"
            aria-label={t("Buka menu", "Open menu")}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs uppercase font-bold hover:bg-[#0E52FF] hover:text-white transition-colors"
          >
            <span>{t("Semua Produk", "Shop All")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop?offer=PREORDER"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs uppercase font-bold hover:bg-[#0E52FF] hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0E52FF]"></span>
              <span>{t("Rilis Pre-Order", "Pre-Order Drops")}</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs uppercase font-bold hover:bg-[#0E52FF] hover:text-white transition-colors"
          >
            <span>{t("Lacak Pesanan", "Track Order")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
