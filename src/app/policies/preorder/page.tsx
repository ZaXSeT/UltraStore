import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, AlertCircle } from "lucide-react";

export default function PreorderPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Kebijakan Transaksi
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
          Ketentuan Pre-Order &amp; Jadwal Rilis
        </h1>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Sistem Pre-Order (Full Payment)</h2>
          <p>
            Pesanan pre-order di UltraStore mengikat alokasi kuota langsung ke batch perakitan pabrik atau distributor resmi. Pembayaran dilakukan secara penuh (Full Payment) saat checkout untuk mengunci slot Anda.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Estimasi Waktu (ETA) &amp; Transparansi Jadwal</h2>
          <p>
            Rentang waktu yang tertera pada produk pre-order adalah <strong>estimasi waktu barang tiba di gudang Jakarta</strong>, bukan waktu tiba di alamat penerima. Perkembangan batch dapat dipantau langsung melalui halaman detail batch masing-masing rilis.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Keterlambatan Produksi &amp; Hak Pembatalan</h2>
          <p>
            Apabila terjadi keterlambatan manufaktur lebih dari 30 hari kalender di luar rentang ETA tertera, UltraStore akan merilis pemberitahuan resmi dan pelanggan berhak mengajukan pengembalian dana 100% tanpa potongan biaya administrasi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Pemisahan Pengiriman Keranjang Campuran</h2>
          <p>
            Jika keranjang Anda memuat item ready stock dan item pre-order, sistem akan memecah transaksi menjadi kelompok pesanan terpisah. Barang ready stock akan segera dikirim tanpa harus menunggu pesanan pre-order tiba.
          </p>
        </section>
      </div>
    </div>
  );
}
