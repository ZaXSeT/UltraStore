import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#202724] text-[#F4F1EA] mt-24 border-t border-[#313b37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-[#184E46] text-[#F4F1EA] flex items-center justify-center font-bold font-mono">
                U
              </div>
              <span className="font-bold text-lg tracking-tight uppercase">UltraStore</span>
            </div>
            <p className="text-sm text-[#D9DDD5]/80 leading-relaxed mb-6">
              Gear pilihan. Setup dengan karakter. Toko peripheral terkurasi dengan spesifikasi jujur dan progres pre-order faktual.
            </p>
            <div className="text-xs font-mono text-[#D9DDD5]/60">
              Gudang & Pengiriman:<br />
              Jakarta, Indonesia
            </div>
          </div>

          {/* Links: Navigasi */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D9DDD5]/60 mb-4">Katalog</h4>
            <ul className="space-y-2.5 text-sm text-[#D9DDD5]">
              <li><Link href="/shop?category=keyboard" className="hover:text-white transition-colors">Mechanical Keyboards</Link></li>
              <li><Link href="/shop?category=mouse" className="hover:text-white transition-colors">Ultralight Gaming Mice</Link></li>
              <li><Link href="/shop?category=audio" className="hover:text-white transition-colors">Audiophile & Reference</Link></li>
              <li><Link href="/shop?category=desk-gear" className="hover:text-white transition-colors">Precision Desk Gear</Link></li>
              <li><Link href="/shop?offer=PREORDER" className="text-[#F4E5DC] hover:text-white font-medium transition-colors">Jadwal Pre-order (Drops)</Link></li>
            </ul>
          </div>

          {/* Links: Kebijakan */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D9DDD5]/60 mb-4">Layanan & Aturan</h4>
            <ul className="space-y-2.5 text-sm text-[#D9DDD5]">
              <li><Link href="/track-order" className="hover:text-white transition-colors">Lacak Pesanan / Guest Access</Link></li>
              <li><Link href="/policies/preorder" className="hover:text-white transition-colors">Ketentuan Pre-Order & ETA</Link></li>
              <li><Link href="/policies/warranty" className="hover:text-white transition-colors">Garansi & Pengembalian</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-white transition-colors">Kebijakan Pengiriman</Link></li>
              <li><Link href="/admin" className="text-xs text-[#D9DDD5]/40 hover:text-white font-mono transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Active Payment Channels */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D9DDD5]/60 mb-4">Metode Pembayaran</h4>
            <p className="text-xs text-[#D9DDD5]/80 mb-3">
              Mendukung transaksi aman real-time via gateway resmi:
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2 py-1 bg-[#2d3732] rounded text-[#F4F1EA]">QRIS Realtime</span>
              <span className="px-2 py-1 bg-[#2d3732] rounded text-[#F4F1EA]">BCA Virtual Account</span>
              <span className="px-2 py-1 bg-[#2d3732] rounded text-[#F4F1EA]">BNI / Mandiri / BRI</span>
              <span className="px-2 py-1 bg-[#2d3732] rounded text-[#F4F1EA]">GoPay / E-Wallet</span>
              <span className="px-2 py-1 bg-[#2d3732] rounded text-[#F4F1EA]">Kartu Visa / MC</span>
            </div>
            <div className="mt-4 text-[11px] text-[#D9DDD5]/50">
              Setiap nominal dihitung otomatis server-side dalam mata uang Rupiah (IDR).
            </div>
          </div>
        </div>

        <div className="border-t border-[#313b37] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D9DDD5]/60 font-mono">
          <div>© 2026 UltraStore. All rights reserved. Precision Workshop Concept.</div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <span>Server Time: Asia/Jakarta</span>
            <span>Status: Production Ready P0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
