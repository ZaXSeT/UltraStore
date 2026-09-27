import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, AlertCircle } from "lucide-react";

export default function PreorderPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-[#59635E] hover:text-[#202724]">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="border-b border-[#D9DDD5] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#A84329] font-bold">
          Kebijakan Transaksi
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[#202724] mt-1">
          Ketentuan Pre-Order & Drop Ledger
        </h1>
      </div>

      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-6 text-sm text-[#202724] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">1. Hakikat Pre-Order (P0 Full Payment)</h2>
          <p>
            Pesanan pre-order di UltraStore mengikat alokasi kuota langsung ke batch perakitan pabrik atau distributor resmi. Pembayaran dilakukan secara penuh (Full Payment) saat checkout untuk mengunci slot kamu.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">2. Estimasi Waktu (ETA) & Drop Ledger</h2>
          <p>
            Rentang waktu yang tertera pada produk pre-order adalah <strong>estimasi waktu barang tiba di gudang Jakarta</strong>, bukan waktu tiba di alamat penerima. Perkembangan batch dapat dipantau langsung melalui halaman Drop Ledger masing-masing rilis.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">3. Keterlambatan Produksi & Hak Pembatalan</h2>
          <p>
            Apabila terjadi keterlambatan manufaktur lebih dari 30 hari kalender di luar rentang ETA tertera, UltraStore akan merilis pemberitahuan resmi dan pelanggan berhak mengajukan pengembalian dana 100% tanpa potongan biaya administrasi.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">4. Pemisahan Pengiriman Keranjang Campuran</h2>
          <p>
            Jika keranjang kamu memuat item ready stock dan item pre-order, sistem akan memecah transaksi menjadi order terpisah. Barang ready stock akan segera dikirim tanpa harus menunggu pesanan pre-order tiba.
          </p>
        </section>
      </div>
    </div>
  );
}
