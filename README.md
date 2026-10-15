# English untuk Guru Cikal

Web belajar bahasa Inggris untuk Michelle: level A1 sampai C2, 1170 kosakata guru Cikal / Cambridge / SEN-ABK. Berupa web statis (HTML, CSS, JavaScript biasa), tanpa server dan tanpa proses build.

## Struktur (versi datar)
Semua file sejajar di akar repositori, tanpa folder: `index.html`, `style.css`, `manifest.webmanifest`, `sw.js`, `01-data.js` sampai `12-app.js` (dimuat berurutan, jangan ubah urutannya), dan empat file ikon `.png`.

## Memasang di GitHub Pages / Vercel
1. Pilih **semua file** lalu unggah ke akar repositori (Add file > Upload files). Tidak perlu folder.

1. Ekstrak zip, lalu unggah **seluruh isi folder** (termasuk folder `css`, `js`, `icons`) ke repositori.
2. Settings > Pages > Branch `main`, folder `/ (root)`.
3. Buka alamat `https://namakamu.github.io/namarepo`. Vercel juga bisa: impor repositori, tanpa pengaturan build.

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
- **Beranda**: ringkasan belajar hari ini, statistik, tes level terakhir, penguasaan per level, jalan pintas, papan semangat
- **Belajar**: Kartu, Ulang, Audio, Daftar, Kamus
- **Latihan**: Latihan (arti, dengar, isi kalimat, susun kalimat, ejaan), Lafal, Catatan
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
