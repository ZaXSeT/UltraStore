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
  Check,
  SlidersHorizontal,
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
  const [mobileExpanded, setMobileExpanded] = useState(false);

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
    <div className="w-full">
      {/* Mobile Toggle Button (Hidden on Desktop) */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#202724] rounded text-xs font-mono font-bold text-[#202724] shadow-[2px_2px_0px_#202724] hover:bg-[#F4F1EA] transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#184E46]" />
            <span className="uppercase tracking-wider">FILTER & SPESIFIKASI</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#A84329]"></span>
            )}
          </div>
          <span className="text-[11px] text-[#59635E]">
            {mobileExpanded ? "[ TUTUP - ]" : "[ FILTER + ]"}
          </span>
        </button>
      </div>

      {/* Main Filter Sidebar Content */}
      <div
        className={`${
          mobileExpanded ? "block" : "hidden"
        } lg:block bg-white border border-[#D9DDD5] rounded-md p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5 text-xs font-mono`}
      >
        {/* Sidebar Header Title */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DDD5]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#184E46]"></span>
            <span className="font-bold text-[#202724] tracking-wider text-[11px] uppercase">
              FILTER KATALOG
            </span>
          </div>
          <span className="text-[10px] text-[#59635E]">
            REV.2026
          </span>
        </div>

        {/* 1. Hardware Search */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#59635E] uppercase tracking-wider">
              // PENCARIAN
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-[10px] text-[#A84329] hover:underline flex items-center gap-0.5"
              >
                <X className="w-3 h-3" />
                <span>Hapus</span>
              </button>
            )}
          </div>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 text-[#59635E] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Model, switch, sensor..."
              className="w-full bg-[#F4F1EA]/60 border border-[#D9DDD5] rounded py-1.5 pl-8 pr-7 text-xs text-[#202724] placeholder-[#59635E]/60 focus:bg-white focus:outline-none focus:border-[#184E46] focus:ring-1 focus:ring-[#184E46] transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#59635E] hover:text-[#202724]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>
        </div>

        {/* 2. Category Navigation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#59635E] uppercase tracking-wider">
              // KATEGORI PERIPHERAL
            </span>
            {currentCategory && (
              <button
                type="button"
                onClick={() => updateFilters({ category: "" })}
                className="text-[10px] text-[#184E46] hover:underline"
              >
                Lihat Semua
              </button>
            )}
          </div>

          <div className="space-y-1">
            {/* All Categories Item */}
            <button
              type="button"
              onClick={() => updateFilters({ category: "" })}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors border ${
                !currentCategory
                  ? "bg-[#202724] border-[#202724] text-[#F4F1EA] font-bold"
                  : "bg-white border-transparent text-[#202724] hover:bg-[#F4F1EA] hover:border-[#D9DDD5]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-70">[ALL]</span>
                <span>Semua Gear</span>
              </div>
              <span
                className={`text-[10px] px-1 py-0.2 rounded-sm ${
                  !currentCategory
                    ? "bg-[#184E46] text-white"
                    : "bg-[#F4F1EA] text-[#59635E] border border-[#D9DDD5]"
                }`}
              >
                {totalProducts}
              </span>
            </button>

            {/* List Categories */}
            {allCategories.map((c) => {
              const isActive = currentCategory === c.slug;
              const Icon = CATEGORY_ICONS[c.slug] || Sliders;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => updateFilters({ category: c.slug })}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors border ${
                    isActive
                      ? "bg-[#202724] border-[#202724] text-[#F4F1EA] font-bold"
                      : "bg-white border-transparent text-[#202724] hover:bg-[#F4F1EA] hover:border-[#D9DDD5]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#184E46]" : "text-[#59635E]"}`} />
                    <span className="truncate">{c.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded-sm ${
                      isActive
                        ? "bg-[#184E46] text-white"
                        : "bg-[#F4F1EA] text-[#59635E] border border-[#D9DDD5]"
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Brand Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="sidebar-brand-select"
              className="text-[10px] font-bold text-[#59635E] uppercase tracking-wider"
            >
              // MANUFAKTUR & BRAND
            </label>
            {currentBrand && (
              <button
                type="button"
                onClick={() => updateFilters({ brand: "" })}
                className="text-[10px] text-[#184E46] hover:underline"
              >
                Reset Brand
              </button>
            )}
          </div>
          <div className="relative">
            <select
              id="sidebar-brand-select"
              value={currentBrand}
              onChange={(e) => updateFilters({ brand: e.target.value })}
              className="w-full appearance-none bg-white border border-[#D9DDD5] rounded py-1.5 pl-3 pr-8 text-xs text-[#202724] focus:outline-none focus:border-[#184E46] focus:ring-1 focus:ring-[#184E46] cursor-pointer"
            >
              <option value="">Semua Brand ({allBrands.length})</option>
              {allBrands.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name} ({b.count})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#59635E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 4. Fulfillment Type */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#59635E] uppercase tracking-wider">
              // STATUS FULFILLMENT
            </span>
            {currentOffer && (
              <button
                type="button"
                onClick={() => updateFilters({ offer: "" })}
                className="text-[10px] text-[#184E46] hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => updateFilters({ offer: "" })}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left border transition-colors ${
                !currentOffer
                  ? "bg-[#202724] border-[#202724] text-[#F4F1EA] font-bold"
                  : "bg-white border-[#D9DDD5] text-[#202724] hover:bg-[#F4F1EA]"
              }`}
            >
              <span>Semua Status</span>
              <span className="text-[10px] opacity-70">Ready + PO</span>
            </button>

            <button
              type="button"
              onClick={() => updateFilters({ offer: "READY" })}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left border transition-colors ${
                currentOffer === "READY"
                  ? "bg-[#E4ECE6] border-[#184E46] text-[#184E46] font-bold"
                  : "bg-white border-[#D9DDD5] text-[#202724] hover:bg-[#F4F1EA]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#184E46]"></span>
                <span>Ready Stock Hub</span>
              </div>
              <span className="text-[9px] uppercase px-1 py-0.2 rounded-sm bg-[#184E46]/10 text-[#184E46] font-bold">
                1-2 Hari
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateFilters({ offer: "PREORDER" })}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-left border transition-colors ${
                currentOffer === "PREORDER"
                  ? "bg-[#F4E5DC] border-[#A84329] text-[#A84329] font-bold"
                  : "bg-white border-[#D9DDD5] text-[#202724] hover:bg-[#F4F1EA]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A84329]"></span>
                <span>Pre-Order Batch</span>
              </div>
              <span className="text-[9px] uppercase px-1 py-0.2 rounded-sm bg-[#A84329]/10 text-[#A84329] font-bold">
                Batch Rilisan
              </span>
            </button>
          </div>
        </div>

        {/* 5. Reset Action Button */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-[#D9DDD5]">
            <button
              type="button"
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded border border-[#A84329]/40 bg-[#F4E5DC]/50 hover:bg-[#F4E5DC] text-[#A84329] text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET SEMUA FILTER</span>
            </button>
          </div>
        )}

        {/* 6. Technical Spec Assurance Card */}
        <div className="pt-2 border-t border-[#D9DDD5]">
          <div className="bg-[#F4F1EA]/70 border border-[#D9DDD5] rounded p-2.5 space-y-1.5 text-[10px] text-[#59635E]">
            <div className="flex items-center gap-1.5 text-[#202724] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#184E46]" />
              <span>SPESIFIKASI DIVERIFIKASI</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-[#184E46] shrink-0" />
              <span>Foto peripheral riil resmi</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-[#184E46] shrink-0" />
              <span>Garansi distributor Jakarta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
