"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Search, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function TrackOrderPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      setErrorMsg(t("Masukkan nomor referensi pesanan, misalnya UST-20260928-89F2.", "Enter your order reference, for example UST-20260928-89F2."));
      return;
    }
    router.push(`/orders/${reference.trim()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--theme-ink)] tracking-tight">
          {t("Lacak Pesanan", "Track Your Order")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          {t("Masukkan nomor referensi dari tagihan atau konfirmasi pesanan Anda.", "Enter the reference number from your invoice or order confirmation.")}
        </p>
      </div>

      <div className="bg-[var(--theme-surface)] border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 tracking-wide">
              {t("Nomor Referensi Pesanan", "Order Reference")}
            </label>
            <input
              type="text"
              required
              placeholder={t("Contoh: UST-20260928-89F2", "Example: UST-20260928-89F2")}
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                setErrorMsg("");
              }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[var(--theme-ink)] placeholder-slate-400 focus:bg-[var(--theme-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-ring)] focus:border-[var(--theme-accent)] transition-all"
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
            <span>{t("Lacak Pesanan", "Find My Order")}</span>
          </button>
        </form>

        <div className="border-t border-slate-100 mt-6 pt-4 text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t("Privasi Pesanan", "Order Privacy")}</span>
          </div>
          <p className="leading-relaxed">
            {t("Detail alamat dan pembayaran hanya ditampilkan melalui tautan akses pesanan yang aman.", "Your address and payment details are protected by a secure order access link.")}
          </p>
        </div>
      </div>
    </div>
  );
}
