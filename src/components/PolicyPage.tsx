import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerLocale } from "../lib/server-locale";
import { copy } from "../lib/locale";

type Policy = "shipping" | "warranty" | "preorder";

const policies = {
  shipping: {
    label: ["Logistik & Distribusi", "Shipping & Delivery"],
    title: ["Kebijakan Pengiriman Domestik", "Shipping Policy"],
    sections: [
      ["1. Asal Pengiriman & Gudang", "1. Shipping Origin", "Semua pesanan dikirim dari pusat distribusi kami di Jakarta, Indonesia. Produk dikemas dengan kotak tebal dan pelindung tambahan untuk komponen yang sensitif.", "Orders ship from our distribution center in Jakarta, Indonesia. We use sturdy boxes and extra protection for sensitive components."],
      ["2. Waktu Pemrosesan", "2. Processing Time", "Untuk produk stok tersedia, pembayaran yang terverifikasi sebelum pukul 15.00 WIB akan diserahkan kepada kurir pada hari kerja yang sama.", "For in-stock items, payments verified before 3:00 p.m. Western Indonesia Time are handed to the courier on the same business day."],
      ["3. Pelacakan Pesanan", "3. Tracking Your Order", "Nomor resi muncul pada detail pesanan setelah kurir menerbitkan manifest. Anda dapat memantau pesanan melalui menu Lacak Pesanan.", "Your tracking number appears in your order details once the courier issues the shipping manifest. You can check progress on the Track Order page."],
    ],
  },
  warranty: {
    label: ["Layanan Purnajual", "After-Sales Support"],
    title: ["Garansi & Ketentuan Pengembalian", "Warranty & Returns"],
    sections: [
      ["1. Cakupan Garansi", "1. Warranty Coverage", "Periferal yang dibeli melalui UltraStore mendapat garansi distributor selama satu tahun sejak barang diterima pelanggan.", "Peripherals purchased through UltraStore carry a one-year distributor warranty starting on the day you receive them."],
      ["2. Kerusakan Saat Diterima", "2. Faulty on Arrival", "Jika produk mengalami kerusakan fungsi dalam 7 × 24 jam setelah diterima, Anda dapat mengajukan penggantian unit. Tim teknis kami akan memverifikasi kerusakannya terlebih dahulu.", "If a product develops a functional fault within seven days of delivery, you may request a replacement. Our technical team will verify the fault first."],
      ["3. Pengecualian Garansi", "3. Warranty Exclusions", "Garansi tidak mencakup kerusakan akibat cairan, benturan berat, modifikasi sirkuit yang tidak resmi, atau penggunaan daya di luar spesifikasi.", "The warranty does not cover damage caused by liquids, severe impact, unauthorized circuit modifications, or power outside the product's specifications."],
    ],
  },
  preorder: {
    label: ["Kebijakan Transaksi", "Order Policy"],
    title: ["Ketentuan Pre-Order & Jadwal Rilis", "Pre-Orders & Release Dates"],
    sections: [
      ["1. Pembayaran Pre-Order", "1. Pre-Order Payment", "Pre-order mengalokasikan kuota pada batch pemasok atau pabrik. Pembayaran penuh diperlukan saat checkout untuk mengamankan pesanan Anda.", "A pre-order reserves capacity in a supplier or factory batch. Full payment is required at checkout to secure your place."],
      ["2. Perkiraan Kedatangan", "2. Estimated Arrival", "Rentang waktu pada halaman produk menunjukkan perkiraan barang tiba di gudang Jakarta, bukan tanggal pengiriman ke alamat Anda. Pantau perkembangannya di halaman batch produk.", "The date range shown on a product page estimates arrival at our Jakarta warehouse. It is not a delivery date for your address. Follow progress on the product's batch page."],
      ["3. Keterlambatan & Pembatalan", "3. Delays & Cancellation", "Jika produksi terlambat lebih dari 30 hari kalender setelah akhir perkiraan kedatangan, UltraStore akan memberi tahu Anda. Anda dapat meminta pengembalian dana penuh tanpa biaya administrasi.", "If production runs more than 30 calendar days past the estimated arrival window, UltraStore will notify you. You may then request a full refund with no administration fee."],
      ["4. Keranjang dengan Stok Campuran", "4. Mixed Carts", "Produk stok tersedia dan pre-order diproses sebagai kelompok pesanan terpisah. Produk stok tersedia dapat dikirim tanpa menunggu pre-order tiba.", "In-stock items and pre-orders are processed as separate order groups. In-stock items can ship without waiting for the pre-order batch."],
    ],
  },
} as const;

export async function PolicyPage({ policy }: { policy: Policy }) {
  const locale = await getServerLocale();
  const t = (id: string, en: string) => copy(locale, id, en);
  const content = policies[policy];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[var(--theme-ink)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>{t("Kembali ke Beranda", "Back to Home")}</span>
      </Link>
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-2.5 py-1 border border-[var(--theme-accent-border)]">{t(content.label[0], content.label[1])}</span>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-ink)] mt-2">{t(content.title[0], content.title[1])}</h1>
      </div>
      <div className="bg-[var(--theme-surface)] border border-slate-200/80 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-sm">
        {content.sections.map(([idTitle, enTitle, idBody, enBody]) => (
          <section className="space-y-2" key={idTitle}>
            <h2 className="text-base font-bold text-[var(--theme-ink)]">{t(idTitle, enTitle)}</h2>
            <p>{t(idBody, enBody)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
