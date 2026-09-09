# UKURAGA

> Progressive Web App (PWA) pelacak ukuran lingkar tubuh, metrik komposisi fisik, dan galeri foto transformasi secara mandiri dengan penyimpanan lokal (offline-first) dan wawasan analitis AI opsional.

---

## Ringkasan Proyek (Overview)

**UKURAGA** (dari frasa *"Ukur Raga"*, dikembangkan di bawah inisiatif NALAKARA) adalah aplikasi web mandiri yang dirancang untuk mencatat perkembangan fisik seseorang secara manual. Aplikasi ini berfokus pada pengukuran dimensi tubuh nyata (seperti lingkar pinggang, panggul, dada, paha, lengan) selain berat badan, visualisasi grafik riwayat, kalkulasi rasio kesehatan tubuh (BMI, WHR, WHtR, BMR, TDEE), serta dokumentasi foto progres berkala tanpa memerlukan registrasi akun di server pihak ketiga.

---

## Masalah yang Ingin Diselesaikan (Problem Statement)

1. **Keterbatasan Timbangan Standar**: Berat badan saja sering kali menipu dalam program diet atau pembentukan otot (*body recomposition*). Pengurangan lemak sering kali diimbangi oleh penambahan massa otot, sehingga timbangan tidak bergerak meskipun bentuk tubuh mengecil.
2. **Kekhawatiran Privasi Data Fisik & Foto**: Foto bentuk tubuh dan data biologis adalah data yang sangat sensitif. Banyak pengguna enggan mengunggah foto perkembangan fisik ke aplikasi berbasis cloud komersial.
3. **Kompleksitas Aplikasi Fitness Komersial**: Sebagian besar aplikasi di pasar dijejali fitur sosial, iklan, langganan berbayar, atau integrasi perangkat keras pintar yang rumit. UKURAGA hadir sebagai pencatat manual yang cepat, hening, dan langsung berfungsi di browser atau perangkat mobile sebagai PWA.

---

## Target Pengguna (Target Users)

- Penggiat kebugaran, diet, gym, atau *bodybuilding* yang memantau perubahan lingkar tubuh secara berkala.
- Individu yang ingin mencatat metrik kesehatan dasar (tekanan darah, detak jantung istirahat, berat badan) tanpa ketergantungan pada akun cloud.
- Pengguna yang mengutamakan privasi data fisik dan foto transformasi di perangkat pribadi mereka sendiri.

---

## Fitur Utama (Core Features)

### 1. Pencatatan Metrik Harian (Daily Record & Calendar)
- Kalender interaktif untuk memilih tanggal pencatatan (hari ini atau tanggal lampau).
- Input cepat per metrik dengan indikator visual tanggal yang sudah terisi.
- Dukungan metrik bawaan:
  - Dimensi: Berat Badan (kg), Lingkar Pinggang, Pinggul, Dada, Paha, Lengan, Betis (cm).
  - Kesehatan Tambahan: Lemak Tubuh (%), Massa Otot (%), Detak Jantung Istirahat (bpm), Tekanan Darah Sistolik & Diastolik (mmHg).
- Kustomisasi tipe metrik: Menambah jenis metrik baru atau menonaktifkan metrik bawaan yang tidak relevan.

### 2. Kalkulator Metrik Cerdas (Smart Calculations)
- **BMI (Body Mass Index)**: Mengukur proporsi berat terhadap tinggi badan.
- **WHR (Waist-to-Hip Ratio)**: Mengidentifikasi distribusi lemak tubuh bagian tengah.
- **WHtR (Waist-to-Height Ratio)**: Indikator risiko kardiovaskular berdasarkan perbandingan lingkar pinggang dan tinggi badan.
- **BMR & TDEE**: Estimasi metabolisme basal dan kebutuhan kalori harian berdasarkan usia, jenis kelamin, tinggi, berat, dan tingkat aktivitas harian.

### 3. Pelacak Target (Goal Tracker)
- Menetapkan satu target utama untuk metrik tertentu (misal: target berat badan atau lingkar pinggang).
- Progress bar visual yang menghitung persentase capaian dari nilai awal (*starting value*) menuju target (*target value*).

### 4. Grafik & Riwayat (History & Analytics)
- Grafik garis interaktif per jenis metrik menggunakan library Recharts.
- Log riwayat lengkap yang dikelompokkan berdasarkan tanggal pencatatan.
- Fitur ekspor data log ke format berkas CSV (`ukuraga_history_all.csv`).

### 5. Galeri Foto Progres (Visual Gallery)
- Pengambilan foto langsung dari kamera atau unggah galeri lokal.
- Kompresi gambar otomatis via HTML5 Canvas (dioptimalkan ke format WebP/JPEG max 1280px) untuk mencegah pembengkakan memori.
- Penyimpanan berkas foto berbasis IndexedDB lokal.
- Modal penampil foto dengan catatan dan tanggal.

### 6. Keamanan Aplikasi (App Lock)
- Penguncian aplikasi menggunakan PIN 4-digit (dihash dengan SHA-256).
- Dukungan autentikasi biometrik lokal (WebAuthn Platform Authenticator / Face Unlock / Fingerprint perangkat).
- Otomatis terkunci saat tab atau jendela aplikasi diminimalkan (`visibilitychange`).

### 7. Wawasan Analitis AI (Gemini AI Insights)
- Analisis tren 30 hari, korelasi antar metrik, dan tips gaya hidup praktis berbasis Google Gemini (2.5 Flash).
- Mendukung mode **BYOK (Bring Your Own Key)** langsung di browser pengguna atau memanfaatkan kunci environment server (`GEMINI_API_KEY`).
- Dilengkapi penafian (*disclaimer*) non-medis yang ketat.

### 8. Fitur Pendukung & Aksesibilitas
- Dukungan multibahasa: Bahasa Indonesia dan English.
- Mode Gelap (Dark Mode) dan Terang (Light Mode).
- Gamifikasi ringan: 4 lencana pencapaian (*First Entry*, *Profiler*, *Explorer*, *Consistent Week*).
- Pengingat mingguan via Web Notification API.

---

## Alur Pengguna Utama (Main User Workflow)

```
[ Buka Aplikasi ]
       │
       ▼
[ Terkunci? ] ─── Ya ───► [ Verifikasi PIN / Biometrik ]
       │                                 │
     Tidak                               ▼
       ├─────────────────────────────────┘
       ▼
[ Dashboard Beranda (Home) ]
 ├── Lihat Ringkasan Target & Capaian
 ├── Lihat Rasio Kesehatan (BMI, WHR, WHtR, TDEE)
 └── Minta Analisis AI 30 Hari (Opsional)
       │
       ├──► [ Catat (Record) ] ──► Pilih Tanggal di Kalender ──► Simpan Nilai Ukuran
       ├──► [ Galeri (Gallery) ] ──► Ambil / Unggah Foto ──► Tinjau Perubahan Visual
       ├──► [ Riwayat (History) ] ──► Tinjau Tren Grafik ──► Unduh CSV
       └──► [ Profil (Profile) ] ──► Edit Data Fisik, Keamanan PIN, dan Preferensi
```

---

## Cara Kerja Aplikasi (How It Works)

1. **Client-Side Rendering (SPA)**: Aplikasi berjalan di browser menggunakan React 19 dan HashRouter (`/#/`), memastikan routing lancar tanpa perlu konfigurasi URL rewrite di web server statis.
2. **Penyimpanan Hibrida Lokal**:
   - Teks, angka, konfigurasi, profil, dan PIN hash disimpan pada `window.localStorage`.
   - Objek gambar foto progres yang berukuran besar disimpan pada `IndexedDB` (`ukuraga_db`) untuk menghindari kuota ketat 5MB pada localStorage.
3. **PWA & Offline Capability**:
   - `service-worker.js` (versi v3) memprioritaskan Network-First untuk dokumen navigasi HTML dan Cache-First/Stale-While-Revalidate untuk static bundle.
   - PWA dapat di-install ke home screen perangkat Android/iOS/Desktop.
4. **Backend Gateway Opsional**:
   - Express server (`server.ts`) bertindak sebagai reverse-proxy aman untuk panggilan AI Gemini, menyembunyikan API key server (jika diisi) atau meneruskan header BYOK dari pengguna.

---

## Tumpukan Teknologi (Technology Stack)

| Bagian | Teknologi / Pustaka | Keterangan |
|---|---|---|
| **Frontend Framework** | React 19.1.0, React DOM 19.1.0 | Menggunakan functional component dan React Hooks |
| **Routing** | React Router DOM 7.7.1 | HashRouter untuk kompatibilitas deployment statis |
| **Bahasa & Compiler** | TypeScript 5.8, Vite 6.2, tsx | Tipe ketat di seluruh modul |
| **Styling** | Tailwind CSS CDN + custom extend | Mendukung dark mode class |
| **Visualisasi Data** | Recharts 3.1.0 | Rendering grafik tren metrik |
| **Penyimpanan Lokal** | HTML5 localStorage + IndexedDB | Zero-cloud, local-first |
| **Keamanan** | Web Crypto API (SHA-256) + WebAuthn | Kunci PIN dan Biometrik lokal |
| **AI Integration** | `@google/genai` via Express Proxy | Model default: `gemini-2.5-flash` |
| **Backend / Dev** | Node.js Express 5.2.1 | Middleware Vite + route API AI & Health check |

---

## Status Saat Ini (Current Status)

- **Status Maturity**: **Functional Prototype / MVP Lengkap**.
- **Kondisi Fungsional**: Seluruh fitur utama (pencatatan, kalender, grafik, galeri foto IndexedDB, lockscreen PIN, dan integrasi AI) berfungsi normal tanpa error kompilasi.
- **Kesiapan GitHub**: Siap dipindahkan ke repositori GitHub publik/privat sebagai proyek open-source atau portofolio pribadi.

---

## Batasan yang Diketahui (Known Limitations)

1. **Ketiadaan Sinkronisasi Antar-Perangkat**: Karena mengadopsi arsitektur *local-first*, data di browser laptop tidak otomatis tersinkronisasi ke browser ponsel.
2. **Belum Ada Fitur Backup / Restore JSON**: Saat ini baru tersedia ekspor CSV riwayat. Belum ada fitur pencadangan lengkap (JSON) untuk memindahkan seluruh profil, foto, dan pengaturan ke perangkat baru secara sekaligus.
3. **Tailwind via Runtime CDN**: Skrip Tailwind dimuat melalui tag `<script src="https://cdn.tailwindcss.com">` di `index.html`. Ini sangat praktis untuk prototype, namun dianjurkan beralih ke Tailwind CLI / PostCSS bundler jika dipublikasikan ke produksi berskala tinggi.
4. **Resiko Pembersihan Cache Browser**: Jika pengguna sengaja membersihkan *site data/cookies* browser tanpa mencadangkan data, data lokal akan terhapus.

---

## Catatan Penting untuk Pengembang Selanjutnya (Notes for Future Developers)

- **Penyimpanan Foto**: Jangan simpan foto ke `localStorage`. Gunakan fungsi pembantu di `lib/storage.ts` (`savePhotoToDB`, `getAllPhotosFromDB`) yang menggunakan IndexedDB dan kompresi kanvas.
- **Manajemen Tanggal**: Selalu perhatikan zona waktu lokal vs UTC saat memproses tanggal pengukuran (`YYYY-MM-DD`). Gunakan helper di `lib/utils.ts` atau pemotongan string ISO untuk menghindari pergeseran tanggal sebesar 1 hari akibat perbedaan offset UTC.
- **Konfigurasi Lingkungan**: Buat berkas `.env` dengan variabel `GEMINI_API_KEY` jika ingin menyediakan fitur AI secara global tanpa mewajibkan pengguna memasukkan API key pribadi (BYOK).
