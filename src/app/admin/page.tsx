"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  Layers,
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  Search,
  Eye,
  EyeOff,
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
    <div className="min-h-screen bg-[#0D0E11] text-neutral-100 flex flex-col font-sans">
      {/* Dedicated Admin Control Bar */}
      <header className="border-b border-neutral-800 bg-[#121318] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0E52FF] flex items-center justify-center font-mono font-black text-white text-sm tracking-tighter">
            US
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black tracking-tight text-white uppercase">
                ULTRASTORE
              </span>
              <span className="font-mono text-[10px] uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">Isolated Control Plane</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NODE ACTIVE (PORT 3000)</span>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 border border-neutral-700 transition-colors"
          >
            <span>Live Store</span>
          </a>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 font-mono text-xs uppercase font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("cms")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "cms"
                ? "bg-[#0E52FF] text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Hero Section CMS</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "categories"
                ? "bg-[#0E52FF] text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Categories CMS</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "products"
                ? "bg-[#0E52FF] text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>3. Product Directory ({products.length})</span>
          </button>
        </div>

        {saveMessage && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-700/80 text-emerald-300 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* TAB 1: HERO SECTION CMS */}
        {activeTab === "cms" && (
          <form onSubmit={handleSaveHero} className="bg-[#14151C] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-tight font-mono">
                  Hero Showcase Live Editor
                </h2>
                <p className="text-xs text-neutral-400">
                  Konfigurasi banner editorial, headline, copywriting, dan aset foto hero homepage.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[#0E52FF] hover:bg-blue-600 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Badge Text</label>
                <input
                  type="text"
                  value={hero.badgeText || ""}
                  onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Tagline / Indeks No.</label>
                <input
                  type="text"
                  value={hero.tagline || ""}
                  onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Availability Status</label>
                <input
                  type="text"
                  value={hero.availability || ""}
                  onChange={(e) => setHero({ ...hero, availability: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Judul Brand (Line 1)</label>
                <input
                  type="text"
                  value={hero.titleLine1 || ""}
                  onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Model Accent (Grey)</label>
                <input
                  type="text"
                  value={hero.titleAccent || ""}
                  onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Tipe Gear (Line 2)</label>
                <input
                  type="text"
                  value={hero.titleLine2 || ""}
                  onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Deskripsi Editorial</label>
                <textarea
                  rows={2}
                  value={hero.description || ""}
                  onChange={(e) => setHero({ ...hero, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Dimensi Gear</label>
                <input
                  type="text"
                  value={hero.dimensions || ""}
                  onChange={(e) => setHero({ ...hero, dimensions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Tebal &amp; Edge</label>
                <input
                  type="text"
                  value={hero.thickness || ""}
                  onChange={(e) => setHero({ ...hero, thickness: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">URL Gambar Produk Hero</label>
                <input
                  type="text"
                  value={hero.imageUrl || ""}
                  onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Tombol Utama Text</label>
                <input
                  type="text"
                  value={hero.ctaText || ""}
                  onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-neutral-400 uppercase text-[11px]">Tombol Utama Link</label>
                <input
                  type="text"
                  value={hero.ctaLink || ""}
                  onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1A1C24] border border-neutral-700 text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: CATEGORIES SHOWCASE CMS */}
        {activeTab === "categories" && (
          <form onSubmit={handleSaveCategories} className="bg-[#14151C] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-tight font-mono">
                  Category Showcase CMS (5 Kolom)
                </h2>
                <p className="text-xs text-neutral-400">
                  Ubah judul, subtitle spesifikasi teknis, dan foto thumbnail 5 kategori homepage.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[#0E52FF] hover:bg-blue-600 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Categories"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, idx) => (
                <div key={idx} className="border border-neutral-800 rounded-2xl p-4 space-y-3 bg-[#1A1C24]">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="font-mono text-xs font-bold text-white">SLOT #{cat.index || idx + 1}</span>
                    <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700">
                      CATEGORY TILE
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase">Judul Kategori</label>
                    <input
                      type="text"
                      value={cat.title || ""}
                      onChange={(e) => {
                        const updated = [...categories];
                        updated[idx].title = e.target.value;
                        setCategories(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-700 bg-[#121318] text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase">Spesifikasi Teaser</label>
                    <input
                      type="text"
                      value={cat.spec || ""}
                      onChange={(e) => {
                        const updated = [...categories];
                        updated[idx].spec = e.target.value;
                        setCategories(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-700 bg-[#121318] text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 uppercase">URL Gambar Showcase</label>
                    <input
                      type="text"
                      value={cat.image || ""}
                      onChange={(e) => {
                        const updated = [...categories];
                        updated[idx].image = e.target.value;
                        setCategories(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-700 bg-[#121318] text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>
        )}

        {/* TAB 3: PRODUCT DIRECTORY */}
        {activeTab === "products" && (
          <div className="bg-[#14151C] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-tight font-mono">
                  Product Inventory Directory
                </h2>
                <p className="text-xs text-neutral-400">
                  Toggle status visibilitas katalog etalase dan update URL foto master.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Cari produk / brand..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    loadProducts(e.target.value);
                  }}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-[#1A1C24] text-white focus:outline-none focus:border-[#0E52FF]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Produk &amp; Brand</th>
                    <th className="py-2.5">Kategori</th>
                    <th className="py-2.5">Foto URL</th>
                    <th className="py-2.5 text-right">Harga Mulai</th>
                    <th className="py-2.5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                            p.published === 1
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                              : "bg-neutral-800 text-neutral-500 border-neutral-700"
                          }`}
                        >
                          {p.published === 1 ? "ACTIVE" : "HIDDEN"}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-white max-w-xs truncate">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-neutral-400 font-normal">{p.brand_name}</div>
                      </td>
                      <td className="py-3 text-neutral-400">{p.category_name}</td>
                      <td className="py-3 max-w-xs">
                        <input
                          type="text"
                          defaultValue={p.primary_image || ""}
                          onBlur={(e) => handleUpdateProductImage(p.id, e.target.value)}
                          className="w-full px-2 py-1 text-[11px] border border-neutral-700 rounded bg-[#121318] text-neutral-300 font-mono truncate"
                        />
                      </td>
                      <td className="py-3 text-right font-bold text-white">
                        {p.min_price ? `Rp ${p.min_price.toLocaleString("id-ID")}` : "-"}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => togglePublishProduct(p.id, p.published)}
                          className="p-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                          title={p.published === 1 ? "Sembunyikan dari Toko" : "Tampilkan di Toko"}
                        >
                          {p.published === 1 ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-500" />}
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
  );
}
