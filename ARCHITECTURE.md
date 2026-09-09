# Architecture

Dokumentasi arsitektur perangkat lunak **UKURAGA** berdasarkan inspeksi langsung terhadap struktur berkas, implementasi kode sumber, dan alur data sistem.

---

## Technology Stack

- **Runtime & Language**: Node.js, TypeScript 5.8 (Strict Type Checking)
- **Frontend Core**: React 19.1.0, React DOM 19.1.0
- **Routing**: React Router DOM 7.7.1 (`HashRouter`)
- **Visualisasi Grafik**: Recharts 3.1.0 (Berdasarkan D3 SVG engine)
- **Styling**: Tailwind CSS (Runtime script CDN via `index.html` dengan konfigurasi class `dark`)
- **Backend / Dev Server**: Express 5.2.1, tsx 4.23 (Node runner), esbuild 0.28 (Bundle engine)
- **AI SDK**: `@google/genai` (SDK resmi Gemini terbaru dari Google)
- **Storage API**: HTML5 `localStorage` API dan W3C `IndexedDB` API
- **Security & Web API**: Web Crypto API (`crypto.subtle.digest`), Web Authentication API (`navigator.credentials`), Service Worker API, Notification API

---

## Project Structure

Struktur direktori aktual di dalam repositori:

```
/
├── components/               # Komponen UI modular
│   ├── AIInsights.tsx        # Tampilan wawasan analitis AI dan form input BYOK
│   ├── AchievementList.tsx   # Daftar pencapaian dan progress bar
│   ├── AchievementToast.tsx  # Notifikasi melayang saat pencapaian terbuka
│   ├── AddPhotoModal.tsx     # Modal pemilihan/pengambilan foto progres
│   ├── AppSettings.tsx       # Pengaturan tema, bahasa, pengingat, dan kunci AI
│   ├── BottomNav.tsx         # Bilah navigasi bawah 5 menu
│   ├── Calendar.tsx          # Komponen pemilih tanggal horizontal
│   ├── CustomMeasurementModal.tsx # Modal penambahan metrik kustom
│   ├── ErrorBoundary.tsx     # Penangan crash aplikasi level root
│   ├── FAB.tsx               # Floating Action Button mengambang
│   ├── GoalTracker.tsx       # Kartu penetapan & pemantauan target
│   ├── HistoryChart.tsx      # Komponen grafik garis Recharts
│   ├── Icons.tsx             # Koleksi ikon SVG mandiri
│   ├── ManageMeasurements.tsx# Manajemen aktif/nonaktif metrik
│   ├── MeasurementRow.tsx    # Baris input ukuran per tipe
│   ├── ProfileCard.tsx       # Tampilan & form edit profil pengguna
│   ├── ProgressBar.tsx       # Komponen progress bar umum
│   ├── SecuritySettings.tsx  # Pengaturan PIN dan Biometrik
│   ├── SetPinModal.tsx       # Modal keypad pembuatan/pengubahan PIN
│   ├── ThemeToggle.tsx       # Tombol switch mode terang/gelap
│   └── ViewPhotoModal.tsx    # Modal penampil foto ukuran penuh
├── context/                  # State management berbasis React Context
│   ├── AuthContext.tsx       # Otentikasi, status kunci, dan PIN/Biometrik
│   ├── DataContext.tsx       # Data utama (pengukuran, target, foto, kustom)
│   ├── LocalizationContext.tsx # Manajemen bahasa (ID/EN) dan teks terjemahan
│   └── ThemeContext.tsx      # Manajemen tema (light/dark)
├── hooks/                    # Custom React Hooks
│   ├── useAuth.ts            # Akses cepat ke AuthContext
│   └── useLocalStorage.ts    # Sinkronisasi state lokal dengan window.localStorage
├── lib/                      # Helper fungsional & utilitas non-UI
│   ├── achievements.ts       # Logika kalkulasi unlock pencapaian
│   ├── ai.ts                 # Penghubung client ke endpoint proxy AI
│   ├── auth.ts               # Hashing SHA-256 dan handler WebAuthn
│   ├── storage.ts            # Wrapper IndexedDB dan kompresi kanvas foto
│   ├── translations.ts       # Kamus terjemahan Bahasa Indonesia dan Inggris
│   └── utils.ts              # Fungsi utilitas (hitung umur, format tanggal)
├── pages/                    # Halaman rute aplikasi
│   ├── GalleryPage.tsx       # Grid foto progres transformasi
│   ├── HistoryPage.tsx       # Riwayat grafik dan ekspor CSV
│   ├── HomePage.tsx          # Beranda: target, rasio tubuh, AI insights
│   ├── LockScreen.tsx        # Layar penguncian PIN/Biometrik
│   ├── ProfilePage.tsx       # Halaman pengaturan profil dan aplikasi
│   └── RecordPage.tsx        # Halaman kalender pencatatan harian
├── App.tsx                   # Rute utama, provider wrapper, dan reminder
├── constants.ts              # Konfigurasi default metrik & ikon
├── index.html                # Entry point HTML, Tailwind CDN, manifest PWA
├── index.tsx                 # Root render React dengan ErrorBoundary
├── metadata.json             # Metadata kapabilitas AI Studio
├── package.json              # Dependensi npm dan konfigurasi skrip build
├── server.ts                 # Server Express: proxy Gemini & Vite middleware
├── service-worker.js         # Service worker PWA untuk caching offline (v3)
├── tsconfig.json             # Konfigurasi TypeScript
└── types.ts                  # Definisi TypeScript domain entities
```

---

## Application Structure & Hierarchy

Hierarki rendering komponen aplikasi:

```
[ index.tsx ]
   │
   └── <ErrorBoundary>
         │
         └── <App>
               ├── <ThemeProvider>
               │     └── <LocalizationProvider>
               │           └── <DataProvider>
               │                 └── <AuthProvider>
               │                       └── <HashRouter>
               │                             └── <AppContent>
               │                                   ├── Jika isLocked === true:
               │                                   │     └── <LockScreen />
               │                                   └── Jika isLocked === false:
               │                                         └── <MainApp>
               │                                               ├── <Routes> (Home | Record | Gallery | History | Profile)
               │                                               ├── <AchievementToast />
               │                                               └── <BottomNav />
```

---

## Main Components

1. **`DataContext.tsx`**: Inti dari seluruh manipulasi data. Menyimpan array `measurements`, objek `profile`, `activeGoal`, `photos`, serta mengelola mekanisme *upsert*, *delete*, dan pemicu evaluasi *achievements*.
2. **`AuthContext.tsx`**: Mengatur status proteksi aplikasi (`isLocked`), memvalidasi PIN berbasis hash, mendaftarkan kredensial biometrik via WebAuthn, dan mendengarkan event `visibilitychange` peramban.
3. **`RecordPage.tsx` & `MeasurementRow.tsx`**: Menggabungkan kalender horizontal dengan daftar baris metrik. Setiap baris memiliki mode *display* dan *input* yang tersinkronisasi secara reaktif dengan tanggal terpilih.
4. **`GalleryPage.tsx` & `lib/storage.ts`**: Menangani penambahan gambar, kompresi gambar berbasis kanvas HTML5 (resizing ke max 1280px, konversi ke WebP/JPEG kualitas 0.8), dan menyimpan hasilnya ke IndexedDB.
5. **`HomePage.tsx` & `AIInsights.tsx`**: Menghitung rasio biologis (BMI, WHR, WHtR, BMR, TDEE) secara lokal dan menyediakan kartu analisis 30 hari yang terhubung ke backend Express `/api/gemini/generate`.

---

## Data Model

```
┌────────────────────────────────────────┐       ┌───────────────────────────────┐
│              Profile                   │       │             Goal              │
├────────────────────────────────────────┤       ├───────────────────────────────┤
│ - name: string                         │       │ - id: string                  │
│ - gender: Gender                       │       │ - type: string                │
│ - birthDate: string (YYYY-MM-DD)       │       │ - startingValue: number       │
│ - height?: number (cm)                 │       │ - targetValue: number         │
│ - activityLevel: ActivityLevel         │       │ - startDate: string           │
└────────────────────────────────────────┘       └───────────────────────────────┘

┌────────────────────────────────────────┐       ┌───────────────────────────────┐
│            Measurement                 │       │          PhotoEntry           │
├────────────────────────────────────────┤       ├───────────────────────────────┤
│ - id: string                           │       │ - id: string                  │
│ - date: string (ISO)                   │       │ - date: string (YYYY-MM-DD)   │
│ - type: string                         │       │ - image: string (Data URL)    │
│ - value: number                        │       │ - note?: string               │
│ - note?: string                        │       └───────────────────────────────┘
└────────────────────────────────────────┘

┌────────────────────────────────────────┐       ┌───────────────────────────────┐
│        CustomMeasurementType           │       │           AuthData            │
├────────────────────────────────────────┤       ├───────────────────────────────┤
│ - id: string (e.g. 'custom_123')       │       │ - method: 'none'|'pin'|'bio'  │
│ - name: string                         │       │ - pinHash?: string (SHA-256)  │
│ - unit: string                         │       │ - credentialId?: string       │
└────────────────────────────────────────┘       └───────────────────────────────┘
```

---

## State Management

- Pendekatan yang digunakan adalah **React Context + Custom Hooks**, bukan Redux atau Zustand.
- State dibagi menjadi 4 konteks spesifik:
  - `ThemeContext`: Menyimpan status mode tema (`'light' | 'dark'`).
  - `LocalizationContext`: Menyimpan pilihan bahasa (`'id' | 'en'`) dan fungsi penerjemah `t(key, replacements)`.
  - `DataContext`: Menampung seluruh data operasional aplikasi.
  - `AuthContext`: Mengontrol status akses dan keamanan.
- Hook khusus `useLocalStorage<T>` bertindak sebagai jembatan dua arah (*two-way binding*) antara React State dan `window.localStorage`.

---

## Data Flow

```
[ Input Pengguna di UI ]
        │
        ▼
[ Hook / Handler Komponen (misal: handleSave) ]
        │
        ▼
[ Context Dispatcher (misal: upsertMeasurement) ]
        ├──► Simpan ke React State (memicu re-render UI seketika)
        ├──► Tulis ke localStorage (atau IndexedDB untuk foto)
        └──► Panggil checkNewAchievements() ──► Jika ada yang baru, picu AchievementToast
```

---

## Storage / Persistence Strategy

Aplikasi menerapkan **Arsitektur Penyimpanan Hibrida Lokal (Local-First Hybrid Storage)**:

1. **`localStorage` (Data Ringan & Skalar)**:
   - Digunakan untuk: Profil, riwayat angka pengukuran, target, konfigurasi metrik kustom, hash PIN, preferensi tema, dan status pengingat.
   - Kelebihan: Pembacaan sinkron (*synchronous read*), bebas latensi saat inisialisasi komponen.
2. **`IndexedDB` (Data Objek Berat / Media)**:
   - Nama Database: `ukuraga_db`, Object Store: `photos`, KeyPath: `id`.
   - Digunakan untuk: Menyimpan foto progres transformasi.
   - Kelebihan: Kapasitas penyimpanan besar (ratusan megabyte tergantung disk pengguna), tidak membebani limit 5MB dari `localStorage`.
   - Mengikutsertakan fungsi otomatis `migrateLegacyPhotos()` untuk memindahkan foto lama dari `localStorage` ke IndexedDB saat startup aplikasi.

---

## External Services & Backend Gateway

Aplikasi ini mayoritas beroperasi tanpa server (*serverless client*), kecuali untuk layanan AI:

- **Express Gateway (`server.ts`)**:
  - Endpoint `GET /api/health`: Health check server.
  - Endpoint `GET /api/gemini/status`: Memeriksa apakah server memiliki `GEMINI_API_KEY` aktif di environment.
  - Endpoint `POST /api/gemini/generate`: Gerbang proxy aman untuk memanggil Google Gemini API menggunakan `@google/genai`.
  - Menangani autentikasi berlapis: Menggunakan header `x-gemini-api-key` jika pengguna menggunakan mode BYOK (Bring Your Own Key), atau menggunakan `process.env.GEMINI_API_KEY` jika disetel di server.

---

## AI Integration

- **Model**: `gemini-2.5-flash` (didefinisikan secara eksplisit di backend proxy).
- **Strategi Pemanggilan**:
  - *Server-proxied*: Kunci API tidak pernah bocor ke bundle JavaScript publik jika menggunakan environment server.
  - *Client-BYOK*: Jika server tidak memiliki API key, pengguna dapat memasukkan Gemini API key miliknya sendiri dari AI Studio melalui antarmuka Pengaturan atau prompt langsung. Kunci disimpan di `localStorage` lokal klien dan dikirim via header HTTP kustom ke proxy.
- **System Instructions**: Menginstruksikan model untuk bertindak sebagai *health metric assistant* objektif, berbasis data numerik nyata, melarang klaim diagnosa medis klinis, dan selalu menyertakan penafian hukum.

---

## Architectural Patterns

1. **Local-First Pattern**: Aplikasi dapat berjalan dan digunakan sepenuhnya saat perangkat offline (luring). Akses internet hanya dibutuhkan saat memanggil fitur analitik AI Gemini.
2. **Provider Pattern**: Mengisolasi *concerns* fungsional ke dalam Provider React berjenjang (`Theme`, `Localization`, `Data`, `Auth`).
3. **Optimistic & Defensive Ingress**: Input foto langsung dikompresi di kanvas sebelum masuk ke basis data lokal untuk menghindari kehabisan kuota browser.
4. **Graceful Fallback AI**: Jika API key AI tidak tersedia atau terjadi gangguan jaringan, aplikasi tidak memunculkan dialog crash yang mengganggu; sistem menyembunyikan kartu atau menampilkan pesan informatif non-intrusif.

---

## Security Considerations

- **PIN Security**: PIN 4 digit tidak pernah disimpan dalam bentuk teks biasa (*plain text*). PIN di-hash menggunakan algoritma SHA-256 via Web Crypto API sebelum disimpan di storage.
- **Biometric Security**: Menggunakan standar WebAuthn lokal peramban. Data biometrik (sidik jari/wajah) diproses langsung oleh sistem operasi perangkat, bukan oleh kode JavaScript aplikasi.
- **Inactivity Locking**: Event `visibilitychange` memastikan aplikasi terkunci segera saat tab peramban disembunyikan atau beralih aplikasi di ponsel.
- **BYOK Privacy**: Kunci Gemini pengguna hanya disimpan di `localStorage` peramban lokal dan hanya diteruskan saat melakukan inferensi analitik.

---

## Current Technical Debt

1. **Tailwind Runtime via CDN**:
   - `index.html` memuat `<script src="https://cdn.tailwindcss.com">`.
   - *Dampak*: Ukuran script CDN lebih besar dibandingkan hasil build Tailwind CLI yang sudah dipangkas (*purged*), dan ada potensi *flash of unstyled content (FOUC)* saat jaringan lambat.
2. **Penggunaan Array Tunggal untuk Pengukuran di `localStorage`**:
   - Seluruh catatan disimpan dalam satu key `ukuraga_measurements`.
   - *Dampak*: Jika riwayat pengukuran mencapai ribuan data selama bertahun-tahun, proses parsing dan serialisasi JSON pada setiap *upsert* akan membutuhkan alokasi memori berlebih. Seharusnya data historis dipindahkan ke IndexedDB seperti halnya foto.
3. **Ketiadaan Unit Tests**:
   - Tidak ada rangkaian automated test (Jest, Vitest, atau Playwright) untuk memverifikasi kalkulasi matematis BMR/TDEE dan aturan pencapaian (*achievements*).

---

## Scalability & Maintainability Considerations

- **Skalabilitas Vertikal (Data)**: Dengan struktur saat ini, aplikasi sangat ringan untuk penggunaan tipikal (1-3 tahun pencatatan harian). Batas performa baru akan terasa jika riwayat metrik melampaui 10.000 titik data di `localStorage`.
- **Maintainability**: Kode sangat bersih dan terorganisir dengan rapi. Pembagian folder (`components`, `pages`, `context`, `lib`, `hooks`) memiliki pemisahan tanggung jawab (*separation of concerns*) yang jelas. Tipe data TypeScript didefinisikan secara terpusat di `types.ts`.

---

## Architecture Assessment

- **What was actually found**: Arsitektur Single Page Application (SPA) yang sangat terarah, rapi, dan matang untuk skala aplikasi personal. Pilihan memisahkan foto ke IndexedDB dan angka ke `localStorage` adalah keputusan teknis yang tepat dan realistis.
- **Interpretation**: Aplikasi ini dibangun bukan sebagai kode sekali pakai (*throwaway code*), melainkan telah dipikirkan siklus hidup penggunaannya, terbukti dari adanya modul error boundary, migrasi data foto lama, dan dukungan BYOK AI.
- **Assumptions**: Aplikasi diasumsikan akan terus dipakai dalam mode personal (satu pengguna per instalasi peramban). Jika ingin dikembangkan menjadi multi-pengguna dengan sinkronisasi cloud, arsitektur sinkronisasi lokal-ke-cloud (seperti CRDT atau Firestore offline-persistence) perlu diintegrasikan.
