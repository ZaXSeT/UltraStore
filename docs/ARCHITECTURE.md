# UltraStore Architecture & Module Contracts

Dokumen arsitektur, keputusan stack, kontrak modul, dan state machine sistem UltraStore.

---

## 1. Keputusan Stack & Justifikasi

| Layer / Komponen | Pilihan Stack | Alasan & Justifikasi Repo |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server Components (RSC) mengeliminasi client JS pada halaman katalog/PDP; Route Handlers menangani webhook Midtrans; layout modular. |
| **Bahasa & Compiler** | TypeScript 5.7+ (Strict Mode) | Type safety penuh lintas boundary modul, pencegahan bug nominal floating-point, dan kontrak compile-time. |
| **Styling** | Tailwind CSS 3.4 + CSS Variables | Implementasi presisi token visual dari `02-DESIGN-BRIEF.md` (Warm Ivory canvas, Graphite ink, Petrol Green brand) tanpa CSS runtime overhead. |
| **Database Engine** | SQLite via `node:sqlite` (Node.js stdlib) | Menggunakan modul standar Node.js (`DatabaseSync`). Bebas dependensi eksternal native/C++ build tools, performa tinggi, atomic `BEGIN IMMEDIATE` transaction, journal mode WAL. |
| **CI / CD** | GitHub Actions | Eksekusi otomatis linting, typecheck (`tsc --noEmit`), migrasi DB, automated test suite, dan build pada pull request & push main. |

---

## 2. Struktur Modul & Direktori

```text
UltraStore/
├── .github/workflows/ci.yml       # Definisi pipeline CI
├── docs/
│   └── ARCHITECTURE.md            # Dokumen arsitektur & kontrak modul ini
├── src/
│   ├── app/                       # Next.js App Router (Routes & Pages)
│   │   ├── layout.tsx             # Root layout dengan design tokens
│   │   ├── page.tsx               # Homepage
│   │   ├── shop/                  # Katalog & filter produk
│   │   ├── products/[slug]/       # PDP (Product Detail Page)
│   │   ├── drops/[slug]/          # Preorder Batch progress page
│   │   └── cart/                  # Keranjang belanja & group checkout
│   ├── components/                # UI Components (Header, Footer, Card, Badges)
│   ├── contracts/                 # Kontrak antarmuka modul (ICatalog, IInventory, IOrder, IPayment)
│   ├── db/
│   │   ├── schema.sql             # Skema DDL SQLite kanonikal
│   │   └── migrate.mjs            # Runner migrasi mandiri
│   ├── lib/
│   │   ├── db.ts                  # Koneksi singleton DatabaseSync & runInTransaction
│   │   ├── types.ts               # Definisi domain entity & status union
│   │   └── catalog.ts             # Service katalog produk & preorder
│   └── tests/                     # Test suite fondasi & transaksi
└── package.json                   # Scripts: build, lint, typecheck, db:migrate, test
```

---

## 3. Kontrak Modul & Batasan Layanan

Setiap modul memiliki batasan tanggung jawab yang jelas sesuai `src/contracts/index.ts`:

### A. Catalog Module (`ICatalogModule`)
- **Tanggung Jawab:** Menyimpan dan menyajikan data Brand, Kategori, Produk, Varian, Gambar terverifikasi, dan Penawaran (READY/PREORDER).
- **Invarian:** Produk draft tidak pernah tampil di storefront publik (`published = 1`). Part number produsen dipisahkan dari internal SKU toko.

### B. Inventory & Ledger Module (`IInventoryModule`)
- **Tanggung Jawab:** Melacak stok fisik (`on_hand`), cadangan pesanan belum dibayar (`reserved`), stok siap kirim (`allocated`), dan kuota batch preorder (`quota_reserved`, `quota_committed`).
- **Invarian:** `available = on_hand - reserved - allocated >= 0`. Tidak boleh terjadi oversell atau stok negatif. Setiap mutasi dicatat dalam `stock_movements`.

### C. Order Module (`IOrderModule`)
- **Tanggung Jawab:** Mengelola checkout keranjang yang terpisah berdasarkan kelompok pengiriman (`READY` vs `PREORDER:<batchId>`), validasi alamat, dan pembuatan token akses pesanan tamu (`guest_access_token`).
- **Invarian:** Order READY dan PREORDER tidak boleh dicampur dalam satu grup transaksi checkout.

### D. Payment Module (`IPaymentModule`)
- **Tanggung Jawab:** Inisialisasi transaksi pembayaran ke provider (Midtrans / Sandbox mock), verifikasi signature webhook, dan pembaruan status pembayaran secara idempoten melalui `idempotency_keys`.

---

## 4. State Machine & Transisi Siklus Hidup

### Status Pesanan (`OrderStatus`)
```text
[ pending_payment ] ──(bayar lunas)──> [ confirmed ] ──(kirim selesai)──> [ completed ]
         │                                   │
         ├──(kadaluarsa / batal)             └──(masalah stok/ops)
         v                                   v
    [ cancelled ]                       [ on_hold ]
```

### Status Alokasi Stok (`AllocationStatus`)
- `reserved`: Stok ready atau slot kuota PO diamankan sementara selama menunggu pembayaran (TTL reservasi).
- `allocated_stock`: Pembayaran lunas untuk unit ready stock, barang siap packing.
- `committed_po`: Pembayaran lunas untuk unit preorder, slot produksi diteruskan ke pabrik/supplier.
- `released`: Reservasi dibatalkan/kadaluarsa karena pembayaran tidak diselesaikan tepat waktu.
- `consumed`: Barang fisik telah diserahkan ke kurir / shipped.

### Status Pemenuhan (`FulfillmentStatus`)
- READY flow: `unallocated` -> `ready_to_ship` -> `shipped` -> `delivered`.
- PREORDER flow: `unallocated` -> `waiting_supplier` -> `received_qc` -> `ready_to_ship` -> `shipped` -> `delivered`.

### Status Pembayaran (`PaymentStatus`)
- `created` -> `pending` -> `succeeded`
- Alternatif akhir: `failed`, `expired`, atau `cancelled`.
