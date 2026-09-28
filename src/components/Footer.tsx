import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-20 border-t border-slate-800 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-base">
                U
              </div>
              <span className="font-bold text-xl tracking-tight text-white">UltraStore</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Toko peripheral terkurasi untuk mechanical keyboard, mouse gaming ultralight, dan audio enthusiast bergaransi resmi.
            </p>
            <div className="text-xs text-slate-500 space-y-0.5">
              <div className="font-medium text-slate-400">Gudang & Hub Distribusi:</div>
              <div>Jakarta Selatan, Indonesia</div>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Katalog Produk
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/shop?category=keyboard" className="hover:text-white transition-colors">
                  Mechanical Keyboards
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mouse" className="hover:text-white transition-colors">
                  Ultralight Gaming Mice
                </Link>
              </li>
              <li>
                <Link href="/shop?category=mousepad" className="hover:text-white transition-colors">
                  Precision Mousepads
                </Link>
              </li>
              <li>
                <Link href="/shop?category=switches-parts" className="hover:text-white transition-colors">
                  Switches & Keycaps
                </Link>
              </li>
              <li>
                <Link href="/shop?offer=PREORDER" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Pre-Order Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Layanan Pelanggan
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Lacak Status Pesanan
                </Link>
              </li>
              <li>
                <Link href="/policies/preorder" className="hover:text-white transition-colors">
                  Ketentuan Pre-Order & ETA
                </Link>
              </li>
              <li>
                <Link href="/policies/warranty" className="hover:text-white transition-colors">
                  Garansi & Layanan Purnajual
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Informasi Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Portal Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Metode Pembayaran
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Mendukung transaksi otomatis real-time:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">QRIS</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">BCA VA</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">Mandiri / BNI</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">GoPay / ShopeePay</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">Visa / Mastercard</span>
            </div>
            <div className="mt-4 text-[11px] text-slate-500">
              Transaksi aman terenkripsi dalam mata uang Rupiah (IDR).
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div>© 2026 UltraStore. Hak cipta dilindungi. Authorized Hardware Distributor.</div>
          <div className="mt-2 sm:mt-0 flex gap-4 text-slate-500">
            <span>Server: Jakarta (WIB)</span>
            <span className="text-teal-400">Status: Operasional Normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
