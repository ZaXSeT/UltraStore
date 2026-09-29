"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Keyboard,
  Mouse,
  Layers,
  Sliders,
  Sparkles,
  Headphones,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

interface BrandItem {
  name: string;
  slug: string;
  count: number;
}

interface ShopFiltersProps {
  allBrands: BrandItem[];
  currentCategory?: string;
  currentBrand?: string;
  currentOffer?: string;
  searchQuery?: string;
  totalProducts: number;
}

// ponytail: static category list covers enthusiast gear seeds; upgrade to server-passed category list if admin category creation added.
const CATEGORIES = [
  { slug: "", label: "Semua", icon: Sparkles },
  { slug: "keyboard", label: "Keyboard", icon: Keyboard },
  { slug: "mouse", label: "Mouse", icon: Mouse },
  { slug: "mousepad", label: "Mousepad", icon: Layers },
  { slug: "switches-parts", label: "Switches", icon: Sliders },
  { slug: "audio", label: "Audio", icon: Headphones },
];

export function ShopFilters({
  allBrands,
  currentCategory = "",
  currentBrand = "",
  currentOffer = "",
  searchQuery = "",
}: ShopFiltersProps) {
  const router = useRouter();

  const updateFilters = (updates: {
    category?: string;
    brand?: string;
    offer?: string;
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
    if (merged.q) params.set("q", merged.q);

    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentBrand || currentOffer || searchQuery
  );

  return (
    <div className="bg-[var(--theme-surface)] border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Filter Bar: Category Tabs (Left-Aligned) + Brand Dropdown + Stock Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Column: Category Pills (Flush Left) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
            Kategori:
          </span>
          {CATEGORIES.map((c) => {
            const isActive = currentCategory === c.slug;
            const Icon = c.icon;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => updateFilters({ category: c.slug || "" })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white font-bold shadow-sm"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[var(--theme-ink)]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Brand Dropdown & Stock Status (Flush Right on desktop, left on mobile) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Dropdown */}
          <div className="relative inline-flex items-center">
            <label
              htmlFor="brand-select"
              className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mr-2"
            >
              Brand:
            </label>
            <div className="relative">
              <select
                id="brand-select"
                value={currentBrand}
                onChange={(e) => updateFilters({ brand: e.target.value })}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-mono font-medium text-[var(--theme-ink)] focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 cursor-pointer shadow-sm"
              >
                <option value="">Semua Brand ({allBrands.length})</option>
                {allBrands.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name} ({b.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Fulfillment Status Toggle */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono">
            <button
              type="button"
              onClick={() => updateFilters({ offer: "" })}
              className={`px-3 py-1 rounded-lg transition-all ${
                !currentOffer
                  ? "bg-[var(--theme-surface)] text-[var(--theme-ink)] font-bold shadow-sm"
                  : "text-slate-600 hover:text-[var(--theme-ink)]"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ offer: "READY" })}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                currentOffer === "READY"
                  ? "bg-teal-600 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:text-teal-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentOffer === "READY" ? "bg-[var(--theme-surface)]" : "bg-teal-500"
                }`}
              ></span>
              <span>Ready</span>
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ offer: "PREORDER" })}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                currentOffer === "PREORDER"
                  ? "bg-orange-600 text-white font-bold shadow-sm"
                  : "text-slate-600 hover:text-orange-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentOffer === "PREORDER" ? "bg-[var(--theme-surface)] animate-pulse" : "bg-orange-500"
                }`}
              ></span>
              <span>Pre-Order</span>
            </button>
          </div>

          {/* Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-xs font-mono font-bold hover:bg-orange-100 transition-colors"
              title="Reset Semua Filter"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
