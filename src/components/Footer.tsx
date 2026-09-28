import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-20 border-t border-slate-800 w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                U
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">UltraStore</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Gear pilihan. Setup dengan karakter. Toko peripheral presisi terkurasi dengan spesifikasi jujur dan jadwal pre-order transparan.
            </p>
            <div className="text-xs text-slate-400">
              Gudang &amp; Pengiriman:<br />
              <span className="text-slate-300 font-medium">Jakarta Selatan, Indonesia</span>
            </div>
          </div>

          {/* Links: Navigasi */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-bold">Katalog</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link href="/shop?category=keyboard" className="hover:text-white transition-colors">Mechanical Keyboards</Link></li>
              <li><Link href="/shop?category=mouse" className="hover:text-white transition-colors">Ultralight Gaming Mice</Link></li>
              <li><Link href="/shop?category=mousepad" className="hover:text-white transition-colors">Precision Mousepads</Link></li>
              <li><Link href="/shop?category=switches-parts" className="hover:text-white transition-colors">Switches &amp; Aksesoris</Link></li>
              <li><Link href="/shop?offer=PREORDER" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Jadwal Pre-Order Drops</Link></li>
            </ul>
          </div>

          {/* Links: Kebijakan */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-bold">Layanan &amp; Bantuan</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link href="/track-order" className="hover:text-white transition-colors">Lacak Pesanan (Guest)</Link></li>
              <li><Link href="/policies/preorder" className="hover:text-white transition-colors">Ketentuan Pre-Order &amp; ETA</Link></li>
              <li><Link href="/policies/warranty" className="hover:text-white transition-colors">Garansi &amp; Pengembalian</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-white transition-colors">Kebijakan Pengiriman</Link></li>
              <li><Link href="/admin" className="text-slate-500 hover:text-slate-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Active Payment Channels */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-bold">Metode Pembayaran</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Mendukung transaksi aman real-time via gateway resmi:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">QRIS Realtime</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">BCA Virtual Account</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">BNI / Mandiri / BRI</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">GoPay / E-Wallet</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">Kartu Visa / MC</span>
            </div>
            <div className="mt-4 text-[11px] text-slate-500">
              Setiap nominal dihitung otomatis server-side dalam mata uang Rupiah (IDR).
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div>© 2026 UltraStore. Hak cipta dilindungi undang-undang.</div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <span>Zona Waktu: Asia/Jakarta</span>
            <span className="text-emerald-400">Sistem Operasional Normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
