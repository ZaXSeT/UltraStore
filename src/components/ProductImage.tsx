"use client";

import React, { useState } from "react";

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
}

export function ProductImage({ src, alt, category, className = "" }: ProductImageProps) {
  const [error, setError] = useState(false);

  // High-craft technical blueprint SVG silhouettes for enthusiast gear
  const renderFallback = () => {
    const cat = (category || "").toLowerCase();

    if (cat.includes("mousepad")) {
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-[#184E46]/70">
          <rect x="15" y="25" width="90" height="70" rx="6" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 2" />
          <rect x="22" y="32" width="76" height="56" rx="3" fill="#184E46" fillOpacity="0.08" />
          <circle cx="85" cy="45" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M25 75L45 55L65 70L80 58L95 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <text x="60" y="94" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="monospace" fontWeight="bold">PRECISION SURFACE</text>
        </svg>
      );
    }

    if (cat.includes("keyboard")) {
      return (
        <svg viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-20 text-[#184E46]/70">
          <rect x="10" y="20" width="120" height="60" rx="5" stroke="currentColor" strokeWidth="2.5" />
          {/* Keycap grid */}
          <rect x="18" y="28" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="34" y="28" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="50" y="28" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="66" y="28" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="82" y="28" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="98" y="28" width="24" height="10" rx="1.5" fill="currentColor" fillOpacity="0.3" />
          {/* Row 2 */}
          <rect x="18" y="42" width="18" height="10" rx="1.5" fill="currentColor" fillOpacity="0.3" />
          <rect x="40" y="42" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="56" y="42" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="72" y="42" width="12" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
          <rect x="88" y="42" width="18" height="10" rx="1.5" fill="currentColor" fillOpacity="0.3" />
          {/* Row 3 - Spacebar */}
          <rect x="18" y="56" width="16" height="10" rx="1.5" fill="currentColor" fillOpacity="0.25" />
          <rect x="38" y="56" width="60" height="10" rx="1.5" fill="#184E46" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
          <rect x="102" y="56" width="20" height="10" rx="1.5" fill="currentColor" fillOpacity="0.25" />
          <text x="70" y="90" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="monospace" fontWeight="bold">HALL EFFECT 8K</text>
        </svg>
      );
    }

    if (cat.includes("switch")) {
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-[#184E46]/70">
          <rect x="25" y="35" width="50" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" />
          {/* Switch Stem Cross */}
          <rect x="44" y="18" width="12" height="25" rx="2" fill="#184E46" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
          <rect x="37" y="24" width="26" height="12" rx="2" fill="#184E46" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
          {/* Bottom Pins */}
          <line x1="38" y1="75" x2="38" y2="88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="62" y1="75" x2="62" y2="88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="75" x2="50" y2="92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <text x="50" y="58" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="monospace" fontWeight="bold">MX LINEAR</text>
        </svg>
      );
    }

    if (cat.includes("audio")) {
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-[#184E46]/70">
          {/* Headband */}
          <path d="M25 70C25 40 40 20 60 20C80 20 95 40 95 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          {/* Left Earcup */}
          <rect x="16" y="60" width="18" height="35" rx="9" fill="#184E46" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
          {/* Right Earcup */}
          <rect x="86" y="60" width="18" height="35" rx="9" fill="#184E46" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" />
          <circle cx="25" cy="77" r="4" fill="currentColor" fillOpacity="0.4" />
          <circle cx="95" cy="77" r="4" fill="currentColor" fillOpacity="0.4" />
          <text x="60" y="105" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="monospace" fontWeight="bold">REFERENCE MONITOR</text>
        </svg>
      );
    }

    // Default: Ultralight Mouse Silhouette
    return (
      <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-24 text-[#184E46]/70">
        <path
          d="M50 15C33 15 25 32 25 58C25 84 35 105 50 105C65 105 75 84 75 58C75 32 67 15 50 15Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="#184E46"
          fillOpacity="0.08"
        />
        {/* Split line */}
        <line x1="50" y1="15" x2="50" y2="48" stroke="currentColor" strokeWidth="2" />
        {/* Scroll wheel */}
        <rect x="46" y="24" width="8" height="16" rx="4" fill="currentColor" stroke="currentColor" strokeWidth="1" />
        {/* Sensor crosshair */}
        <circle cx="50" cy="68" r="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="60" x2="50" y2="64" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="72" x2="50" y2="76" stroke="currentColor" strokeWidth="1.5" />
        <text x="50" y="92" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="monospace" fontWeight="bold">39G ULTRA</text>
      </svg>
    );
  };

  if (!src || error) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-3 select-none bg-neutral-50/50 ${className}`}>
        {renderFallback()}
        <span className="text-[10px] font-mono text-[#59635E] uppercase tracking-wider mt-1 font-semibold text-center line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`max-h-full max-w-full w-auto h-auto object-contain object-center transition-transform duration-300 ${className}`}
      loading="lazy"
    />
  );
}
