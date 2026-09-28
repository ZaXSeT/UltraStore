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
  ChevronDown,
  Search,
  X,
  ShieldCheck,
  CheckCircle,
  Truck,
  Sparkles,
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

export function ShopSidebar({
  allCategories,
  allBrands,
  currentCategory = "",
  currentBrand = "",
  currentOffer = "",
  searchQuery = "",
  totalProducts,
}: ShopSidebarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const updateFilters = (updates: {
    category?: string;
    brand?: string;
    offer?: string;
    q?: string;
  }) => {
    const params = new URLSearchParams();
    const merged = {
      category: currentCategory,
      brand: currentBrand,
      offer: currentOffer,
      q: searchQuery,
      ...updates,
    };

    if (merged.category) params.set("category", merged.category);
    if (merged.brand) params.set("brand", merged.brand);
    if (merged.offer) params.set("offer", merged.offer);
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
    router.push("/shop");
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentBrand || currentOffer || searchQuery
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
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
              onClick={() => updateFilters({ category: "" })}
              className="text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              Semua
            </button>
          )}
        </div>

        <div className="space-y-1">
          {/* All Categories Item */}
          <button
            type="button"
            onClick={() => updateFilters({ category: "" })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
              !currentCategory
                ? "bg-slate-900 text-white font-semibold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-4 h-4 ${!currentCategory ? "text-teal-400" : "text-slate-400"}`} />
              <span>Semua Kategori</span>
            </div>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                !currentCategory
                  ? "bg-slate-800 text-slate-200"
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
              <button
                key={c.slug}
                type="button"
                onClick={() => updateFilters({ category: c.slug })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? "bg-slate-900 text-white font-semibold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                  <span className="truncate">{c.name}</span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                    isActive
                      ? "bg-slate-800 text-slate-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Brand Selection Dropdown */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="sidebar-brand-select"
            className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Brand
          </label>
          {currentBrand && (
            <button
              type="button"
              onClick={() => updateFilters({ brand: "" })}
              className="text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              Reset
            </button>
          )}
        </div>
        <div className="relative">
          <select
            id="sidebar-brand-select"
            value={currentBrand}
            onChange={(e) => updateFilters({ brand: e.target.value })}
            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-8 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer shadow-sm transition-all"
          >
            <option value="">Semua Brand ({allBrands.length})</option>
            {allBrands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name} ({b.count})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
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
              className="text-xs font-medium text-teal-600 hover:text-teal-700"
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
                ? "bg-teal-50 border-teal-500 text-teal-900 font-semibold shadow-sm"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <span>Ready Stock Hub</span>
            </div>
            <span className="text-[10px] text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full font-medium">
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
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Garansi Resmi UltraStore</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>100% Produk Original Pabrikan</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Dikirim Langsung dari Jakarta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
