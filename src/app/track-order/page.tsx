"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

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
        <div className="w-12 h-12 rounded-full bg-[#E4ECE6] text-[#184E46] flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#202724] tracking-tight">
          Lacak Pesanan Kamu
        </h1>
        <p className="text-xs text-[#59635E] font-mono">
          Masukkan nomor referensi pesanan yang dikirimkan ke invoice atau email kamu.
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#D9DDD5] rounded p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#202724] mb-1 uppercase tracking-wider">
              Nomor Referensi Pesanan
            </label>
            <input
              type="text"
              required
              placeholder="UST-YYYYMMDD-XXXX"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                setErrorMsg("");
              }}
              className="w-full p-3 bg-[#F4F1EA] border border-[#78857C] rounded text-sm font-mono text-[#202724] focus:outline-none focus:border-[#184E46]"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-[#A12D2D] font-mono">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#184E46] text-white text-xs font-mono font-bold uppercase tracking-wider rounded hover:bg-[#123d37] transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Cari Status Pesanan</span>
          </button>
        </form>

        <div className="border-t border-[#D9DDD5] mt-6 pt-4 text-[11px] font-mono text-[#59635E] space-y-1">
          <div className="flex items-center gap-1 text-[#184E46] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privasi Data Pesanan</span>
          </div>
          <p>
            Detail alamat dan informasi transaksi pribadi dilindungi tautan akses bertanda tangan (guest access token) untuk mencegah kebocoran data.
          </p>
        </div>
      </div>
    </div>
  );
}
