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
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke halaman produk</span>
      </Link>

      {/* Header Drop Ledger */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
              Jadwal Pre-Order Terjadwal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              {batch.name}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-500 font-medium">Estimasi Tiba di Gudang:</div>
            <div className="text-lg font-bold text-slate-900">{batch.etaRange}</div>
          </div>
        </div>

        {/* Quota committed bar */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">
              Kuota Terpesan: {batch.quotaCommitted} / {batch.quotaTotal} Unit
            </span>
            <span className="font-semibold text-blue-600">
              Sisa Kuota: {batch.quotaTotal - batch.quotaCommitted} Unit
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors inline-block shadow-sm"
            >
              Pesan Slot Pre-Order Sekarang
            </Link>
          </div>
        )}
      </div>

      {/* Drop Timeline Phases */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Tahapan Eksekusi Batch
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Status diperbarui langsung berdasarkan pencatatan fisik operator gudang &amp; supplier resmi.
          </p>
        </div>

        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.key}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-blue-50/50 border-blue-300"
                    : isCompleted
                    ? "bg-emerald-50/40 border-emerald-200/80"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-bold ${
                        isCurrent
                          ? "text-blue-900"
                          : isCompleted
                          ? "text-emerald-900"
                          : "text-slate-600"
                      }`}
                    >
                      {stage.label}
                    </h3>
                    <span className="text-xs font-semibold uppercase">
                      {isCompleted ? (
                        <span className="text-emerald-700">Selesai</span>
                      ) : isCurrent ? (
                        <span className="text-blue-700">Sedang Berjalan</span>
                      ) : (
                        <span className="text-slate-400">Terjadwal</span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Audit Logs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Catatan Perubahan Faktual
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit log tercatat tanpa animasi atau progres waktu semu.
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {batch.timelineNotes.map((note, i) => (
            <div key={i} className="py-3.5 flex flex-col sm:flex-row justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900">{note.note}</span>
                <div className="text-slate-500">Pencatat: {note.actor}</div>
              </div>
              <div className="text-slate-400 shrink-0">{note.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
