import { getPreorderBatchBySlug, getAllProducts } from "../../../lib/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Box, CheckCircle2, Circle } from "lucide-react";

export default async function DropLedgerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const batch = getPreorderBatchBySlug(slug);

  if (!batch) {
    notFound();
  }

  const allProducts = getAllProducts();
  const product = allProducts.find((p) =>
    p.offers.some((o) => o.batchId === batch.id)
  );

  const stages = [
    { key: "opened", label: "Pemesanan Dibuka", desc: "Batch aktif menerima pemesanan slot." },
    { key: "closed", label: "Pemesanan Ditutup", desc: "Alokasi final dikirim ke pabrik perakitan." },
    { key: "supplier_production", label: "Proses Pabrik/Supplier", desc: "Komponen dirakit dan diuji kualitas awal." },
    { key: "transit", label: "Pengiriman ke Gudang", desc: "Barang dalam kargo udara/laut menuju Jakarta." },
    { key: "qc_received", label: "Diterima & QC Gudang", desc: "Inspeksi fisik 100% kelayakan unit." },
    { key: "shipping", label: "Pengiriman Pelanggan", desc: "Nomor resi diterbitkan dan dikirim ke alamat." },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === batch.currentStage);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Button */}
      <Link
        href={product ? `/products/${product.slug}` : "/shop"}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#59635E] hover:text-[#202724]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke halaman produk</span>
      </Link>

      {/* Header Drop Ledger */}
      <div className="bg-[#FFFFFF] border-2 border-[#A84329]/30 rounded p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A84329] bg-[#F4E5DC] px-2.5 py-1 rounded">
              Drop Ledger · Batch Terjadwal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202724] tracking-tight">
              {batch.name}
            </h1>
          </div>

          <div className="text-right font-mono">
            <div className="text-xs text-[#59635E]">Estimasi Masuk Gudang:</div>
            <div className="text-lg font-bold text-[#202724]">{batch.etaRange}</div>
          </div>
        </div>

        {/* Quota committed bar */}
        <div className="space-y-2 pt-4 border-t border-[#D9DDD5]">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#59635E]">
              Kuota Terpesan: {batch.quotaCommitted} / {batch.quotaTotal} Unit
            </span>
            <span className="font-bold text-[#A84329]">
              Sisa Kuota: {batch.quotaTotal - batch.quotaCommitted} Unit
            </span>
          </div>
          <div className="w-full h-3 bg-[#F4F1EA] rounded-full overflow-hidden border border-[#D9DDD5]">
            <div
              className="h-full bg-[#A84329] rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (batch.quotaCommitted / batch.quotaTotal) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>

        {product && (
          <div className="pt-2">
            <Link
              href={`/products/${product.slug}`}
              className="px-6 py-3 bg-[#A84329] text-white text-xs font-bold font-mono uppercase tracking-wider rounded hover:bg-[#8e3822] transition-colors inline-block"
            >
              Pesan Slot Pre-Order Sekarang
            </Link>
          </div>
        )}
      </div>

      {/* Drop Timeline Phases */}
      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-10 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-[#202724] tracking-tight">
            Tahapan Eksekusi Batch
          </h2>
          <p className="text-xs text-[#59635E] font-mono mt-1">
            Status bergerak berdasarkan pencatatan log aktual operator gudang & supplier resmi.
          </p>
        </div>

        <div className="space-y-6">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.key}
                className={`flex items-start gap-4 p-4 rounded border transition-all ${
                  isCurrent
                    ? "bg-[#F4E5DC]/30 border-[#A84329]"
                    : isCompleted
                    ? "bg-[#E4ECE6]/30 border-[#184E46]/30"
                    : "bg-[#F9F8F6] border-[#D9DDD5] opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#184E46]" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 text-[#A84329] animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#78857C]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-bold ${
                        isCurrent
                          ? "text-[#A84329]"
                          : isCompleted
                          ? "text-[#184E46]"
                          : "text-[#59635E]"
                      }`}
                    >
                      {stage.label}
                    </h3>
                    <span className="text-[11px] font-mono uppercase text-[#59635E]">
                      {isCompleted ? "SELESAI" : isCurrent ? "BERJALAN" : "RENCANA"}
                    </span>
                  </div>
                  <p className="text-xs text-[#59635E] mt-1">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Audit Logs */}
      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-10 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#202724] tracking-tight">
            Catatan Perubahan Faktual
          </h2>
          <p className="text-xs text-[#59635E] font-mono mt-1">
            Audit log tercatat tanpa animasi atau progres waktu semu.
          </p>
        </div>

        <div className="divide-y divide-[#D9DDD5] text-xs font-mono">
          {batch.timelineNotes.map((note, i) => (
            <div key={i} className="py-3 flex flex-col sm:flex-row justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-[#202724]">{note.note}</span>
                <div className="text-[#59635E]">Aktor: {note.actor}</div>
              </div>
              <div className="text-[#59635E] shrink-0">{note.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
