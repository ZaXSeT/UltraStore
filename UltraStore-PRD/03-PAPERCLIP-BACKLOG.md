# UltraStore — Backlog eksekusi Paperclip

## Cara memakai

Hermes menjadi pengendali implementasi di Paperclip. Buat atau gunakan project UltraStore dalam company yang dipilih pengguna, hubungkan workspace repo, lalu materialisasikan backlog ini menjadi issue yang dapat dikerjakan. File ini bukan bukti issue sudah dibuat.

ID `UST-*` di bawah adalah ID rencana yang stabil, bukan ID yang sudah diterbitkan Paperclip. Simpan mapping ke ID/URL issue asli. Cari project/issue yang sama sebelum membuat baru agar restart tidak menghasilkan duplikat.

Gunakan agent yang tersedia sesuai kemampuan. Peran di tabel adalah tanggung jawab, bukan perintah menciptakan banyak agent baru. Jika hanya Hermes yang tersedia, kerjakan berurutan dan lakukan review terpisah setelah implementasi. Default maksimum dua pekerjaan coding independen bersamaan jika resource, izin, dan budget existing mendukung.

Jangan menerjemahkan “bisa mengontrol Paperclip” menjadi kebebasan mengubah company lain, menghapus task lain, atau menaikkan budget. Seluruh koordinasi diarahkan ke UltraStore.

## Struktur proyek

- Sasaran proyek: toko peripheral UltraStore dengan ready stock dan PO yang dapat ditransaksikan dan dioperasikan dengan benar.
- Milestone M0: akses, audit, keputusan arsitektur.
- Milestone M1: identitas visual, katalog, pipeline bukti produk.
- Milestone M2: inventory, PO, checkout.
- Milestone M3: payment, fulfillment, admin.
- Milestone M4: QA, staging, launch readiness.
- Milestone M5: DP, compare, wishlist dan kurasi lanjutan.

Prioritas lokal P0 berarti wajib launch, P1 berarti pengembangan berikutnya. Sesuaikan dengan enumerasi priority pada Paperclip yang terpasang; jangan mengirim nilai `P0` sebagai API enum tanpa memeriksa schema. Ukuran S/M/L menunjukkan kompleksitas relatif, bukan estimasi jam atau biaya.

## Daftar pekerjaan

| ID | Judul | Prioritas | Peran | Ukuran | Dependensi |
| --- | --- | --- | --- | --- | --- |
| UST-001 | Audit akses, repo dan kemampuan Paperclip | P0 | Hermes | S | — |
| UST-002 | Fondasi aplikasi, CI dan kontrak modul | P0 | Engineering | M | 001 |
| UST-003 | Design tokens dan prototipe halaman inti | P0 | Design / Frontend | M | 001 |
| UST-004 | Schema produk, offer dan evidence katalog | P0 | Backend | M | 002 |
| UST-005 | Riset brand/model dan gambar peripheral | P0 | Catalog Research | L | 001 |
| UST-006 | Storefront, filter, PDP dan integrasi aset | P0 | Frontend | L | 003, 004, 005 |
| UST-007 | Ledger stok, reservasi dan expiry | P0 | Backend | L | 004 |
| UST-008 | Batch PO, quota, update ETA dan penerimaan | P0 | Backend / Frontend | L | 004, 007 |
| UST-009 | Cart, Buy Now dan checkout kelompok | P0 | Fullstack | L | 006, 007, 008 |
| UST-010 | Auth, otorisasi dan akses guest order | P0 | Fullstack | M | 002, 004 |
| UST-011 | Gateway sandbox, webhook dan reconciliation | P0 | Payments | L | 009, 010 |
| UST-012 | Shipping, shipment dan notifikasi | P0 | Fullstack | M | 009, 010, 011 |
| UST-013 | Admin operasional, audit dan refund | P0 | Fullstack | L | 007, 008, 010, 011, 012 |
| UST-014 | Kebijakan, SEO, analytics dan monitoring | P0 | Fullstack / Content | M | 006, 011, 012 |
| UST-015 | QA transaksi, aksesibilitas dan desain | P0 | QA / Reviewer | L | 006–014 |
| UST-016 | Staging, backup restore dan runbook | P0 | Engineering | M | 013, 014 |
| UST-017 | Final catalog dan launch readiness | P0 | Hermes / QA | M | 015, 016, input bisnis |
| UST-018 | DP dan pelunasan PO | P1 | Payments / Fullstack | L | 017 |
| UST-019 | Compare, wishlist dan restock | P1 | Fullstack | M | 017 |
| UST-020 | Desk Notes, kurasi dan promo sederhana | P1 | Catalog / Fullstack | M | 017 |

Dependensi 006–014 berarti setiap task UST-006 sampai UST-014. Jangan memulai task dependen hanya karena prerequisite telah memiliki branch; tunggu kontrak atau hasil yang dibutuhkan benar-benar tersedia. Prototipe 003 boleh menggunakan fixture berlabel; penerbitan katalog memerlukan 005 dan gate 017.

## Scope dan acceptance per issue

### UST-001 — Audit dan koneksi

Periksa identitas/company/role, izin operasi, agent tersedia, budget, versi Paperclip, tools Hermes, akses GitHub, branch, AGENTS.md, README, status Git, dan stack. Gunakan autentikasi existing; jangan meminta secret untuk ditulis ke issue.

Hasil: laporan audit, mapping kemampuan, daftar blocker konkret, keputusan pertahankan atau scaffold stack. Jika repo tidak dapat diakses, jangan mengklaim telah mengaudit kode. Buat pekerjaan akses dengan kebutuhan minimum sambil melanjutkan desain/riset yang independen.

### UST-002 — Fondasi

Siapkan struktur modul, environment example tanpa secret, lint/typecheck/build, migrasi DB, scripts dev/test, dan CI. Kontrak entity/status dan service diletakkan di dokumen arsitektur.

Selesai bila setup dari checkout bersih berhasil, CI menjalankan pemeriksaan dasar, dan keputusan stack disertai alasan yang sesuai repo.

### UST-003 — Desain

Implementasi tokens, typography, header/footer, product card, form field, badge READY/PO, dialog, filter sheet, dan desain home/PDP/checkout. Ikuti 02-DESIGN-BRIEF.md.

Selesai bila prototype 390/1440 px dan error/empty state tersedia, font/contrast tidak bermasalah, serta checklist anti-slop dinilai dengan contoh visual.

### UST-004 — Data katalog

Buat Product, Variant, Offer, Brand, Category, Media dan evidence schema. Pisahkan SKU internal dari manufacturer part number, offer READY dari PREORDER, data usaha dari data produsen. Admin draft tidak otomatis publish.

Selesai bila constraints, importer tervalidasi, fixture development, dan gate publish menolak data/gambar yang belum diverifikasi.

### UST-005 — Riset mandiri produk dan gambar

Cari minimal 12 kandidat lintas empat kategori bila bukti tersedia. Jangan menetapkan brand, model, spesifikasi, harga toko atau stok dari ingatan model. Buka sumber resmi dan periksa kecocokan foto tiap varian.

Hasil wajib: `catalog-research.json`, `asset-manifest.json`, dan ringkasan kandidat approved/pending/rejected beserta alasan. Lokasi di repo disesuaikan; jangan menaruh credential/cookie dalam manifest.

Field minimum kandidat: brand resmi, nama resmi, model, manufacturer part number atau null, varian, spesifikasi dengan sumber, official product URL, checked_at. Field gambar: source URL, product/variant association, sudut pandang, dimensi, format, checksum untuk file yang boleh disimpan, izin pemakaian, status verifikasi.

Selesai bila setiap kandidat dapat ditelusuri; produk tanpa data memadai tetap draft; foto berizin cocok dengan item. Tidak perlu menunggu semua kandidat approved untuk menyerahkan riset. Final live gate tetap di UST-017.

### UST-006 — Storefront

Bangun navigasi kategori, search/filter berbasis URL, pagination, PDP varian/offer, galeri, informasi garansi, empty/error/loading. Integrasikan aset dari manifest; jangan memakai gambar acak.

Selesai bila FR-01/02 dan T19/T20 lulus; produk draft tidak terindeks atau terbeli; screenshot sesuai design brief tersedia.

### UST-007 — Inventory

Buat transaksi reservasi → alokasi → pengiriman, ledger koreksi, job expiry dan late-payment allocation. Tentukan kontrak pengecekan status gateway untuk expiry; fake adapter dapat dipakai sementara hingga 011.

Selesai bila uji DB paralel T02/T08 lulus dan semua event idempotent. Jangan memakai test in-memory saja untuk membuktikan row-locking bekerja.

### UST-008 — Pre-order

Bangun batch per SKU, quota, open/close, ETA snapshots, Drop Ledger, audit update, dan penerimaan sebagian/QC. Tidak mengimplementasikan DP sebelum kontrak full payment stabil.

Selesai bila T03/T04/T11/T12 lulus dan kuota PO tidak bercampur dengan stok siap jual.

### UST-009 — Checkout

Buat cart persisted, Beli sekarang, quote server-side, grup READY + per batch, invoice terpisah, idempotency dan total breakdown. Alamat sekali untuk sesi boleh dipakai bersama sebagai input lalu disalin ke snapshot masing-masing order.

Selesai bila T01/T05/T09 lulus dengan adapter test, perubahan harga/ongkir meminta penerimaan ulang dan order dari satu grup tidak melunasi grup lain.

### UST-010 — Identity dan otorisasi

Implementasi login dengan library yang sesuai, peran server-side, guest access token berumur terbatas, permintaan link email dengan respons anti-enumerasi, dan proteksi halaman privat.

Selesai bila T13 lulus, support/editor tidak dapat refund atau mengubah role, dan tamu hanya melihat ordernya sendiri.

### UST-011 — Payment

Integrasikan provider sandbox, matriks channel aktif, invoice attempt, webhook tervalidasi, idempotency, provider expiry, reconciliation dan penanganan pembayaran kedua. Periksa dokumentasi provider versi aktual.

Selesai bila T06/T07/T08/T14/T17 lulus; sukses, pending, expired, denied, timeout diuji; nominal/currency mismatch ditolak. Lampirkan bukti sandbox yang sudah disanitasi. Credential yang belum tersedia menghasilkan blocker integrasi, bukan klaim “pembayaran selesai”.

### UST-012 — Pengiriman dan komunikasi

Implementasikan shipping adapter atau matriks tarif nyata, quote expiry, snapshot alamat, shipment/resi, status tracking, email outbox dan retry.

Selesai bila perubahan tarif tertangani, area unsupported tidak gratis, notifikasi tidak duplikat, dan pengiriman hanya dimulai setelah syarat pembayaran/alokasi terpenuhi.

### UST-013 — Admin dan refund

Bangun panel katalog, inventory, batch, order, shipment, refund queue, audit dan exception. Uji refund sebagian, kegagalan dan retry terhadap penerimaan yang benar.

Selesai bila T10 lulus, admin dapat menyelesaikan satu siklus order nyata di sandbox, dan koreksi finansial selalu mempunyai catatan tanpa merusak histori.

### UST-014 — Konten dan observability

Tambahkan halaman kebijakan berdasarkan input pemilik, metadata canonical/OG/sitemap, structured data yang sesuai produk nyata, analytics server-confirmed purchase, dan alert operasional. Draft kebijakan diberi label sampai final.

Selesai bila tidak ada rating/stock/price palsu di structured data, analytics tidak berisi PII, dan error payment/job dapat ditelusuri lewat correlation ID.

### UST-015 — QA menyeluruh

Jalankan T01–T15 dan T17–T20 yang relevan untuk P0. T18 dipenuhi bersama 016. Verifikasi desain pada ukuran yang ditentukan, keyboard, screen-reader spot check, halaman kosong/gagal, dan performa. Perbaiki bug lalu ulangi area terdampak.

Selesai bila laporan menyebut test yang benar-benar dijalankan, hasil, screenshot, serta batasan; tidak ada P0/P1 defect yang memblokir transaksi atau mengekspos data.

### UST-016 — Staging dan operasional

Siapkan environment terpisah, migrations, secret injection, webhook HTTPS, worker/job scheduling, email, logging, backup dan uji restore. Tulis rollback dan cara menangani payment mismatch/late payment/refund.

Selesai bila deploy bersih dan restore dapat diulang, aplikasi tidak bergantung pada terminal developer yang kebetulan terbuka, serta staging tidak terhubung ke charge production.

### UST-017 — Final catalog dan launch

Audit 100% SKU awal untuk nama/brand/model/foto/izin, harga, stok/quota, ETA, berat/dimensi, garansi dan kebijakan. Verifikasi channel production merchant, domain, shipping, kontak dan email. Tinjau bukti 015/016.

Selesai bila toko memenuhi seluruh P0 dan tindakan produksi telah sesuai otorisasi pemilik. Jika ada blocker, keluarkan launch-readiness report dengan owner/aksi konkret dan status staging yang jujur. Jangan menandai production done karena tampilan demo selesai.

### UST-018 — DP

Implementasi FR-07, ledger obligation terpisah, quote shipping final, reminder, overdue queue, refund lintas transaksi dan feature flag. Selesai bila T16 plus regresi refund/duplikat lulus sebelum flag dinyalakan.

### UST-019 — Compare dan wishlist

Bandingkan maksimal tiga produk satu kategori, bedakan unknown dari unsupported. Wishlist tersimpan sesuai identitas; restock/PO notification opt-in dengan unsubscribe. Selesai bila tidak ada spesifikasi yang dikarang dan notifikasi tidak spam.

### UST-020 — Editorial dan promo

Desk Notes bersumber, koleksi berbasis atribut terverifikasi, kode promo dengan expiry/kuota/eligibility yang dihitung server-side. Hindari promosi yang mengubah DP atau ongkir secara ambigu. Selesai bila klaim faktual punya bukti dan promo tidak dapat dipakai melampaui batas lewat request paralel.

## Template isi setiap task

```text
Plan ID: UST-XXX
Outcome: [perubahan yang dapat diamati]
Source requirements: [FR/T/design section]
Scope: [yang dikerjakan]
Dependencies: [ID/URL issue asli]
Owner: [agent aktual]
Inputs: [data, kontrak, file]
Deliverables: [kode/dokumen/preview]
Acceptance criteria: [cek perilaku dan edge case]
Verification: [test + bukti yang harus dilampirkan]
External blockers: [jika ada, aksi/owner konkret]
Resume point: [langkah berikutnya yang dapat dilanjutkan]
```

## Aturan controller Hermes

Gunakan control-plane API/tool Paperclip yang tersedia dan kontrak runtime yang terpasang. Issue mendukung assignment, update, komentar dan checkout atomik; bila checkout ditolak karena dimiliki agent lain, jangan merebutnya. ID run dan aturan audit mengikuti runtime. [Referensi Issues API](https://github.com/paperclipai/paperclip/blob/master/docs/api/issues.md).

Simpan PRD dan brief sebagai project/issue document atau artifact yang dapat diakses agent lain. Path lokal Windows pada perangkat pengguna tidak otomatis tersedia di host Hermes. Sertakan dokumen yang diperlukan sebelum task didelegasikan.

Utamakan kemajuan yang tersimpan: branch/commit/PR, hasil test, artifact, status dan resume point. Jangan busy-poll atau mengirim komentar identik. Jika suatu integrasi terblokir, lanjutkan issue independen. Jika semua tersisa terblokir, simpan kebutuhan minimum dengan mekanisme waiting resmi dan jadwal wake yang didukung runtime.

Review mencakup kode, behavior, visual, serta bukti data produk. Task dianggap done setelah acceptance criteria terpenuhi; “agent mengatakan sudah” bukan bukti. Project launch tetap terbuka sampai UST-017 selesai. P1 ditangani setelah P0 stabil sesuai kapasitas yang diberikan.
