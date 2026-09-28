"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Keyboard,
  Mouse,
  Layers,
  Sliders,
  Headphones,
  RotateCcw,
  Search,
  X,
  ShieldCheck,
  CheckCircle,
  Truck,
  Sparkles,
  Check,
  Tag,
  ChevronDown,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

interface BrandItem {
  name: string;
  slug: string;
  count: number;
}

interface ShopSidebarProps {
  allCategories: CategoryItem[];
  allBrands: BrandItem[];
  currentCategory?: string;
  currentBrand?: string;
  currentOffer?: string;
  currentSurface?: string;
  searchQuery?: string;
  totalProducts: number;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  keyboard: Keyboard,
  mouse: Mouse,
  mousepad: Layers,
  "switches-parts": Sliders,
  audio: Headphones,
};

// ponytail: integrated scrollable brand list without unstyled native popovers. Upgrade to virtualized list if brands > 200.
export function ShopSidebar({
  allCategories,
  allBrands,
  currentCategory = "",
  currentBrand = "",
  currentOffer = "",
  currentSurface = "",
  searchQuery = "",
  totalProducts,
}: ShopSidebarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [brandSearch, setBrandSearch] = useState("");
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);

  const updateFilters = (updates: {
    category?: string;
    brand?: string;
    offer?: string;
    surface?: string;
    q?: string;
  }) => {
    const params = new URLSearchParams();
    const merged = {
      category: currentCategory,
      brand: currentBrand,
      offer: currentOffer,
      surface: currentSurface,
      q: searchQuery,
      ...updates,
    };

    if (merged.category) params.set("category", merged.category);
    if (merged.brand) params.set("brand", merged.brand);
    if (merged.offer) params.set("offer", merged.offer);
    if (merged.surface) params.set("surface", merged.surface);
    if (merged.q && merged.q.trim() !== "") params.set("q", merged.q.trim());

    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchTerm });
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateFilters({ q: "" });
  };

  const resetAll = () => {
    setSearchTerm("");
    setBrandSearch("");
    router.push("/shop");
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentBrand || currentOffer || currentSurface || searchQuery
  );

  const filteredBrands = allBrands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-6">
      {/* 1. Hardware Search */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="sidebar-search"
            className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Pencarian
          </label>
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          )}
        </div>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="sidebar-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari model, switch, brand..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* 2. Category Navigation */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Kategori
          </span>
          {currentCategory && (
            <button
              type="button"
              onClick={() => updateFilters({ category: "", surface: "" })}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Semua
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* All Categories Item */}
          <button
            type="button"
            onClick={() => updateFilters({ category: "", surface: "" })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
              !currentCategory
                ? "bg-blue-600 text-white font-semibold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-4 h-4 ${!currentCategory ? "text-blue-200" : "text-slate-400"}`} />
              <span>Semua Kategori</span>
            </div>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                !currentCategory
                  ? "bg-blue-700 text-white font-bold"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {totalProducts}
            </span>
          </button>

          {/* Individual Categories from DB */}
          {allCategories.map((c) => {
            const isActive = currentCategory === c.slug;
            const Icon = CATEGORY_ICONS[c.slug] || Sparkles;
            return (
              <div key={c.slug} className="space-y-1">
                <button
                  type="button"
                  onClick={() => updateFilters({ category: c.slug, surface: "" })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-200" : "text-slate-400"}`} />
                    <span className="truncate">{c.name}</span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                      isActive
                        ? "bg-blue-700 text-white font-bold"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {c.count}
                  </span>
                </button>

                {/* Sub-Filter Khusus Mousepad: Glass vs Non-Glass (Cloth/Poron) */}
                {c.slug === "mousepad" && (currentCategory === "mousepad" || currentCategory === "") && (
                  <div className="pl-6 pt-1 space-y-1">
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">
                      Material Surface
                    </div>
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: "mousepad", surface: "glass" })}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        currentSurface === "glass"
                          ? "bg-slate-900 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Glasspad (Kaca)</span>
                      </div>
                      <span className="text-[10px] opacity-70">16</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateFilters({ category: "mousepad", surface: "cloth" })}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        currentSurface === "cloth"
                          ? "bg-slate-900 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>Cloth / Poron Base</span>
                      </div>
                      <span className="text-[10px] opacity-70">14</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SCROLLABLE BRAND SELECTOR (Fully Scrollable, Clean UI, Non-Clipping) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsBrandExpanded(!isBrandExpanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
          >
            <span>Brand ({allBrands.length})</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isBrandExpanded ? "rotate-180" : ""}`} />
          </button>
          {currentBrand && (
            <button
              type="button"
              onClick={() => updateFilters({ brand: "" })}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
          )}
        </div>

        {isBrandExpanded && (
          <div className="space-y-2 pt-1">
            {/* Quick search input for brands */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder={`Cari dari ${allBrands.length} brand...`}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
              />
              {brandSearch && (
                <button
                  type="button"
                  onClick={() => setBrandSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Scrollable Brand List with visible custom scrollbar */}
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
              {/* All Brands button */}
              <button
                type="button"
                onClick={() => updateFilters({ brand: "" })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  !currentBrand
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!currentBrand && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  <span>Semua Brand</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {allBrands.length}
                </span>
              </button>

              {/* Filtered Brands */}
              {filteredBrands.length === 0 ? (
                <div className="px-2 py-3 text-center text-xs text-slate-400">
                  Tidak ada brand yang cocok
                </div>
              ) : (
                filteredBrands.map((b) => {
                  const isActive = currentBrand === b.slug;
                  return (
                    <button
                      key={b.slug}
                      type="button"
                      onClick={() => updateFilters({ brand: b.slug })}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200/60"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isActive && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        <span className="truncate">{b.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0 ml-1">
                        {b.count}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Stock & Pre-order Status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Ketersediaan
          </span>
          {currentOffer && (
            <button
              type="button"
              onClick={() => updateFilters({ offer: "" })}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Semua
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => updateFilters({ offer: "" })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border ${
              !currentOffer
                ? "bg-slate-900 border-slate-900 text-white font-semibold shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span>Semua Produk</span>
            <span className="text-[11px] text-slate-400">Ready & PO</span>
          </button>

          <button
            type="button"
            onClick={() => updateFilters({ offer: "READY" })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border ${
              currentOffer === "READY"
                ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Ready Stock Hub</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-medium">
              1-2 Hari
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateFilters({ offer: "PREORDER" })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border ${
              currentOffer === "PREORDER"
                ? "bg-amber-50 border-amber-500 text-amber-900 font-semibold shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Pre-Order Batch</span>
            </div>
            <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full font-medium">
              Batch Terjadwal
            </span>
          </button>
        </div>
      </div>

      {/* 5. Reset Filter Button */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={resetAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}

      {/* 6. Authenticity Guarantee Micro-Card */}
      <div className="pt-2 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Garansi Resmi UltraStore</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>100% Produk Original Pabrikan</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Dikirim Langsung dari Jakarta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
