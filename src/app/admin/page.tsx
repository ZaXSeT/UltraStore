"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  Search,
  Eye,
  EyeOff,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"showcase" | "inventory">("showcase");
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
  const [announcement, setAnnouncement] = useState<any>({
    primaryText: "",
    secondaryText: "",
  });
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "cat_pad",
    price: 1750000,
    stock: 10,
    primary_image: "",
    is_preorder: false,
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.hero) setHero(data.data.hero);
          if (data.data.categories) setCategories(data.data.categories);
          if (data.data.announcement) setAnnouncement(data.data.announcement);
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

  const handleSaveShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      await Promise.all([
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "hero_config", value: hero }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "categories_config", value: categories }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "announcement_config", value: announcement }),
        }),
      ]);
      setSaveMessage("Storefront parameters updated live.");
      setTimeout(() => setSaveMessage(null), 3500);
    } catch {
      setSaveMessage("Failed saving showcase.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProductFull = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        loadProducts(productSearch);
        setSaveMessage("Product details updated.");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage("Failed updating product.");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewProduct({
          name: "",
          category_id: "cat_pad",
          price: 1750000,
          stock: 10,
          primary_image: "",
          is_preorder: false,
        });
        loadProducts(productSearch);
        setSaveMessage("Product added to catalog.");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage("Failed creating product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete product permanently from catalog?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSaveMessage("Product removed from catalog.");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      setSaveMessage("Failed deleting product.");
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stock: newStock }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, total_stock: newStock } : p))
    );
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
                CONTROL INTERFACE
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#111215]">
                Direct Dispatch
              </h2>
            </div>

            <nav className="flex flex-col space-y-1 font-mono text-xs uppercase font-bold tracking-wider">
              <button
                onClick={() => setActiveTab("showcase")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "showcase"
                    ? "border-[#111215] bg-[#111215] text-white"
                    : "border-transparent text-[#6E7382] hover:text-[#111215] hover:border-[#E2E5EB]"
                }`}
              >
                <span>01. Storefront Showcase</span>
                <span className="text-[10px] opacity-60">CMS</span>
              </button>

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "inventory"
                    ? "border-[#111215] bg-[#111215] text-white"
                    : "border-transparent text-[#6E7382] hover:text-[#111215] hover:border-[#E2E5EB]"
                }`}
              >
                <span>02. Catalog Directory</span>
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
          {/* TAB 1: SHOWCASE CMS */}
          {activeTab === "showcase" && (
            <div className="max-w-6xl space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#0E52FF] font-bold mb-1">
                    PRIMARY STAGE &amp; NAVIGATION
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111215]">
                    Editorial Showcase Setup
                  </h1>
                </div>

                <button
                  onClick={handleSaveShowcase}
                  disabled={saving}
                  className="px-8 py-3.5 bg-[#111215] hover:bg-[#0E52FF] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "SAVING..." : "COMMIT TO LIVE STORE"}</span>
                </button>
              </div>

              {/* Announcement Strip */}
              <div className="bg-white border border-[#E2E5EB] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                  <span className="font-mono text-xs font-black uppercase text-[#111215]">Top Notification Strip</span>
                  <span className="font-mono text-[10px] text-[#8F94A3]">HEADER BAR</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Primary Message</label>
                    <input
                      type="text"
                      value={announcement.primaryText || ""}
                      onChange={(e) => setAnnouncement({ ...announcement, primaryText: e.target.value })}
                      className="w-full px-3.5 py-2 font-sans text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Secondary Detail</label>
                    <input
                      type="text"
                      value={announcement.secondaryText || ""}
                      onChange={(e) => setAnnouncement({ ...announcement, secondaryText: e.target.value })}
                      className="w-full px-3.5 py-2 font-sans text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Matrix Section */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-7 space-y-6 bg-white border border-[#E2E5EB] p-6 sm:p-8">
                  <div className="border-b border-[#E2E5EB] pb-3">
                    <span className="font-mono text-xs font-black uppercase text-[#111215]">Hero Focus Product</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Badge Tag</label>
                      <input
                        type="text"
                        value={hero.badgeText || ""}
                        onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Index No.</label>
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
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Brand Title</label>
                      <input
                        type="text"
                        value={hero.titleLine1 || ""}
                        onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Accent Name</label>
                      <input
                        type="text"
                        value={hero.titleAccent || ""}
                        onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Suffix</label>
                      <input
                        type="text"
                        value={hero.titleLine2 || ""}
                        onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Editorial Synopsis</label>
                    <textarea
                      rows={3}
                      value={hero.description || ""}
                      onChange={(e) => setHero({ ...hero, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs leading-relaxed border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Dimensions</label>
                      <input
                        type="text"
                        value={hero.dimensions || ""}
                        onChange={(e) => setHero({ ...hero, dimensions: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Thickness</label>
                      <input
                        type="text"
                        value={hero.thickness || ""}
                        onChange={(e) => setHero({ ...hero, thickness: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Availability</label>
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
                </div>

                {/* Live Architectural Preview Card (5 cols) */}
                <div className="xl:col-span-5 bg-white border border-[#E2E5EB] p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8F94A3]">
                      LIVE RATIO PREVIEW (1:1 STAGE)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="relative aspect-square w-full max-w-[320px] mx-auto border border-[#E2E5EB] overflow-hidden bg-[#F8F9FA] shadow-xs">
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
                  </div>
                </div>
              </div>

                {/* 5-Slot Category Configuration Block */}
                <div className="bg-white border border-[#E2E5EB] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                    <span className="font-mono text-xs font-black uppercase text-[#111215]">
                      5-Slot Homepage Category Directory &amp; Navigation Links
                    </span>
                    <span className="font-mono text-[10px] text-[#8F94A3]">SSR / DYNAMIC</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="border border-[#E2E5EB] p-4 space-y-3 bg-[#FDFDFE]">
                        <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                          <span className="font-mono text-xs font-black text-[#111215]">SLOT 0{idx + 1}</span>
                          <span className="font-mono text-[10px] uppercase text-[#6E7382]">{cat.index}</span>
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Title Display</label>
                          <input
                            type="text"
                            value={cat.title || ""}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[idx].title = e.target.value;
                              setCategories(updated);
                            }}
                            className="w-full px-3 py-1.5 font-bold text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[#111215]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Target URL (Link)</label>
                          <input
                            type="text"
                            value={cat.href || ""}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[idx].href = e.target.value;
                              setCategories(updated);
                            }}
                            className="w-full px-3 py-1.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[#111215]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Spec Teaser Subtitle</label>
                          <input
                            type="text"
                            value={cat.spec || ""}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[idx].spec = e.target.value;
                              setCategories(updated);
                            }}
                            className="w-full px-3 py-1.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[#111215]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Image Media (R2/CDN URL)</label>
                          <input
                            type="text"
                            value={cat.image || ""}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[idx].image = e.target.value;
                              setCategories(updated);
                            }}
                            className="w-full px-3 py-1.5 font-mono text-[11px] border border-[#E2E5EB] bg-white focus:outline-none focus:border-[#111215]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & CATALOG */}
          {activeTab === "inventory" && (
            <div className="max-w-6xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#0E52FF] font-bold mb-1">
                    INVENTORY MASTER
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111215]">
                    Catalog Directory &amp; Stocks
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#111215] hover:bg-[#0E52FF] text-white font-mono text-xs uppercase font-bold tracking-wider transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8F94A3]" />
                    <input
                      type="text"
                      placeholder="Search catalog..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        loadProducts(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[#111215]"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Product Modal Overlay */}
              {editingProduct && (
                <div className="bg-white border-2 border-[#111215] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                    <span className="font-mono text-xs font-black uppercase text-[#111215]">
                      Edit Product Parameters: {editingProduct.name}
                    </span>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-xs font-mono text-[#8F94A3] hover:text-[#111215]"
                    >
                      [CLOSE]
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProductFull} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Product Designation
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Stock Quantity (Units)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.stock ?? editingProduct.total_stock ?? 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Cloudflare R2 Master Asset URL
                      </label>
                      <input
                        type="text"
                        value={editingProduct.primary_image || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, primary_image: e.target.value })}
                        className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E2E5EB]">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-[#E2E5EB] text-xs font-mono uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#111215] text-white text-xs font-mono font-bold uppercase hover:bg-[#0E52FF] transition-colors"
                      >
                        Update Product
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {showAddModal && (
                <div className="bg-white border-2 border-[#111215] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                    <span className="font-mono text-xs font-black uppercase text-[#111215]">
                      Create New Catalog Product
                    </span>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-xs font-mono text-[#8F94A3] hover:text-[#111215]"
                    >
                      [CLOSE]
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Product Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Category
                        </label>
                        <select
                          value={newProduct.category_id}
                          onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                        >
                          <option value="cat_pad">Mousepad</option>
                          <option value="cat_mou">Mouse</option>
                          <option value="cat_kbd">Keyboard</option>
                          <option value="cat_swp">Switches &amp; Parts</option>
                          <option value="cat_aud">Audio</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Base Price (IDR)
                        </label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Initial Stock
                        </label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Pre-Order Status
                        </label>
                        <label className="flex items-center gap-2 pt-2 text-xs font-mono">
                          <input
                            type="checkbox"
                            checked={newProduct.is_preorder}
                            onChange={(e) => setNewProduct({ ...newProduct, is_preorder: e.target.checked })}
                          />
                          <span>Pre-Order Batch</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Cloudflare R2 or CDN Image Path
                      </label>
                      <input
                        type="text"
                        placeholder="/api/r2/products/example.webp or CDN URL"
                        value={newProduct.primary_image}
                        onChange={(e) => setNewProduct({ ...newProduct, primary_image: e.target.value })}
                        className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[#111215]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E2E5EB]">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 border border-[#E2E5EB] text-xs font-mono uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#111215] text-white text-xs font-mono font-bold uppercase hover:bg-[#0E52FF] transition-colors"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white border border-[#E2E5EB] overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E5EB] bg-[#F8F9FA] text-[#6E7382] uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Designation</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Stock Physical</th>
                      <th className="py-3 px-4">Media Path (R2)</th>
                      <th className="py-3 px-4 text-right">Floor Price</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5EB]">
                    {products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => (
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
                        <td className="py-3 px-4 w-28">
                          <input
                            type="number"
                            defaultValue={p.total_stock ?? 0}
                            onBlur={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border border-[#E2E5EB] bg-white font-mono font-bold text-center focus:outline-none focus:border-[#111215]"
                          />
                        </td>
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
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 border border-[#E2E5EB] hover:border-[#111215] text-[#111215] transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
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
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 border border-[#E2E5EB] hover:border-red-600 text-neutral-400 hover:text-red-600 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Swiss Industrial Pagination Controls */}
              {products.length > itemsPerPage && (
                <div className="flex items-center justify-between border-t border-[#E2E5EB] pt-4 font-mono text-xs">
                  <div className="text-[#6E7382]">
                    SHOWING {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, products.length)} OF {products.length} ITEMS
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-[#E2E5EB] bg-white hover:bg-neutral-100 disabled:opacity-40 uppercase"
                    >
                      PREV
                    </button>

                    {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center border transition-colors ${
                          currentPage === i + 1
                            ? "border-[#111215] bg-[#111215] text-white font-bold"
                            : "border-[#E2E5EB] bg-white hover:bg-neutral-100 text-[#111215]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(Math.ceil(products.length / itemsPerPage), p + 1))
                      }
                      disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                      className="px-3 py-1.5 border border-[#E2E5EB] bg-white hover:bg-neutral-100 disabled:opacity-40 uppercase"
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
