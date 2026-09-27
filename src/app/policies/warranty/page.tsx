import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function WarrantyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-[#59635E] hover:text-[#202724]">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="border-b border-[#D9DDD5] pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#184E46] font-bold">
          Layanan Purna Jual
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[#202724] mt-1">
          Garansi & Ketentuan Pengembalian
        </h1>
      </div>

      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 space-y-6 text-sm text-[#202724] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">1. Cakupan Garansi Resmi UltraStore</h2>
          <p>
            Seluruh hardware peripheral yang dibeli melalui UltraStore dilindungi garansi distributor resmi 1 (satu) tahun terhitung sejak tanggal barang diterima oleh pelanggan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">2. Cacat Pabrik (Dead on Arrival)</h2>
          <p>
            Barang yang mengalami kerusakan fungsional dalam waktu 7x24 jam sejak diterima berhak mendapatkan penggantian unit baru (One-to-One Replacement) setelah diverifikasi oleh tim teknis kami.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#184E46] font-mono">3. Pengecualian Garansi</h2>
          <p>
            Garansi tidak berlaku untuk: kerusakan akibat kelalaian pemakaian (tercebur air, jatuh, patah fisik), modifikasi sirkuit pcb yang tidak resmi, atau kerusakan akibat penggunaan charger daya voltase berlebih.
          </p>
        </section>
      </div>
    </div>
  );
}
