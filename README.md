# English untuk Guru Cikal

Web belajar bahasa Inggris untuk Michelle: level A1 sampai C2, 1170 kosakata guru Cikal / Cambridge / SEN-ABK. Antarmuka memakai HTML, CSS, dan JavaScript biasa tanpa proses build. Login dan sinkron memakai Supabase; fitur Speaking AI memakai satu Vercel Function.

## Struktur (versi datar)
File antarmuka berada di akar repositori: `index.html`, `style.css`, `manifest.webmanifest`, `sw.js`, `01-data.js` sampai `14-speaking.js` (dimuat berurutan sesuai `index.html`), dan file ikon `.png`. `api/speaking.js` adalah endpoint server untuk Gemini dan tidak masuk ke cache offline.

## Memasang di GitHub Pages / Vercel
Vercel: impor repositori, tanpa pengaturan build. Speaking AI membutuhkan Vercel karena GitHub Pages tidak menjalankan `api/speaking.js`.

## Pasang seperti aplikasi dan mode offline
- Harus lewat alamat **https** (GitHub Pages dan Vercel sudah https). Tidak jalan jika file dibuka langsung dari komputer.
- Android/Chrome: menu titik tiga > Pasang aplikasi. iPhone: Safari > Bagikan > Tambah ke Layar Utama.
- Setelah dibuka sekali dengan internet, web bisa dibuka tanpa internet. Yang tetap butuh internet: font dari Google (ada font cadangan), dan pengenalan suara di tes Lafal.

## Memperbarui web
1. Ubah file yang perlu, lalu commit.
2. **Naikkan `VERSION` di `sw.js`** (untuk membersihkan cache lama; file web sendiri sudah diambil dari internet dulu) (misalnya `v3-2026-11`), kalau tidak, HP yang sudah memasangnya bisa tetap menampilkan versi lama dari cache.
3. Pengguna akan melihat versi baru setelah menutup dan membuka web dua kali.
4. Jika menambah file JS baru, tambahkan juga ke daftar `CORE` di `sw.js` dan ke `index.html`.


## Akun dan login
- Login berupa **pintu depan sederhana** di sisi browser (kode statis), bukan pengamanan sungguhan. Kata sandi disimpan sebagai hash, tetapi siapa pun yang membaca kode bisa mencoba menebaknya.
- Ada dua peran: pengguna (nama MICHELLE) dan **admin** (nama ADMIN). Panel Admin (menu Alat) hanya mengatur web di browser tempat admin masuk. Admin tidak bisa melihat atau mengubah data di perangkat lain, karena semua data tersimpan di browser masing-masing.
- Untuk kontrol admin yang sungguhan (melihat progres banyak pengguna, mengelola akun), diperlukan layanan server seperti Firebase atau Supabase.
- Mengganti kata sandi berarti mengganti hash di `js/12-app.js` (di versi datar: `12-app.js`). Jangan menyimpan kata sandi asli di kode.

## Data
- Progres tersimpan di **localStorage browser** (per perangkat dan per alamat web). Mengganti alamat web berarti mulai dari nol, kecuali dipulihkan lewat cadangan.
- Cadangkan lewat menu **Alat > Cadangan & pemulihan data**. Cadangan berisi progres, kata sendiri, dan catatan.
- Login hanyalah pintu depan sederhana (kode statis), bukan pengamanan sungguhan.
- Jangan menulis data pribadi murid yang asli di tab Catatan.

## Menu
Di komputer, menu berada di panel kiri. Di HP, menu berada di bilah bawah dengan sub-tab di atas isi.
- **Beranda**: rencana belajar mingguan otomatis (dibuat dari hasil Tes Level), ringkasan hari ini, statistik, tes level terakhir, penguasaan per level, jalan pintas, papan semangat
- **Belajar**: Kartu, Ulang, Audio, Daftar, Kamus
- **Latihan**: Latihan (arti, dengar, isi kalimat, susun kalimat, ejaan), Kesalahan (buku kesalahan: jawaban salah dicatat dan dilatih ulang sampai benar 3 kali berturut-turut), Lafal, Speaking AI, Catatan
- **Tes**: Tes Level (42 soal gaya Cambridge), Kemajuan (grafik)
- **Alat**: Kata Saya, Template, Admin (khusus admin), Cadangan, Pasang aplikasi

## Supabase (login, sinkron, dasbor admin)
- Login memakai **Supabase Auth** (email dan password). Akun dibuat manual di dashboard Supabase (Authentication > Users); pendaftaran bebas sebaiknya dimatikan.
- Skema database dan aturan akses (RLS) ada di `supabase-setup.sql`. Tabel: `profiles`, `progress`, `notes`, `app_settings`.
- Progres tersinkron otomatis tiap beberapa detik setelah ada perubahan, dan digabung saat masuk dari perangkat lain. Tanpa internet, data tetap tersimpan di perangkat dan dikirim saat online.
- **Admin** dapat melihat ringkasan progres semua pengguna, membuat pengumuman, dan mematikan fitur untuk semua pengguna. **Catatan guru tidak bisa dibaca admin** (dijaga oleh RLS).
- `config.js` berisi alamat proyek dan kunci **publishable** (aman ditaruh di web). **Jangan pernah** menaruh kunci `secret` atau `service_role` di sini.
- Jika `config.js` kosong atau pustaka tidak termuat, web memakai mode lokal tanpa server.
- Pustaka `supabase.js` adalah supabase-js 2.117.2, disimpan di web sendiri agar bisa dipakai offline.
- Mengganti password: lewat Supabase (Authentication > Users > klik pengguna > Send password recovery / Update).

## Dua akun
- **MICHELLE** (tema pink) dan **ADMIN** (tema biru-ungu, lencana ADMIN, panel Admin) memakai **data yang terpisah** di browser yang sama.
- Pengaturan fitur yang dimatikan admin berlaku untuk menu pengguna di browser yang sama.

## Catatan teknis
- Suara memakai Web Speech API bawaan browser. Kualitas dan suara bahasa Indonesia berbeda antar perangkat.
- Tes Lafal butuh Chrome atau Edge, internet, dan izin mikrofon.
- Tes Level adalah tes latihan, bukan sertifikat CEFR resmi.

## Speaking AI
- Tab **Speaking AI** memakai Gemini Flash untuk membalas percakapan dan memberi koreksi bahasa Inggris singkat. Riwayat chat hanya berada di memori halaman dan tidak disimpan ke Supabase.
- Input suara memakai Web Speech API di Chrome/Edge; browser mengubah ucapan menjadi teks. Suara balasan memakai `speechSynthesis` bawaan browser. Versi ini tidak memakai API audio langsung.
- Permintaan AI hanya diterima dengan access token Supabase yang valid. Gemini API key disimpan di server sebagai secret, tidak ditaruh di `config.js` atau kode browser.
- Di Vercel, buka Project Settings > Environment Variables, lalu tambahkan `GEMINI_API_KEY` sebagai **Secret** untuk Production (dan Preview bila diperlukan). Redeploy sesudah menyimpannya. `GEMINI_MODEL` opsional; jika kosong, endpoint memakai `gemini-2.5-flash`.
- Endpoint membatasi jawaban hingga 260 token dan menerapkan batas best-effort 12 permintaan per menit per instance. Atur batas pemakaian Gemini di Google AI Studio/Cloud jika billing diaktifkan.
- Jangan masukkan nama atau informasi pribadi murid. Kuota gratis Gemini dapat terbatas dan Google menyatakan data pada tier gratis dapat dipakai untuk meningkatkan produknya; cek [ketentuan dan harga Gemini API](https://ai.google.dev/gemini-api/docs/pricing) sebelum penggunaan rutin.
- URL Supabase dan publishable key di `api/speaking.js` harus cocok dengan nilai publik di `config.js` jika proyek Supabase diganti.

## Rencana belajar dan buku kesalahan
- Buku kesalahan dan rencana mingguan tersimpan di `progress.data` (JSON) dan ikut tersinkron; tidak perlu perubahan SQL.
- Ringkasan untuk admin (`progress.summary`) memuat jumlah soal salah, 5 kata tersulit, aktivitas 7 hari, dan kemajuan rencana. Daftar soal salah lengkap tidak terlihat admin.
- Rencana dibuat ulang tiap Senin dan setelah Tes Level selesai. Tugas otomatis dihitung dari penghitung mingguan (`meta.pc`).

## Laporan kesalahan
- Tombol 🚩 ada di Kartu, Ulang, soal Latihan, Buku kesalahan, baris Daftar, dan Template. Laporan berisi kategori, catatan opsional, dan konteks item (kunci jawaban ikut tersimpan untuk peninjau, tetapi tidak ditampilkan ke pelapor).
- Mode server: laporan masuk ke tabel `reports` (jalankan `supabase-laporan.sql` sekali). Jika offline atau gagal, laporan diantre di perangkat dan dikirim otomatis saat tersambung.
- Admin meninjau di menu Admin: laporan sejenis digabung (dengan jumlah pelapor), bisa ditandai selesai, disalin sebagai daftar, atau diunduh CSV.
- Mode lokal (tanpa server): laporan tersimpan di perangkat dan terlihat di panel Admin perangkat yang sama.
