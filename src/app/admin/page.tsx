import { getDb } from "../../lib/db";
import Link from "next/link";
import { ShieldCheck, Package, Layers, FileText, ArrowLeft, RefreshCw } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9DDD5] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#184E46] bg-[#E4ECE6] px-2.5 py-1 rounded mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATIONAL ADMIN CONSOLE (P0)</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#202724]">
            UltraStore Command Center
          </h1>
        </div>

        <Link
          href="/"
          className="text-xs font-mono text-[#59635E] hover:text-[#202724] flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Storefront Publik</span>
        </Link>
      </div>

      {/* 1. STOCK BALANCES LEDGER */}
      <section className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D9DDD5] pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#184E46]" />
            <h2 className="text-base font-bold text-[#202724]">
              Inventory Stock Ledger (Ready Stock)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#59635E]">
            Formula: Available = On Hand - Reserved - Allocated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#D9DDD5] text-[#59635E]">
                <th className="py-2">SKU</th>
                <th className="py-2">Produk & Varian</th>
                <th className="py-2 text-right">On Hand</th>
                <th className="py-2 text-right">Reserved (Hold 30m)</th>
                <th className="py-2 text-right">Allocated (Paid)</th>
                <th className="py-2 text-right">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DDD5]/40">
              {stockBalances.map((sb) => {
                const available = sb.on_hand - sb.reserved - sb.allocated;
                return (
                  <tr key={sb.variant_id} className="hover:bg-[#F9F8F6]">
                    <td className="py-2.5 font-bold text-[#202724]">{sb.sku}</td>
                    <td className="py-2.5 text-[#59635E]">
                      {sb.product_name} - {sb.variant_name}
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#202724]">{sb.on_hand}</td>
                    <td className="py-2.5 text-right text-[#A84329] font-bold">{sb.reserved}</td>
                    <td className="py-2.5 text-right text-[#184E46] font-bold">{sb.allocated}</td>
                    <td className="py-2.5 text-right font-bold text-[#184E46]">{available}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. PRE-ORDER BATCHES */}
      <section className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D9DDD5] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#A84329]" />
            <h2 className="text-base font-bold text-[#202724]">
              Pre-Order Batches & Drop Ledger Quotas
            </h2>
          </div>
          <span className="text-xs font-mono text-[#59635E]">
            Isolated from on_hand inventory
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#D9DDD5] text-[#59635E]">
                <th className="py-2">Batch Name</th>
                <th className="py-2">Status</th>
                <th className="py-2">Stage</th>
                <th className="py-2">ETA Rentang</th>
                <th className="py-2 text-right">Quota Total</th>
                <th className="py-2 text-right">Reserved</th>
                <th className="py-2 text-right">Committed</th>
                <th className="py-2 text-right">Available Quota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DDD5]/40">
              {batches.map((b) => {
                const avail = b.quota_total - b.quota_reserved - b.quota_committed;
                return (
                  <tr key={b.id} className="hover:bg-[#F9F8F6]">
                    <td className="py-2.5 font-bold text-[#202724]">{b.name}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-[#F4E5DC] text-[#A84329] uppercase font-bold text-[10px]">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#59635E] uppercase">{b.current_stage}</td>
                    <td className="py-2.5 text-[#202724] font-bold">{b.eta_range}</td>
                    <td className="py-2.5 text-right">{b.quota_total}</td>
                    <td className="py-2.5 text-right text-[#A84329]">{b.quota_reserved}</td>
                    <td className="py-2.5 text-right text-[#184E46] font-bold">{b.quota_committed}</td>
                    <td className="py-2.5 text-right font-bold text-[#184E46]">{avail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. RECENT ORDERS */}
      <section className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D9DDD5] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#184E46]" />
            <h2 className="text-base font-bold text-[#202724]">
              Pesanan Terbaru Masuk
            </h2>
          </div>
          <span className="text-xs font-mono text-[#59635E]">
            Total {orders.length} order tercatat
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-xs font-mono text-[#59635E] text-center py-6">
            Belum ada pesanan masuk. Coba lakukan transaksi sandbox di storefront.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#D9DDD5] text-[#59635E]">
                  <th className="py-2">Order Ref</th>
                  <th className="py-2">Tipe</th>
                  <th className="py-2">Status Bayar</th>
                  <th className="py-2">Fulfillment</th>
                  <th className="py-2">Pelanggan</th>
                  <th className="py-2 text-right">Total</th>
                  <th className="py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DDD5]/40">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F9F8F6]">
                    <td className="py-2.5 font-bold text-[#202724]">{o.reference}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.offer_type === "READY"
                          ? "bg-[#E4ECE6] text-[#184E46]"
                          : "bg-[#F4E5DC] text-[#A84329]"
                      }`}>
                        {o.offer_type}
                      </span>
                    </td>
                    <td className="py-2.5 uppercase font-bold text-[#184E46]">
                      {o.status}
                    </td>
                    <td className="py-2.5 uppercase text-[#59635E]">
                      {o.fulfillment_status}
                    </td>
                    <td className="py-2.5 text-[#59635E]">{o.customer_email}</td>
                    <td className="py-2.5 text-right font-bold text-[#202724]">
                      {formatIdr(o.total_amount)}
                    </td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/orders/${o.reference}?token=${o.guest_access_token}`}
                        className="text-[#184E46] underline hover:text-[#123d37]"
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
