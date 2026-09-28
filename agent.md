# AGENT RUNBOOK & PERSISTENT SESSION MEMORY: ULTRASTORE

Dokumen ini adalah single source of truth untuk progress, konfigurasi arsitektur, dan riwayat modifikasi sistem UltraStore. Setiap agent di sesi baru wajib membaca dokumen ini.

---

## 1. Project Identity & Credentials
- **Repository**: `https://github.com/ZaXSeT/UltraStore`
- **Owner / Git Author**: `ZaXSeT <zackyxie123@gmail.com>`
  - *Catatan Penting*: Semua git commit & push WAJIB menggunakan name `ZaXSeT` dan email `zackyxie123@gmail.com` agar tidak memicu `Deployment Blocked` di Vercel.
- **Local Dev URLs**:
  - Storefront: `http://localhost:3000`
  - Admin Console: `http://admin.localhost:3000` (subdomain rewrite via `src/middleware.ts`)
- **Cloudflare R2 Bucket**: `ultrastore`
  - Account ID: `e9f6cff37d5d30f39a1865ce7c3d765e`
  - Access Key ID: `b741bf9cf99ebc693bde29efc570fe02`
  - Secret Access Key: `e4e3b6bfc50f2a619f17431722490bb8d9f2ad4f21e4f4172fe5879fe217ea38`
  - Endpoint: `https://e9f6cff37d5d30f39a1865ce7c3d765e.r2.cloudflarestorage.com`
  - Public Dev URL (jika tidak diblokir ISP): `https://pub-e9f6cff37d5d30f39a1865ce7c3d765e.r2.dev`

---

## 2. Architecture & Design Rules (STRICT / ZERO AI-SLOP)
1. **No AI Generated Images**:
   - Dilarang keras generate gambar produk via AI. Semua 114 produk menggunakan foto autentik (infinitas.id / official brand assets) yang telah di-upload ke Cloudflare R2 dalam format WebP.
2. **No Rounded Corners (Zero Radius)**:
   - Dilarang menggunakan `rounded-full`, `rounded-2xl`, `rounded-xl` pada cards, filter items, tabs, status badges, dan containers.
   - Semua elemen UI berarsitektur **Swiss Modernism / Brutalist Studio Precision**: hairline border (`#E2E5EB` / `border-neutral-200`), sudut siku-siku 90° tajam.
3. **No Dull All-Black Buttons**:
   - Tombol aksi utama (CTA, Save changes, Add, Upload & Crop, Live storefront) menggunakan **Swiss Cobalt Electric Blue** (`#0E52FF`, hover `#0040E0`, active `scale-[0.98]`).
4. **No Em Dash (`—`)**:
   - Jangan pernah menggunakan em dash (`—`). Gunakan interpunct `·` atau pipe `|`.
5. **No Local Fallbacks**:
   - Jika gambar tidak ada di R2, tampilkan kotak kosong netral (`bg-neutral-100`). Jangan pernah fallback ke aset hardcode lokal.

---

## 3. Serverless Deployment Specs (Netlify & Vercel)
- Database: SQLite `data/ultrastore.db` di-track di Git repository.
- Lingkungan serverless (Vercel & Netlify AWS Lambda) memiliki `/var/task` yang *Read-Only*.
- Di `src/lib/db.ts`, terdapat hook otomatis `process.env.VERCEL || process.env.NETLIFY` yang meng-copy `data/ultrastore.db` ke `/tmp/ultrastore.db` (satu-satunya partisi yang mendukung Read/Write di serverless).
- `PRAGMA journal_mode = WAL` dibungkus try/catch agar tidak melempar crash pada disk serverless.
- Konfigurasi Netlify terpasang di `netlify.toml` menggunakan `@netlify/plugin-nextjs`.

---

## 4. Admin Console Features (`http://admin.localhost:3000`)
- **Modul 01: Storefront Showcase (CMS)**:
  - Form Top Notification Strip (dengan tombol Save tersendiri: `Save Strip`).
  - Form Hero Focus Product (dengan tombol Save tersendiri: `Save Hero`).
  - Form 5-Slot Homepage Category Directory & Links (dengan tombol Save tersendiri: `Save Categories`).
  - Tombol Global di kanan atas: `COMMIT TO LIVE STORE`.
  - Preview 1:1 Live Aspect Ratio dengan upload dan interactive crop 1:1.
  - Penamaan file otomatis menggunakan crypto hash random: `products/asset_<timestamp>_<hash>.webp` (tidak pernah menggunakan nama asli file user).
- **Modul 02: Catalog Directory & Stocks**:
  - Tombol `+ Add Product` (modal pop-up lengkap dengan upload/crop, nama, kategori, harga, stok, pre-order status).
  - Input cepat Stok Fisik per baris tabel (onBlur auto-update DB).
  - Tombol Edit per item (`Edit2` icon) untuk mengedit detail nama, stok, dan gambar.
  - Tombol Hapus per item (`Trash2` icon) menghapus produk, varian, dan stok dari DB.
  - Pagination per 15 items (`PREV`, nomor halaman `1, 2, 3...`, `NEXT`).

---

## 5. Changelog Terbaru
- `5b786a2`: Mengganti seluruh tombol hitam kusam di admin menjadi Swiss Cobalt Electric Blue (`#0E52FF`).
- `a93aca1`: Membersihkan pill badge AI-slop pada header katalog menjadi Swiss Technical Frame.
- `69cc80a`: Memperbaiki deployment Vercel runtime serverless (tmp sqlite copy & safe pragma).
- `d118c0d`: Menghapus tanda em dash (`—`) di seluruh judul tab browser, badge hero, dan SQLite settings.
- `b0763a9`: Menghapus semua sudut rounded pada PDP (spesifikasi, box contents, panel pembelian).
- `56a5098`: Mengganti highlight brand selector di sidebar katalog menjadi flat tabular Swiss black dengan square marker Electric Blue.
- `b324518`: Menghapus kartu jaminan generik di footer sidebar katalog dan memperbaiki author commit ke `ZaXSeT <zackyxie123@gmail.com>`.
- `3bd48f4`: Mengubah tombol Detail di seluruh card produk menjadi sharp Swiss Cobalt Electric Blue.
- `ad3bb6a`: Mengkalibrasi jarak vertikal footer dan zero-gap hero atas.
- `e086027`: Menambahkan animasi metallic shimmer mengkilat (`logo-shimmer`) pada logo ULTRASTORE di navbar dengan gradien deep cobalt ke cyan/white gleam.
- `a7125bb`: Memperbesar skala typography judul hero kiri (`text-5xl sm:text-7xl lg:text-8xl 2xl:text-9xl`) dan memperluas viewport gambar kanan menjadi `max-w-[620px]` dengan rasio grid 6:6 seimbang dan dominan.
- `Current`: Memperbaiki animasi logo ULTRASTORE: warna dasar tetap Deep Obsidian `#0F172A` pekat dengan kilatan sinar cahaya putih/cobalt yang bergerak menyapu huruf dari kiri ke kanan secara halus (`-200%` ke `200%`).
- `Current-2`: Memperbaiki bug tombol `VIEW DETAIL` yang terpotong di tepi kartu produk: menyederhanakan label menjadi `DETAIL ↗` dengan `whitespace-nowrap`, `shrink-0`, padding `px-2.5 py-1.5`, dan layout `items-end` yang sejajar rapi dengan harga tanpa menabrak batas kartu.
- `Current-3`: Menghilangkan celah gap vertikal kosong 0px total antara brand ticker bar dan frame hero section beranda (mencabut class `space-y-*` dari wrapper induk beranda).
- `Current-4`: Mengganti seluruh highlight aktif warna hitam (`#111215`) di sidebar filter katalog (`ShopSidebar.tsx`) menjadi **Swiss Cobalt Electric Blue** (`#0E52FF`) dengan aksen putih bersih pada Kategori Produk, Brand Directory, dan Dispatch Availability.
