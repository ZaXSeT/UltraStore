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
    <div className="w-full bg-white border border-neutral-200/90 p-5 space-y-6">
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

      {/* 2. Category Navigation (Swiss Industrial List, Zero AI-Slop) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.16em] text-neutral-500">
            GEAR SPECIALIZATION
          </span>
          {currentCategory && (
            <button
              type="button"
              onClick={() => updateFilters({ category: "", surface: "" })}
              className="font-mono text-[10px] uppercase text-[#0E52FF] hover:underline"
            >
              ALL
            </button>
          )}
        </div>

        <div className="border border-neutral-200 divide-y divide-neutral-200 bg-white">
          {/* All Categories Item */}
          <button
            type="button"
            onClick={() => updateFilters({ category: "", surface: "" })}
            className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono transition-colors text-left ${
              !currentCategory
                ? "bg-[#111215] text-white font-bold"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <span className="uppercase tracking-wider">All Categories</span>
            <span className="text-[10px] opacity-60 font-tabular">{totalProducts}</span>
          </button>

          {/* Individual Categories from DB */}
          {allCategories.map((c) => {
            const isActive = currentCategory === c.slug;
            return (
              <div key={c.slug}>
                <button
                  type="button"
                  onClick={() => updateFilters({ category: c.slug, surface: "" })}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono transition-colors text-left ${
                    isActive
                      ? "bg-[#111215] text-white font-bold"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="uppercase tracking-wider truncate">{c.name}</span>
                  <span className="text-[10px] opacity-60 font-tabular">{c.count}</span>
                </button>

                {/* Sub-Filter Khusus Mousepad: Glass vs Non-Glass (Cloth/Poron) */}
                {c.slug === "mousepad" && (currentCategory === "mousepad" || currentCategory === "") && (
                  <div className="bg-neutral-50 border-t border-neutral-200 divide-y divide-neutral-200/60 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: "mousepad", surface: "glass" })}
                      className={`w-full flex items-center justify-between pl-6 pr-3.5 py-1.5 transition-colors text-left ${
                        currentSurface === "glass"
                          ? "bg-neutral-200 text-neutral-950 font-bold"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#0E52FF]" />
                        <span>Glasspad (Kaca)</span>
                      </div>
                      <span className="text-[10px] opacity-60">16</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateFilters({ category: "mousepad", surface: "cloth" })}
                      className={`w-full flex items-center justify-between pl-6 pr-3.5 py-1.5 transition-colors text-left ${
                        currentSurface === "cloth"
                          ? "bg-neutral-200 text-neutral-950 font-bold"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-neutral-400" />
                        <span>Cloth / Poron Base</span>
                      </div>
                      <span className="text-[10px] opacity-60">14</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SCROLLABLE BRAND SELECTOR (Swiss Architectural Frame, Zero AI-Slop) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsBrandExpanded(!isBrandExpanded)}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-[0.16em] text-neutral-500 hover:text-[#111215] transition-colors"
          >
            <span>BRAND DIRECTORY ({allBrands.length})</span>
            <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isBrandExpanded ? "rotate-180" : ""}`} />
          </button>
          {currentBrand && (
            <button
              type="button"
              onClick={() => updateFilters({ brand: "" })}
              className="font-mono text-[10px] uppercase text-[#0E52FF] hover:underline"
            >
              CLEAR
            </button>
          )}
        </div>

        {isBrandExpanded && (
          <div className="space-y-2 pt-1">
            {/* Quick search input for brands */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder={`Search ${allBrands.length} brands...`}
                className="w-full pl-8 pr-7 py-2 bg-neutral-50 border border-neutral-200 text-xs font-mono placeholder-neutral-400 focus:outline-none focus:border-[#111215] focus:bg-white transition-all"
              />
              {brandSearch && (
                <button
                  type="button"
                  onClick={() => setBrandSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#111215] p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Scrollable Brand List with visible custom scrollbar */}
            <div className="max-h-56 overflow-y-auto border border-neutral-200 divide-y divide-neutral-200 bg-white scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
              {/* All Brands button */}
              <button
                type="button"
                onClick={() => updateFilters({ brand: "" })}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors text-left ${
                  !currentBrand
                    ? "bg-[#111215] text-white font-bold"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!currentBrand && <span className="w-1.5 h-1.5 bg-[#0E52FF]" />}
                  <span className="uppercase tracking-wider">All Brands</span>
                </div>
                <span className="text-[10px] opacity-60 font-tabular font-mono">
                  {allBrands.length}
                </span>
              </button>

              {/* Filtered Brands */}
              {filteredBrands.length === 0 ? (
                <div className="px-3 py-3 text-center text-xs font-mono text-neutral-400">
                  No matching brand
                </div>
              ) : (
                filteredBrands.map((b) => {
                  const isActive = currentBrand === b.slug;
                  return (
                    <button
                      key={b.slug}
                      type="button"
                      onClick={() => updateFilters({ brand: b.slug })}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors text-left ${
                        isActive
                          ? "bg-[#111215] text-white font-bold"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isActive && <span className="w-1.5 h-1.5 bg-[#0E52FF]" />}
                        <span className="truncate uppercase tracking-wider">{b.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-tabular shrink-0 ml-1 ${isActive ? "opacity-75" : "text-neutral-400"}`}>
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

      {/* 4. Stock & Pre-order Status (Swiss Industrial Architectural List, Zero AI-Slop) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.16em] text-neutral-500">
            DISPATCH AVAILABILITY
          </span>
          {currentOffer && (
            <button
              type="button"
              onClick={() => updateFilters({ offer: "" })}
              className="font-mono text-[10px] uppercase text-[#0E52FF] hover:underline"
            >
              CLEAR
            </button>
          )}
        </div>

        <div className="border border-neutral-200 divide-y divide-neutral-200 bg-white">
          <button
            type="button"
            onClick={() => updateFilters({ offer: "" })}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono transition-colors text-left ${
              !currentOffer
                ? "bg-[#111215] text-white font-bold"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <span className="uppercase tracking-wider">All Stock Types</span>
            <span className="text-[10px] opacity-60">READY + PO</span>
          </button>

          <button
            type="button"
            onClick={() => updateFilters({ offer: "READY" })}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono transition-colors text-left ${
              currentOffer === "READY"
                ? "bg-[#111215] text-white font-bold"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500" />
              <span className="uppercase tracking-wider">Ready Physical Stock</span>
            </div>
            <span className="text-[10px] opacity-60">24H DISPATCH</span>
          </button>

          <button
            type="button"
            onClick={() => updateFilters({ offer: "PREORDER" })}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono transition-colors text-left ${
              currentOffer === "PREORDER"
                ? "bg-[#111215] text-white font-bold"
                : "text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#0E52FF]" />
              <span className="uppercase tracking-wider">Scheduled Pre-Order</span>
            </div>
            <span className="text-[10px] opacity-60">BATCH RUN</span>
          </button>
        </div>
      </div>

      {/* 5. Reset Filter Button */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={resetAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-neutral-300 hover:border-[#111215] bg-neutral-100 hover:bg-neutral-200 text-[#111215] text-xs font-mono font-bold uppercase transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
