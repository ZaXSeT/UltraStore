import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Logistik &amp; Distribusi
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
          Kebijakan Pengiriman Domestik
        </h1>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Asal Pengiriman &amp; Gudang</h2>
          <p>
            Semua pesanan dikirim dari pusat distribusi kami di Jakarta, Indonesia menggunakan kemasan box tebal dan bubble wrap khusus perlindungan switch serta sensor optik presisi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Waktu Pemrosesan</h2>
          <p>
            Untuk produk <strong>Ready Stock</strong>, pembayaran yang terverifikasi sebelum pukul 15:00 WIB akan diserahkan ke kurir pada hari kerja yang sama.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Pelacakan Pesanan &amp; Resi</h2>
          <p>
            Nomor resi pengiriman otomatis diperbarui pada detail pesanan Anda segera setelah manifest kurir diterbitkan. Anda dapat melacak status pengiriman melalui menu Lacak Pesanan.
          </p>
        </section>
      </div>
    </div>
  );
}
