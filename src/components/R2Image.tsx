"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { r2ProxyFallbackUrl } from "../lib/image-url";

export function R2Image({ src, alt, ...props }: ImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [failedProxy, setFailedProxy] = useState<string | null>(null);
  const original = typeof src === "string" ? src : "";

  useEffect(() => {
    setFailedSource(null);
    setFailedProxy(null);
  }, [original]);

  const proxy = r2ProxyFallbackUrl(original);
  const displayedSrc = failedSource === original ? proxy : original;
  if (!displayedSrc || failedProxy === displayedSrc) {
    return <div className="absolute inset-0 bg-neutral-100" aria-label={alt} />;
  }

  return (
    <Image
      {...props}
      key={displayedSrc}
      src={displayedSrc}
      alt={alt}
      unoptimized
      onError={() => {
        if (displayedSrc === original && proxy) setFailedSource(original);
        else setFailedProxy(displayedSrc);
      }}
    />
  );
}
