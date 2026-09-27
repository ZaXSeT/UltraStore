# UltraStore — Runbook Operasional & Panduan Staging

## 1. Menjalankan Aplikasi
```bash
# Install dependencies
npm install

# Menjalankan automated test suite
npm test

# Menjalankan build produksi
npm run build

# Menjalankan development server
npm run dev
```

Aplikasi berjalan pada: `http://localhost:3000`
Console Admin: `http://localhost:3000/admin`

## 2. Struktur Arsitektur & Database
- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Design Tokens:** Precision Workshop (Warm Ivory `#F4F1EA`, Graphite `#202724`, Petrol Green `#184E46`, Burnt Orange `#A84329`)
- **Database:** Node.js native `node:sqlite` (SQLite 3 dengan WAL mode, foreign keys ON, atomic transactions `BEGIN IMMEDIATE`)
- **File Database:** `./data/ultrastore.db` (auto-created & auto-seeded saat first run)

## 3. Database Backup & Restore
### Backup:
```bash
# Backup snapshot SQLite
cp ./data/ultrastore.db ./data/backups/ultrastore_backup_$(date +%Y%m%d).db
```

### Restore:
```bash
# Pastikan server dimatikan sebelum restore
cp ./data/backups/ultrastore_backup_YYYYMMDD.db ./data/ultrastore.db
```

## 4. Simulasi Pembayaran & Webhook (Sandbox)
1. Buat pesanan melalui `/shop` -> masukkan ke keranjang -> `/checkout`.
2. Klik tombol **"Simulasi Bayar Sukses (Sandbox)"** pada layar checkout.
3. Webhook `/api/webhooks/payments` menerima status `settlement` dan secara atomik:
   - Mengubah status pembayaran menjadi `succeeded`.
   - Memindahkan stok `reserved` -> `allocated` (Ready Stock) atau `quota_reserved` -> `quota_committed` (Pre-order).
   - Mengubah status pesanan menjadi `confirmed` dan fulfillment menjadi `ready_to_ship` atau `waiting_supplier`.
4. Rincian pesanan aman dapat diakses via `/orders/[reference]?token=[guestAccessToken]`.

## 5. Prasyarat Peluncuran Produksi (Launch Blockers)
Sebelum beralih dari staging/sandbox ke live:
1. **Midtrans Production Keys:** Isi `MIDTRANS_SERVER_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` asli dari merchant portal.
2. **Alamat Gudang Asal:** Konfigurasi alamat gudang nyata untuk integrasi API kurir.
3. **Data Usaha:** Verifikasi harga jual final, margin, dan nomor rekening toko.
