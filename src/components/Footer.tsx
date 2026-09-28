import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Mail,
  Clock,
  Phone,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#090D16] text-slate-300 border-t border-slate-800/80 mt-20 w-full">
      {/* 1. Value Proposition & Official Retail Trust Strip (Full Width Fluid) */}
      <div className="border-b border-slate-800/80 bg-[#0C121E]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2563EB] shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Produk Original</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Distributor resmi pabrikan langsung dengan jaminan keaslian unit &amp; garansi distributor 1 tahun.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2563EB] shrink-0">
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Pengiriman Cepat Jakarta</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Stok ready dikirim dalam 1-2 hari kerja dari Hub Jakarta dengan asuransi pengiriman penuh.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2563EB] shrink-0">
                <RotateCcw className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Garansi &amp; Penggantian Unit</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Jaminan penggantian unit baru untuk cacat pabrik pada periode awal masa pakai.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2563EB] shrink-0">
                <Headphones className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Layanan Konsultasi Gear</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Tim spesialis siap membantu pemilihan switch, switch puller, layout keyboard, dan mouse grip.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Official Retail Columns (Full Width Fluid) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 xl:gap-12">
          {/* Brand Info & Distribution Hub (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <span>U</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    UltraStore
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Official Retail
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  PT UltraStore Periferal Indonesia
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Distributor resmi dan retail online terkurasi periferal komputer enthusiast di Indonesia. Mengkhususkan diri pada mechanical keyboard Hall Effect rapid trigger, ultralight gaming mice, precision glasspads, dan switch enthusiast resmi.
            </p>

            <div className="space-y-2.5 text-xs text-slate-400 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Hub Distribusi: Jl. TB Simatupang, Cilandak, Jakarta Selatan 12430</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Email Layanan: support@ultrastore.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Jam Operasional: Senin – Sabtu: 09:00 – 18:00 WIB</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Layanan Pelanggan Siap Membantu</span>
            </div>
          </div>

          {/* Links: Koleksi Hardware */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              <span>Kategori Produk</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
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
                  Precision Glasspads
                </Link>
              </li>
              <li>
                <Link href="/shop?category=switches-parts" className="hover:text-white transition-colors">
                  Switches &amp; Modding Parts
                </Link>
              </li>
              <li>
                <Link href="/shop?offer=PREORDER" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span>Pre-Order Drops</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors text-slate-500">
                  Lihat Semua Koleksi →
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Layanan Pelanggan & Bantuan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              <span>Layanan Pelanggan</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Lacak Status Pesanan</span>
                </Link>
              </li>
              <li>
                <Link href="/policies/warranty" className="hover:text-white transition-colors">
                  Ketentuan Garansi 1 Tahun
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Kebijakan Pengiriman &amp; Ekspedisi
                </Link>
              </li>
              <li>
                <Link href="/policies/preorder" className="hover:text-white transition-colors">
                  Informasi Pre-Order &amp; Batch ETA
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link href="/policies/warranty" className="hover:text-white transition-colors">
                  Klaim Garansi &amp; Retur Unit
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Logistics Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              <span>Metode Pembayaran</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs mb-5">
              <div className="px-2.5 py-1.5 bg-[#0C121E] rounded-lg border border-slate-800 text-slate-200 font-bold text-center flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>QRIS</span>
              </div>
              <div className="px-2.5 py-1.5 bg-[#0C121E] rounded-lg border border-slate-800 text-blue-400 font-bold text-center flex items-center justify-center">
                <span>BCA VA</span>
              </div>
              <div className="px-2.5 py-1.5 bg-[#0C121E] rounded-lg border border-slate-800 text-slate-300 font-semibold text-center flex items-center justify-center text-[11px]">
                <span>Mandiri / BNI</span>
              </div>
              <div className="px-2.5 py-1.5 bg-[#0C121E] rounded-lg border border-slate-800 text-sky-400 font-semibold text-center flex items-center justify-center text-[11px]">
                <span>GoPay</span>
              </div>
              <div className="col-span-2 px-2.5 py-1.5 bg-[#0C121E] rounded-lg border border-slate-800 text-slate-300 font-medium text-center flex items-center justify-center gap-2 text-[11px]">
                <span className="font-bold text-blue-400">VISA</span>
                <span className="text-slate-600">|</span>
                <span className="font-bold text-amber-400">Mastercard</span>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              <span>Ekspedisi Resmi</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              <span className="px-2 py-1 bg-[#0C121E] rounded-md border border-slate-800">JNE Express</span>
              <span className="px-2 py-1 bg-[#0C121E] rounded-md border border-slate-800">SiCepat</span>
              <span className="px-2 py-1 bg-[#0C121E] rounded-md border border-slate-800">J&amp;T</span>
              <span className="px-2 py-1 bg-[#0C121E] rounded-md border border-slate-800">GoSend / Grab</span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Legal & Regulatory Sub-Footer */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="text-center md:text-left space-y-1">
            <p>© 2026 PT UltraStore Periferal Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
            <p className="text-[11px] text-slate-600">
              Distributor Resmi Hardware &amp; Peripheral Komputer Enthusiast Indonesia.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <Link href="/policies/warranty" className="hover:text-white transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="/policies/shipping" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/policies/preorder" className="hover:text-white transition-colors">
              Kebijakan Pre-Order
            </Link>
            <Link href="/track-order" className="hover:text-white transition-colors">
              Pusat Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
