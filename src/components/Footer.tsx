import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-20 border-t border-slate-800 w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold font-mono">
                U
              </div>
              <span className="font-extrabold text-xl tracking-tight uppercase font-mono text-white">UltraStore</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-mono">
              Gear pilihan. Setup dengan karakter. Toko peripheral terkurasi dengan spesifikasi jujur dan progres pre-order faktual.
            </p>
            <div className="text-xs font-mono text-slate-500">
              Gudang & Pengiriman:<br />
              Jakarta, Indonesia
            </div>
          </div>

          {/* Links: Navigasi */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 font-bold">// KATALOG</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li><Link href="/shop?category=keyboard" className="hover:text-teal-400 transition-colors">Mechanical Keyboards</Link></li>
              <li><Link href="/shop?category=mouse" className="hover:text-teal-400 transition-colors">Ultralight Gaming Mice</Link></li>
              <li><Link href="/shop?category=mousepad" className="hover:text-teal-400 transition-colors">Precision Mousepads</Link></li>
              <li><Link href="/shop?category=switches-parts" className="hover:text-teal-400 transition-colors">Switches & Parts</Link></li>
              <li><Link href="/shop?offer=PREORDER" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">Jadwal Pre-order Drops</Link></li>
            </ul>
          </div>

          {/* Links: Kebijakan */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 font-bold">// LAYANAN & ATURAN</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li><Link href="/track-order" className="hover:text-teal-400 transition-colors">Lacak Pesanan / Guest Access</Link></li>
              <li><Link href="/policies/preorder" className="hover:text-teal-400 transition-colors">Ketentuan Pre-Order & ETA</Link></li>
              <li><Link href="/policies/warranty" className="hover:text-teal-400 transition-colors">Garansi & Pengembalian</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-teal-400 transition-colors">Kebijakan Pengiriman</Link></li>
              <li><Link href="/admin" className="text-slate-500 hover:text-teal-400 font-mono transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Active Payment Channels */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 font-bold">// METODE PEMBAYARAN</h4>
            <p className="text-xs text-slate-400 mb-3 font-mono">
              Mendukung transaksi aman real-time via gateway resmi:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-200 border border-slate-700">QRIS Realtime</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-200 border border-slate-700">BCA Virtual Account</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-200 border border-slate-700">BNI / Mandiri / BRI</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-200 border border-slate-700">GoPay / E-Wallet</span>
              <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-200 border border-slate-700">Kartu Visa / MC</span>
            </div>
            <div className="mt-4 text-[10px] text-slate-500 font-mono">
              Setiap nominal dihitung otomatis server-side dalam mata uang Rupiah (IDR).
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono">
          <div>© 2026 UltraStore. All rights reserved. Precision Workshop Concept.</div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <span>Server Time: Asia/Jakarta</span>
            <span className="text-teal-400">Status: Production Ready P0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
