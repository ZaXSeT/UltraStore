# UltraStore — Precision Workshop

## 1. Ide visual

Bayangkan katalog peralatan presisi bertemu toko desain independen: bidang ivory, huruf graphite, foto peripheral yang terasa nyata, garis tipis seperti lembar spesifikasi, dan aksen hijau petrol. Komposisi editorial memberi ruang pada produk; detail kecil menyampaikan kualitas tanpa dekorasi berlebihan.

Kepribadian: tenang, teknis, hangat, terkurasi. Modern melalui tipografi, proporsi, foto, dan interaksi yang tepat. Hindari bentuk visual yang sekadar meniru template landing page AI.

Nama publik selalu **UltraStore**. Wordmark berupa lettering sederhana dengan sentuhan potongan pada huruf U; favicon dapat memakai monogram U berbentuk jejak sirkuit yang sangat sederhana. Jangan memakai ikon robot, bintang AI, atau petir generik sebagai identitas utama.

Kalimat utama: **“Gear pilihan. Setup dengan karakter.”**

Kalimat pendukung: “Temukan peripheral untuk cara kamu bekerja dan bermain. Pilih ready stock atau ikuti pre-order dengan progres yang jelas.”

## 2. Warna

| Token | Nama | Hex | Penggunaan |
| --- | --- | --- | --- |
| `--canvas` | Warm Ivory | `#F4F1EA` | Latar utama, sekitar 65–75% halaman |
| `--surface` | Chalk | `#FFFFFF` | Panel form, drawer, area foto tertentu |
| `--ink` | Graphite | `#202724` | Heading, body utama, footer |
| `--muted` | Slate Olive | `#59635E` | Teks sekunder dan metadata |
| `--brand` | Petrol Green | `#184E46` | CTA primer, link penting, status ready |
| `--brand-soft` | Mist | `#E4ECE6` | Background status dan panel ringan |
| `--accent` | Burnt Orange | `#A84329` | Penanda PO, nomor bab, detail editorial |
| `--accent-soft` | Clay Wash | `#F4E5DC` | Background label PO |
| `--line` | Warm Grey | `#D9DDD5` | Pemisah dekoratif dan grid |
| `--control-border` | Mid Slate | `#78857C` | Batas input/kontrol yang perlu terlihat |
| `--error` | Brick | `#A12D2D` | Error, selalu disertai teks/icon |

CTA: teks putih di Petrol Green. Link teks: Petrol Green di Ivory. Badge PO: Burnt Orange di Clay Wash. Border dekoratif boleh ringan; input yang bergantung pada border untuk identifikasi memakai control-border. Uji kontras kombinasi aktual termasuk disabled, focus, hover dan overlay sebelum shipping.

Aksen orange maksimal sekitar 5% halaman. Tidak ada gradient sebagai identitas utama. Dark mode ditunda; jangan menghabiskan fase pertama untuk dua tema.

## 3. Tipografi dan ritme

- Pilihan awal: **Manrope** untuk heading dan body, **IBM Plex Mono** untuk SKU, nomor batch, dan data kecil. Periksa lisensi/distribusi font, lalu host secara lokal jika diizinkan.
- Fallback: system sans dan monospace. Halaman tetap rapi jika font gagal dimuat.
- H1 desktop 60–68 px, mobile 36–42 px; heading berat 600–700, letter spacing sekitar -0,03em.
- Body 16 px dengan line-height 1,55; metadata minimal 12–13 px, bukan teks mikro dekoratif yang sulit dibaca.
- Harga menggunakan tabular numbers. Rupiah tanpa desimal: Rp1.249.000.
- Grid desktop 12 kolom, konten maksimal 1280 px, margin 64–80 px; mobile margin 20 px.
- Spacing berbasis 4 px, section gap 72–96 px desktop dan 40–56 px mobile.
- Radius 4–8 px pada kontrol/panel; jangan membulatkan seluruh elemen menjadi pil.
- Shadow hanya untuk layer yang terangkat, misalnya drawer/dialog. Kartu produk cukup pemisah atau hover halus.

## 4. Homepage sebagai komposisi nyata

### Area pertama, desktop 1440 px

Announcement strip tipis dengan satu informasi nyata: “Pengiriman dari [kota toko]” atau jadwal PO yang valid. Bila informasi belum ada, hilangkan strip. Jangan mengisi janji pengiriman palsu.

Header 80 px: wordmark kiri, navigasi kategori tengah, pencarian yang mudah dikenali, akun, dan keranjang kanan. Bar kategori dapat memuat Keyboard, Mouse, Audio, Desk Gear, Pre-order.

Hero 7/5 kolom:

- Kiri: label kecil `ULTRASTORE / GEAR SELECTION`, headline dua atau tiga baris, satu paragraf pendek, tombol **Belanja ready stock**, link **Lihat pre-order**.
- Kanan: satu foto keyboard atau desk setup yang terverifikasi/berizin pada latar polos. Sisipkan keterangan model dan tiga spesifikasi faktual dalam kolom tipis di bawah foto, bukan hotspot acak di atas produk.
- Baseline hero berisi nomor editorial `01 / DESK ESSENTIALS` dan garis horizontal; ini bahasa visual UltraStore, bukan carousel promosi.

Jangan menutupi foto dengan banyak badge atau membuat hero setinggi layar hingga katalog tidak terlihat.

### Urutan isi

1. **Ready for your desk** — empat pilihan ready stock, judul Indonesia “Siap masuk setup kamu”. Setiap kartu memuat foto, brand, nama, dua atribut utama, harga, status.
2. **The next drop** — satu rilisan PO utama dalam panel lebar, foto kiri, rentang ETA dan progres kanan. Tombol “Lihat batch”. Panel hanya muncul jika ada batch relevan.
3. **Pilih berdasarkan kebutuhan** — tiga tautan kurasi: “Meja kerja tenang”, “Main lebih ringan”, “Mulai mechanical”. Semua menuju filter/collection nyata; klaim rasa/suara harus punya sumber.
4. **Desk Notes** — P1: satu artikel unggulan dan dua judul kecil. Pada P0 boleh diganti panduan spesifikasi statis yang akurat.
5. Footer graphite: layanan, kebijakan, kontak nyata, metode pembayaran yang aktif, dan wordmark besar dengan whitespace.

### Mobile

Header ringkas dengan search yang tetap mudah dijangkau. Hero ditumpuk: headline → foto → CTA. Katalog dua kolom pada layar yang cukup lebar; pada 360 px pastikan nama/harga tidak saling bertabrakan. Filter membuka bottom sheet dengan tombol Terapkan dan Reset. Tidak ada horizontal overflow kecuali area yang jelas memang dapat digeser, misalnya tabel pembanding P1.

## 5. Kartu produk

Kartu tidak perlu terlihat seperti kartu dashboard. Foto mengisi area rasio 1:1 dengan produk tidak terpotong. Teks berada di bawah pada latar halaman.

Urutan:

1. Brand sebagai metadata yang terbaca.
2. Nama resmi + model, maksimal dua atau tiga baris tanpa menyembunyikan identitas penting.
3. Varian utama: contoh layout / warna / koneksi, hanya jika terverifikasi.
4. Harga varian atau “Mulai Rp…” yang benar.
5. Label tekstual **Ready stock** atau **Pre-order · Est. kirim [rentang]**.

Jangan menampilkan DP sebagai harga jual penuh. Jika DP aktif, tampilkan “Harga Rp1.000.000 · DP mulai Rp300.000” dengan hierarchy yang tidak menipu.

Hover dapat menukar ke foto kedua yang cocok. Pada touch, informasi tidak bergantung pada hover. Sold out masih dapat dilihat, tetapi aksi transaksi dinonaktifkan dan alasan terlihat.

## 6. Halaman produk

Desktop: galeri sekitar 58%, panel pembelian 42%. Panel dapat sticky selama tidak menutup footer. Mobile: galeri → identitas/harga → pilihan varian → status/ETA → CTA → detail.

Spesifikasi menggunakan tabel dua kolom atau kelompok key/value. Tulisan “Cocok untuk…” harus mengacu atribut nyata; jangan membuat ulasan pengalaman penggunaan bila tidak ada pengujian.

Pilihan ready stock dan PO berbentuk radio cards dengan harga dan waktu pemenuhan masing-masing. Setelah varian berganti, reset pilihan offer jika tidak tersedia dan beri penjelasan.

PO menampilkan **Drop Ledger** bergaya catatan log: tanggal di kolom kiri, status dan penjelasan di kanan. Gunakan ringkasan “Update terakhir…” dengan timestamp nyata. Tahap belum terjadi ditampilkan sebagai rencana, bukan sukses.

## 7. Checkout

Prioritas: pengguna tahu barang apa, dikirim kapan, bayar berapa, dan apa langkah berikutnya.

Desktop dua kolom: form 7 kolom, ringkasan 5 kolom. Mobile satu kolom. Kelompok READY dan setiap batch PO memiliki judul, item, ongkir, status pembayaran, serta tombol bayar sendiri. Copy sebelum pembayaran: “Barang ready stock dan setiap batch pre-order diproses sebagai pesanan terpisah.”

Metode pembayaran dikelompokkan dengan logo resmi berukuran seimbang. Hanya channel aktif yang muncul; jangan memajang puluhan logo untuk memberi kesan lengkap. Ketika berpindah ke UI gateway, pertahankan ringkasan order dan jalur kembali yang jelas.

State wajib: kosong, loading, quote berubah, gagal mengambil ongkir, stok berubah, payment pending, payment expired, payment verified, verifikasi bermasalah. Contoh copy: “Pembayaran sedang diverifikasi. Kamu tidak perlu membayar ulang.”

## 8. Gambar dan akurasi katalog

Agent bertanggung jawab menemukan foto peripheral yang benar. Sumber utama adalah produsen atau supplier yang diotorisasi. FR-11 pada PRD menjadi syarat penerbitan, bukan pilihan desain.

Gunakan sudut fotografi yang konsisten sejauh aset berizin tersedia: produk utuh, detail material, koneksi, dan foto dalam setup. Background polos hangat atau netral. Jangan mengubah warna produk agar cocok palette website.

Setiap aset mencatat nama brand, nama/model resmi, varian yang diwakili, sumber URL, tanggal pemeriksaan dan status izin. Alt text deskriptif, misalnya “[brand] [model] warna [warna], tampak atas”; isi hanya setelah identitas diverifikasi.

Jika tidak ada aset sah untuk hero, gunakan layout tipografi yang tetap bagus atau komposisi aset sah lain. Jangan menghasilkan foto AI dan memasangkannya dengan nama barang bermerek seolah-olah foto aslinya.

## 9. Gerak dan aksesibilitas

Transisi 140–220 ms untuk hover, disclosure dan drawer. Hero tidak membutuhkan animasi masuk panjang. Tidak ada parallax wajib, scroll hijacking, cursor kustom, teks marquee terus-menerus, atau animasi produk berputar tanpa fungsi.

Hormati reduced motion. Focus ring terlihat pada seluruh latar. Target sentuh utama sekitar 44 × 44 px. Accordion, dropdown, dialog dan filter dapat digunakan keyboard. Error form menyebut apa yang salah dan cara memperbaikinya.

## 10. Batas desain “tidak AI slop”

Tolak hasil jika salah satu berikut masih dominan:

- Gradient ungu-biru, glow neon, glassmorphism berlebihan.
- Semua section menjadi bento tiles dengan bentuk sama.
- Hero abstrak tanpa peripheral nyata dan tanpa kegunaan belanja.
- Emoji dijadikan ikon navigasi atau ikon kategori tidak konsisten.
- Testimoni palsu, bintang rating buatan, “10.000 pelanggan” tanpa data.
- Countdown palsu, diskon coret fiktif, atau “stok hampir habis” tanpa sumber stok.
- Copy “revolusioner”, “next-gen experience”, “unleash your potential” tanpa informasi produk.
- Semua tombol dan badge berbentuk pil, teks abu-abu terlalu pucat, whitespace ekstrem hingga informasi belanja hilang.

Keunikan harus berasal dari komposisi editorial, warna, fotografi, kualitas data, dan Drop Ledger yang berguna.

## 11. Bukti review desain

Simpan screenshot home, katalog, PDP ready, PDP PO, cart campuran, checkout, order tracking, dan admin utama pada lebar 390 px dan 1440 px. Uji overflow tambahan pada 360 px, 768 px, dan 1920 px.

Checklist review: konsistensi palette; hirarki nama/harga/status; kecocokan foto-varian; readability; focus/keyboard; empty/error states; CTA mobile; tidak ada klaim palsu; contrast test. Desain selesai jika dapat dipakai berbelanja, bukan hanya terlihat bagus pada satu screenshot hero.
