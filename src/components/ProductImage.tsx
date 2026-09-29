"use client";

import { useEffect, useState } from "react";
import { r2ProxyFallbackUrl } from "../lib/image-url";

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  eager?: boolean;
}

export function ProductImage({ src, alt, className = "", eager = false }: ProductImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [failedProxy, setFailedProxy] = useState<string | null>(null);

  useEffect(() => {
    setFailedSource(null);
    setFailedProxy(null);
  }, [src]);

  const proxy = src ? r2ProxyFallbackUrl(src) : null;
  const displayedSrc = failedSource === src ? proxy : src;
  const hasFailed = !displayedSrc || failedProxy === displayedSrc;

  if (hasFailed) {
    return <div className={`w-full h-full bg-neutral-100 ${className}`} />;
  }

  return (
    <img
      key={displayedSrc}
      src={displayedSrc}
      alt={alt}
      onError={() => {
        if (displayedSrc === src && proxy) setFailedSource(src);
        else setFailedProxy(displayedSrc);
      }}
      className={`w-full h-full object-cover transition-transform duration-300 ${className}`}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
    />
  );
}
