import { getProductBySlug } from "../../../lib/catalog";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "../../../components/ProductDetailClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-slate-900 transition-colors">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-slate-900 transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Component */}
      <ProductDetailClient product={product} />
    </div>
  );
}
