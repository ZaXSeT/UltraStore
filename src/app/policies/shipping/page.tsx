import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-[#59635E] hover:text-[#202724]">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="border-b border-[#D9DDD5] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#184E46] font-bold">
          Logistik & Distribusi
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[#202724] mt-1">
          Kebijakan Pengiriman Domestik
        </h1>
      </div>

      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-6 text-sm text-[#202724] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">1. Asal Pengiriman & Gudang</h2>
          <p>
            Semua pesanan dikirim dari pusat distribusi kami di Jakarta, Indonesia menggunakan kemasan box tebal dan bubble wrap khusus perlindungan switch/sensor elektronik.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">2. Waktu Pemrosesan</h2>
          <p>
            Untuk produk <strong>Ready Stock</strong>, pembayaran yang terverifikasi sebelum pukul 15:00 WIB akan diserahkan ke kurir pada hari kerja yang sama.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">3. Pelacakan Pesanan & Resi</h2>
          <p>
            Nomor resi pengiriman otomatis diperbarui pada detail pesanan Anda segera setelah manifest kurir diterbitkan. Anda dapat melacak status pengiriman melalui menu Lacak Order.
          </p>
        </section>
      </div>
    </div>
  );
}
