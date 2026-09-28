"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { DEFAULT_FOOTER_CONFIG, FooterConfig } from "../lib/cms-types";
import { useLanguage } from "../context/LanguageContext";
import { localizeFooter } from "../lib/localized-cms";

// ponytail: minimal footer ceiling. Upgrade with newsletter/socials when marketing requests it.
export function Footer() {
  const { locale, t } = useLanguage();
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const displayFooter = localizeFooter(footer, locale);

  useEffect(() => {
    fetch("/api/admin/settings?key=footer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFooter(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-neutral-200/90 bg-white text-neutral-500 font-mono text-xs w-full mt-12 sm:mt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#111215] tracking-tight text-sm uppercase">{displayFooter.brandTitle}</span>
          <span className="text-neutral-300">/</span>
          <span className="text-[11px] uppercase text-neutral-400">{displayFooter.brandTagline}</span>
        </div>

        <nav className="flex flex-wrap items-center gap-6 uppercase text-[11px] tracking-wider">
          <Link href="/shop" className="hover:text-[#111215] transition-colors">
            {t("Katalog", "Shop")}
          </Link>
          <Link href="/shop?offer=PREORDER" className="hover:text-[#111215] transition-colors">
            Pre-Order
          </Link>
          <Link href="/track-order" className="hover:text-[#111215] transition-colors">
            {t("Lacak Pesanan", "Track Order")}
          </Link>
          <Link href="/policies/warranty" className="hover:text-[#111215] transition-colors">
            {t("Garansi", "Warranty")}
          </Link>
        </nav>

        <div className="text-neutral-400 text-[10px] uppercase font-mono">
          {displayFooter.copyrightText}
        </div>
      </div>
    </footer>
  );
}
