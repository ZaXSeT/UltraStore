# UltraStore ⚡

> **Gear pilihan. Setup dengan karakter.**

UltraStore adalah toko online peripheral presisi untuk setup kerja dan gaming berkurasi tinggi. Dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, dan SQLite stdlib berkinerja tinggi.

---

## 🛠️ Fitur Utama (P0 Ready)

1. **Ready Stock & Beli Sekarang:**
   - Katalog peripheral resmi terverifikasi pabrik (Keychron, Wooting, Logitech G, Pulsar, Sennheiser, ARTISAN).
   - Saldo stok akurat dengan ledger atomik (`on_hand`, `reserved`, `allocated`).
2. **Pre-Order & Drop Ledger:**
   - Manajemen rilis batch per SKU dengan kuota transparan.
   - Drop Ledger timeline faktual yang melacak setiap tahapan perakitan hingga sampai di gudang.
3. **Pemisahan Keranjang Campuran (FR-03 PRD):**
   - Item Ready Stock dan Pre-Order dikelompokkan secara terpisah saat checkout.
   - Tagihan dan invoice independen agar pengiriman barang siap kirim tidak tertahan oleh jadwal batch PO.
4. **Pembayaran & Webhook Sandbox:**
   - Alur simulasi pembayaran aman (BCA Virtual Account / QRIS) dengan verifikasi server-side dan penanganan late payment / idempotency.
5. **Akses Pesanan Tamu (Guest Token):**
   - Pelanggan dapat berbelanja tanpa akun, riwayat pesanan dilindungi guest token bertanda tangan.
6. **Command Center Admin:**
   - Console `/admin` untuk inspeksi saldo stok real-time, kuota batch, dan antrean fulfillment.

---

## 🚀 Memulai Proyek

```bash
# Install dependencies
npm install

# Jalankan pengujian otomatis (Unit & Invariants)
npm test

# Jalankan server development
npm run dev
```

Buka `http://localhost:3000` pada browser Anda.

---

## 🎨 Design System: Precision Workshop
- `--canvas`: Warm Ivory `#F4F1EA`
- `--surface`: Chalk `#FFFFFF`
- `--ink`: Graphite `#202724`
- `--muted`: Slate Olive `#59635E`
- `--brand`: Petrol Green `#184E46`
- `--accent`: Burnt Orange `#A84329`
- Typography: System Sans + Monospace untuk metadata & SKU.
