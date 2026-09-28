import { getDb } from "../../lib/db";
import Link from "next/link";
import { ShieldCheck, Package, Layers, FileText, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const db = getDb();

  const orders = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 20")
    .all() as any[];

  const stockBalances = db
    .prepare(`
      SELECT sb.*, v.sku, v.name as variant_name, p.name as product_name
      FROM stock_balances sb
      JOIN variants v ON sb.variant_id = v.id
      JOIN products p ON v.product_id = p.id
    `)
    .all() as any[];

  const batches = db
    .prepare(`
      SELECT b.*, v.sku, v.name as variant_name
      FROM preorder_batches b
      JOIN variants v ON b.variant_id = v.id
    `)
    .all() as any[];

  const formatIdr = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Operational Admin Console</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            UltraStore Command Center
          </h1>
        </div>

        <Link
          href="/"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Storefront Publik</span>
        </Link>
      </div>

      {/* 1. STOCK BALANCES LEDGER */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Inventory Stock Ledger (Ready Stock)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Rumus: Available = On Hand - Reserved - Allocated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5">SKU</th>
                <th className="py-2.5">Produk &amp; Varian</th>
                <th className="py-2.5 text-right">On Hand</th>
                <th className="py-2.5 text-right">Reserved (30m)</th>
                <th className="py-2.5 text-right">Allocated (Paid)</th>
                <th className="py-2.5 text-right">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockBalances.map((sb) => {
                const available = sb.on_hand - sb.reserved - sb.allocated;
                return (
                  <tr key={sb.variant_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">{sb.sku}</td>
                    <td className="py-3 text-slate-600">
                      {sb.product_name} - {sb.variant_name}
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900 font-tabular">{sb.on_hand}</td>
                    <td className="py-3 text-right text-blue-600 font-semibold font-tabular">{sb.reserved}</td>
                    <td className="py-3 text-right text-emerald-600 font-semibold font-tabular">{sb.allocated}</td>
                    <td className="py-3 text-right font-bold text-emerald-700 font-tabular">{available}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. PRE-ORDER BATCHES */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Pre-Order Batches &amp; Drop Ledger Quotas
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Terisolasi dari inventori fisik on-hand
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5">Batch Name</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Stage</th>
                <th className="py-2.5">ETA Rentang</th>
                <th className="py-2.5 text-right">Quota Total</th>
                <th className="py-2.5 text-right">Reserved</th>
                <th className="py-2.5 text-right">Committed</th>
                <th className="py-2.5 text-right">Available Quota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => {
                const avail = b.quota_total - b.quota_reserved - b.quota_committed;
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">{b.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase font-semibold text-[10px] border border-blue-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 uppercase text-xs">{b.current_stage}</td>
                    <td className="py-3 text-slate-900 font-medium">{b.eta_range}</td>
                    <td className="py-3 text-right font-tabular">{b.quota_total}</td>
                    <td className="py-3 text-right text-blue-600 font-tabular">{b.quota_reserved}</td>
                    <td className="py-3 text-right text-emerald-600 font-semibold font-tabular">{b.quota_committed}</td>
                    <td className="py-3 text-right font-bold text-emerald-700 font-tabular">{avail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. RECENT ORDERS */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Pesanan Terbaru Masuk
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Total {orders.length} order tercatat
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-6">
            Belum ada pesanan masuk. Coba lakukan transaksi sandbox di storefront.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5">Order Ref</th>
                  <th className="py-2.5">Tipe</th>
                  <th className="py-2.5">Status Bayar</th>
                  <th className="py-2.5">Fulfillment</th>
                  <th className="py-2.5">Pelanggan</th>
                  <th className="py-2.5 text-right">Total</th>
                  <th className="py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">{o.reference}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        o.offer_type === "READY"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {o.offer_type}
                      </span>
                    </td>
                    <td className="py-3 uppercase font-semibold text-emerald-600">
                      {o.status}
                    </td>
                    <td className="py-3 uppercase text-slate-600">
                      {o.fulfillment_status}
                    </td>
                    <td className="py-3 text-slate-600">{o.customer_email}</td>
                    <td className="py-3 text-right font-semibold text-slate-900 font-tabular">
                      {formatIdr(o.total_amount)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/orders/${o.reference}?token=${o.guest_access_token}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
