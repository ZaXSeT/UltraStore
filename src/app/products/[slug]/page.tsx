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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-mono text-[#59635E]">
        <Link href="/" className="hover:text-[#202724]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#202724]">Katalog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#202724]">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#202724] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Component */}
      <ProductDetailClient product={product} />
    </div>
  );
}
