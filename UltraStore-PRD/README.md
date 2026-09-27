# UltraStore — Paket PRD & rencana eksekusi Hermes/Paperclip

Paket ini siap diberikan ke Hermes sebagai spesifikasi dan instruksi pelaksanaan proyek UltraStore.

## Isi

| File | Kegunaan |
| --- | --- |
| [01-PRD.md](01-PRD.md) | Fitur, aturan ready stock/PO, pembayaran, data, arsitektur, keamanan, 20 skenario uji |
| [02-DESIGN-BRIEF.md](02-DESIGN-BRIEF.md) | Konsep Precision Workshop, warna, typography, komposisi halaman, anti-slop checklist |
| [03-PAPERCLIP-BACKLOG.md](03-PAPERCLIP-BACKLOG.md) | 20 task implementasi dengan dependensi, hasil dan kriteria selesai |
| [04-HERMES-CONTROLLER-PROMPT.md](04-HERMES-CONTROLLER-PROMPT.md) | Prompt siap tempel agar Hermes mengendalikan eksekusi melalui Paperclip |

## Cara memulai

1. Ekstrak atau kirim seluruh folder ini ke host/workspace yang dapat dibaca Hermes.
2. Pastikan koneksi Hermes–Paperclip milik Anda dan akses repo tersedia. Jika belum, prompt akan meminta detail minimum yang benar-benar diperlukan; jangan menempelkan credential ke dokumen.
3. Salin bagian **PROMPT SIAP TEMPEL** dari file 04 dan sertakan file 01–03.
4. Hermes mengaudit repo, membuat/memperbarui project serta task Paperclip, lalu mengerjakan backlog dan menyimpan bukti hasil.

## Keputusan utama

- Nama: **UltraStore**. Konsep: **Precision Workshop**. Tagline: **Gear pilihan. Setup dengan karakter.**
- Warna: ivory hangat, graphite, hijau petrol, burnt orange.
- Wajib launch: ready stock, Beli sekarang, PO full payment, multimetode payment sesuai merchant, admin dan fulfillment.
- DP/pelunasan, wishlist, compare dan editorial tambahan dikerjakan pada P1.
- Hermes mencari gambar dan data peripheral sendiri, memverifikasi brand/nama/model/varian serta mencatat sumber. Barang ambigu tetap draft.
- Cart campuran dipecah menjadi pembayaran dan pengiriman per kelompok yang dijelaskan sebelum checkout.
- Hermes berperan sebagai controller Paperclip, menggunakan agent yang tersedia dan menguji hasil sebelum menutup task.

## Status faktual paket

Disusun pada 28 September 2026. Belum ada perubahan yang dikirim ke GitHub, belum ada issue dibuat di instance Paperclip Anda, dan belum ada gateway dihubungkan.

Saat pemeriksaan, Git target tidak menampilkan refs; API publik GitHub mengembalikan 404. Isi dan stack repo belum terverifikasi. Rekomendasi stack di PRD bersifat kondisional dan harus didahului audit Hermes.

Katalog nyata, harga/stok UltraStore, credential, alamat pengiriman dan kebijakan usaha belum diberikan. Rencana mencakup cara melanjutkan dengan draft/staging secara jujur dan apa yang dibutuhkan sebelum menerima transaksi nyata.
