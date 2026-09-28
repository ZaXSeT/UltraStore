"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Layers,
  Package,
  Save,
  CheckCircle2,
  Search,
  Eye,
  EyeOff,
  ArrowUpRight,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"cms" | "categories" | "products">("cms");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [hero, setHero] = useState<any>({
    badgeText: "",
    tagline: "",
    titleLine1: "",
    titleLine2: "",
    titleAccent: "",
    description: "",
    dimensions: "",
    thickness: "",
    availability: "",
    ctaText: "",
    ctaLink: "",
    imageUrl: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setHero(data.data.hero || {});
          setCategories(data.data.categories || []);
        }
      })
      .catch(console.error);

    loadProducts();
  }, []);

  const loadProducts = (search = "") => {
    fetch(`/api/admin/products${search ? `?search=${encodeURIComponent(search)}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
        }
      })
      .catch(console.error);
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_config", value: hero }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage("Hero Configuration tersimpan live!");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage("Gagal menyimpan Hero Configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategories = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "categories_config", value: categories }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage("Kategori Showcase tersimpan live!");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage("Gagal menyimpan Kategori.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublishProduct = async (id: string, currentPublished: number) => {
    const nextPublished = currentPublished === 1 ? 0 : 1;
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published: nextPublished }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: nextPublished } : p))
    );
  };

  const handleUpdateProductImage = async (id: string, newImage: string) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, primary_image: newImage }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, primary_image: newImage } : p))
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[#111215] flex flex-col font-sans selection:bg-[#0E52FF] selection:text-white">
      {/* Top Editorial Architectural Bar */}
      <header className="border-b border-[#E2E5EB] bg-white sticky top-0 z-50 px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#0E52FF]" />
            <span className="font-mono text-sm font-black tracking-[-0.03em] uppercase text-[#111215]">
              ULTRASTORE / CP
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 border-l border-[#E2E5EB] pl-6 font-mono text-[11px] text-[#6E7382]">
            <span className="uppercase tracking-widest text-[#111215] font-semibold">ENGINE:</span>
            <span>SQLITE 3.49 / WAL</span>
            <span className="text-[#C2C6D1]">·</span>
            <span className="uppercase tracking-widest text-[#111215] font-semibold">STORAGE:</span>
            <span>CLOUDFLARE R2</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {saveMessage && (
            <div className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-4 py-2 border border-[#111215] bg-[#111215] hover:bg-[#0E52FF] hover:border-[#0E52FF] text-white font-mono text-xs uppercase tracking-wider transition-all duration-200"
          >
            <span>Live Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </header>

      {/* Main Studio Frame */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Vertical Architectural Index */}
        <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[#E2E5EB] bg-white p-6 sm:p-8 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8F94A3] block">
                CONSOLE DISPATCH
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#111215]">
                Content &amp; Assets
              </h2>
            </div>

            <nav className="flex flex-col space-y-1 font-mono text-xs uppercase font-bold tracking-wider">
              <button
                onClick={() => setActiveTab("cms")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "cms"
                    ? "border-[#111215] bg-[#111215] text-white"
                    : "border-transparent text-[#6E7382] hover:text-[#111215] hover:border-[#E2E5EB]"
                }`}
              >
                <span>01. Hero Matrix</span>
                <span className="text-[10px] opacity-60">CMS</span>
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "categories"
                    ? "border-[#111215] bg-[#111215] text-white"
                    : "border-transparent text-[#6E7382] hover:text-[#111215] hover:border-[#E2E5EB]"
                }`}
              >
                <span>02. 5-Slot Category</span>
                <span className="text-[10px] opacity-60">GRID</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "products"
                    ? "border-[#111215] bg-[#111215] text-white"
                    : "border-transparent text-[#6E7382] hover:text-[#111215] hover:border-[#E2E5EB]"
                }`}
              >
                <span>03. Master Catalog</span>
                <span className="text-[10px] opacity-60">{products.length} ITEMS</span>
              </button>
            </nav>
          </div>

          <div className="hidden lg:block pt-8 border-t border-[#E2E5EB] font-mono text-[11px] text-[#8F94A3] space-y-2">
            <div>HOST: admin.localhost:3000</div>
            <div>STATUS: STANDALONE CP</div>
          </div>
        </aside>

        {/* Right Active Workspace */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {/* TAB 1: HERO STAGE CMS */}
          {activeTab === "cms" && (
            <div className="max-w-6xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#0E52FF] font-bold mb-1">
                    PRIMARY STAGE CONFIG
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111215]">
                    Hero Showcase Parameters
                  </h1>
                </div>

                <button
                  onClick={handleSaveHero}
                  disabled={saving}
                  className="px-8 py-3.5 bg-[#111215] hover:bg-[#0E52FF] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "SAVING..." : "COMMIT TO DATABASE"}</span>
                </button>
              </div>

              {/* Split Editor: Inputs on left, Realtime 1:1 Framing on right */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Form Fields (7 cols) */}
                <div className="xl:col-span-7 space-y-6 bg-white border border-[#E2E5EB] p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Badge Tag (Top)
                      </label>
                      <input
                        type="text"
                        value={hero.badgeText || ""}
                        onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Index / Series Code
                      </label>
                      <input
                        type="text"
                        value={hero.tagline || ""}
                        onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Brand Line 1
                      </label>
                      <input
                        type="text"
                        value={hero.titleLine1 || ""}
                        onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Model Highlight (Accent)
                      </label>
                      <input
                        type="text"
                        value={hero.titleAccent || ""}
                        onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Suffix Line 2
                      </label>
                      <input
                        type="text"
                        value={hero.titleLine2 || ""}
                        onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                      Editorial Synopsis
                    </label>
                    <textarea
                      rows={3}
                      value={hero.description || ""}
                      onChange={(e) => setHero({ ...hero, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs leading-relaxed border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={hero.dimensions || ""}
                        onChange={(e) => setHero({ ...hero, dimensions: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Thickness / Cut
                      </label>
                      <input
                        type="text"
                        value={hero.thickness || ""}
                        onChange={(e) => setHero({ ...hero, thickness: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Status
                      </label>
                      <input
                        type="text"
                        value={hero.availability || ""}
                        onChange={(e) => setHero({ ...hero, availability: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#E2E5EB]">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                      Hero Master Artwork (1:1 Ratio Cloudflare R2 / CDN URL)
                    </label>
                    <input
                      type="text"
                      value={hero.imageUrl || ""}
                      onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 font-mono text-[11px] border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Primary CTA Label
                      </label>
                      <input
                        type="text"
                        value={hero.ctaText || ""}
                        onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        CTA Target URL
                      </label>
                      <input
                        type="text"
                        value={hero.ctaLink || ""}
                        onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Architectural Preview Card (5 cols) */}
                <div className="xl:col-span-5 bg-white border border-[#E2E5EB] p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8F94A3]">
                      LIVE RATIO PREVIEW (1:1 STAGE)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="relative aspect-square w-full max-w-[340px] mx-auto border border-[#E2E5EB] overflow-hidden bg-[#F8F9FA] shadow-xs">
                    {hero.imageUrl ? (
                      <Image
                        src={hero.imageUrl}
                        alt="Hero Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#8F94A3]">
                        No Asset Assigned
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#E2E5EB] pt-4 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-[#6E7382]">
                      <span>RENDERED HEADLINE:</span>
                      <span className="font-bold text-[#111215]">{hero.titleLine1} {hero.titleAccent}</span>
                    </div>
                    <div className="flex justify-between text-[#6E7382]">
                      <span>AVAILABILITY:</span>
                      <span className="font-bold text-emerald-700">{hero.availability}</span>
                    </div>
                    <div className="flex justify-between text-[#6E7382]">
                      <span>DIMENSIONS:</span>
                      <span className="font-bold text-[#111215]">{hero.dimensions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORY SHOWCASES */}
          {activeTab === "categories" && (
            <div className="max-w-6xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#0E52FF] font-bold mb-1">
                    INDEX ARCHITECTURE
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111215]">
                    5-Slot Category Directory
                  </h1>
                </div>

                <button
                  onClick={handleSaveCategories}
                  disabled={saving}
                  className="px-8 py-3.5 bg-[#111215] hover:bg-[#0E52FF] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "SAVING..." : "COMMIT CATEGORIES"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {categories.map((cat, idx) => (
                  <div key={idx} className="bg-white border border-[#E2E5EB] p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-3">
                      <span className="font-mono text-xs font-black text-[#111215]">SLOT 0{idx + 1}</span>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#F6F7F9] border border-[#E2E5EB] text-[#6E7382]">
                        {cat.index}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Category Title</label>
                      <input
                        type="text"
                        value={cat.title || ""}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[idx].title = e.target.value;
                          setCategories(updated);
                        }}
                        className="w-full px-3.5 py-2 font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Technical Teaser</label>
                      <input
                        type="text"
                        value={cat.spec || ""}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[idx].spec = e.target.value;
                          setCategories(updated);
                        }}
                        className="w-full px-3.5 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Showcase Image URL</label>
                      <input
                        type="text"
                        value={cat.image || ""}
                        onChange={(e) => {
                          const updated = [...categories];
                          updated[idx].image = e.target.value;
                          setCategories(updated);
                        }}
                        className="w-full px-3.5 py-2 font-mono text-[11px] border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    {cat.image && (
                      <div className="relative aspect-video w-full border border-[#E2E5EB] overflow-hidden bg-[#F8F9FA] mt-2">
                        <Image src={cat.image} alt={cat.title} fill unoptimized className="object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT DIRECTORY */}
          {activeTab === "products" && (
            <div className="max-w-6xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#0E52FF] font-bold mb-1">
                    INVENTORY MASTER
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111215]">
                    Catalog Visibility &amp; Assets
                  </h1>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8F94A3]" />
                  <input
                    type="text"
                    placeholder="Search brand, model, SKU..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      loadProducts(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[#111215]"
                  />
                </div>
              </div>

              <div className="bg-white border border-[#E2E5EB] overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E5EB] bg-[#F8F9FA] text-[#6E7382] uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Master Media Path</th>
                      <th className="py-3 px-4 text-right">Floor Price</th>
                      <th className="py-3 px-4 text-center">Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5EB]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F9FAFC] transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block font-bold text-[10px] px-2 py-0.5 border ${
                              p.published === 1
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-neutral-100 text-neutral-500 border-neutral-300"
                            }`}
                          >
                            {p.published === 1 ? "LIVE" : "DRAFT"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans font-bold text-[#111215] max-w-xs truncate">
                          <div>{p.name}</div>
                          <div className="font-mono text-[10px] font-normal text-[#8F94A3]">{p.brand_name}</div>
                        </td>
                        <td className="py-3 px-4 text-[#6E7382] uppercase text-[11px]">{p.category_name}</td>
                        <td className="py-3 px-4 max-w-xs">
                          <input
                            type="text"
                            defaultValue={p.primary_image || ""}
                            onBlur={(e) => handleUpdateProductImage(p.id, e.target.value)}
                            className="w-full px-2.5 py-1 text-[11px] border border-[#E2E5EB] bg-white focus:outline-none focus:border-[#111215] truncate"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#111215]">
                          {p.min_price ? `Rp ${p.min_price.toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePublishProduct(p.id, p.published)}
                            className="p-1.5 border border-[#E2E5EB] hover:border-[#111215] transition-colors"
                            title={p.published === 1 ? "Hide from Storefront" : "Publish to Storefront"}
                          >
                            {p.published === 1 ? (
                              <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-[#8F94A3]" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
