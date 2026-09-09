# Product

Dokumentasi spesifikasi produk **UKURAGA** berdasarkan inspeksi aktual terhadap source code aplikasi.

---

## Product Overview

**UKURAGA** adalah aplikasi web progresif (PWA) yang berfungsi sebagai buku harian fisik digital (*body measurement and transformation log*). Aplikasi ini memungkinkan pengguna mencatat ukuran lingkar tubuh, komposisi berat, serta foto progres secara teratur, visual, dan privat tanpa ketergantungan pada server pihak ketiga ataupun akun komersial.

- **Status Status**: Implemented (Functional Prototype / MVP)
- **Pengembang Awal**: NALAKARA (Inferred dari footer dan identitas visual aplikasi)
- **Filosofi Produk**: *Privacy-first*, *device-local storage*, kesederhanaan input, dan visualisasi progres yang realistis.

---

## Problem Statement

- **Implemented Context**:
  - Timbangan konvensional hanya menunjukkan satu angka (berat badan), yang sering kali gagal menggambarkan progres perubahan komposisi tubuh (misalnya penurunan lingkar pinggang saat massa otot bertambah).
  - Banyak aplikasi kebugaran komersial mewajibkan login, menampilkan iklan, melacak data pengguna ke cloud, atau menuntut langganan berbayar hanya untuk mencatat angka dan foto perkembangan.
  - Kurangnya wadah yang privat dan terkunci untuk menyimpan foto transformasi tubuh di perangkat pribadi tanpa tercampur di galeri foto publik smartphone.

---

## Target Users

1. **Fitness & Gym Enthusiasts** *(Implemented / Target Nyata)*:
   Individu yang sedang menjalani program *bulking*, *cutting*, atau *body recomposition* yang perlu mengukur lingkar lengan, dada, paha, dan persentase lemak.
2. **Weight Loss / Lifestyle Changers** *(Implemented / Target Nyata)*:
   Pengguna yang ingin memantau penurunan lingkar pinggang dan perut sebagai indikator perbaikan metabolik jangka panjang.
3. **Privacy-Conscious Individuals** *(Implemented / Target Nyata)*:
   Pengguna yang tidak ingin data biologis dan foto tubuh pribadinya diunggah ke cloud server mana pun.

---

## User Needs

- **Pencatatan cepat per tanggal**: Mengisi beberapa ukuran sekaligus dalam satu layar kalender harian. *(Implemented)*
- **Evaluasi rasio tubuh otomatis**: Mengetahui apakah perbandingan pinggang-pinggul atau pinggang-tinggi berada dalam batas wajar. *(Implemented)*
- **Privasi & Keamanan**: Mengunci aplikasi dengan PIN atau sidik jari agar data tidak dilihat orang lain saat meminjamkan ponsel. *(Implemented)*
- **Dokumentasi visual**: Menyandingkan catatan angka dengan foto tampak fisik. *(Implemented)*
- **Portabilitas data**: Mengunduh data yang sudah dicatat dalam format terbuka (CSV). *(Implemented)*

---

## Core Use Cases

| Use Case | Deskripsi | Status |
|---|---|---|
| **UC-1: Catat Pengukuran Harian** | Pengguna memilih tanggal, memasukkan angka berat/lingkar, dan menyimpannya. | **Implemented** |
| **UC-2: Evaluasi Target (Goal)** | Pengguna menentukan target angka (misal berat badan turun ke 70 kg) dan memantau persentase capaian. | **Implemented** |
| **UC-3: Pemantauan Tren Grafik** | Pengguna memilih metrik tertentu dan melihat kurva fluktuasi dari waktu ke waktu. | **Implemented** |
| **UC-4: Log Foto Fisik** | Pengguna mengambil foto tubuh terkini via kamera atau galeri, memberi catatan, dan melihat riwayat visual. | **Implemented** |
| **UC-5: Penguncian Aplikasi** | Aplikasi otomatis terkunci ketika diminimalkan dan meminta PIN atau biometrik saat dibuka kembali. | **Implemented** |
| **UC-6: Analisis Cerdas AI** | Pengguna meminta analisis komparatif 30 hari terakhir untuk melihat korelasi antar metrik. | **Implemented** |
| **UC-7: Pengingat Rutin** | Notifikasi browser mingguan untuk mengingatkan pengguna melakukan pengukuran berkala. | **Implemented** |
| **UC-8: Kustomisasi Ukuran** | Pengguna menambah metrik baru (misal: lingkar leher) atau menghapus metrik bawaan yang tidak digunakan. | **Implemented** |

---

## User Workflows

### Alur 1: Mengisi Pengukuran Harian
1. Pengguna membuka tab navigasi **Record** (Catat).
2. Memilih tanggal pada kalender horizontal (default: hari ini).
3. Daftar seluruh jenis ukuran ditampilkan berurutan dengan input angka.
4. Pengguna memasukkan angka, menekan tombol **Simpan**.
5. Nilai tersimpan secara reaktif, tanggal pada kalender mendapatkan indikator titik (dot) tanda data tersedia.
6. Sistem memeriksa apakah aksi tersebut membuka pencapaian baru (*achievements*).

### Alur 2: Menetapkan & Memantau Target
1. Pada halaman **Home** (Beranda), jika belum ada target, muncul kartu **Set a New Goal**.
2. Pengguna memilih metrik (misal: *Weight*) dan memasukkan target angka.
3. Setelah disimpan, kartu berubah menjadi visual **Progress Bar** yang menampilkan nilai awal, nilai terkini, nilai target, dan selisih sisa (*to go*).

### Alur 3: Menambah dan Mengamati Foto Progres
1. Pengguna membuka tab navigasi **Gallery** (Galeri).
2. Menekan tombol aksi mengambang (**FAB +**).
3. Memilih foto dari file picker/kamera, mengisi tanggal foto dan catatan opsional.
4. Foto otomatis dikompresi di sisi klien dan disimpan ke IndexedDB.
5. Grid foto menampilkan miniatur foto dengan label tanggal.
6. Mengetuk foto membuka modal detail berukuran penuh dengan opsi hapus.

---

## Functional Requirements

### 1. Modul Pencatatan Data
- **FR-1.1**: Sistem harus mengizinkan penambahan, pengubahan, dan penghapusan nilai pengukuran per tanggal dan per tipe metrik. *(Implemented)*
- **FR-1.2**: Sistem harus mendukung angka desimal dengan presisi 0.1. *(Implemented)*
- **FR-1.3**: Sistem harus memungkinkan penambahan tipe metrik kustom (nama & satuan). *(Implemented)*
- **FR-1.4**: Sistem harus mengizinkan penyembunyian/penghapusan metrik bawaan opsional. *(Implemented)*

### 2. Modul Perhitungan Matematis (Kalkulator Kesehatan)
- **FR-2.1**: **BMI** = $\frac{\text{Berat (kg)}}{(\text{Tinggi (m)})^2}$. *(Implemented)*
- **FR-2.2**: **WHR** = $\frac{\text{Lingkar Pinggang}}{\text{Lingkar Pinggul}}$. *(Implemented)*
- **FR-2.3**: **WHtR** = $\frac{\text{Lingkar Pinggang}}{\text{Tinggi Badan}}$. *(Implemented)*
- **FR-2.4**: **BMR (Mifflin-St Jeor)** = $10 \times W + 6.25 \times H - 5 \times A + S$ (di mana $S = +5$ untuk pria, $-161$ untuk wanita). *(Implemented)*
- **FR-2.5**: **TDEE** = $BMR \times \text{Multiplier Aktivitas}$ (1.2 s/d 1.725). *(Implemented)*

### 3. Modul Visualisasi & Ekspor
- **FR-3.1**: Menampilkan grafik garis fluktuasi nilai berdasarkan urutan waktu menggunakan Recharts. *(Implemented)*
- **FR-3.2**: Menampilkan ringkasan data log terkelompok berdasarkan tanggal terbaru ke terlama. *(Implemented)*
- **FR-3.3**: Mengunduh seluruh riwayat ke dalam berkas CSV. *(Implemented)*
- **FR-3.4**: Pencadangan data lengkap (Full Backup JSON) dan Pemulihan (Restore JSON). *(Planned / Belum Implemented)*

### 4. Modul Keamanan
- **FR-4.1**: Pengaturan kunci PIN 4 angka numerik dengan hashing SHA-256. *(Implemented)*
- **FR-4.2**: Pemanfaatan WebAuthn API untuk autentikasi biometrik platform lokal. *(Implemented)*
- **FR-4.3**: Penguncian otomatis saat event `visibilitychange` aktif (tab berpindah atau browser ditutup). *(Implemented)*
- **FR-4.4**: Reset darurat jika lupa PIN (menghapus seluruh data lokal setelah konfirmasi ganda). *(Implemented)*

---

## Business Rules

1. **Aturan Validasi Pengukuran**: Hanya satu nilai valid per jenis metrik pada tanggal yang sama. Pengisian ulang pada tanggal yang sama akan melakukan *upsert* (memperbarui nilai lama).
2. **Aturan Privasi**: Tidak boleh ada data tubuh, foto, maupun profil pengguna yang dikirim ke server analitik pihak ketiga tanpa izin eksplisit pengguna.
3. **Aturan Penafian Medis**: Seluruh output analitik dan kalkulator wajib disertai penafian bahwa UKURAGA bukan alat diagnosis medis klinis.
4. **Aturan Penghapusan Kustom**: Jika tipe metrik kustom dihapus dari pengaturan, seluruh riwayat data historis yang terkait dengan tipe metrik tersebut juga ikut dibersihkan untuk menjaga integritas relasional data.

---

## Data / Entities

### 1. `Measurement` (Catatan Ukuran)
- `id`: string (kombinasi tanggal + tipe + acak)
- `date`: string (ISO date `YYYY-MM-DD` atau datetime)
- `type`: string (identitas jenis metrik, misal `'weight'`, `'waist'`, atau `'custom_...'`)
- `value`: number (nilai numerik)
- `note`: string opsional

### 2. `Profile` (Profil Pengguna)
- `name`: string
- `gender`: enum (`'male'`, `'female'`, `'unspecified'`)
- `birthDate`: string (`YYYY-MM-DD`)
- `height`: number opsional (cm)
- `activityLevel`: enum (`'sedentary'`, `'lightly_active'`, `'moderately_active'`, `'very_active'`, `'unspecified'`)

### 3. `Goal` (Target)
- `id`: string
- `type`: string (tipe metrik sasaran)
- `startingValue`: number
- `targetValue`: number
- `startDate`: string (ISO date)

### 4. `PhotoEntry` (Foto Progres)
- `id`: string
- `date`: string (`YYYY-MM-DD`)
- `image`: string (Base64 data URL gambar yang telah dikompresi)
- `note`: string opsional

### 5. `CustomMeasurementType` (Tipe Ukuran Tambahan)
- `id`: string (prefix `custom_...`)
- `name`: string
- `unit`: string (cm, kg, %, dsb.)

### 6. `AuthData` (Kredensial Lokal)
- `method`: `'none'` | `'pin'` | `'biometric'`
- `pinHash`: string opsional (SHA-256 base64)
- `credentialId`: string opsional (WebAuthn credential ID)

---

## AI Capabilities

- **Model**: Google Gemini 2.5 Flash via proxy server backend Express (`/api/gemini/generate`).
- **Fitur AI 1 (Home Quick Insights)**: Memberikan tip 1 kalimat ringkas non-medis untuk metrik BMI, WHR, WHtR, dan TDEE dalam format JSON terstruktur. *(Implemented)*
- **Fitur AI 2 (Deep 30-Day Analysis)**: Menghasilkan ringkasan naratif 3 bagian:
  1. *Trend Analysis* (analisis trajektori angka 30 hari terakhir).
  2. *Metric Correlations* (hubungan antara berat badan, lingkar perut, atau massa otot).
  3. *Actionable Guidance* (rekomendasi kebiasaan harian realistis dan non-medis). *(Implemented)*
- **Konfigurasi Kunci**: Mendukung server key bawaan (`GEMINI_API_KEY`) dan fitur **BYOK (Bring Your Own Key)** yang dimasukkan oleh pengguna di browser. *(Implemented)*

---

## Integrations

- **Web Notifications API**: Notifikasi browser terjadwal untuk pengingat mingguan. *(Implemented)*
- **Web Crypto API & WebAuthn**: Untuk keamanan biometrik dan hashing lokal. *(Implemented)*
- **Google Gen AI SDK**: Integrasi API Gemini di sisi server. *(Implemented)*
- **Google Fit / Apple Health**: Integrasi sinkronisasi perangkat pintar. *(Out of Scope / Planned)*
- **Cloud Database (Firebase/Supabase)**: Sinkronisasi akun multi-perangkat. *(Out of Scope)*

---

## UX Principles

1. **Immediate Utility**: Tidak ada layar login atau *onboarding wizard* yang memblokir pengguna saat pertama kali membuka aplikasi. Pengguna langsung masuk ke Beranda dan dapat segera mencatat data.
2. **High Accessibility**: Seluruh tombol dan target sentuh memiliki ukuran minimum $\ge 44\text{px}$ untuk kemudahan pengoperasian pada layar ponsel.
3. **Contrast & Theme Harmony**: Mendukung mode terang (*clean neutral light*) dan mode gelap (*deep slate dark*) yang nyaman untuk mata saat menimbang badan di pagi atau malam hari.
4. **Resilient Feedback**: Tindakan destruktif (seperti menghapus target atau menghapus jenis metrik) selalu disertai konfirmasi eksplisit.

---

## Current Scope vs Out of Scope

### Current Scope (Ada di dalam aplikasi saat ini)
- Pencatatan manual seluruh metrik tubuh penting.
- Kalender riwayat dan visualisasi grafik Recharts.
- Galeri foto progres berbasis IndexedDB dengan kompresi klien.
- Kalkulasi otomatis rasio tubuh (BMI, WHR, WHtR, BMR, TDEE).
- Kunci keamanan lokal (PIN + Biometrik).
- Analisis data 30 hari berbasis AI Gemini.
- Ekspor CSV data log.
- Dukungan bahasa ganda (ID / EN).

### Out of Scope (Sengaja tidak dimasukkan atau tidak ada)
- Sistem autentikasi pengguna berbasis email/password di cloud.
- Sinkronisasi real-time antar perangkat via database terpusat.
- Pelacakan makanan / penghitung asupan kalori mikro & makro.
- Integrasi otomatis Bluetooth dengan timbangan pintar (*smart scale*).
- Feed sosial atau berbagi foto progres ke media sosial publik.

---

## Known Limitations

- **Satu Profil Saja**: Aplikasi saat ini hanya mendukung satu pengguna lokal (*single user per browser instance*).
- **Keterbatasan Ekspor**: Pengguna baru bisa mengekspor data metrik ke CSV, tetapi belum ada mekanisme sekali klik untuk mengekspor seluruh foto dan profil ke dalam arsip cadangan (ZIP/JSON).
- **Ketergantungan Kuota Browser**: Jika browser pengguna memiliki ruang penyimpanan sangat terbatas atau fitur *auto-clear storage* aktif, data lokal berisiko terhapus jika tidak diekspor berkala.

---

## Future Opportunities

1. **Full Backup & Restore (JSON + Photo Archive)**: Memungkinkan pengguna mengekspor file `.ukuraga` terenkripsi dan memulihkannya di peramban lain.
2. **Photo Comparison Slider (Before/After)**: Fitur *slider* interaktif untuk membandingkan dua foto progres dari tanggal yang berbeda berdampingan.
3. **Smart Scale Bluetooth Web API (WebBluetooth)**: Kemampuan membaca timbangan Bluetooth yang mendukung profil standar GATT tanpa mengorbankan privasi lokal.
