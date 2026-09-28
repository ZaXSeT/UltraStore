import { getPreorderBatchBySlug, getAllProducts } from "../../../lib/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Box, CheckCircle2, Circle } from "lucide-react";
import { getServerLocale } from "../../../lib/server-locale";
import { copy, deliveryEstimate } from "../../../lib/locale";

export default async function DropLedgerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const t = (id: string, en: string) => copy(locale, id, en);
  const batch = getPreorderBatchBySlug(slug);

  if (!batch) {
    notFound();
  }

  const allProducts = getAllProducts();
  const product = allProducts.find((p) =>
    p.offers.some((o) => o.batchId === batch.id)
  );

  const stages = [
    { key: "opened", label: t("Pemesanan Dibuka", "Orders Open"), desc: t("Batch ini sudah menerima pesanan.", "This batch is accepting orders.") },
    { key: "closed", label: t("Pemesanan Ditutup", "Orders Closed"), desc: t("Alokasi pesanan telah dikirim ke pemasok.", "Final order quantities have been sent to the supplier.") },
    { key: "supplier_production", label: t("Produksi Pemasok", "Supplier Production"), desc: t("Produk sedang diproduksi dan diperiksa.", "Products are being made and checked.") },
    { key: "transit", label: t("Dalam Pengiriman", "In Transit"), desc: t("Barang sedang menuju gudang Jakarta.", "The batch is on its way to our Jakarta warehouse.") },
    { key: "qc_received", label: t("Pemeriksaan Gudang", "Warehouse Inspection"), desc: t("Barang diterima dan diperiksa sebelum dikirim.", "The batch has arrived and is being inspected before dispatch.") },
    { key: "shipping", label: t("Dikirim ke Pelanggan", "Out for Delivery"), desc: t("Pesanan dikirim ke alamat pelanggan.", "Orders are being sent to customers.") },
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
        <span>{t("Kembali ke produk", "Back to Product")}</span>
      </Link>

      {/* Header Drop Ledger */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80">
              {t("Jadwal Pre-Order", "Pre-Order Timeline")}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              {locale === "en" ? batch.name.replace("Batch Rilisan", "Release Batch") : batch.name}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs text-slate-500 font-medium">{t("Perkiraan Tiba di Gudang", "Estimated Warehouse Arrival")}:</div>
            <div className="text-lg font-bold text-slate-900">{deliveryEstimate(batch.etaRange, locale)}</div>
          </div>
        </div>

        {/* Quota committed bar */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600">
              {t("Kuota Terpesan", "Reserved Spots")}: {batch.quotaCommitted} / {batch.quotaTotal} {t("unit", "units")}
            </span>
            <span className="font-semibold text-blue-600">
              {t("Sisa Kuota", "Spots Left")}: {batch.quotaTotal - batch.quotaCommitted} {t("unit", "units")}
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
              {t("Pesan Pre-Order", "Reserve a Pre-Order")}
            </Link>
          </div>
        )}
      </div>

      {/* Drop Timeline Phases */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 space-y-8 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t("Perjalanan Batch", "Batch Progress")}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t("Status diperbarui berdasarkan catatan pemasok dan gudang.", "Updates reflect records from the supplier and warehouse.")}
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
                        <span className="text-emerald-700">{t("Selesai", "Complete")}</span>
                      ) : isCurrent ? (
                        <span className="text-blue-700">{t("Sedang Berjalan", "In Progress")}</span>
                      ) : (
                        <span className="text-slate-400">{t("Terjadwal", "Upcoming")}</span>
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
            {t("Catatan Pembaruan", "Batch Updates")}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t("Pembaruan dicatat saat status batch berubah.", "Updates are recorded when the batch status changes.")}
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {batch.timelineNotes.map((note, i) => (
            <div key={i} className="py-3.5 flex flex-col sm:flex-row justify-between gap-2">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900">{locale === "en" ? ({
                  "Batch dibuka untuk 50 slot produksi.": "This batch opened with 50 production spots.",
                  "Konfirmasi slot awal masuk pabrik perakitan.": "The first production spots have been confirmed with the factory.",
                } as Record<string, string>)[note.note] || note.note : note.note}</span>
                <div className="text-slate-500">{t("Dicatat oleh", "Recorded by")}: {note.actor}</div>
              </div>
              <div className="text-slate-400 shrink-0">{note.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
