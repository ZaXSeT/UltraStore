"use client";

import React from "react";
import Link from "next/link";
import { R2Image } from "./R2Image";
import type { BrandLogoConfig } from "../lib/cms-types";

interface BrandMarqueeProps {
  brands: BrandLogoConfig[];
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  const activeBrands = brands.filter((b) => b.active);
  if (activeBrands.length === 0) return null;

  // Duplicate for seamless infinite loop
  const displayBrands = [...activeBrands, ...activeBrands, ...activeBrands];

  return (
    <section className="w-full border-y border-neutral-200/90 bg-[var(--theme-surface-80)] backdrop-blur-md overflow-hidden py-4 select-none relative group">
      {/* Subtle blueprint grid line texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* Edge gradient mask for smooth fade in/out */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-10 sm:gap-14 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] w-max">
        {displayBrands.map((b, idx) => (
          <Link
            key={`${b.id}-${idx}`}
            href={b.href || `/shop?brand=${b.id}`}
            className="flex items-center justify-center px-5 py-2.5 border border-neutral-200/80 bg-[var(--theme-surface)] hover:border-[var(--theme-accent)] hover:shadow-sm transition-all duration-200 shrink-0 text-neutral-800 hover:text-[var(--theme-accent)] group/brand min-h-[46px]"
          >
            {b.logoUrl ? (
              <div className="relative h-7 w-28 shrink-0 flex items-center justify-center">
                <R2Image
                  src={b.logoUrl}
                  alt={b.name}
                  fill
                  className="object-contain filter grayscale opacity-80 group-hover/brand:grayscale-0 group-hover/brand:opacity-100 transition-all duration-200"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--theme-accent)]" />
                <span className="font-mono text-xs font-black tracking-widest uppercase">
                  {b.name}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
