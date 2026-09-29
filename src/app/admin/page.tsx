"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { localizeSections } from "../../lib/localized-cms";
import { DEFAULT_THEME_CONFIG, THEME_PRESETS, ThemeConfig, validateTheme } from "../../lib/theme";
import {
  DEFAULT_SECTION_HEADERS_CONFIG,
  DEFAULT_BRAND_LOGOS_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  FooterConfig,
} from "../../lib/cms-types";
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
  Upload,
  Crop,
} from "lucide-react";

function specsToText(json: string | undefined): string {
  try {
    return Object.entries(JSON.parse(json || "{}") as Record<string, string>).map(([key, value]) => `${key}: ${value}`).join("\n");
  } catch {
    return "";
  }
}

function parseSpecs(text: string): Record<string, string> {
  const entries = text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const separator = line.indexOf(":");
    if (separator <= 0 || !line.slice(separator + 1).trim()) throw new Error("Write each specification as Label: Value.");
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()] as const;
  });
  return Object.fromEntries(entries);
}

function boxContentsToText(json: string | undefined): string {
  try {
    return (JSON.parse(json || "[]") as string[]).join("\n");
  } catch {
    return "";
  }
}

function parseBoxContents(text: string): string[] {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"showcase" | "inventory" | "theme">("showcase");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [storefrontUrl, setStorefrontUrl] = useState("/");

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
  const [sectionHeaders, setSectionHeaders] = useState<any>(DEFAULT_SECTION_HEADERS_CONFIG);
  const [announcement, setAnnouncement] = useState<any>({
    primaryText: "",
    secondaryText: "",
  });
  const [brandLogos, setBrandLogos] = useState<any[]>(DEFAULT_BRAND_LOGOS_CONFIG);
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [products, setProducts] = useState<any[]>([]);
  const [availableBrands, setAvailableBrands] = useState<{ id: string; name: string }[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const latestProductRequest = useRef(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingVariants, setEditingVariants] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cropTarget, setCropTarget] = useState<"hero" | "product" | { categoryIndex: number }>("hero");
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand_id: "",
    category_id: "cat_pad",
    description: "",
    description_en: "",
    specsText: "",
    boxContentsText: "",
    warranty_info: "",
    warranty_info_en: "",
    price: 1750000,
    stock: 10,
    primary_image: "",
    is_preorder: false,
    published: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const host = window.location.hostname;
    if (host.startsWith("admin.")) {
      setStorefrontUrl(`${window.location.protocol}//${host.slice(6)}${window.location.port ? `:${window.location.port}` : ""}/`);
    }
    fetch("/api/admin/settings")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Could not load storefront settings.");
        return data;
      })
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.hero) setHero(data.data.hero);
          if (data.data.categories) setCategories(data.data.categories);
          if (data.data.announcement) setAnnouncement(data.data.announcement);
          if (data.data.sectionHeaders) setSectionHeaders(data.data.sectionHeaders);
          if (data.data.brandLogos) setBrandLogos(data.data.brandLogos);
          if (data.data.footer) setFooter(data.data.footer);
          if (data.data.theme) setTheme(data.data.theme);
        }
      })
      .catch((error) => {
        setSaveError(true);
        setSaveMessage(error instanceof Error ? error.message : "Could not load storefront settings.");
      });

    loadProducts();
  }, []);

  const loadProducts = (search = "") => {
    const requestId = ++latestProductRequest.current;
    fetch(`/api/admin/products${search ? `?search=${encodeURIComponent(search)}` : ""}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Could not load products.");
        return data;
      })
      .then((data) => {
        if (data.success && requestId === latestProductRequest.current) {
          setProducts(data.products || []);
          setAvailableBrands(data.brands || []);
          setAvailableCategories(data.categories || []);
        }
      })
      .catch((error) => {
        if (requestId === latestProductRequest.current) {
          setSaveError(true);
          setSaveMessage(error instanceof Error ? error.message : "Could not load products.");
        }
      });
  };

  const saveSettings = async (settings: { key: string; value: unknown }[], message: string) => {
    setSaving(true);
    setSaveMessage(null);
    setSaveError(false);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: settings }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Could not save changes.");
      setSaveMessage(message);
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShowcase = () => saveSettings([
    { key: "hero_config", value: hero },
    { key: "categories_config", value: categories },
    { key: "announcement_config", value: announcement },
    { key: "section_headers_config", value: sectionHeaders },
    { key: "brand_logos_config", value: brandLogos },
    { key: "footer_config", value: footer },
  ], "Storefront content saved. Refresh the live site to see changes.");

  const saveSection = (key: string, value: unknown, name: string) =>
    saveSettings([{ key, value }], `${name} saved. Refresh the live site to see changes.`);

  const generateEnglish = async (context: string, fields: Record<string, string>, apply: (translated: Record<string, string>) => void) => {
    if (!Object.values(fields).some((value) => value.trim())) {
      setSaveError(true);
      setSaveMessage("Isi teks bahasa Indonesia terlebih dahulu.");
      return;
    }
    setTranslating(context);
    setSaveError(false);
    setSaveMessage(null);
    try {
      const response = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, fields }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Terjemahan gagal.");
      apply(result.translated);
      setSaveMessage("Versi Inggris siap. Periksa hasilnya, lalu simpan perubahan.");
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Terjemahan gagal.");
    } finally {
      setTranslating(null);
    }
  };

  const generateProductEnglish = (product: any, isNew: boolean) => {
    const fields = {
      ...(product.description?.trim() ? { description: product.description as string } : {}),
      ...(product.warranty_info?.trim() ? { warranty_info: product.warranty_info as string } : {}),
    };
    generateEnglish("product", fields, (translated) => {
      const update = (current: any) => current && (isNew || current.id === product.id) ? ({
        ...current,
        description_en: current.description === fields.description ? translated.description || current.description_en : current.description_en,
        warranty_info_en: current.warranty_info === fields.warranty_info ? translated.warranty_info || current.warranty_info_en : current.warranty_info_en,
      }) : current;
      if (isNew) setNewProduct(update);
      else setEditingProduct(update);
    });
  };

  const handleUpdateProductFull = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingProduct, specs: parseSpecs(editingProduct.specsText || ""), box_contents: parseBoxContents(editingProduct.boxContentsText || "") }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        loadProducts(productSearch);
        setSaveError(false);
        setSaveMessage("Product details updated.");
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveError(true);
        setSaveMessage(data.error || "Failed updating product.");
      }
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Failed updating product.");
    }
  };

  const openProductEditor = async (product: any) => {
    setShowAddModal(false);
    setEditingProduct({ ...product, specsText: specsToText(product.specs_json), boxContentsText: boxContentsToText(product.box_contents_json) });
    setEditingVariants([]);
    if (product.variant_count > 1) {
      try {
        const response = await fetch(`/api/admin/products?variantsFor=${encodeURIComponent(product.id)}`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Could not load variants.");
        setEditingVariants(data.variants || []);
      } catch (error) {
        setSaveError(true);
        setSaveMessage(error instanceof Error ? error.message : "Could not load variants.");
      }
    }
  };

  const saveVariant = async (variant: any) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingProduct.id, variant_id: variant.id, price: variant.price, stock: variant.stock }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not save variant.");
      setSaveError(false);
      setSaveMessage(`${variant.name} price and stock saved.`);
      loadProducts(productSearch);
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Could not save variant.");
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "hero" | "product" | { categoryIndex: number } = "hero"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRawFile(file);
    setCropTarget(target);
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result as string);
      setZoomLevel(1);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCropAndUpload = async () => {
    if (!rawFile) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", rawFile);
      const bitmap = await createImageBitmap(rawFile);
      const cropSize = Math.min(bitmap.width, bitmap.height) / zoomLevel;
      formData.append("cropX", String((bitmap.width - cropSize) / 2));
      formData.append("cropY", String((bitmap.height - cropSize) / 2));
      formData.append("cropWidth", String(cropSize));
      formData.append("cropHeight", String(cropSize));
      bitmap.close();
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (cropTarget === "hero") {
          setHero((prev: any) => ({ ...prev, imageUrl: data.url }));
          setSaveMessage("Hero image uploaded to R2.");
        } else if (typeof cropTarget === "object" && "categoryIndex" in cropTarget) {
          const idx = cropTarget.categoryIndex;
          setCategories((prev: any) => {
            const updated = [...prev];
            updated[idx].image = data.url;
            return updated;
          });
          setSaveMessage(`Slot 0${idx + 1} category image uploaded to R2.`);
        } else if (cropTarget === "product") {
          if (editingProduct) {
            setEditingProduct((prev: any) => ({ ...prev, primary_image: data.url }));
          } else {
            setNewProduct((prev: any) => ({ ...prev, primary_image: data.url }));
          }
          setSaveMessage("Product image uploaded to R2.");
        }

        setCropModalOpen(false);
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Failed connecting to upload server");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, specs: parseSpecs(newProduct.specsText), box_contents: parseBoxContents(newProduct.boxContentsText) }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewProduct({
          name: "",
          brand_id: "",
          category_id: "cat_pad",
          description: "",
          description_en: "",
          specsText: "",
          boxContentsText: "",
          warranty_info: "",
          warranty_info_en: "",
          price: 1750000,
          stock: 10,
          primary_image: "",
          is_preorder: false,
          published: false,
        });
        loadProducts(productSearch);
        setSaveError(false);
        setSaveMessage(data.translationPending
          ? "Draft tersimpan. Versi Inggris belum dibuat; atur OPENAI_API_KEY sebelum menerbitkan produk."
          : "Product added to catalog with English copy.");
        if (!data.translationPending) setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveError(true);
        setSaveMessage(data.error || "Failed creating product.");
      }
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Failed creating product.");
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
        setSaveError(false);
        setSaveMessage("Product removed from catalog.");
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveError(true);
        setSaveMessage(data.error || "Failed deleting product.");
      }
    } catch {
      setSaveError(true);
      setSaveMessage("Failed deleting product.");
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: newStock }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not update stock.");
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, total_stock: newStock } : p)));
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Could not update stock.");
      loadProducts(productSearch);
    }
  };

  const togglePublishProduct = async (id: string, currentPublished: number) => {
    const nextPublished = currentPublished === 1 ? 0 : 1;
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published: nextPublished }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not change visibility.");
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, published: nextPublished } : p)));
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Could not change visibility.");
    }
  };

  const handleUpdateProductImage = async (id: string, newImage: string) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, primary_image: newImage }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not update image.");
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, primary_image: newImage } : p)));
    } catch (error) {
      setSaveError(true);
      setSaveMessage(error instanceof Error ? error.message : "Could not update image.");
      loadProducts(productSearch);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-[var(--theme-ink)] flex flex-col font-sans selection:bg-[var(--theme-accent)] selection:text-white">
      {/* Top Editorial Architectural Bar */}
      <header className="border-b border-[#E2E5EB] bg-white sticky top-0 z-50 px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[var(--theme-accent)]" />
            <span className="font-mono text-sm font-black tracking-[-0.03em] uppercase text-[var(--theme-ink)]">
              ULTRASTORE / ADMIN
            </span>
          </div>

          <div className="hidden md:block border-l border-[#E2E5EB] pl-6 font-mono text-[11px] text-[#6E7382]">
            Content · Products · Theme
          </div>
        </div>

        <div className="flex items-center gap-4">
          {saveMessage && (
            <div role="status" className={`inline-flex items-center gap-2 text-[11px] font-mono font-bold border px-3 py-1.5 ${saveError ? "text-red-800 bg-red-50 border-red-200" : "text-emerald-800 bg-emerald-50 border-emerald-200"}`}>
              {!saveError && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{saveMessage}</span>
            </div>
          )}

          <a
            href={storefrontUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-4 py-2 border border-[var(--theme-accent)] bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white font-mono text-xs uppercase font-bold tracking-wider transition-all duration-200 shadow-sm"
          >
            <span>Live Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </header>

      {/* Main Studio Frame */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Vertical Architectural Index */}
        <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[#E2E5EB] bg-white p-6 sm:p-8 flex flex-col justify-between shrink-0 lg:sticky lg:top-[67px] lg:self-start lg:h-[calc(100vh-67px)] lg:overflow-y-auto">
          <div className="space-y-8">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8F94A3] block">
                CONTROL PANEL
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-[var(--theme-ink)]">
                Admin Workspace
              </h2>
            </div>

            <nav className="flex flex-col space-y-1 font-mono text-xs uppercase font-bold tracking-wider">
              <button
                onClick={() => setActiveTab("showcase")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "showcase"
                    ? "border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white shadow-sm shadow-blue-500/20"
                    : "border-transparent text-[#6E7382] hover:text-[var(--theme-accent)] hover:border-[#E2E5EB]"
                }`}
              >
                <span>01. Homepage &amp; Content</span>
                <span className="text-[10px] opacity-80">EDIT</span>
              </button>

              {/* Quick Jump Links inside Showcase */}
              {activeTab === "showcase" && (
                <div className="pl-4 pr-1 py-1.5 space-y-1 border-l-2 border-[var(--theme-accent-border)] ml-2">
                  <a href="#section-top-strip" className="block text-[10px] text-[#6E7382] hover:text-[var(--theme-accent)] truncate">↳ 01. Top Strip Notification</a>
                  <a href="#section-headings" className="block text-[10px] text-[#6E7382] hover:text-[var(--theme-accent)] truncate">↳ 02. Homepage Headings (ID/EN)</a>
                  <a href="#section-brand-logos" className="block text-[10px] text-[#6E7382] hover:text-[var(--theme-accent)] truncate">↳ 03. Brand Partner Logos</a>
                  <a href="#section-hero-stage" className="block text-[10px] text-[#6E7382] hover:text-[var(--theme-accent)] truncate">↳ 04. Hero Focus Product</a>
                  <a href="#section-categories" className="block text-[10px] text-[#6E7382] hover:text-[var(--theme-accent)] truncate">↳ 05. Category Directory Matrix</a>
                  <a href="#section-footer" className="block text-[10px] text-[#6E7382] hover:text-[var(--theme-accent)] truncate">↳ 06. Global Footer &amp; Branding</a>
                </div>
              )}

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "inventory"
                    ? "border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white shadow-sm shadow-blue-500/20"
                    : "border-transparent text-[#6E7382] hover:text-[var(--theme-accent)] hover:border-[#E2E5EB]"
                }`}
              >
                <span>02. Products &amp; Inventory</span>
                <span className="text-[10px] opacity-80">{products.length} ITEMS</span>
              </button>
              <button
                onClick={() => setActiveTab("theme")}
                className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all text-left ${
                  activeTab === "theme"
                    ? "border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white shadow-sm"
                    : "border-transparent text-[#6E7382] hover:text-[var(--theme-accent)] hover:border-[#E2E5EB]"
                }`}
              >
                <span>03. Website Theme</span>
                <span className="text-[10px] opacity-80">COLORS</span>
              </button>
            </nav>
          </div>

          <div className="hidden lg:block pt-8 border-t border-[#E2E5EB] font-mono text-[11px] text-[#8F94A3] space-y-2">
            <div>Changes to content and products affect the public store after saving.</div>
          </div>
        </aside>

        {/* Right Active Workspace */}
        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {/* TAB 1: SHOWCASE CMS */}
          {activeTab === "showcase" && (
            <div className="max-w-6xl space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--theme-accent)] font-bold mb-1">
                    PRIMARY STAGE &amp; NAVIGATION
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--theme-ink)]">
                    Homepage &amp; Content
                  </h1>
                </div>

                <button
                  onClick={handleSaveShowcase}
                  disabled={saving}
                  className="px-8 py-3.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto shadow-md shadow-blue-500/25"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "SAVING..." : "SAVE ALL CONTENT"}</span>
                </button>
              </div>

              {/* Announcement Strip */}
              <div id="section-top-strip" className="bg-white border border-[#E2E5EB] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">Top Notification Strip</span>
                    <span className="font-mono text-[10px] text-[#8F94A3]">HEADER BAR</span>
                  </div>
                  <button
                    onClick={() => saveSection("announcement_config", announcement, "Notification strip")}
                    disabled={saving || translating === "announcement"}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-all disabled:opacity-50 shadow-sm"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save Strip</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Badge</span>
                    <input type="text" value={announcement.badge || ""} onChange={(e) => setAnnouncement({ ...announcement, badge: e.target.value })} className="w-full px-3.5 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE]" />
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase self-end min-h-9">
                    <input type="checkbox" checked={announcement.active !== false} onChange={(e) => setAnnouncement({ ...announcement, active: e.target.checked })} /> Show top notification
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Primary Message</label>
                    <input
                      type="text"
                      value={announcement.primaryText || ""}
                      onChange={(e) => setAnnouncement({ ...announcement, primaryText: e.target.value, english: { ...announcement.english, primaryText: "" } })}
                      className="w-full px-3.5 py-2 font-sans text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Secondary Detail</label>
                    <input
                      type="text"
                      value={announcement.secondaryText || ""}
                      onChange={(e) => setAnnouncement({ ...announcement, secondaryText: e.target.value, english: { ...announcement.english, secondaryText: "" } })}
                      className="w-full px-3.5 py-2 font-sans text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                    />
                  </div>
                </div>
                <label className="block space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Track order link (ID)</span>
                  <input type="text" value={announcement.trackLinkText || ""} onChange={(e) => setAnnouncement({ ...announcement, trackLinkText: e.target.value, english: { ...announcement.english, trackLinkText: "" } })} className="w-full px-3.5 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE]" />
                </label>
                <div className="border-t border-[#E2E5EB] pt-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[10px] font-black uppercase text-[var(--theme-ink)]">English storefront copy</p>
                    <button type="button" disabled={translating !== null} onClick={() => {
                      const fields: Record<string, string> = { primaryText: announcement.primaryText || "", secondaryText: announcement.secondaryText || "", trackLinkText: announcement.trackLinkText || "" };
                      generateEnglish("announcement", fields, (translated) => setAnnouncement((current: any) => ({ ...current, english: { ...current.english, ...Object.fromEntries(Object.entries(translated).filter(([key]) => current[key] === fields[key])) } })));
                    }} className="px-3 py-1.5 border border-[var(--theme-accent)] text-[var(--theme-accent)] font-mono text-[10px] font-bold uppercase disabled:opacity-50">{translating === "announcement" ? "Writing..." : "Generate English"}</button>
                  </div>
                  {(["primaryText", "secondaryText", "trackLinkText"] as const).map((key) => (
                    <label key={key} className="block space-y-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">{key === "primaryText" ? "Primary message" : key === "secondaryText" ? "Secondary detail" : "Track order link"} (EN)</span>
                      <input type="text" value={announcement.english?.[key] || ""} onChange={(e) => setAnnouncement({ ...announcement, english: { ...announcement.english, [key]: e.target.value } })} placeholder="Generated from Indonesian" className="w-full px-3.5 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]" />
                    </label>
                  ))}
                </div>
              </div>

              <div id="section-headings" className="bg-white border border-[#E2E5EB] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                  <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">Homepage Headings · ID / EN</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={translating !== null} onClick={() => {
                      const keys = (Object.keys(DEFAULT_SECTION_HEADERS_CONFIG) as Array<keyof typeof DEFAULT_SECTION_HEADERS_CONFIG>).filter((key) => key !== "translations");
                      const source = localizeSections(sectionHeaders, "id");
                      const fields = Object.fromEntries(keys.map((key) => [key, String(source[key] || "")]));
                      generateEnglish("headings", fields, (translated) => setSectionHeaders((current: any) => {
                        const liveSource = localizeSections(current, "id") as Record<string, unknown>;
                        const fresh = Object.fromEntries(Object.entries(translated).filter(([key]) => String(liveSource[key] || "") === fields[key]));
                        return { ...current, translations: { ...current.translations, en: { ...current.translations?.en, ...fresh } } };
                      }));
                    }} className="px-3 py-1.5 border border-[var(--theme-accent)] text-[var(--theme-accent)] font-mono text-[10px] uppercase font-bold disabled:opacity-50">{translating === "headings" ? "Writing..." : "Generate English"}</button>
                    <button type="button" onClick={() => saveSection("section_headers_config", sectionHeaders, "Homepage headings")} disabled={saving || translating === "headings"} className="px-3 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white font-mono text-[10px] uppercase font-bold disabled:opacity-50">Save Headings</button>
                  </div>
                </div>
                <p className="text-xs text-[#6E7382]">Write each heading naturally for its audience. Empty fields use the storefront defaults.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(["id", "en"] as const).map((language) => (
                    <div key={language} className="space-y-3">
                      <h3 className="font-mono text-xs font-black text-[var(--theme-ink)]">{language === "id" ? "Bahasa Indonesia" : "English"}</h3>
                      {(Object.keys(DEFAULT_SECTION_HEADERS_CONFIG) as Array<keyof typeof DEFAULT_SECTION_HEADERS_CONFIG>).filter((key) => key !== "translations").map((key) => (
                        <label key={key} className="block space-y-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">{key.replace(/([A-Z])/g, " $1")}</span>
                          <input
                            type="text"
                            value={sectionHeaders.translations?.[language]?.[key] || ""}
                            placeholder={String(localizeSections(sectionHeaders, language)[key] || "")}
                            onChange={(e) => setSectionHeaders({ ...sectionHeaders, translations: { ...sectionHeaders.translations, [language]: { ...sectionHeaders.translations?.[language], [key]: e.target.value }, ...(language === "id" ? { en: { ...sectionHeaders.translations?.en, [key]: "" } } : {}) } })}
                            className="w-full px-3 py-1.5 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                          />
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Logos Marquee Manager */}
              <div id="section-brand-logos" className="bg-white border border-[#E2E5EB] p-6 sm:p-8 space-y-4">
                <div className="border-b border-[#E2E5EB] pb-3 flex items-center justify-between">
                  <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">Brand Partner Logos</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const id = `brand-${Date.now()}`;
                        setBrandLogos([...brandLogos, { id, name: "NEW BRAND", href: "/shop", active: true }]);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white font-mono text-[10px] uppercase font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Brand</span>
                    </button>
                    <button type="button" onClick={() => saveSection("brand_logos_config", brandLogos, "Brand logos")} disabled={saving} className="flex items-center gap-1 px-2.5 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white font-mono text-[10px] uppercase font-bold disabled:opacity-50">
                      <Save className="w-3 h-3" />
                      <span>Save Brands</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {brandLogos.map((brand, idx) => (
                    <div key={brand.id} className={`border p-3 space-y-2 ${brand.active ? "border-[var(--theme-accent-border)] bg-[var(--theme-accent-soft)]" : "border-[#E2E5EB] bg-[#FDFDFE] opacity-50"}`}>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={brand.name}
                          onChange={(e) => {
                            const updated = [...brandLogos];
                            updated[idx] = { ...brand, name: e.target.value };
                            setBrandLogos(updated);
                          }}
                          className="flex-1 px-2 py-1 font-mono text-xs font-black uppercase border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...brandLogos];
                            updated[idx] = { ...brand, active: !brand.active };
                            setBrandLogos(updated);
                          }}
                          title={brand.active ? "Active" : "Hidden"}
                          className="shrink-0"
                        >
                          {brand.active ? <Eye className="w-3.5 h-3.5 text-[var(--theme-accent)]" /> : <EyeOff className="w-3.5 h-3.5 text-[#6E7382]" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setBrandLogos(brandLogos.filter((_, i) => i !== idx))}
                          className="shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-700" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={brand.href || ""}
                        onChange={(e) => {
                          const updated = [...brandLogos];
                          updated[idx] = { ...brand, href: e.target.value };
                          setBrandLogos(updated);
                        }}
                        placeholder="/shop?brand=..."
                        className="w-full px-2 py-1 font-mono text-[10px] border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)] text-[#6E7382]"
                      />
                      <input
                        type="text"
                        value={brand.logoUrl || ""}
                        onChange={(e) => {
                          const updated = [...brandLogos];
                          updated[idx] = { ...brand, logoUrl: e.target.value };
                          setBrandLogos(updated);
                        }}
                        placeholder="Logo image URL (optional, uses text if empty)"
                        className="w-full px-2 py-1 font-mono text-[10px] border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)] text-[#6E7382]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Matrix Section */}
              <div id="section-hero-stage" className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-7 space-y-6 bg-white border border-[#E2E5EB] p-6 sm:p-8">
                  <div className="border-b border-[#E2E5EB] pb-3 flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">Hero Focus Product</span>
                    <button
                      onClick={() => saveSection("hero_config", hero, "Hero")}
                      disabled={saving || translating === "hero"}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-all disabled:opacity-50 shadow-sm"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Hero</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Badge Tag</label>
                      <input
                        type="text"
                        value={hero.badgeText || ""}
                        onChange={(e) => setHero({ ...hero, badgeText: e.target.value.replace(/—/g, "·"), english: { ...hero.english, badgeText: "" } })}
                        className="w-full px-3 py-1.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Index No.</label>
                      <input
                        type="text"
                        value={hero.tagline || ""}
                        onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
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
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Accent Name</label>
                      <input
                        type="text"
                        value={hero.titleAccent || ""}
                        onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Suffix</label>
                      <input
                        type="text"
                        value={hero.titleLine2 || ""}
                        onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-sans font-bold text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Editorial Synopsis</label>
                    <textarea
                      rows={3}
                      value={hero.description || ""}
                      onChange={(e) => setHero({ ...hero, description: e.target.value, english: { ...hero.english, description: "" } })}
                      className="w-full px-3.5 py-2.5 text-xs leading-relaxed border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                    />
                  </div>
                  <div className="border-t border-[#E2E5EB] pt-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-[10px] font-black uppercase text-[var(--theme-ink)]">English storefront copy</p>
                      <button type="button" disabled={translating !== null} onClick={() => {
                        const keys = ["badgeText", "description", "availability", "ctaText", "secondaryCtaText"];
                        const fields = Object.fromEntries(keys.map((key) => [key, String(hero[key] || "")]));
                        generateEnglish("hero", fields, (translated) => setHero((current: any) => ({ ...current, english: { ...current.english, ...Object.fromEntries(Object.entries(translated).filter(([key]) => current[key] === fields[key])) } })));
                      }} className="px-3 py-1.5 border border-[var(--theme-accent)] text-[var(--theme-accent)] font-mono text-[10px] font-bold uppercase disabled:opacity-50">{translating === "hero" ? "Writing..." : "Generate English"}</button>
                    </div>
                    {(["badgeText", "description", "availability", "ctaText", "secondaryCtaText"] as const).map((key) => (
                      <label key={key} className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">{key} (EN)</span>
                        <input type="text" value={hero.english?.[key] || ""} onChange={(e) => setHero({ ...hero, english: { ...hero.english, [key]: e.target.value } })} placeholder="Generated from Indonesian" className="w-full px-3.5 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]" />
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Dimensions</label>
                      <input
                        type="text"
                        value={hero.dimensions || ""}
                        onChange={(e) => setHero({ ...hero, dimensions: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Thickness</label>
                      <input
                        type="text"
                        value={hero.thickness || ""}
                        onChange={(e) => setHero({ ...hero, thickness: e.target.value })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Availability</label>
                      <input
                        type="text"
                        value={hero.availability || ""}
                        onChange={(e) => setHero({ ...hero, availability: e.target.value, english: { ...hero.english, availability: "" } })}
                        className="w-full px-3.5 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      ["ctaText", "Primary button text (ID)"],
                      ["ctaLink", "Primary button link"],
                      ["secondaryCtaText", "Secondary button text (ID)"],
                      ["secondaryCtaLink", "Secondary button link"],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">{label}</span>
                        <input type="text" value={hero[key] || ""} onChange={(e) => setHero({ ...hero, [key]: e.target.value, ...(key === "ctaText" || key === "secondaryCtaText" ? { english: { ...hero.english, [key]: "" } } : {}) })} className="w-full px-3.5 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE]" />
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      ["subBadgeTopLeft", "Image label · top left"],
                      ["subBadgeTopRight", "Image label · top right"],
                      ["subBadgeBottomLeft", "Image label · bottom left"],
                      ["subBadgeBottomRight", "Image label · bottom right"],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">{label}</span>
                        <input type="text" value={hero[key] || ""} onChange={(e) => setHero({ ...hero, [key]: e.target.value })} className="w-full px-3.5 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE]" />
                      </label>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#E2E5EB]">
                    <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                      Hero Master Artwork (1:1 Ratio Cloudflare R2 / CDN URL)
                    </label>
                    <input
                      type="text"
                      value={hero.imageUrl || ""}
                      onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 font-mono text-[11px] border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                    />
                    <label className="block pt-3 space-y-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Image description</span>
                      <input type="text" value={hero.imageAlt || ""} onChange={(e) => setHero({ ...hero, imageAlt: e.target.value })} className="w-full px-3.5 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE]" />
                    </label>
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

                  <div className="relative aspect-square w-full max-w-[320px] mx-auto border border-[#E2E5EB] overflow-hidden bg-[var(--theme-canvas)] shadow-xs">
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
                      <span className="font-bold text-[var(--theme-ink)]">{hero.titleLine1} {hero.titleAccent}</span>
                    </div>
                    <div className="flex justify-between text-[#6E7382]">
                      <span>AVAILABILITY:</span>
                      <span className="font-bold text-emerald-700">{hero.availability}</span>
                    </div>
                  </div>

                  {/* Upload & Crop Action Button */}
                  <div className="pt-2">
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer transition-all shadow-md shadow-blue-500/20">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload &amp; Crop Hero Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

                {/* 5-Slot Category Configuration Block */}
                <div id="section-categories" className="bg-white border border-[#E2E5EB] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">
                        5-Slot Homepage Category Directory &amp; Navigation Links
                      </span>
                      <span className="font-mono text-[10px] text-[#8F94A3]">SSR / DYNAMIC</span>
                    </div>
                    <button
                      onClick={() => saveSection("categories_config", categories, "Categories")}
                      disabled={saving || translating === "categories"}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-all disabled:opacity-50 shadow-sm"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Categories</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="border border-[#E2E5EB] p-4 space-y-3 bg-[#FDFDFE]">
                        <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                          <span className="font-mono text-xs font-black text-[var(--theme-ink)]">SLOT 0{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase text-[#6E7382]">{cat.index}</span>
                            <button type="button" disabled={translating !== null} onClick={() => {
                              const fields = { title: cat.title || "", spec: cat.spec || "" };
                              generateEnglish("categories", fields, (translated) => setCategories((current: any[]) => current.map((item, itemIndex) => itemIndex === idx ? {
                                ...item,
                                titleEn: item.title === fields.title ? translated.title || item.titleEn : item.titleEn,
                                specEn: item.spec === fields.spec ? translated.spec || item.specEn : item.specEn,
                              } : item)));
                            }} className="font-mono text-[10px] font-bold uppercase text-[var(--theme-accent)] disabled:opacity-50">{translating === "categories" ? "Writing..." : "Generate English"}</button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Title Display</label>
                          <input
                            type="text"
                            value={cat.title || ""}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[idx] = { ...updated[idx], title: e.target.value, titleEn: "" };
                              setCategories(updated);
                            }}
                            className="w-full px-3 py-1.5 font-bold text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]"
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
                            className="w-full px-3 py-1.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Title Display (EN)</label>
                          <input type="text" value={cat.titleEn || ""} onChange={(e) => setCategories(categories.map((item, itemIndex) => itemIndex === idx ? { ...item, titleEn: e.target.value } : item))} className="w-full px-3 py-1.5 font-bold text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]" />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Spec Teaser Subtitle</label>
                          <input
                            type="text"
                            value={cat.spec || ""}
                            onChange={(e) => {
                              const updated = [...categories];
                              updated[idx] = { ...updated[idx], spec: e.target.value, specEn: "" };
                              setCategories(updated);
                            }}
                            className="w-full px-3 py-1.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Image Media (R2/CDN URL)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cat.image || ""}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[idx].image = e.target.value;
                                setCategories(updated);
                              }}
                              className="w-full px-3 py-1.5 font-mono text-[11px] border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]"
                            />
                            <label className="px-2.5 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer flex items-center gap-1 transition-all shadow-sm shrink-0">
                              <Upload className="w-3 h-3" />
                              <span>Crop</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e, { categoryIndex: idx })}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Spec Teaser (EN)</label>
                          <input type="text" value={cat.specEn || ""} onChange={(e) => setCategories(categories.map((item, itemIndex) => itemIndex === idx ? { ...item, specEn: e.target.value } : item))} className="w-full px-3 py-1.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER & STORE BRANDING CONFIG */}
                <div id="section-footer" className="bg-white border border-[#E2E5EB] p-6 sm:p-8 space-y-6">
                  <div className="border-b border-[#E2E5EB] pb-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">Global Footer &amp; Branding</span>
                      <p className="text-[11px] font-mono text-[#6E7382]">Atur teks hak cipta, judul merek, dan tagline footer</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => saveSection("footer_config", footer, "Footer")}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-all disabled:opacity-50 shadow-sm"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Footer</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block space-y-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Brand Title</span>
                      <input
                        type="text"
                        value={footer.brandTitle || ""}
                        onChange={(e) => setFooter({ ...footer, brandTitle: e.target.value })}
                        placeholder="ULTRASTORE"
                        className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Brand Tagline</span>
                      <input
                        type="text"
                        value={footer.brandTagline || ""}
                        onChange={(e) => setFooter({ ...footer, brandTagline: e.target.value })}
                        placeholder="Enthusiast Peripherals"
                        className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Copyright Notice</span>
                      <input
                        type="text"
                        value={footer.copyrightText || ""}
                        onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                        placeholder="© 2026 ULTRASTORE JAKARTA"
                        className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                      />
                    </label>
                  </div>
                </div>
            </div>
          )}

          {activeTab === "theme" && (
            <div className="max-w-5xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--theme-accent)] font-bold mb-1">APPEARANCE</p>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Website Theme</h1>
                  <p className="text-sm text-[#6E7382] mt-2">Choose a palette for the public storefront. Changes appear after saving and refreshing the site.</p>
                </div>
                <button
                  type="button"
                  disabled={saving || !validateTheme(theme)}
                  onClick={() => saveSection("theme_config", theme, "Website theme")}
                  className="px-6 py-3 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white font-mono text-xs font-bold uppercase disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Theme"}
                </button>
              </div>

              <section className="bg-white border border-[#E2E5EB] p-6 space-y-5">
                <h2 className="font-mono text-xs font-black uppercase">Ready-to-use palettes</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setTheme(preset.colors)}
                      aria-pressed={JSON.stringify(theme) === JSON.stringify(preset.colors)}
                      className={`text-left border p-3 space-y-3 transition-colors ${JSON.stringify(theme) === JSON.stringify(preset.colors) ? "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]" : "border-[#E2E5EB] hover:border-[#8F94A3]"}`}
                    >
                      <span className="flex gap-1 h-9">
                        <span className="flex-1 border border-black/10" style={{ backgroundColor: preset.colors.canvas }} />
                        <span className="flex-1 border border-black/10" style={{ backgroundColor: preset.colors.surface }} />
                        <span className="flex-1" style={{ backgroundColor: preset.colors.accent }} />
                        <span className="flex-1" style={{ backgroundColor: preset.colors.ink }} />
                      </span>
                      <span className="block font-mono text-xs font-bold uppercase">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white border border-[#E2E5EB] p-6 space-y-5">
                <div>
                  <h2 className="font-mono text-xs font-black uppercase">Custom colors</h2>
                  <p className="text-xs text-[#6E7382] mt-1">Choose the accent, page background, card background, and main text color.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    ["accent", "Accent / buttons"],
                    ["canvas", "Page background"],
                    ["surface", "Cards and navigation"],
                    ["ink", "Main text"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="block space-y-1">
                      <span className="font-mono text-[11px] font-bold uppercase">{label}</span>
                      <span className="flex gap-2">
                        <input type="color" value={theme[key]} onChange={(e) => setTheme({ ...theme, [key]: e.target.value.toUpperCase() })} className="h-10 w-14 border border-[#E2E5EB] bg-white p-1 cursor-pointer" />
                        <input type="text" value={theme[key]} maxLength={7} onChange={(e) => setTheme({ ...theme, [key]: e.target.value.toUpperCase() })} className="h-10 flex-1 border border-[#E2E5EB] px-3 font-mono text-xs uppercase" />
                      </span>
                    </label>
                  ))}
                </div>
                {!validateTheme(theme) && <p role="alert" className="text-xs text-red-700">Use six-digit hex colors. White button text must contrast with the accent, and main text must contrast with the page and cards.</p>}
                <button type="button" onClick={() => setTheme(DEFAULT_THEME_CONFIG)} className="text-xs font-mono underline text-[#6E7382] hover:text-[var(--theme-ink)]">Restore default palette</button>
              </section>

              <section className="border border-[#E2E5EB] p-6 space-y-3" style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(theme.canvas) ? theme.canvas : DEFAULT_THEME_CONFIG.canvas, color: /^#[0-9A-F]{6}$/i.test(theme.ink) ? theme.ink : DEFAULT_THEME_CONFIG.ink }}>
                <h2 className="font-mono text-xs font-black uppercase">Preview</h2>
                <div className="border border-black/10 p-5 space-y-3" style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(theme.surface) ? theme.surface : DEFAULT_THEME_CONFIG.surface }}>
                  <p className="text-xl font-black uppercase">UltraStore</p>
                  <p className="text-sm">A sample product card and button using your selected colors.</p>
                  <span className="inline-flex px-5 py-2 text-white text-xs font-bold uppercase" style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(theme.accent) ? theme.accent : DEFAULT_THEME_CONFIG.accent }}>View product ↗</span>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: INVENTORY & CATALOG */}
          {activeTab === "inventory" && (
            <div className="max-w-6xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E5EB] pb-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--theme-accent)] font-bold mb-1">
                    INVENTORY MASTER
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--theme-ink)]">
                    Products &amp; Inventory
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setEditingProduct(null); setShowAddModal(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-md shadow-blue-500/20"
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
                        setCurrentPage(1);
                        loadProducts(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 font-mono text-xs border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)]"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Product Modal Overlay */}
              {editingProduct && (
                <div className="bg-white border-2 border-[var(--theme-ink)] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                    <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">
                      Edit Product Parameters: {editingProduct.name}
                    </span>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-xs font-mono text-[#8F94A3] hover:text-[var(--theme-ink)]"
                    >
                      [CLOSE]
                    </button>
                  </div>

                  <form onSubmit={handleUpdateProductFull} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Brand</span>
                        <select value={editingProduct.brand_id} onChange={(e) => setEditingProduct({ ...editingProduct, brand_id: e.target.value })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white">
                          {availableBrands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                        </select>
                      </label>
                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Category</span>
                        <select value={editingProduct.category_id} onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white">
                          {availableCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                      </label>
                      <label className="flex items-center gap-2 self-end min-h-9 text-xs font-mono">
                        <input type="checkbox" checked={editingProduct.published === 1 || editingProduct.published === true} onChange={(e) => setEditingProduct({ ...editingProduct, published: e.target.checked ? 1 : 0 })} />
                        Visible on storefront
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Product Description (ID)</span>
                        <textarea rows={3} value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value, description_en: "" })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]" />
                      </label>
                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">English preview · generated from Indonesian</span>
                        <textarea rows={3} value={editingProduct.description_en || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value })} placeholder="Generated automatically when saved" className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]" />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Specifications · one Label: Value per line</span><textarea rows={4} value={editingProduct.specsText || ""} onChange={(e) => setEditingProduct({ ...editingProduct, specsText: e.target.value })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Box contents · one item per line</span><textarea rows={4} value={editingProduct.boxContentsText || ""} onChange={(e) => setEditingProduct({ ...editingProduct, boxContentsText: e.target.value })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Warranty information (ID)</span><textarea rows={2} value={editingProduct.warranty_info || ""} onChange={(e) => setEditingProduct({ ...editingProduct, warranty_info: e.target.value, warranty_info_en: "" })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Warranty English preview</span><textarea rows={2} value={editingProduct.warranty_info_en || ""} onChange={(e) => setEditingProduct({ ...editingProduct, warranty_info_en: e.target.value })} placeholder="Generated automatically when saved" className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                    </div>
                    <button type="button" disabled={translating !== null || !editingProduct.description?.trim()} onClick={() => generateProductEnglish(editingProduct, false)} className="px-3 py-2 border border-[var(--theme-accent)] text-[var(--theme-accent)] font-mono text-[10px] font-bold uppercase disabled:opacity-50">
                      {translating === "product" ? "Writing English..." : "Generate natural English"}
                    </button>
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
                          className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Stock Quantity (Units)
                        </label>
                        <input
                          type="number"
                          min={0}
                          disabled={editingProduct.variant_count !== 1}
                          value={editingProduct.stock ?? editingProduct.total_stock ?? 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                          className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                        />
                        {editingProduct.variant_count !== 1 && <p className="text-[10px] text-[#6E7382]">This product has multiple variants. Edit stock per variant.</p>}
                      </div>
                    </div>

                    <label className="block space-y-1 max-w-xs">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Price (IDR)</span>
                      <input type="number" min={0} disabled={editingProduct.variant_count !== 1} value={editingProduct.price ?? editingProduct.min_price ?? 0} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] disabled:opacity-50" />
                    </label>

                    {editingProduct.variant_count > 1 && (
                      <section className="border border-[#E2E5EB] p-4 space-y-3">
                        <h3 className="font-mono text-xs font-black uppercase">Variant price and stock</h3>
                        {editingVariants.length === 0 && <p className="text-xs text-[#6E7382]">Loading variants...</p>}
                        {editingVariants.map((variant, index) => (
                          <div key={variant.id} className="grid grid-cols-1 sm:grid-cols-[1fr_130px_100px_auto] gap-3 items-end border-t border-[#E2E5EB] pt-3">
                            <div className="text-xs"><strong className="block">{variant.name}</strong><span className="font-mono text-[10px] text-[#6E7382]">{variant.sku}</span></div>
                            <label className="space-y-1"><span className="block font-mono text-[10px] uppercase">Price (IDR)</span><input type="number" min={0} value={variant.price} onChange={(e) => setEditingVariants(editingVariants.map((item, i) => i === index ? { ...item, price: Number(e.target.value) } : item))} className="w-full border border-[#E2E5EB] px-2 py-1.5 font-mono text-xs" /></label>
                            <label className="space-y-1"><span className="block font-mono text-[10px] uppercase">Stock</span><input type="number" min={0} value={variant.stock} onChange={(e) => setEditingVariants(editingVariants.map((item, i) => i === index ? { ...item, stock: Number(e.target.value) } : item))} className="w-full border border-[#E2E5EB] px-2 py-1.5 font-mono text-xs" /></label>
                            <button type="button" onClick={() => saveVariant(variant)} className="px-3 py-2 bg-[var(--theme-accent)] text-white font-mono text-[10px] font-bold uppercase">Save variant</button>
                          </div>
                        ))}
                      </section>
                    )}

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Cloudflare R2 Master Asset URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProduct.primary_image || ""}
                          onChange={(e) => setEditingProduct({ ...editingProduct, primary_image: e.target.value })}
                          className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                        />
                        <label className="px-3 py-2 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer flex items-center gap-1.5 transition-all shadow-sm shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Crop &amp; Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, "product")}
                            className="hidden"
                          />
                        </label>
                      </div>
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
                        disabled={translating === "product"}
                        className="px-6 py-2 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white text-xs font-mono font-bold uppercase transition-all shadow-sm"
                      >
                        Update Product
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {showAddModal && (
                <div className="bg-white border-2 border-[var(--theme-ink)] p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-2">
                    <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">
                      Create New Catalog Product
                    </span>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-xs font-mono text-[#8F94A3] hover:text-[var(--theme-ink)]"
                    >
                      [CLOSE]
                    </button>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <p className="text-xs text-[#6E7382]">New products start as drafts. Add accurate product copy and media before publishing.</p>
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
                          className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Category
                        </label>
                        <select
                          value={newProduct.category_id}
                          onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                        >
                          {availableCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <label className="block space-y-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Brand</span>
                      <select required value={newProduct.brand_id} onChange={(e) => setNewProduct({ ...newProduct, brand_id: e.target.value })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white">
                        <option value="">Select a brand</option>
                        {availableBrands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                      </select>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Description (ID)</span>
                        <textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value, description_en: "" })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" />
                      </label>
                      <label className="block space-y-1">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">English preview · generated from Indonesian</span>
                        <textarea rows={3} value={newProduct.description_en} onChange={(e) => setNewProduct({ ...newProduct, description_en: e.target.value })} placeholder="Generated automatically when saved" className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Specifications · one Label: Value per line</span><textarea rows={3} value={newProduct.specsText} onChange={(e) => setNewProduct({ ...newProduct, specsText: e.target.value })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Box contents · one item per line</span><textarea rows={3} value={newProduct.boxContentsText} onChange={(e) => setNewProduct({ ...newProduct, boxContentsText: e.target.value })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Warranty information (ID)</span><textarea rows={2} value={newProduct.warranty_info} onChange={(e) => setNewProduct({ ...newProduct, warranty_info: e.target.value, warranty_info_en: "" })} className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                      <label className="block space-y-1"><span className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">Warranty English preview</span><textarea rows={2} value={newProduct.warranty_info_en} onChange={(e) => setNewProduct({ ...newProduct, warranty_info_en: e.target.value })} placeholder="Generated automatically when saved" className="w-full px-3 py-2 text-xs border border-[#E2E5EB] bg-white" /></label>
                    </div>
                    <button type="button" disabled={translating !== null || !newProduct.description.trim()} onClick={() => generateProductEnglish(newProduct, true)} className="px-3 py-2 border border-[var(--theme-accent)] text-[var(--theme-accent)] font-mono text-[10px] font-bold uppercase disabled:opacity-50">
                      {translating === "product" ? "Writing English..." : "Generate natural English"}
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                          Base Price (IDR)
                        </label>
                        <input
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
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
                          className="w-full px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
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

                    <label className="flex items-center gap-2 text-xs font-mono">
                      <input type="checkbox" checked={newProduct.published} onChange={(e) => setNewProduct({ ...newProduct, published: e.target.checked })} />
                      Publish to storefront immediately
                    </label>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase font-bold text-[#6E7382]">
                        Cloudflare R2 or CDN Image Path
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="/api/r2/products/example.webp or CDN URL"
                          value={newProduct.primary_image}
                          onChange={(e) => setNewProduct({ ...newProduct, primary_image: e.target.value })}
                          className="flex-1 min-w-0 px-3 py-2 font-mono text-xs border border-[#E2E5EB] bg-[#FDFDFE] focus:outline-none focus:border-[var(--theme-ink)]"
                        />
                        <label className="px-3 py-2 bg-[var(--theme-accent)] text-white font-mono text-xs font-bold uppercase cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Upload
                          <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, "product")} className="hidden" />
                        </label>
                      </div>
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
                        disabled={translating === "product"}
                        className="px-6 py-2 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white text-xs font-mono font-bold uppercase transition-all shadow-sm"
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
                    <tr className="border-b border-[#E2E5EB] bg-[var(--theme-canvas)] text-[#6E7382] uppercase text-[10px] tracking-wider">
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
                        <td className="py-3 px-4 font-sans font-bold text-[var(--theme-ink)] max-w-xs truncate">
                          <div>{p.name}</div>
                          <div className="font-mono text-[10px] font-normal text-[#8F94A3]">{p.brand_name}</div>
                        </td>
                        <td className="py-3 px-4 text-[#6E7382] uppercase text-[11px]">{p.category_name}</td>
                        <td className="py-3 px-4 w-28">
                          <input
                            key={`${p.id}-stock-${p.total_stock}`}
                            type="number"
                            min={0}
                            disabled={p.variant_count !== 1}
                            title={p.variant_count !== 1 ? "Edit stock per variant in the product editor" : "Edit stock, then leave the field to save"}
                            defaultValue={p.total_stock ?? 0}
                            onBlur={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border border-[#E2E5EB] bg-white font-mono font-bold text-center focus:outline-none focus:border-[var(--theme-ink)]"
                          />
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <input
                            key={`${p.id}-image-${p.primary_image}`}
                            type="text"
                            defaultValue={p.primary_image || ""}
                            onBlur={(e) => handleUpdateProductImage(p.id, e.target.value)}
                            className="w-full px-2.5 py-1 text-[11px] border border-[#E2E5EB] bg-white focus:outline-none focus:border-[var(--theme-ink)] truncate"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[var(--theme-ink)]">
                          {p.min_price != null ? `Rp ${p.min_price.toLocaleString("id-ID")}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openProductEditor(p)}
                              className="p-1.5 border border-[#E2E5EB] hover:border-[var(--theme-ink)] text-[var(--theme-ink)] transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => togglePublishProduct(p.id, p.published)}
                              className="p-1.5 border border-[#E2E5EB] hover:border-[var(--theme-ink)] transition-colors"
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
                            ? "border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white font-bold shadow-sm"
                            : "border-[#E2E5EB] bg-white hover:bg-neutral-100 text-[var(--theme-ink)]"
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

        {/* Modal Crop Image (1:1 Aspect Ratio) */}
        {cropModalOpen && tempImageSrc && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[var(--theme-ink)] max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E2E5EB] pb-3">
                <div className="flex items-center gap-2">
                  <Crop className="w-4 h-4 text-[var(--theme-accent)]" />
                  <span className="font-mono text-xs font-black uppercase text-[var(--theme-ink)]">
                    1:1 Square Frame Alignment &amp; Crop
                  </span>
                </div>
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="font-mono text-xs text-[#8F94A3] hover:text-[var(--theme-ink)]"
                >
                  [CLOSE]
                </button>
              </div>

              {/* Crop Canvas Viewport */}
              <div className="relative aspect-square w-full max-w-[340px] mx-auto bg-neutral-900 border-2 border-dashed border-[var(--theme-accent)] overflow-hidden flex items-center justify-center">
                <img
                  src={tempImageSrc}
                  alt="Crop Preview"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.1s ease-out",
                  }}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
                <div className="absolute inset-0 pointer-events-none border border-white/40 grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div></div>
                </div>
              </div>

              {/* Zoom & Alignment Controls */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[10px] text-[#6E7382] uppercase font-bold">
                  <span>Zoom Level</span>
                  <span>{zoomLevel.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-full accent-[var(--theme-ink)]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E5EB]">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 border border-[#E2E5EB] text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={handleApplyCropAndUpload}
                  className="px-6 py-2 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] active:scale-[0.98] text-white text-xs font-mono font-bold uppercase disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  {uploadingImage ? (
                    <span>Processing &amp; Uploading to R2...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Push to R2</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
