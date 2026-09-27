# UltraStore — Product Requirements Document

Versi 1.0 · 28 September 2026 · Bahasa produk: Indonesia · Mata uang: IDR

**Status: rencana produk untuk implementasi oleh Hermes melalui Paperclip.** Dokumen ini menetapkan perilaku yang harus dibangun; bukan laporan bahwa website atau integrasinya sudah tersedia.

## 1. Visi

UltraStore adalah toko peripheral untuk orang yang peduli bagaimana meja mereka terasa, bekerja, dan terlihat. Pelanggan dapat membeli barang ready stock sekarang atau memesan rilisan pre-order dengan informasi harga, jadwal, dan progres yang jelas.

**Janji produk: “Gear pilihan. Setup dengan karakter.”**

Pengalaman harus terasa seperti masuk ke toko spesialis yang memahami produknya: fotografi kuat, spesifikasi jujur, kurasi yang berguna, dan proses transaksi yang dapat dipercaya. Tidak memakai kesan dashboard SaaS generik atau toko gaming penuh neon.

Tiga pembeda:

1. **Ready / Reserve:** status ready stock dan PO terlihat sejak kartu produk sampai invoice.
2. **Drop Ledger:** halaman setiap batch PO dengan tanggal, kuota faktual, perubahan ETA, dan catatan perkembangan dari toko.
3. **Desk Notes:** penjelasan singkat tentang rasa pakai dan alasan memilih produk; hanya memuat klaim yang punya dasar.

## 2. Konteks repo dan asumsi

Target repo: [ZaXSeT/UltraStore](https://github.com/ZaXSeT/UltraStore).

Saat penyusunan, Git tidak mengembalikan refs/branch dan API GitHub tanpa autentikasi mengembalikan 404. Belum ada kode repo yang berhasil diperiksa. Jangan menyimpulkan bahwa repo pasti kosong atau tidak ada. Hermes wajib memeriksa akses, default branch, README, AGENTS.md, struktur aplikasi, dan perubahan lokal terlebih dahulu.

| Keputusan awal | Dasar / konsekuensi |
| --- | --- |
| Nama toko UltraStore | Sesuai permintaan dan nama repo |
| Toko satu penjual, satu gudang awal | Asumsi implementasi; bukan marketplace |
| Pasar Indonesia, Bahasa Indonesia, IDR | Asumsi dari konteks; seluruh nominal disimpan sebagai integer rupiah |
| “Bisa langsung” = ready stock + Beli sekarang | Tidak otomatis berarti COD atau pengambilan di toko |
| Pengiriman domestik | Kota asal, alamat gudang, dan kontrak kurir belum diberikan |
| Tema terang editorial | Default utama; dark mode tidak wajib launch |
| Midtrans sebagai kandidat gateway utama | Harus dicek terhadap akun merchant dan kebutuhan aktual |
| Full payment untuk ready stock dan PO | Wajib launch |
| DP + pelunasan PO | Tahap P1, flag nonaktif sampai semua uji cicilan internal lulus |
| Harga, katalog, foto, kebijakan, ETA, garansi | Data usaha belum tersedia; fixture hanya untuk demo |

Keputusan desain dan pengembangan lokal boleh memakai default ini. Input bisnis yang belum tersedia dicatat dalam daftar blocker peluncuran, tanpa menghentikan pekerjaan yang tidak bergantung padanya.

## 3. Pengguna dan hasil yang ingin dicapai

| Pengguna | Kebutuhan | Hasil yang harus mudah dicapai |
| --- | --- | --- |
| Pembeli praktis | Peripheral yang tersedia dan cocok dengan anggaran | Menemukan varian, melihat total biaya, membeli tanpa membuat akun |
| Penggemar keyboard / setup | Rilisan, spesifikasi rinci, kepastian PO | Memilih batch dan memahami kapan barang diperkirakan dikirim |
| Pembeli yang membandingkan | Menilai dua atau tiga pilihan | Membandingkan spesifikasi dalam kategori yang sama pada P1 |
| Operator toko | Menjaga stok dan memproses pesanan | Melihat pekerjaan hari ini, menerima barang PO, membuat pengiriman |
| Pemilik | Mengendalikan katalog, pembayaran, dan risiko operasional | Menelusuri transaksi, refund, perubahan ETA, dan aktivitas admin |

## 4. Cakupan dan prioritas

### P0 — wajib sebelum launch transaksi

- Homepage, kategori, katalog, pencarian, filter, halaman produk dan varian.
- Ready stock, Beli sekarang, cart, guest checkout, alamat, ongkir, invoice.
- Pre-order full payment berdasarkan batch, kuota, rentang ETA, dan progres.
- Keranjang campuran dengan pengelompokan serta pembayaran per kelompok yang eksplisit.
- Pembayaran multimetode melalui gateway: QRIS, VA, e-wallet, kartu, dan gerai sesuai aktivasi merchant.
- Akun pelanggan opsional, akses pesanan tamu yang aman, riwayat pesanan.
- Admin katalog, SKU, stok, batch PO, pesanan, pengiriman, refund, konten dasar.
- Riset katalog dan pencarian gambar mandiri oleh Hermes dengan verifikasi brand/model/varian serta catatan sumber.
- Email transaksi, job expiry/reconciliation, audit log, kontrol akses.
- Halaman kebijakan, privasi, pengiriman, garansi, kontak; isi final dari pemilik.
- Responsive, aksesibilitas, SEO, logging, backup, dan bukti pengujian.

### P1 — sesudah alur utama stabil

- DP + pelunasan PO, dilindungi feature flag.
- Bandingkan maksimal tiga produk dalam kategori yang sama.
- Wishlist, notifikasi restock/PO dengan persetujuan pengguna.
- Desk Notes, kurasi setup berbasis aturan, promo sederhana dengan batas pemakaian.
- Review pembelian terverifikasi dan integrasi WhatsApp resmi jika disiapkan pemilik.

### P2 — pengembangan lanjut

- Bundle dinamis, loyalty, multi-gudang, pickup/COD jika operasional mendukung.
- Personalisasi berdasarkan preferensi yang disetujui pengguna.
- Gateway cadangan setelah kebutuhan availability terbukti.

Di luar lingkup awal: marketplace multi-vendor, kredit internal, dompet saldo, lelang, aplikasi native, chatbot AI wajib, konfigurator PC lengkap, dan fitur sosial.

## 5. Struktur halaman

| Route konseptual | Tujuan |
| --- | --- |
| `/` | Kurasi utama, ready stock, PO, dan alasan memilih UltraStore |
| `/shop` | Katalog dengan query pencarian, filter, sort, pagination |
| `/category/[slug]` | Keyboard, mouse, audio, mousepad, aksesori |
| `/products/[slug]` | Foto, varian, spesifikasi, harga dan aksi transaksi |
| `/pre-orders` | Daftar batch terbuka, akan datang, dan selesai |
| `/drops/[slug]` | Drop Ledger: produk, batas pemesanan, ETA, progres |
| `/cart` | Item dikelompokkan menurut cara pemenuhan |
| `/checkout/[session]` | Alamat, pengiriman, ringkasan dan pembayaran per kelompok |
| `/orders/[reference]` | Detail dan status; perlu autentikasi/tautan akses aman |
| `/track-order` | Meminta tautan akses ke email, bukan membocorkan detail order |
| `/account` | Pesanan, alamat tersimpan, pengaturan akun |
| `/help`, `/policies/*`, `/contact` | Informasi layanan dan kebijakan |
| `/admin/*` | Pengelolaan toko sesuai peran |

Route dapat disesuaikan dengan konvensi repo tanpa mengubah perilaku produk.

## 6. Persyaratan fungsional

### FR-01 — Katalog dan pencarian

Produk memiliki nama, slug, brand, kategori, foto, deskripsi, spesifikasi terstruktur, berat/dimensi paket, garansi, dan varian SKU. Harga dan inventory berada pada varian/offer, bukan hanya produk induk.

Satu SKU dapat memiliki offer READY dan offer PREORDER pada waktu bersamaan. Pengguna harus memilih penawaran yang jelas; sistem tidak boleh diam-diam mengganti ready stock menjadi PO saat stok habis.

Filter umum: kategori, brand, harga, status stok, koneksi. Filter spesifik keyboard: layout, tipe switch, hot-swap; mouse: berat, koneksi, bentuk; audio: koneksi, mikrofon. Jangan menampilkan filter yang kosong atau tidak relevan.

Pencarian menoleransi kapitalisasi dan spasi, mempunyai empty state yang membantu, menyimpan filter dalam URL, dan tidak memakai hasil/angka stok palsu. Harga “mulai dari” mengikuti varian yang benar-benar dapat dibeli.

**AC:** filter bertahan setelah reload; SKU habis tidak dapat ditambahkan; pilihan varian memperbarui foto, harga, stok, dan spesifikasi yang terkait.

### FR-02 — Halaman produk dan Beli sekarang

Tampilkan galeri, nama, harga final varian, pilihan varian, tipe offer, ketersediaan, estimasi pengiriman, spesifikasi, isi kotak, garansi dan kebijakan terkait. Foto harus sesuai warna dan varian; placeholder diberi penanda saat demo.

CTA READY: **Tambah ke keranjang** dan **Beli sekarang**. Beli sekarang membuat sesi checkout untuk pilihan ini dan menjaga keranjang sebelumnya. CTA PO: **Pre-order batch ini** dengan ETA serta syarat yang terlihat sebelum pengguna melanjutkan.

**AC:** tidak ada varian default tersembunyi yang menyebabkan salah pesan; CTA dinonaktifkan dengan alasan jika offer ditutup; mobile mempunyai bar pembelian yang tidak menutupi konten atau fokus keyboard.

### FR-03 — Cart dan checkout campuran

Satu cart boleh berisi ready stock dan beberapa batch PO. Untuk versi awal, kelompokkan berdasarkan `READY` atau `PREORDER:batchId`.

Setiap kelompok menjadi order, ongkir, dan invoice terpisah. Satu layar checkout dapat mengumpulkan alamat sekali, lalu menunjukkan tiap kelompok dan tombol bayar masing-masing. **Tidak ada tombol “Bayar semua” pada versi awal.**

Contoh: satu mouse ready, satu keyboard PO Oktober, dan satu keycap PO November menghasilkan tiga order. Mouse diproses setelah invoice mouse dibayar; order lain tetap menunggu pembayaran. UI menampilkan “1 dari 3 pesanan sudah dibayar”, bukan sukses untuk seluruh cart.

Per kelompok, server menghitung ulang harga, stok, kuota, berat, ongkir, dan kelayakan channel. Harga yang berubah harus diperlihatkan dan diterima ulang. Idempotency key menghindari order ganda ketika tombol ditekan dua kali.

Cart bukan reservasi stok. Reservasi dimulai saat invoice dibuat. Draft kelompok yang belum dibayar tidak memblokir stok tanpa batas. Pembatalan atau kegagalan satu kelompok tidak membatalkan kelompok lain yang sudah dibayar.

**AC:** pelanggan mengetahui ada pembayaran/ongkir terpisah sebelum konfirmasi; tidak ada cross-group subsidy tersembunyi; refresh/back/retry tidak membuat invoice ganda.

### FR-04 — Ready stock dan inventory

Inventory READY menggunakan ledger dan saldo `on_hand`, `reserved`, `allocated`. `available = on_hand - reserved - allocated`; seluruh nilai tidak negatif.

- Invoice dibuat: available berpindah ke reserved secara atomik.
- Pembayaran sah: reserved berpindah ke allocated, bukan pengurangan stok kedua kali.
- Barang dikirim: on_hand dan allocated berkurang satu kali.
- Invoice kedaluwarsa/batal yang terverifikasi: reserved dilepas satu kali.
- Pembatalan order paid sebelum kirim: allocated dilepas; pengembalian uang tercatat terpisah.
- Retur: stok hanya ditambah setelah barang diterima dan inspeksi menetapkan layak jual.

Reservasi awal 30 menit sebagai konfigurasi produk, diselaraskan dengan kemampuan expiry channel. Channel yang memerlukan hold berbeda harus memiliki kebijakan eksplisit; jangan melepas stok sementara invoice masih dapat dibayar tanpa mekanisme late-payment.

Jika pembayaran valid datang setelah reservasi dilepas, sistem mencoba alokasi atomik lagi. Jika tidak tersedia, tandai `paid_allocation_exception`, hentikan fulfillment, dan buka pekerjaan refund/penyelesaian. Jangan oversell atau mengubahnya menjadi PO otomatis.

**AC:** dua pembeli berebut unit terakhir hanya menghasilkan satu alokasi; expiry dan webhook bersamaan tidak melepaskan alokasi sah; perubahan stok manual memerlukan alasan dan audit.

### FR-05 — Batch pre-order

Batch memiliki produk/SKU yang diikutkan, harga offer, quota per SKU, waktu buka/tutup, batas maksimum per pelanggan jika ada, rentang ETA kirim, kebijakan snapshot, dan catatan publik.

Kuota PO dihitung terpisah dari on_hand. `quota_available = quota_total - reserved_slots - committed_slots`. Pembayaran full/DP yang valid mengubah reserved menjadi committed secara atomik. Batch dengan pesanan aktif tidak dapat dihapus; hanya ditutup/diarsipkan.

Tampilkan rentang **estimasi kirim dari gudang**, misalnya “12–26 November 2026”, bukan janji waktu tiba di alamat. Bedakan ETA masuk gudang, tanggal kirim, dan estimasi kurir.

Drop Ledger berisi tahap: pemesanan dibuka → pemesanan ditutup → proses supplier → perjalanan ke gudang → diterima dan QC → pengiriman. Tahap hanya bergerak dari tindakan operator yang tercatat; bukan animasi otomatis berbasis waktu.

Perubahan ETA menyimpan nilai lama, nilai baru, alasan, aktor, dan timestamp. Pelanggan terdampak menerima pemberitahuan dengan ketentuan pembatalan yang berlaku. Batch terlambat mendapatkan label yang jelas, bukan tanggal yang digeser diam-diam.

Penerimaan barang PO mengubah komitmen menjadi alokasi fisik dalam satu transaksi. Komitmen lama diberi penanda converted agar tidak dihitung dua kali. Unit yang telah dipesan tidak boleh muncul sebagai ready stock bebas. Jika barang datang sebagian, alokasi mengikuti waktu pembayaran valid dengan aturan yang terlihat admin; order hanya dikirim ketika seluruh item order tersedia pada P0.

**AC:** batch tutup tidak menerima invoice baru; pembayaran terhadap invoice lama mengikuti expiry tersimpan; penerimaan sebagian/salah SKU tidak memicu status semua pesanan “siap kirim”.

### FR-06 — Pembayaran multimetode

Rekomendasi: satu gateway utama dengan halaman pembayaran ter-host/komponen resmi. Kandidat awal Midtrans Snap; pemilihan final harus diverifikasi pada akun merchant. Snap menyediakan antarmuka pembayaran bawaan. [Dokumentasi Snap](https://docs.midtrans.com/docs/snap).

| Keluarga metode | Target channel | Aturan tampilan |
| --- | --- | --- |
| QRIS | QR dinamis per invoice | Tampilkan nominal, expiry, dan cara mengecek status |
| Virtual account | BCA, BNI, BRI, Permata; Mandiri sesuai channel provider | Hanya channel yang benar-benar aktif |
| E-wallet | GoPay, ShopeePay; channel lain jika didukung akun | Deep link/QR mengikuti gateway |
| Kartu | Kredit/debit yang didukung gateway | Gunakan antarmuka provider; jangan menyimpan PAN/CVV |
| Gerai retail | Indomaret/Alfamart jika aktif | Tampilkan kode bayar dan masa berlaku |
| PayLater | Opsional P2 | Jangan dipromosikan sebagai pasti tersedia |

Daftar adalah target integrasi, bukan janji semua channel langsung aktif. Metode tambahan dapat membutuhkan aktivasi dan kelayakan merchant. QRIS dari aplikasi dompet yang kompatibel tidak sama dengan integrasi langsung setiap e-wallet. [Aktivasi Midtrans](https://docs.midtrans.com/docs/payment-methods), [contoh channel pada webhook](https://docs.midtrans.com/docs/https-notification-webhooks).

Server menentukan total dan membuat invoice. Redirect browser tidak membuktikan pembayaran. Webhook harus diverifikasi sesuai gateway, dicocokkan ke transaksi, mata uang dan nominal, lalu diproses idempotent. Peristiwa duplikat atau tidak berurutan tidak boleh menurunkan status paid atau menggandakan stok. Reconciliation ke provider menangani webhook yang terlambat. [Notifikasi Midtrans](https://docs.midtrans.com/docs/https-notification-webhooks).

Satu obligation boleh mempunyai beberapa attempts historis, tetapi hanya satu attempt aktif yang dapat dibayar. Pergantian metode harus membatalkan/memastikan expiry attempt lama sebelum membuka attempt baru. Pembayaran kedua yang telanjur berhasil dicatat sebagai kelebihan bayar dan masuk antrean refund; tidak menghasilkan order atau stok kedua.

Gateway timeout menghasilkan status verifikasi tertunda dengan retry aman. Tidak boleh menampilkan “gagal” lalu mengajak bayar ulang ketika charge pertama belum diketahui. Fake gateway boleh digunakan hanya pada mode development/test yang ditandai.

### FR-07 — DP dan pelunasan PO (P1)

DP adalah dua kewajiban pembayaran untuk pembelian yang sama, bukan produk kredit UltraStore. Pengaktifan per batch hanya setelah kebijakan bisnis ditetapkan dan skenario pembayaran diuji.

- Harga barang dikunci saat order. Default usulan DP 30%, dapat ditentukan pemilik per batch.
- DP = pembulatan ke atas dari persentase × subtotal barang setelah diskon.
- Ongkir saat DP adalah estimasi dan belum ditagih. Sebelum invoice pelunasan dibuat, pelanggan menerima biaya pengiriman final dan total baru.
- Pelunasan = sisa subtotal barang + ongkir final yang diterima pelanggan; tidak ada biaya tambahan tersembunyi.
- PO full payment menagih barang + ongkir yang dikunci saat checkout. Perubahan tarif kurir berikutnya menjadi tanggungan toko kecuali pelanggan meminta perubahan alamat/layanan dan menyetujui harga baru.
- DP valid mengamankan quota. Produk tidak dikirim sebelum DP dan balance sama-sama settled serta barang lolos QC.
- Deadline pelunasan awal: tujuh hari kalender sejak pemberitahuan siap dilunasi; konfigurasi disimpan sebagai snapshot. Reminder H-3 dan H-1 hanya sekali per event.
- Jika deadline lewat, tandai `balance_overdue` dan buat pekerjaan operator. Jangan otomatis menyita DP atau membebaskan alokasi sebelum kebijakan yang sah dan disetujui pelanggan dijalankan.

Contoh: barang Rp1.000.000; DP 30% = Rp300.000. Setelah barang siap, pelanggan menyetujui ongkir Rp25.000; invoice balance Rp725.000. Total pembayaran Rp1.025.000. Biaya merchant gateway bukan tagihan tambahan otomatis ke pelanggan.

**AC:** percobaan menekan pelunasan dua kali tidak menciptakan double charge; refund menelusuri DP dan balance per transaksi; flag nonaktif menghilangkan seluruh opsi DP dari UI publik.

### FR-08 — Pengiriman dan akses pesanan

Alamat mencakup nama penerima, nomor telepon, provinsi, kota/kabupaten, kecamatan, kode pos, alamat rinci, serta catatan opsional. Validasi ongkir berdasarkan berat/dimensi paket dan area kurir. Pilihan layanan menampilkan biaya dan estimasi, bukan janji mutlak.

Gunakan adapter shipping. Awal operasional dapat menggunakan tarif yang dikelola admin untuk area terbatas, atau API agregator/kurir setelah akses tersedia. Jika area tidak terlayani atau quote tidak tersedia, checkout berhenti dengan pesan yang membantu; tidak boleh mengganti ongkir menjadi nol.

Order menyimpan snapshot alamat dan tarif. Perubahan alamat setelah pembayaran membutuhkan revalidasi biaya dan jejak audit; perubahan setelah shipment dibuat diarahkan ke operator.

Tamu memperoleh akses melalui link acak bertanda tangan dan kedaluwarsa atau login email terverifikasi. Mengetahui nomor order saja tidak memberi akses PII. Invoice dapat dicetak; seluruh total bersumber dari snapshot order, bukan harga katalog terbaru.

### FR-09 — Pembatalan, refund, garansi

Kebijakan final berasal dari pemilik dan ditampilkan sebelum checkout. Saran default produk: pembatalan sebelum kirim dapat diajukan; batch dibatalkan toko menawarkan refund penuh atas pembayaran yang diterima; retur/garansi memakai pemeriksaan dan keputusan operator. Ini rancangan operasional, bukan penetapan hak hukum pelanggan.

Refund memiliki requested, approved, processing, succeeded, failed. “Refund berhasil” hanya setelah konfirmasi provider atau bukti penyelesaian manual yang diaudit. Dana yang bisa dikembalikan tidak melebihi penerimaan sah dikurangi refund yang telah berhasil/dipesan.

Partial refund harus mengalokasikan nominal ke item dan shipping dengan jelas. Refund uang tidak otomatis restock barang. Untuk DP, refund dibagi ke transaksi asal dan dilacak satu per satu. Dashboard membedakan order dibatalkan dari uang telah kembali.

### FR-10 — Admin dan komunikasi

Peran: owner, operations, catalog editor, support, customer. Semua izin ditegakkan server-side. Owner mengatur integrasi/refund; operations mengurus inventory, batch, shipment; editor hanya katalog/konten; support melihat data minimum dan membuat permintaan bantuan tanpa mengubah nilai pembayaran.

Admin menyediakan pencarian order, antrean pembayaran bermasalah, batch terlambat, stok rendah, refund tertunda, pelunasan jatuh tempo, dan pengiriman yang siap diproses. Perubahan harga tidak mengubah order lama. Koreksi pembayaran tidak dapat dilakukan lewat tombol “Mark paid” biasa.

Email wajib: order/invoice dibuat, pembayaran terkonfirmasi, expiry, ETA berubah, barang dikirim, refund selesai. P1 menambah DP dan pelunasan. Gunakan transactional outbox, deduplication dan retry; kegagalan email tidak membatalkan order atau mengulangi charge.

### FR-11 — Riset produk dan gambar mandiri oleh agent

Hermes harus mencari informasi dan gambar peripheral secara mandiri melalui alat pencarian/browser yang tersedia. Agent tidak boleh sekadar mengisi nama fiktif atau memakai foto peripheral mirip. Nama brand, nama produk resmi, generasi, nomor model/part number bila tersedia, varian warna, layout, dan jenis switch harus sesuai dengan barang pada gambar.

Prioritas sumber: halaman resmi produsen → katalog/media kit resmi → feed supplier atau distributor yang diberikan toko. Halaman reseller hanya menjadi sumber pembanding; bila sumber primer tidak tersedia, simpan item sebagai draft dengan status perlu verifikasi. Marketplace tidak menjadi sumber otomatis untuk klaim garansi resmi, ketersediaan toko, atau foto varian.

Setiap SKU mempunyai evidence record: `brand_canonical`, `official_product_name`, `manufacturer_model`, `manufacturer_part_number` jika tersedia, `variant_attributes`, `source_product_url`, `source_image_url`, `source_type`, `checked_at`, `field_evidence`, `image_variant_match`, `usage_permission_status`, dan `review_status`. Part number yang tidak ditemukan tetap null; jangan dikarang. Nomor SKU internal UltraStore boleh dibuat dan harus dibedakan dari nomor produsen.

Workflow: temukan calon produk → baca halaman resmi → cocokkan seluruh atribut pembeda → periksa gambar secara visual dan konteks sumber → catat bukti → cek izin pemakaian aset dari lisensi/media kit/otorisasi supplier → optimalkan salinan yang boleh digunakan → masukkan ke draft catalog → validasi kelengkapan → aktifkan hanya bila data bisnis tersedia.

Ketepatan identitas dan izin pemakaian gambar adalah dua pemeriksaan terpisah. Gambar yang bisa diakses publik belum otomatis boleh digunakan secara komersial. Jika izin belum jelas, simpan URL sumber dan status pending; gunakan placeholder berlabel pada staging, bukan menerbitkan aset tersebut sebagai foto toko.

Ketentuan kualitas:

- Foto utama wajib menunjukkan varian yang dipilih. Foto keyboard ANSI tidak boleh dipakai untuk SKU ISO tanpa penjelasan; foto warna putih bukan representasi SKU hitam.
- Jangan membuat gambar AI sebagai foto produk nyata, menghapus watermark, mengubah logo, atau merekayasa detail produk. Foto ilustrasi editorial hanya boleh terpisah dan berlabel.
- Brand memakai ejaan resmi dan casing yang konsisten; product title tidak memakai keyword stuffing.
- Spesifikasi yang tidak terverifikasi dikosongkan/ditandai belum tersedia. Jangan menyimpulkan polling rate, sensor, switch, konektivitas, atau dukungan OS hanya dari bentuk produk.
- Harga jual UltraStore, stok, kuota PO, ETA, dan garansi toko berasal dari pemilik/supplier terverifikasi; tidak disalin dari stok/harga toko lain sebagai fakta bisnis UltraStore.
- Simpan gambar yang berizin di storage sendiri dengan alt text yang akurat, rasio konsisten, dan metadata sumber. Hindari ketergantungan hotlink retailer.
- Pada P0, target riset awal 12 calon produk lintas minimal empat kategori. Ini target riset, bukan kewajiban mengarang 12 produk aktif. Publikasikan hanya kandidat yang lolos seluruh gate; jumlah lebih kecil diterima jika bukti memang terbatas.

**AC:** semua SKU yang dipublikasikan mempunyai brand/nama/model/varian terverifikasi, gambar cocok, status izin jelas, dan data usaha lengkap. Kandidat ambigu tidak muncul sebagai barang siap dibeli. Audit sampel 100% dari katalog awal dilakukan sebelum launch.

## 7. Model status dan invariant

Pisahkan status pembayaran, order, batch, dan fulfillment. Satu field `status` tidak cukup.

| Entitas | Status minimum |
| --- | --- |
| Payment attempt | created, pending, succeeded, failed, expired, cancelled |
| Payment obligation | unpaid, partially_paid, paid, overdue; saldo diturunkan dari ledger |
| Order | pending_payment, confirmed, on_hold, cancelled, completed |
| Allocation | reserved, committed_po, allocated_stock, released, consumed, exception |
| Fulfillment | unallocated, waiting_supplier, received_qc, ready_to_ship, shipped, delivered, returned |
| Batch | draft, scheduled, open, closed, inbound, received, completed, cancelled; `delayed` adalah flag |
| Refund | requested, approved, processing, succeeded, failed |

Refund/chargeback adalah ledger terpisah; payment attempt yang succeeded tetap menjadi catatan penerimaan historis. Financial status pelanggan menampilkan efek refund dengan benar.

Invariant wajib:

1. Stok tersedia dan kuota tersedia tidak negatif.
2. Setiap perpindahan inventory hanya terjadi sekali per business event.
3. Fulfillment hanya boleh dimulai bila tagihan yang disyaratkan lunas dan item dialokasikan.
4. Harga order, kebijakan, alamat, spesifikasi varian penting, serta tanggal ETA saat membeli disimpan sebagai snapshot.
5. Browser tidak berwenang menentukan harga, status paid, role, quota, atau diskon.
6. Order cancelled tidak boleh aktif kembali karena event stale; pembayaran terlambat masuk alur exception.
7. Total uang menggunakan integer rupiah; parsing nominal provider yang berbentuk desimal harus tepat, tanpa floating point.
8. Refund sukses + refund yang sedang dicadangkan tidak melampaui pembayaran yang refundable.
9. Tanggal bisnis memakai zona waktu toko yang dikonfigurasi, default Asia/Jakarta; DB menyimpan UTC.
10. Tidak ada data pelanggan/secret dalam event analytics, URL publik, fixture, atau log aplikasi umum.

## 8. Arsitektur yang disarankan

Jika repo sudah punya stack yang sehat, lanjutkan stack itu. Untuk repo baru, rekomendasi awal adalah modular monolith: Next.js App Router + TypeScript, PostgreSQL, ORM bertipe, object storage untuk gambar, provider autentikasi/library yang terpelihara, dan worker untuk jobs. Hindari microservice tanpa kebutuhan nyata. App Router mendukung pemisahan komponen server/client serta route handlers; versi stabil kompatibel dipilih dan dikunci saat implementasi. [Dokumentasi Next.js](https://nextjs.org/docs/app).

Komponen UI boleh memakai primitive yang accessible, tetapi seluruh styling harus mengikuti 02-DESIGN-BRIEF.md. CSS variables menjadi sumber token; Tailwind opsional jika sesuai repo.

Modul: catalog, pricing, inventory, preorder, checkout, payments, fulfillment, identity, notifications, admin. Efek payment, inventory, dan outbox menggunakan transaksi DB dan unique constraints. Row locking atau operasi kondisional atomik harus mencegah race, dengan retry terbatas untuk deadlock. [PostgreSQL locking](https://www.postgresql.org/docs/current/explicit-locking.html).

Job minimum: invoice expiry dengan pengecekan provider, payment reconciliation, notifikasi ulang, PO deadline, dan alert stok/ETA. Job harus tetap berjalan ketika tidak ada pengguna membuka website; bukan timer browser atau pekerjaan fire-and-forget dalam request.

Adapter payment: createAttempt, getStatus, cancelAttempt, verifyEvent, requestRefund, reconcile. Adapter shipping: quote, createShipment jika didukung, track. Mock dan production dipisahkan konfigurasi dan credential.

### Model data minimum

| Kelompok | Entitas / catatan |
| --- | --- |
| Katalog | Product, Variant, Category, Brand, Media, SpecDefinition, Offer |
| Inventory | StockBalance, StockMovement, Reservation; unique business-event key |
| PO | PreorderBatch, BatchVariantQuota, BatchUpdate, PreorderCommitment |
| Checkout | Cart, CartItem, CheckoutSession, CheckoutGroup; Offer ID eksplisit |
| Pesanan | Order, OrderItem, AddressSnapshot, PolicySnapshot, PriceSnapshot |
| Keuangan | PaymentObligation, PaymentAttempt, PaymentEvent, Refund, RefundAllocation |
| Fulfillment | Shipment, ShipmentItem, Receipt, ReturnRequest |
| Akses | User, Role, GuestAccessToken; token tersimpan sebagai hash |
| Operasional | AuditLog, OutboxEvent, JobRun, StoreSettings |

Kunci unik: SKU, order reference, provider transaction ID, webhook dedupe key, idempotency key per operasi dan principal, business event inventory. Constraint total/quantity nonnegative dan relasi DB wajib; validasi UI tidak cukup.

### Kontrak API konseptual

- `GET /api/products`, `GET /api/products/:slug`, `GET /api/drops/:slug`.
- `POST /api/checkout/quote`: input item/offer, alamat, layanan; server memberi breakdown dan expiry quote.
- `POST /api/checkout/groups/:id/orders`: validasi quote, buat order/reservasi dengan idempotency key.
- `POST /api/orders/:id/payment-attempts`: buat attempt untuk obligation yang benar.
- `POST /api/webhooks/payments/:provider`: endpoint provider tervalidasi, tidak memakai sesi pelanggan.
- `GET /api/orders/:id`: otorisasi pemilik order/guest token, no public cache.
- `POST /api/admin/batches/:id/updates`, `POST /api/admin/receipts`, `POST /api/admin/refunds`.

Nama endpoint boleh menyesuaikan repo; semantik, otorisasi, validasi, dan idempotency wajib dipertahankan.

## 9. Kualitas, keamanan dan pengukuran

Target rilis: responsive dari 360 sampai 1920 px; keyboard navigation; focus terlihat; label form; error terhubung ke field; teks status selain warna. Target aksesibilitas WCAG 2.2 AA untuk alur inti dan kontras teks normal minimal 4,5:1. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Budget awal: median Lighthouse mobile dari tiga run terkontrol ≥90 performance pada home, katalog, PDP; p75 field LCP ≤2,5 detik, INP ≤200 ms, CLS ≤0,1 setelah trafik cukup. Ukur checkout dengan integrasi gateway secara terpisah; jangan mengklaim field score sebelum ada data. Optimalkan ukuran gambar, reserve aspect ratio, cache katalog, dan jangan cache halaman pesanan privat.

Wajib: validasi server, rate limiting autentikasi/checkout, proteksi CSRF yang sesuai arsitektur, sanitasi konten admin, validasi upload tipe/ukuran, role server-side, TLS production, cookie aman, secret di environment/secrets manager, backup terjadwal dan satu uji restore staging. Gunakan library autentikasi yang terpelihara; jangan menciptakan kriptografi/password system sendiri.

Log terstruktur memakai correlation ID tanpa PII/secret. Alert untuk webhook gagal berulang, payment mismatch, inventory exception, refund gagal, job berhenti, dan email tertahan. Rekonsiliasi harian membandingkan ledger internal dengan provider.

Analytics: view_product, select_variant, add_to_cart, begin_checkout, select_shipping, payment_pending, purchase_confirmed, preorder_committed, refund_succeeded. Event purchase hanya dari server sekali setelah pembayaran valid, bukan return URL. Simpan analitik finansial DP terpisah dari order count dan gross merchandise value.

Target awal adalah hipotesis internal, bukan klaim performa: oversell 0; charge duplikat dari aplikasi 0; semua perubahan ETA tercatat; seluruh order berbayar dapat direkonsiliasi. Setelah dua minggu trafik nyata, ukur baseline add-to-cart, checkout completion, penyebab payment failure, dan ketepatan fulfillment sebelum menetapkan target pertumbuhan.

## 10. Skenario penerimaan wajib

| ID | Skenario | Bukti yang diharapkan |
| --- | --- | --- |
| T01 | Ready stock → Beli sekarang → bayar valid | Satu order, satu alokasi, receipt, siap proses |
| T02 | Dua pembeli mengambil unit terakhir | Satu berhasil; satu pesan stok habis; saldo tidak negatif |
| T03 | PO full payment | Quota committed, status menunggu supplier, ETA tersimpan |
| T04 | Batch tutup/quota habis | Tidak ada invoice baru yang valid |
| T05 | Cart READY + dua batch PO | Tiga order/ongkir; pembayaran satu tidak melunasi lainnya |
| T06 | Webhook duplikat/tidak berurutan | Satu efek bisnis; paid tidak kembali pending |
| T07 | Return URL sukses tanpa webhook sah | UI memverifikasi; order belum dianggap paid |
| T08 | Pembayaran terlambat setelah expiry | Alokasi ulang aman atau exception/refund, tanpa oversell |
| T09 | Ubah nominal/SKU/role dari browser | Ditolak server; tidak mengubah harga atau hak akses |
| T10 | Refund parsial, retry, provider error | Saldo tepat, audit lengkap, sukses hanya terkonfirmasi |
| T11 | Penerimaan PO sebagian, QC gagal | Hanya unit valid dialokasikan; tidak memicu kirim semua |
| T12 | ETA PO berubah | Riwayat tersimpan dan notifikasi satu kali per perubahan |
| T13 | Link order orang lain / nomor order tebakan | Akses ditolak tanpa membocorkan alamat/telepon |
| T14 | Gateway timeout / shipping API down | Status jujur, retry aman, ongkir tidak menjadi gratis |
| T15 | Keyboard + mobile checkout | Seluruh langkah dapat diselesaikan dan fokus terlihat |
| T16 | DP Rp300.000 + balance Rp725.000 | Total Rp1.025.000; hanya kirim setelah lengkap; P1 |
| T17 | Dua attempt sama-sama terbayar | Kelebihan bayar terdeteksi; tidak ada alokasi ganda |
| T18 | Backup restore / worker restart | Data pulih; job dilanjutkan tanpa menggandakan efek |
| T19 | Gambar/model/brand/warna tidak cocok | Item ditahan sebagai draft, tidak dipublikasikan |
| T20 | Data model benar tetapi izin gambar belum jelas | Sumber dicatat; aset tidak diterbitkan secara komersial |

Uji unit untuk aturan uang/status; integration test DB nyata untuk race dan constraints; E2E untuk alur pelanggan/admin; sandbox gateway untuk kontrak provider. Screenshot saja bukan bukti transaksi benar.

## 11. Tahapan dan gerbang peluncuran

Urutan: audit repo → fondasi → desain + katalog → inventory/PO → checkout → payment + fulfillment/admin → QA staging → produksi. Backlog lengkap terdapat di 03-PAPERCLIP-BACKLOG.md. Durasi ditentukan setelah audit; tidak menjanjikan deadline tanpa kapasitas dan akses yang diketahui.

Launch hanya setelah semua P0 lulus dan bukti tersedia. Dependency eksternal berikut harus disiapkan pemilik: akses repo, katalog/harga/foto yang sah, alamat asal, akun gateway/channel aktif, aturan shipping, domain, hosting DB/app/worker, email domain, kontak layanan, kebijakan PO/refund/garansi/privasi final.

Jika credential belum tersedia, hasil maksimal yang jujur adalah **staging/demo teruji**, bukan toko siap menerima uang. Tampilkan sandbox banner dan nonaktifkan transaksi nyata pada mode demo. Tidak mengarang produk asli, testimoni, rating, kuota, label distributor resmi, atau konfirmasi pembayaran.

Definition of done: kode tersimpan dalam repo target, PR/perubahan dapat ditinjau, migration dan rollback terdokumentasi, CI lulus, QA evidence tersedia, setup/runbook lengkap, known limitations disebutkan, dan semua dependency peluncuran ditutup. Keputusan produksi mengikuti otorisasi pemilik yang berlaku pada sesi implementasi.

## 12. Rujukan dan batas verifikasi

Seluruh link dokumentasi diperiksa pada 28 September 2026. Versi API/channel dapat berubah; Hermes wajib memverifikasi ulang sebelum implementasi. Keputusan palette, fitur, aturan kelompok checkout, dan prioritas dalam paket ini adalah rekomendasi produk untuk UltraStore, bukan isi yang ditemukan di repo.

Panduan Hermes/Paperclip terdapat pada prompt handoff. Paket ini belum diunggah ke repo, belum membuat issue Paperclip, dan belum mengonfigurasi akun pembayaran.
