# Product Review

Evaluasi obyektif terhadap kondisi aktual produk **UKURAGA**.

---

## Current Maturity: MVP (Minimum Viable Product)

**UKURAGA berada di level MVP (Minimum Viable Product).**

**Alasan Evaluasi:**
Aplikasi ini sudah melampaui fase sekadar *Functional Prototype* karena seluruh alur penggunaan intinya (*core user loop*) sudah berfungsi secara utuh dari hulu ke hilir tanpa *mock data* atau tombol pura-pura:
1. Pengguna dapat langsung membuka aplikasi dan mencatat ukuran tubuh harian secara persisten.
2. Kalender harian, grafik tren riwayat (Recharts), dan galeri foto terkompresi berbasis IndexedDB berjalan dengan stabil.
3. Fitur kalkulasi kesehatan (BMI, WHR, WHtR, BMR, TDEE) bekerja secara matematis real-time.
4. Sistem penguncian keamanan lokal (PIN SHA-256 dan WebAuthn Biometrik) terbukti mengunci aplikasi saat berpindah tab.
5. Fitur wawasan AI berbasis Google Gemini telah dilengkapi arsitektur ganda (Server Key + BYOK).

Alasan mengapa aplikasi ini belum dapat diklasifikasikan sebagai *Production Ready* adalah karena masih bergantung pada CDN runtime untuk Tailwind CSS, belum memiliki fitur pencadangan lengkap (JSON export/import untuk seluruh foto dan pengaturan), dan ketiadaan automated test suite.

---

## What Works Well (Hal yang Berfungsi Sangat Baik)

- **Alur Pencatatan Harian yang Cepat**: Halaman *Record* dengan kalender horizontal dan baris input metrik yang otomatis menyelaraskan diri dengan tanggal terpilih memberikan pengalaman pencatatan yang responsif dan memuaskan.
- **Penyimpanan Foto Cerdas**: Keputusan memindahkan foto ke IndexedDB dan menerapkan kompresi kanvas HTML5 (resizing dan konversi WebP/JPEG) mencegah crash kuota `localStorage` yang sering menjangkiti aplikasi web lokal.
- **Kalkulasi Rasio Kesehatan Otomatis**: Pengguna tidak perlu menghitung manual; metrik BMR, TDEE, BMI, dan WHR langsung terkalkulasi saat data profil dan ukuran terisi.
- **Dukungan BYOK (Bring Your Own Key)**: Memungkinkan aplikasi tetap dapat menjalankan fitur AI cerdas di mana pun di-deploy tanpa membebani tagihan pemilik repositori.
- **Keamanan & Privasi Lokal**: Sistem kunci PIN dan biometrik memberikan rasa aman nyata bagi pengguna yang menyimpan foto perkembangan fisik di ponselnya.

---

## What Is Valuable (Nilai Produk Tertinggi)

- **Zero-Friction Utility**: Tidak perlu login, tidak ada pembuatan akun, tidak ada iklan, dan tidak ada formulir pendaftaran yang panjang. Nilai guna langsung terasa dalam 5 detik pertama membuka aplikasi.
- **Privasi Total untuk Data Sensitif**: Bentuk tubuh dan foto perkembangan adalah data privat. Aplikasi ini memberikan kenyamanan psikologis karena data tidak pernah meninggalkan perangkat pengguna tanpa persetujuan.
- **Pendekatan Holistik**: Menggabungkan tiga elemen terpenting dalam transformasi fisik sekaligus: **Angka Ukuran Lingkar** + **Rasio Kesehatan** + **Bukti Visual Foto**.

---

## UX Issues (Masalah Pengalaman Pengguna)

1. **Ketiadaan Fitur Perbandingan Foto (Before vs After)**:
   Meskipun foto tersimpan rapi di tab Galeri, pengguna belum bisa memilih dua foto untuk disandingkan berdampingan (*side-by-side comparison slider*), padahal inilah hal yang paling dicari orang saat memotret progres tubuh.
2. **Ketiadaan Konfirmasi Saat Menonaktifkan Kunci PIN**:
   Di halaman Pengaturan Keamanan, tombol untuk menonaktifkan kunci aplikasi langsung menghapus proteksi tanpa meminta verifikasi PIN saat ini terlebih dahulu. Siapa pun yang sedang memegang ponsel bisa mematikan kunci tersebut dengan mudah.
3. **Pemberitahuan PWA Install Kurang Proaktif**:
   Instalasi PWA hanya mengandalkan banner standar browser tanpa panduan ramah dalam aplikasi (*custom in-app install banner*).

---

## Product Issues (Masalah Tingkat Produk)

1. **Ekspor Data Belum Menyeluruh**:
   Aplikasi baru menyediakan tombol ekspor CSV untuk data riwayat angka di halaman History. Belum tersedia tombol untuk mengekspor atau mencadangkan seluruh data profil, foto, dan pengaturan ke berkas tunggal (JSON/ZIP).
2. **Ketergantungan Ekstrem pada Perangkat Tunggal**:
   Jika pengguna berganti ponsel atau laptop, tidak ada jalur mudah untuk memindahkan riwayat data selain memindahkan berkas secara manual.
3. **Notifikasi Pengingat Bersifat Pasif**:
   Pengingat mingguan mengandalkan Web Notification API yang hanya akan aktif jika tab aplikasi sedang terbuka atau service worker terbangun di peramban yang mendukung background notification.

---

## Technical Issues (Masalah Teknis Aktual)

1. **Tailwind CSS Runtime CDN**:
   Penggunaan `<script src="https://cdn.tailwindcss.com">` di `index.html` dapat menimbulkan jeda *styling* pada koneksi internet lambat serta tidak direkomendasikan untuk *production build* akhir.
2. **Skalabilitas Penyimpanan Pengukuran di `localStorage`**:
   Semua catatan ukuran disimpan dalam satu array serialisasi JSON di `localStorage`. Untuk pemakaian lebih dari 2 tahun dengan belasan metrik setiap hari, operasi baca-tulis array ini akan mulai mengalami penurunan efisiensi.
3. **Ketiadaan Automated Unit / Integration Test**:
   Tidak ada pengujian otomatis untuk memastikan rumus matematis BMR/TDEE dan mekanisme unlock pencapaian tidak mengalami regresi saat kode diperbarui.

---

## Technical Debt (Hutang Teknis)

- Memindahkan asset script Tailwind CDN ke build pipeline Tailwind bawaan Vite (Tailwind CSS v4 atau PostCSS plugin).
- Menyatukan seluruh persistensi data (baik angka maupun foto) ke IndexedDB dengan satu abstraksi database yang terstruktur.
- Menambahkan skema migrasi versi data yang lebih formal untuk antisipasi pembaruan struktur entitas di masa mendatang.

---

## Missing Functionality (Fungsi yang Belum Ada)

- Fitur **Backup & Restore Lengkap** (Ekspor berkas cadangan berekstensi `.ukuraga` atau `.json` dan impor kembali).
- Slider komparasi foto *Before / After* di Galeri.
- Pengaturan hari dan jam spesifik untuk pengingat mingguan (saat ini intervalnya paten 7 hari dari penimbangan terakhir).
- Fitur pencarian atau filter catatan berdasarkan jenis metrik di halaman riwayat.

---

## Risks (Risiko)

- **Risiko Kehilangan Data**: Pengguna yang tidak memahami cara kerja penyimpanan lokal berisiko kehilangan seluruh riwayat pengukuran jika mereka melakukan aksi *Clear Site Data* atau *Clear Browser Cache*.
- **Risiko Pemblokiran WebAuthn**: Pada beberapa peramban seluler pihak ketiga (in-app browser seperti Instagram atau Telegram), WebAuthn API dan Service Worker mungkin tidak didukung atau dinonaktifkan.

---

## What Should Be Preserved (Hal yang Harus Dipertahankan)

- **Arsitektur Local-First & Zero-Login**: Jangan pernah menambahkan kewajiban login server atau registrasi akun yang merusak sifat instan aplikasi ini.
- **Struktur Kalender Pencatatan Harian**: Desain kalender horizontal yang langsung terhubung ke baris ukuran adalah bagian terbaik dari UX aplikasi ini.
- **Penyimpanan Foto Lokal Terkompresi**: Tetap gunakan kompresi kanvas dan penyimpanan IndexedDB agar pengguna bebas menyimpan puluhan foto tanpa membebani memori.
- **Dukungan Gemini AI Opsional (BYOK)**: Pertahankan fleksibilitas ini agar aplikasi tetap murah untuk di-host dan dapat dinikmati oleh siapa pun.

---

## What Should Be Changed (Hal yang Perlu Diubah)

- Tambahkan verifikasi PIN saat ini sebelum pengguna dapat menonaktifkan fitur penguncian aplikasi di Pengaturan.
- Tambahkan tombol **Cadangkan Data (Backup JSON)** dan **Pulihkan Data (Restore JSON)** di halaman Pengaturan.
- Migrasikan styling dari CDN Tailwind ke bundler lokal Vite.
- Tambahkan tampilan komparasi 2 foto berdampingan di Galeri.

---

## What Should NOT Be Over-Engineered (Jangan Berlebihan)

- **JANGAN membangun backend cloud database (seperti PostgreSQL, Prisma, atau Firebase Auth)** hanya untuk menyimpan data pengguna, kecuali jika pengguna secara spesifik meminta sinkronisasi multi-perangkat real-time. Keindahan utama UKURAGA adalah sifatnya yang mandiri, portabel, dan bebas biaya operasional.
- **JANGAN menambahkan feed sosial, leaderboard publik, atau sistem pertemanan.** UKURAGA adalah ruang intim dan personal bagi pengguna untuk bercermin secara jujur dengan tubuhnya.
- **JANGAN menambahkan pelacak kalori makanan (food logging database).** Ada aplikasi lain yang jauh lebih komprehensif untuk tugas itu; UKURAGA harus tetap fokus pada pengukuran raga/dimensi fisik.

---

## Recommended Direction

### Rekomendasi Utama: **POLISH**

### Alasan Objektif:
Aplikasi UKURAGA memiliki ide produk yang sangat kuat, relevan, dan implementasi yang sudah **sangat fungsional serta rapi**.

- **Bukan Prototype Mentah**: Kode sumbernya memiliki arsitektur modular yang sehat, penanganan tipe TypeScript yang disiplin, integrasi IndexedDB yang matang, serta UI yang bersih dan responsif.
- **Tidak Perlu Diarsip (ARCHIVE)**: Membuang atau mengarsipkan aplikasi ini adalah pemborosan aset digital karena produk ini sudah 85-90% siap digunakan sehari-hari.
- **Tidak Perlu Dibangun Ulang dari Nol (REBUILD IN ANTIGRAVITY)**: Fondasi kodenya (React 19 + TypeScript + Express Vite) sudah modern dan tidak memiliki *spaghetti code*. Membangun ulang dari nol hanya akan menghabiskan waktu tanpa memberikan lompatan nilai yang signifikan.
- **Tidak Perlu Evolusi Berlebihan (EVOLVE)**: Menambah fitur-fitur besar baru (seperti cloud sync atau tracking makanan) saat ini justru akan merusak nilai jual utamanya: privasi lokal dan kesederhanaan.

**Langkah yang paling bijak dan bernilai tinggi adalah memolesnya (POLISH)**:
1. Menyempurnakan alur keamanan (proteksi saat mematikan PIN).
2. Menambahkan fitur *Backup/Restore JSON* lengkap agar data pengguna aman dari resiko terhapusnya cache peramban.
3. Mengganti script CDN Tailwind menjadi Tailwind lokal Vite.
4. Menambahkan slider *Before/After* sederhana di Galeri foto.
5. Memindahkannya ke GitHub sebagai proyek open-source unggulan atau meluncurkannya sebagai web app mandiri.
