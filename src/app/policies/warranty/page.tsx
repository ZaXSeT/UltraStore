import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function WarrantyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Layanan Purna Jual
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
          Garansi &amp; Ketentuan Pengembalian
        </h1>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Cakupan Garansi Resmi UltraStore</h2>
          <p>
            Seluruh hardware peripheral yang dibeli melalui UltraStore dilindungi garansi distributor resmi 1 (satu) tahun terhitung sejak tanggal barang diterima oleh pelanggan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Cacat Pabrik (Dead on Arrival)</h2>
          <p>
            Barang yang mengalami kerusakan fungsional dalam waktu 7x24 jam sejak diterima berhak mendapatkan penggantian unit baru (One-to-One Replacement) setelah diverifikasi oleh tim teknis kami.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Pengecualian Garansi</h2>
          <p>
            Garansi tidak berlaku untuk: kerusakan akibat kelalaian pemakaian (terkena cairan, benturan fisik parah), modifikasi sirkuit pcb yang tidak resmi, atau kerusakan akibat penggunaan daya voltase berlebih.
          </p>
        </section>
      </div>
    </div>
  );
}
