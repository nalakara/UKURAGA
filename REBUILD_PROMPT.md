# MASTER REBUILD PROMPT: UKURAGA

> Berkas ini dirancang sebagai **Master Prompt Blueprint** yang komprehensif. Dokumen ini dapat langsung disalin-tempelkan (*copy-paste*) ke AI Coding Agent (seperti Google AI Studio, Antigravity, Cursor, atau Devin) untuk merekonstruksi dan membangun ulang aplikasi **UKURAGA** dari nol dengan spesifikasi terbaik tanpa perlu melihat kode lama.

---

```markdown
# Role & Goal
Anda adalah seorang Principal Full-Stack Engineer dan UI/UX Designer kelas dunia. 
Tugas Anda adalah merancang dan membangun sebuah Progressive Web App (PWA) lengkap, fungsional, dan sangat terpoles bernama **UKURAGA** (dari kata "Ukur Raga").

---

## 1. Product Purpose & Philosophy
UKURAGA adalah aplikasi buku harian fisik dan pelacak ukuran tubuh digital (*body measurement and transformation log*) yang berprinsip **Local-First & Privacy-First**. Aplikasi ini dibangun untuk individu yang ingin mendokumentasikan perubahan bentuk fisik (lingkar tubuh, komposisi berat, dan foto perkembangan) secara konsisten tanpa mengharuskan pendaftaran akun di server pihak ketiga, tanpa iklan, dan tanpa risiko kebocoran foto pribadi ke cloud publik.

---

## 2. Problem Statement & Target Users
- **Problem**: Angka timbangan berat badan sering kali menyesatkan karena tidak memperhitungkan perubahan massa otot vs lemak (*body recomposition*). Di sisi lain, aplikasi fitness komersial cenderung rumit, meminta akun email/sosial, memasang iklan, dan mengunggah foto tubuh yang sangat sensitif ke server cloud mereka.
- **Target Users**:
  1. Penggiat gym, fitness, dan diet yang memantau ukuran lingkar tubuh (pinggang, lengan, paha, dada).
  2. Orang yang menjalani gaya hidup sehat dan ingin memantau rasio kesehatan (BMI, WHR, WHtR, TDEE).
  3. Pengguna yang mengutamakan privasi data pribadi di perangkat mereka sendiri.

---

## 3. Core Concept & Key Architecture
- **Offline-First & Local Persistence**:
  - Data numerik, profil, pengaturan, dan riwayat pengukuran disimpan di `window.localStorage`.
  - Data biner/foto progres disimpan di `IndexedDB` lokal dengan kompresi kanvas di sisi klien (maksimal 1280px, format WebP/JPEG kualitas 0.8) agar tidak membebani memori.
- **Zero-Login**: Tidak ada formulir registrasi akun atau login cloud. Pengguna langsung dapat menggunakan aplikasi seketika saat pertama kali dibuka.
- **App Lock (Keamanan Lokal)**: Aplikasi dapat dikunci dengan PIN 4-angka (SHA-256) atau WebAuthn biometrik lokal, dan otomatis terkunci jika pengguna beralih aplikasi atau meminimalkan tab (`visibilitychange`).

---

## 4. Core Features

### A. Kalender & Pencatatan Harian (Daily Record)
1. **Kalender Horizontal Interaktif**: Menampilkan baris tanggal dengan penanda titik (*dot indicator*) pada tanggal yang memiliki data.
2. **Daftar Metrik Tubuh Bawaan**:
   - Berat Badan (kg)
   - Lingkar Pinggang (cm)
   - Lingkar Pinggul (cm)
   - Lingkar Dada (cm)
   - Lingkar Paha (cm)
   - Lingkar Lengan (cm)
   - Lingkar Betis (cm)
   - Lemak Tubuh / Body Fat (%) [opsional/dapat dinonaktifkan]
   - Massa Otot (%) [opsional/dapat dinonaktifkan]
   - Detak Jantung Istirahat (bpm) [opsional/dapat dinonaktifkan]
   - Tekanan Darah Sistolik & Diastolik (mmHg) [opsional/dapat dinonaktifkan]
3. **Kustomisasi Tipe Ukuran**: Pengguna dapat menambah jenis ukuran baru (nama dan satuan) atau menyembunyikan ukuran bawaan.
4. **Input Fleksibel**: Mendukung angka desimal (presisi 0.1) dengan mode *Display* dan *Edit* per baris ukuran.

### B. Kalkulator Rasio Kesehatan Otomatis (Smart Metrics)
Sistem otomatis menghitung rasio berikut di Beranda saat data pendukung tersedia:
1. **BMI (Body Mass Index)** = $\text{Berat (kg)} / (\text{Tinggi (m)})^2$.
2. **WHR (Waist-to-Hip Ratio)** = $\text{Lingkar Pinggang} / \text{Lingkar Pinggul}$.
3. **WHtR (Waist-to-Height Ratio)** = $\text{Lingkar Pinggang} / \text{Tinggi Badan}$.
4. **BMR (Mifflin-St Jeor)**:
   - Pria: $10 \times W + 6.25 \times H - 5 \times A + 5$
   - Wanita: $10 \times W + 6.25 \times H - 5 \times A - 161$
5. **TDEE (Total Daily Energy Expenditure)**:
   - Sedentary: $\times 1.2$
   - Lightly Active: $\times 1.375$
   - Moderately Active: $\times 1.55$
   - Very Active: $\times 1.725$

### C. Pelacak Target (Goal Tracker)
- Pengguna dapat memilih satu metrik aktif untuk dijadikan target sasaran (misal: Berat Badan 70 kg).
- Menampilkan visual *Progress Bar* dengan persentase capaian dari *starting value* menuju *target value*, serta sisa angka yang harus dicapai (*to go*).

### D. Grafik Riwayat & Ekspor Data (History & Analytics)
- Visualisasi grafik garis interaktif per jenis metrik menggunakan **Recharts**.
- Log riwayat lengkap yang dikelompokkan berdasarkan tanggal terbaru ke terlama.
- Tombol **Ekspor CSV** untuk mengunduh seluruh riwayat catatan ukuran.
- Tombol **Backup JSON** dan **Restore JSON** untuk mencadangkan seluruh data profil dan riwayat ke dalam berkas lokal.

### E. Galeri Foto Progres (Visual Gallery)
- Pengambilan foto langsung dari kamera smartphone atau unggah dari penyimpanan lokal.
- Kompresi gambar otomatis via kanvas sebelum disimpan ke IndexedDB.
- Grid foto rapi dengan stempel tanggal. Mengetuk foto menampilkan modal ukuran penuh dengan catatan dan tombol hapus.
- Slider pembanding foto (*Before vs After*) untuk menyandingkan 2 foto dari tanggal berbeda.

### F. Wawasan Cerdas AI (Gemini AI Insights)
- Analisis analitis berkala berbasis model **Google Gemini 2.5 Flash** melalui backend proxy Express.
- Prompt menghasilkan 3 bagian:
  1. *Trend Analysis* (trajektori angka 30 hari terakhir).
  2. *Metric Correlations* (korelasi perubahan berat vs lingkar tubuh).
  3. *Actionable Guidance* (tips gaya hidup praktis dan realistis).
- Mendukung mode **BYOK (Bring Your Own Key)** yang dimasukkan oleh pengguna di Pengaturan atau kunci lingkungan server (`GEMINI_API_KEY`).
- Selalu memuat penafian hukum (*medical disclaimer*).

### G. Keamanan & Preferensi
- Penguncian aplikasi dengan PIN 4 digit (dihash dengan SHA-256) atau Biometrik WebAuthn.
- Proteksi saat mematikan kunci (meminta verifikasi PIN saat ini).
- Opsi reset darurat jika pengguna lupa PIN (menghapus seluruh data setelah konfirmasi ganda).
- Pengaturan tema: Mode Terang (*Light Mode*) dan Mode Gelap (*Dark Mode*).
- Multibahasa: Bahasa Indonesia dan English.
- Gamifikasi: 4 lencana pencapaian (*First Entry*, *Profiler*, *Explorer*, *Consistent Week*).

---

## 5. Data Entities & Schema

```typescript
export interface Measurement {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  type: string;
  value: number;
  note?: string;
}

export interface Profile {
  name: string;
  gender: 'male' | 'female' | 'unspecified';
  birthDate: string; // YYYY-MM-DD
  height?: number; // cm
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'unspecified';
}

export interface Goal {
  id: string;
  type: string;
  startingValue: number;
  targetValue: number;
  startDate: string;
}

export interface PhotoEntry {
  id: string;
  date: string; // YYYY-MM-DD
  image: string; // Base64 data URL hasil kompresi
  note?: string;
}

export interface CustomMeasurementType {
  id: string;
  name: string;
  unit: string;
}

export interface AuthData {
  method: 'none' | 'pin' | 'biometric';
  pinHash?: string;
  credentialId?: string;
}
```

---

## 6. UX & Visual Direction
- **Archetype UI**: *Clean, modern, high-contrast utility*. Menghindari gradien berlebihan atau elemen dekoratif yang tidak perlu.
- **Palet Warna**:
  - Warna Utama / Aksen: Indigo (`#4f46e5` / hover `#4338ca`).
  - Mode Terang: Background `#f9fafb`, Kartu `#ffffff`, Teks `#111827`.
  - Mode Gelap: Background `#111827`, Kartu `#1f2937`, Teks `#f3f4f6`.
- **Aksesibilitas Target Sentuh**: Semua tombol navigasi, keypad PIN, dan elemen interaktif wajib memiliki dimensi sentuh minimal $\ge 44\text{px}$.
- **Navigasi Bawah (Bottom Navigation)**: 5 menu tetap:
  1. *Home* (Beranda)
  2. *Record* (Catat)
  3. *Gallery* (Galeri)
  4. *History* (Riwayat)
  5. *Profile* (Profil)

---

## 7. Technical Stack & Implementation Expectations
- **Frontend**: React 19, TypeScript, React Router (HashRouter), Tailwind CSS.
- **Charts**: Recharts (LineChart, ResponsiveContainer).
- **Backend / Dev Proxy**: Express 5 + Vite middleware di `server.ts` yang mengontrol endpoint `/api/gemini/generate` menggunakan SDK `@google/genai`.
- **PWA**: File `service-worker.js` mandiri dengan strategi *Network-First* untuk dokumen HTML dan caching aset statis, serta `manifest.json` yang lengkap.
- **Kerapian Kode**:
  - Pecah kode ke dalam modul kecil: `components/`, `context/`, `hooks/`, `lib/`, `pages/`.
  - Gunakan `ErrorBoundary` di root untuk menangani error tak terduga secara anggun.

---

## 8. What NOT to Build (Strict Constraints)
- **JANGAN** membuat sistem login backend berbasis database SQL/Firebase/OAuth. Aplikasi ini harus sepenuhnya *offline-first* dan *zero-login*.
- **JANGAN** membuat fitur sosial, feed publik, atau berbagi metrik ke pengguna lain.
- **JANGAN** menambahkan pelacak kalori makanan (*food logging*). Fokus aplikasi hanya pada pengukuran dimensi raga dan foto transformasi.
- **JANGAN** menyimpan foto biner ke dalam `localStorage`. Semua foto wajib masuk ke IndexedDB.

---

## 9. Definition of Done
Aplikasi dianggap selesai jika:
1. Pengguna dapat membuka aplikasi di peramban dan langsung mengisi ukuran harian di kalender.
2. Kartu BMI, WHR, WHtR, dan TDEE terhitung akurat sesuai rumus medis standar.
3. Foto dapat diunggah, dikompresi, dan tersimpan di IndexedDB secara persisten saat halaman dimuat ulang.
4. Kunci aplikasi via PIN dan Biometrik berhasil mengunci tampilan saat tab berpindah.
5. Grafik riwayat merender kurva fluktuasi data dengan benar dan data dapat diunduh dalam format CSV.
6. Analisis AI Gemini menghasilkan wawasan terstruktur menggunakan server key atau BYOK.
7. Tidak ada error kompilasi TypeScript (`tsc --noEmit` bersih).
```
