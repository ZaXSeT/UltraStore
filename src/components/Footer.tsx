import Link from "next/link";

// ponytail: minimal footer ceiling. Upgrade with newsletter/socials when marketing requests it.
export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs mt-20 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 tracking-tight text-sm">UltraStore</span>
          <span className="text-slate-300">/</span>
          <span>Toko Periferal &amp; Hardware Presisi</span>
        </div>

        <nav className="flex flex-wrap items-center gap-6">
          <Link href="/shop" className="hover:text-slate-900 transition-colors">
            Katalog
          </Link>
          <Link href="/shop?offer=PREORDER" className="hover:text-slate-900 transition-colors">
            Pre-Order
          </Link>
          <Link href="/track-order" className="hover:text-slate-900 transition-colors">
            Lacak Pesanan
          </Link>
          <Link href="/policies/warranty" className="hover:text-slate-900 transition-colors">
            Garansi
          </Link>
        </nav>

        <div className="text-slate-400 text-[11px]">
          © 2026 UltraStore. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
