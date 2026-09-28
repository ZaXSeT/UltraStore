"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Search, ShieldCheck } from "lucide-react";

export default function TrackOrderPage() {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      setErrorMsg("Masukkan nomor referensi pesanan (contoh: UST-20260928-89F2)");
      return;
    }
    router.push(`/orders/${reference.trim()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Lacak Status Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Masukkan nomor referensi pesanan yang tertera pada invoice atau konfirmasi pesanan Anda.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
              Nomor Referensi Pesanan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: UST-20260928-89F2"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                setErrorMsg("");
              }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Cari Status Pesanan</span>
          </button>
        </form>

        <div className="border-t border-slate-100 mt-6 pt-4 text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privasi Data Pesanan</span>
          </div>
          <p className="leading-relaxed">
            Detail alamat dan informasi transaksi pribadi dilindungi tautan akses bertanda tangan (guest access token) untuk menjaga kerahasiaan data pembeli.
          </p>
        </div>
      </div>
    </div>
  );
}
