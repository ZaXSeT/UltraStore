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
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10 space-y-8 min-h-screen bg-neutral-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6 bg-white p-6 rounded-2xl border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-md border border-neutral-200 mb-2 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0E52FF]" />
            <span>CENTRAL COMMAND ADMIN CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase">
            UltraStore Dashboard &amp; CMS
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Ubah konfigurasi Hero, Foto Banner, Direktori Kategori, dan Katalog tanpa sentuh kode hardcode.
          </p>
        </div>

        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors shadow-xs shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ke Storefront Publik</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-2 text-xs font-mono font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("cms")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "cms"
              ? "bg-neutral-950 text-white shadow-xs"
              : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#0E52FF]" />
          <span>1. Hero Section CMS</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "categories"
              ? "bg-neutral-950 text-white shadow-xs"
              : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Layers className="w-4 h-4 text-[#0E52FF]" />
          <span>2. Category Showcase CMS</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "products"
              ? "bg-neutral-950 text-white shadow-xs"
              : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Package className="w-4 h-4 text-[#0E52FF]" />
          <span>3. Katalog Produk ({products.length})</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {activeTab === "cms" && (
        <form onSubmit={handleSaveHero} className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
                Hero Section Live Editor
              </h2>
              <p className="text-xs text-neutral-500">
                Semua teks, badge, foto produk hero, dan CTA dapat diganti langsung dari sini.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-neutral-950 hover:bg-[#0E52FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Badge Text</label>
              <input
                type="text"
                value={hero.badgeText || ""}
                onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Tagline / Indeks No.</label>
              <input
                type="text"
                value={hero.tagline || ""}
                onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Availability Status</label>
              <input
                type="text"
                value={hero.availability || ""}
                onChange={(e) => setHero({ ...hero, availability: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Judul Brand (Line 1)</label>
              <input
                type="text"
                value={hero.titleLine1 || ""}
                onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Model Accent (Grey)</label>
              <input
                type="text"
                value={hero.titleAccent || ""}
                onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Tipe Gear (Line 2)</label>
              <input
                type="text"
                value={hero.titleLine2 || ""}
                onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Deskripsi Editorial</label>
              <textarea
                rows={2}
                value={hero.description || ""}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Dimensi Gear</label>
              <input
                type="text"
                value={hero.dimensions || ""}
                onChange={(e) => setHero({ ...hero, dimensions: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Tebal &amp; Edge</label>
              <input
                type="text"
                value={hero.thickness || ""}
                onChange={(e) => setHero({ ...hero, thickness: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">URL Gambar Produk Hero</label>
              <input
                type="text"
                value={hero.imageUrl || ""}
                onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Tombol Utama Text</label>
              <input
                type="text"
                value={hero.ctaText || ""}
                onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-neutral-700">Tombol Utama Link</label>
              <input
                type="text"
                value={hero.ctaLink || ""}
                onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>
          </div>
        </form>
      )}

      {activeTab === "categories" && (
        <form onSubmit={handleSaveCategories} className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
                Category Showcase Editor (5 Kolom)
              </h2>
              <p className="text-xs text-neutral-500">
                Atur judul, spesifikasi, dan URL foto untuk showcase kategori di homepage.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-neutral-950 hover:bg-[#0E52FF] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Kategori"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="border border-neutral-200 rounded-2xl p-5 space-y-3 bg-neutral-50/50">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="font-mono text-xs font-bold text-neutral-900">KARTU #{cat.index || idx + 1}</span>
                  <span className="text-[10px] font-mono uppercase bg-neutral-200 px-2 py-0.5 rounded">SLOT {idx + 1}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-semibold uppercase text-neutral-600">Judul Kategori</label>
                  <input
                    type="text"
                    value={cat.title || ""}
                    onChange={(e) => {
                      const updated = [...categories];
                      updated[idx].title = e.target.value;
                      setCategories(updated);
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-semibold uppercase text-neutral-600">Spesifikasi Teaser</label>
                  <input
                    type="text"
                    value={cat.spec || ""}
                    onChange={(e) => {
                      const updated = [...categories];
                      updated[idx].spec = e.target.value;
                      setCategories(updated);
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-semibold uppercase text-neutral-600">URL Gambar Showcase</label>
                  <input
                    type="text"
                    value={cat.image || ""}
                    onChange={(e) => {
                      const updated = [...categories];
                      updated[idx].image = e.target.value;
                      setCategories(updated);
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      {activeTab === "products" && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-neutral-950 uppercase tracking-tight">
                Manajemen Produk Toko
              </h2>
              <p className="text-xs text-neutral-500">
                Publish / Sembunyikan produk dari storefront, atau update URL foto produk.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari produk / brand..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  loadProducts(e.target.value);
                }}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider">
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Produk &amp; Brand</th>
                  <th className="py-2.5">Kategori</th>
                  <th className="py-2.5">Foto URL</th>
                  <th className="py-2.5 text-right">Harga Mulai</th>
                  <th className="py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.published === 1
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        {p.published === 1 ? "ACTIVE" : "HIDDEN"}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-neutral-900 max-w-xs truncate">
                      <div>{p.name}</div>
                      <div className="text-[11px] font-mono text-neutral-400 font-normal">{p.brand_name}</div>
                    </td>
                    <td className="py-3 font-mono text-neutral-500">{p.category_name}</td>
                    <td className="py-3 max-w-xs">
                      <input
                        type="text"
                        defaultValue={p.primary_image || ""}
                        onBlur={(e) => handleUpdateProductImage(p.id, e.target.value)}
                        className="w-full px-2 py-1 text-[11px] border border-neutral-200 rounded font-mono truncate"
                      />
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-neutral-900">
                      {p.min_price ? `Rp ${p.min_price.toLocaleString("id-ID")}` : "-"}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => togglePublishProduct(p.id, p.published)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                        title={p.published === 1 ? "Sembunyikan dari Toko" : "Tampilkan di Toko"}
                      >
                        {p.published === 1 ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
