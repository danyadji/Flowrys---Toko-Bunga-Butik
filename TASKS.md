# Tasks: Flowrys

Rencana pengerjaan berdasarkan `PRD.md` (v1.2) dan `design.md` (v1.0).
Centang `[x]` saat selesai. ID tugas (contoh `M2-03`) dipakai untuk commit dan referensi.

**Legenda:** `[ ]` belum, `[~]` sedang dikerjakan, `[x]` selesai. Estimasi memakai satuan jam kerja fokus (jam).

---

## 0. Asumsi dan Keputusan yang Dikunci

Keputusan ini diambil supaya pengerjaan tidak tersendat. Ubah di sini dulu sebelum coding jika tidak setuju.

| # | Keputusan | Alasan |
|---|---|---|
| D1 | Kategori: `buket`, `bunga-papan`, `bunga-meja`, `hampers` | Sesuai referensi desain. Kategori "lainnya" dihapus dari default. |
| D2 | Model produk ditambah `originalPrice`, `rating`, `soldCount`, `badge` | Dibutuhkan kartu produk sesuai design.md. Rating dan terjual hanya data mock. |
| D3 | Filter dan menu **Momen** **ditunda** (bukan Fase 1) | Menjaga scope kecil. Field `occasions` tidak dibuat dulu. |
| D4 | Halaman **Korporat** tidak dibuat | Di luar scope. Menu tidak ditampilkan. |
| D5 | Tombol **Custom Order** dibuat (link WhatsApp dengan pesan template) | Murah dibuat, nilai bisnis tinggi, tidak butuh backend. |
| D6 | Ongkir manual via WhatsApp | Sesuai PRD 6.4. |
| D7 | Semua akses data **async (Promise)** walau sumbernya localStorage | Memaksa UI menangani loading dan error sejak awal, sehingga migrasi ke API tidak mengubah komponen. |
| D8 | Bahasa: **JavaScript** dengan JSDoc pada model dan service | Sesuai rencana awal. Jika ingin lebih ketat, ganti ke TypeScript sebelum M1 (biaya kecil di awal, jauh lebih murah dibanding migrasi belakangan). |
| D9 | Login admin Fase 1 adalah **simulasi** dan dinyatakan jelas di README dan banner demo | Tidak ada keamanan sungguhan tanpa server; jujur lebih baik daripada menyesatkan. |
| D10 | Fase 2: Sanctum **mode cookie SPA** bila frontend dan API satu domain induk; jika tidak, mode token | Cookie HttpOnly lebih tahan pencurian lewat XSS. Putuskan sebelum M6. |

---

## 1. Arsitektur dan Aturan Kode

### 1.1 Lapisan dan aturan dependensi

```
pages/            → menyusun fitur menjadi halaman, tanpa logika bisnis
  ↓
features/         → modul per domain (products, cart, checkout, admin)
  ↓                 berisi components, hooks, dan schema milik fitur itu
components/ui/    → komponen UI generik (Button, Chip, Badge, Modal, ...)
  ↓
services/         → satu-satunya pintu akses data (productService, authService)
  ↓
services/adapters → implementasi penyimpanan: localStorage (Fase 1), HTTP (Fase 2)
```

**Aturan (wajib):**
1. Dependensi hanya mengarah ke bawah. `components/ui` tidak boleh mengimpor dari `features`, dan `services` tidak boleh mengimpor dari React atau UI.
2. Komponen **tidak pernah** menyentuh `localStorage` atau `fetch` langsung. Semua lewat `services/`.
3. Fitur tidak saling mengimpor internal satu sama lain. Berbagi lewat `components/ui`, `utils`, atau `services`.
4. Semua warna, font, radius, dan bayangan berasal dari token Tailwind (design.md bagian 11). Tidak ada hex di komponen.
5. Semua teks yang sama (nomor WA, alamat toko, jam buka, lead time) dibaca dari `config/store.js`.
6. Fungsi murni (format rupiah, builder pesan WA, slugify, validasi tanggal) ada di `utils/` dan **wajib diuji**.
7. **Dilarang** memakai `dangerouslySetInnerHTML`; semua teks dari admin dirender sebagai teks biasa (ditegakkan aturan lint).
8. Semua data yang dibaca dari `localStorage` **divalidasi dengan skema Zod**; jika tidak valid, kembali ke seed.
9. Tidak ada secret di kode atau `VITE_*`; tautan eksternal memakai `rel="noopener noreferrer"`.

### 1.2 Kontrak service (jangan diubah bentuknya saat Fase 2)

```js
// services/productService.js
getProducts({ category, search, sort, page, pageSize }) → Promise<{ data, meta }>
getProductBySlug(slug)                                  → Promise<Product>
getFeaturedProducts()                                   → Promise<Product[]>
createProduct(input)                                    → Promise<Product>
updateProduct(id, input)                                → Promise<Product>
deleteProduct(id)                                       → Promise<void>
setAvailability(id, isAvailable)                        → Promise<Product>
getCategories()                                         → Promise<Category[]>
resetDemoData()                                         → Promise<void>   // hanya adapter demo

// services/authService.js
login({ email, password }) → Promise<{ user, token }>
logout()                   → Promise<void>
getSession()               → Promise<User | null>
```

Bentuk response `getProducts` sama dengan rencana API di PRD bagian 8 (`{ data, meta }`), agar komponen tidak berubah saat backend jadi.

### 1.3 Pilihan teknis

| Kebutuhan | Pilihan | Catatan |
|---|---|---|
| Build | Vite + React | |
| Styling | Tailwind CSS (token dari design.md) | |
| Routing | React Router (lazy route per halaman) | |
| Data fetching | TanStack Query | Cache, loading, error, invalidasi setelah mutasi admin |
| State keranjang | Zustand + middleware `persist` | Kecil, sederhana, otomatis tersimpan |
| Form | React Hook Form + Zod | Skema Zod dipakai juga untuk validasi checkout dan admin |
| Uji | Vitest + React Testing Library | E2E (Playwright) opsional di M5 |
| Kualitas | ESLint, Prettier, `eslint-plugin-boundaries` atau aturan impor sederhana | Menegakkan aturan 1.1 |
| Ikon | lucide-react | |

### 1.4 Konvensi

- **Penamaan:** komponen `PascalCase.jsx`, hook `useXxx.js`, util `camelCase.js`, folder `kebab-case`.
- **Commit:** Conventional Commits, contoh `feat(cart): add quantity stepper (M3-02)`.
- **Branch:** `main` selalu bisa deploy. Kerja di `feat/m2-storefront`, lalu merge per milestone via PR (walau kerja sendiri, PR menjadi jejak yang rapi).
- **Definition of Done (tiap tugas):** berfungsi, tidak ada error/warning di konsol, lint bersih, responsif di 360px dan 1280px, ada state loading/empty/error bila mengambil data, util murni punya tes.

### 1.5 Struktur folder (acuan)

```
frontend/src/
├── app/                 # providers (QueryClient, Router), layout root
├── assets/              # ilustrasi svg, logo
├── components/ui/       # Button, Chip, Badge, Input, Select, Modal, Toast, Skeleton
├── config/              # store.js (WA, alamat, jam buka, lead time), env.js
├── data/                # seed: categories.js, products.js
├── features/
│   ├── products/        # ProductCard, ProductGrid, filters, hooks (useProducts)
│   ├── cart/            # cartStore, CartItem, CartSummary
│   ├── checkout/        # CheckoutForm, schema, buildWhatsAppMessage
│   └── admin/           # AdminLayout, ProductTable, ProductForm, LoginForm
├── pages/               # Home, Collection, ProductDetail, Cart, Checkout, admin/*, NotFound
├── routes/              # definisi rute, ProtectedRoute
├── services/
│   ├── adapters/        # localStorageAdapter.js (Fase 1), httpAdapter.js (Fase 2)
│   ├── productService.js
│   └── authService.js
└── utils/               # formatRupiah, slugify, buildWhatsAppMessage, dateRules
```

---

## M0. Persiapan (± 4-6 jam)

- [ ] **M0-01** Finalkan keputusan D1-D8 di atas (revisi PRD ke v1.2 bila perlu)
- [ ] **M0-02** Kumpulkan 18 foto produk: rasio 4:5, tone konsisten, sumber berlisensi bebas; catat atribusi
- [ ] **M0-03** Siapkan data dummy 18 produk (nama, slug, kategori, harga, harga coret, deskripsi, rating, terjual, badge) sebagai `products.js`
- [ ] **M0-04** Siapkan logo Flowrys (wordmark + ikon bunga) dalam SVG
- [ ] **M0-05** Siapkan ilustrasi: hero (bunga kiri/kanan), 4 ilustrasi kategori, dekorasi kelopak dan sparkle, empty state
- [ ] **M0-06** Tulis copywriting utama: hero, deskripsi kategori, cara pesan, 3-4 testimoni, teks footer
- [ ] **M0-07** Tentukan nomor WA demo, alamat toko, jam operasional, lead time (default H+1)
- [ ] **M0-08** Buat repo GitHub, taruh `docs/PRD.md`, `docs/design.md`, `docs/tasks.md`, dan `CLAUDE.md`

**Selesai bila:** semua aset dan data dummy siap di satu folder dan repo sudah dibuat.

---

## M1. Setup dan Fondasi (± 6-8 jam)

Tujuan: kerangka yang benar sebelum satu pun halaman dibuat. Inilah yang menentukan apakah Fase 2 mulus.

- [x] **M1-01** Inisialisasi `frontend/` dengan Vite + React
- [x] **M1-02** Pasang Tailwind, masukkan **semua token** dari design.md bagian 11 dan kelas komponen dasar
- [x] **M1-03** Muat font Quicksand + Nunito, atur fallback, cek tampil benar
- [x] **M1-04** Setup ESLint + Prettier + aturan batas impor (aturan 1.1)
- [x] **M1-05** Setup Vitest + RTL, buat satu tes contoh yang lulus
- [x] **M1-06** Buat struktur folder sesuai 1.5
- [x] **M1-07** `config/store.js` dan `config/env.js` (nomor WA, alamat, jam, lead time, mode demo)
- [x] **M1-08** `utils/`: `formatRupiah`, `slugify`, `dateRules` (validasi H+N dan jam operasional), **beserta tes**
- [x] **M1-09** `data/categories.js` dan `data/products.js` dari M0
- [x] **M1-10** `services/adapters/localStorageAdapter.js`: baca/tulis dengan *seed* awal, versi skema data (`schemaVersion`), penanganan data rusak (fallback ke seed), simulasi latensi kecil (150-300ms)
- [x] **M1-11** `productService` sesuai kontrak 1.2 (filter, cari, sort, paginasi, CRUD, `resetDemoData`) **beserta tes**
- [x] **M1-12** `authService` mock (kredensial demo dari env, sesi di localStorage)
- [x] **M1-13** `app/`: QueryClientProvider, Router, layout root, `ErrorBoundary`, halaman `NotFound`
- [x] **M1-14** Komponen UI dasar: `Button` (primer/outline/ghost), `Chip`, `Badge`, `Input`, `Select`, `Skeleton`, `Toast`, `Modal`
- [ ] **M1-15** Konfigurasi rewrite SPA (`vercel.json` atau `_redirects`) dan deploy awal kosong ke Vercel/Netlify untuk memastikan pipeline jalan
- [x] **M1-16** Header keamanan di `vercel.json`/`_headers`: Content-Security-Policy (izinkan `self`, Google Fonts, `img-src` untuk `self data: https:`), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `frame-ancestors 'none'`; pastikan font dan gambar tetap tampil
- [ ] **M1-17** CI GitHub Actions (lint, tes, `npm audit`) dan aktifkan Dependabot
- [x] **M1-18** Aturan ESLint yang melarang `dangerouslySetInnerHTML` (`react/no-danger`)
- [x] **M1-19** Skema Zod untuk `Product` dan `Category`; adapter memvalidasi data yang dibaca dari localStorage dan kembali ke seed bila tidak valid **beserta tes**

**Selesai bila:** aplikasi kosong bisa di-deploy dengan header keamanan aktif, `productService` lulus tes, data localStorage tervalidasi, token desain berfungsi, lint, tes, dan audit hijau.

---

## M2. Storefront (± 14-18 jam)

Urutan: layout → komponen → halaman.

### Layout dan komponen bersama
- [x] **M2-01** `Navbar` floating pill (sticky, hamburger di mobile, ikon keranjang dengan badge jumlah)
- [x] **M2-02** `Footer`
- [x] **M2-03** `ProductCard` sesuai design.md 5.3 (rating, badge, harga coret, stok habis, hover)
- [x] **M2-04** `ProductCardSkeleton` dan `EmptyState` (ilustrasi + teks + aksi)

### Landing page (`/`)
- [x] **M2-05** Hero: H1 dengan coretan tangan (SVG), dua CTA, ilustrasi, dekorasi melayang (patuhi `prefers-reduced-motion`)
- [x] **M2-06** Section kategori: 4 kartu arch, tautan ke `/koleksi?kategori=...`
- [x] **M2-07** Section produk terlaris: bento grid, kartu besar, tab segmented, kartu Custom Order (D5)
- [x] **M2-08** Section cara pesan
- [ ] **M2-09** Section testimoni — **DIBATALKAN sementara**: menunggu 3 ulasan asli yang terverifikasi (aturan antislop R-18 melarang testimoni karangan; lihat `docs/copywriting.md`)
- [x] **M2-10** Banner CTA plum dan link Custom Order ke WhatsApp (pesan template)

### Koleksi (`/koleksi`)
- [x] **M2-11** Chip kategori dengan jumlah, search (debounce 300ms), select sort (Terpopuler, Terbaru, Harga naik, Harga turun)
- [x] **M2-12** State filter tersimpan di **URL query string** (bisa dibagikan, tombol back berfungsi)
- [x] **M2-13** Grid produk dengan loading skeleton, empty state, dan penanganan error + tombol coba lagi
- [x] **M2-14** Banner CTA "Tidak menemukan yang pas?"

### Detail produk (`/produk/:slug`)
- [x] **M2-15** Galeri gambar, info produk, stepper jumlah, tombol tambah keranjang (nonaktif jika stok habis)
- [x] **M2-16** Tombol "Pesan via WhatsApp" langsung untuk satu produk
- [x] **M2-17** Produk terkait (kategori sama, tidak termasuk dirinya)
- [x] **M2-18** Slug tidak ditemukan → `NotFound`

### SEO dasar
- [x] **M2-19** Title dan meta description per halaman (react-helmet-async atau setara), Open Graph untuk landing

**Selesai bila:** semua halaman publik bisa dinavigasi, filter/pencarian/sort dapat dikombinasikan dan tersimpan di URL, tampilan cocok dengan design.md di mobile dan desktop.

---

## M3. Keranjang dan Checkout (± 10-12 jam)

- [x] **M3-01** `cartStore` (Zustand + persist): tambah, ubah jumlah, hapus, kosongkan, total; **beserta tes**
- [x] **M3-02** Sinkronisasi keranjang dengan katalog: produk yang dihapus admin atau menjadi stok habis ditandai/dikeluarkan dari keranjang saat dimuat
- [x] **M3-03** Halaman `/keranjang`: daftar item, stepper, hapus, ringkasan sticky (desktop) / bar bawah (mobile), empty state
- [x] **M3-04** Skema Zod checkout dengan **validasi kondisional** berdasarkan metode (ambil vs antar), termasuk aturan tanggal/jam dari `dateRules`
- [x] **M3-05** `CheckoutForm`: kartu radio metode penerimaan, field muncul/hilang sesuai metode, field tersembunyi tidak divalidasi (PRD 6.4)
- [x] **M3-06** Ringkasan pesanan di halaman checkout (item, subtotal, catatan "ongkir dikonfirmasi admin" untuk diantar)
- [x] **M3-07** `utils/buildWhatsAppMessage`: dua format (diantar dan ambil di toko), `encodeURIComponent` benar untuk karakter khusus dan baris baru, **beserta tes snapshot** untuk kedua format
- [x] **M3-08** Tombol "Pesan via WhatsApp": membuka `wa.me` di tab baru dengan `rel="noopener noreferrer"`, lalu tawarkan kosongkan keranjang
- [x] **M3-09** Pesan WhatsApp untuk pemesanan langsung dari halaman detail (M2-16) memakai builder yang sama
- [x] **M3-10** Penanganan kasus tepi: keranjang kosong di `/checkout` diarahkan ke koleksi, nomor WA tidak terkonfigurasi menampilkan pesan yang jelas
- [x] **M3-11** Batasi panjang tiap field checkout (nama, alamat, kartu ucapan 200, catatan) dan panjang total pesan; tes dengan input berisi karakter khusus, emoji, dan baris baru

**Selesai bila:** dari memilih produk sampai WhatsApp terbuka dengan pesan benar berjalan untuk kedua metode, dan tes builder pesan lulus.

---

## M4. Admin (± 12-14 jam)

- [x] **M4-01** `LoginPage` dengan kredensial demo ditampilkan di kotak kecil, validasi, pesan error
- [x] **M4-02** `ProtectedRoute` untuk `/admin/*` (redirect ke login, kembali ke halaman tujuan setelah login)
- [x] **M4-03** `AdminLayout`: sidebar plum, header, tombol logout, banner demo mode
- [x] **M4-04** `ProductTable`: thumbnail, nama, kategori, harga, status stok, aksi; pencarian dan filter kategori; paginasi
- [x] **M4-05** Toggle cepat stok tersedia/habis dengan *optimistic update* dan rollback bila gagal
- [x] **M4-06** `ProductForm` (tambah dan edit, komponen yang sama): nama, slug otomatis (bisa diubah, harus unik), kategori, harga, harga coret, deskripsi, badge, featured, stok
- [x] **M4-07** Input gambar: URL atau unggah file → kompres di klien (batas lebar dan ukuran) → data URL; preview; batasi jumlah gambar; peringatan bila penyimpanan hampir penuh; **hanya terima JPEG/PNG/WebP, tolak SVG, URL wajib `https://`**
- [x] **M4-08** Validasi Zod: harga bilangan bulat > 0, harga coret > harga jual bila diisi, slug unik, minimal 1 gambar
- [x] **M4-09** Hapus produk dengan modal konfirmasi
- [x] **M4-10** Setelah mutasi, invalidasi cache TanStack Query sehingga storefront ikut terbarui
- [x] **M4-11** Tombol **Reset data demo** dengan konfirmasi, kembali ke seed
- [x] **M4-12** Penanganan `QuotaExceededError` localStorage dengan pesan yang bisa dipahami
- [x] **M4-13** Deskripsi produk diperlakukan sebagai teks biasa (jaga baris baru lewat CSS `white-space: pre-line`), tanpa HTML; tes bahwa input berisi tag tidak dieksekusi
- [x] **M4-14** Sesi admin mock: simpan hanya penanda sesi (bukan password), tampilkan label "simulasi" di halaman login

**Selesai bila:** seluruh CRUD berfungsi, perubahan tampak di storefront, reset data bekerja, halaman admin terlindungi, dan tidak ada crash saat penyimpanan penuh.

---

## M5. Polish, Kualitas, dan Deploy (± 10-12 jam)

- [x] **M5-01** Audit responsif di 360, 768, 1280px untuk semua halaman
- [x] **M5-02** Audit aksesibilitas: kontras, alt gambar, label form, fokus keyboard, fokus modal, `aria-live` untuk error
- [x] **M5-03** Optimasi gambar: WebP, ukuran sesuai layar (`srcset`/`sizes`), `loading="lazy"`, dimensi eksplisit agar tidak layout shift
- [x] **M5-04** Code splitting: lazy load halaman admin dan halaman berat; cek ukuran bundle
- [ ] **M5-05** Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 90, SEO ≥ 90; perbaiki temuan (tertunda: butuh browser Chrome + URL deploy)
- [x] **M5-06** Konsistensi state: loading, empty, error di setiap halaman yang mengambil data
- [x] **M5-07** Tes tambahan pada jalur kritis (checkout kondisional, filter URL, CRUD service); opsional 1-2 tes E2E dengan Playwright (alur pesan dan alur admin)
- [x] **M5-08** Favicon, `manifest`, gambar Open Graph, `robots.txt`
- [x] **M5-09** Pastikan nomor WA di produksi adalah nomor demo, bukan pribadi
- [ ] **M5-10** Deploy final, uji refresh di `/admin` dan `/produk/:slug`, uji di HP sungguhan (tertunda: butuh akun Vercel/Netlify; rewrite + preview lokal sudah diverifikasi)
- [x] **M5-11** README lengkap: link demo, screenshot/GIF, fitur, tech stack, arsitektur ringkas, akun demo, cara menjalankan lokal, batasan demo mode, roadmap Fase 2
- [x] **M5-12** Tulis `docs/api-contract.md` dan `docs/erd.md` (diagram Mermaid) dari PRD bagian 7-8
- [x] **M5-13** Audit keamanan Fase 1: cek header di deployment (misalnya lewat securityheaders.com), `npm audit` tanpa temuan tinggi/kritis, cari secret di repo dan riwayat git, pastikan tidak ada `VITE_*` sensitif, CSP tidak memblokir aset
- [x] **M5-14** Tambah bagian "Keamanan dan batasan demo mode" di README (login simulasi, data hanya di browser, apa yang diamankan di Fase 2)

**Selesai bila:** semua kriteria selesai di PRD bagian 14 terpenuhi.

---

## M6. Fase 2: Backend Laravel + MySQL (setelah Fase 1 selesai)

Kerjakan di folder `backend/`. Storefront dan admin **tidak diubah**, hanya adapter data yang diganti.

### Backend
- [x] **M6-01** Buat projek Laravel, konfigurasi `.env`, koneksi MySQL, CORS untuk domain frontend
- [x] **M6-02** Migration: `categories`, `products` (dengan `original_price`, `rating`, `sold_count`, `badge`), `product_images`, dan tabel `users`
- [x] **M6-03** Model dan relasi, `Factory`, dan `Seeder` yang memakai data yang sama dengan seed frontend
- [x] **M6-04** API publik: `GET /categories`, `GET /products` (filter, cari, sort, paginasi), `GET /products/{slug}` memakai API Resource agar bentuk response sama dengan kontrak
- [x] **M6-05** Autentikasi admin dengan Sanctum: `login`, `logout`, middleware, pembatasan laju login (rate limit)
- [x] **M6-06** API admin: create, update, delete, ubah ketersediaan, dengan **Form Request** untuk validasi
- [x] **M6-07** Upload gambar ke storage (validasi tipe dan ukuran, nama file aman, hapus file saat produk dihapus)
- [x] **M6-08** Format error konsisten (422 validasi, 401, 404) dan pemetaan di frontend
- [x] **M6-09** Tes fitur (Pest/PHPUnit): endpoint publik, otorisasi admin, validasi, upload
- [x] **M6-10** Dokumentasi API (OpenAPI/Scribe) yang cocok dengan `api-contract.md`

### Keamanan Fase 2
- [x] **M6-S1** Putuskan mode Sanctum (cookie SPA vs token) dan konfigurasikan domain, CORS, serta CSRF sesuai pilihan
- [x] **M6-S2** Rate limiting login dan endpoint admin; password admin kuat dan tidak memakai password demo di produksi
- [x] **M6-S3** `$fillable` pada semua model, Form Request pada semua input, tanpa raw query
- [x] **M6-S4** Upload gambar: validasi tipe berdasarkan isi file, batas ukuran, nama file acak, resize dan re-encode, hapus file saat produk dihapus
- [x] **M6-S5** Produksi: `APP_DEBUG=false`, `.env` di luar git, `APP_KEY` dirahasiakan, cache konfigurasi
- [x] **M6-S6** CORS hanya untuk domain frontend, HTTPS wajib, header keamanan pada API
- [x] **M6-S7** User database dengan hak akses minimal dan backup berkala (uji restore sekali)
- [x] **M6-S8** `composer audit` di CI, pastikan log tidak memuat data sensitif
- [x] **M6-S9** Tes otorisasi: rute admin menolak pengguna tanpa token/peran (401/403)

### Integrasi
- [x] **M6-11** Buat `httpAdapter` (axios/fetch) yang memenuhi kontrak service 1.2; pilih adapter lewat env (`VITE_DATA_SOURCE=demo|api`)
- [x] **M6-12** Ganti `authService` ke token Sanctum, tangani kedaluwarsa token
- [x] **M6-13** Ubah input gambar admin dari data URL menjadi unggah ke API
- [x] **M6-14** Uji regresi: seluruh alur Fase 1 berjalan tanpa perubahan pada komponen UI
- [ ] **M6-15** Deploy backend, pasang HTTPS, amankan `.env`, atur backup database (tertunda: butuh VPS/hosting PHP)
- [x] **M6-16** Perbarui README: arsitektur penuh, cara menjalankan frontend + backend, tautan dokumentasi API

**Opsional setelahnya:** ganti admin dengan Filament (jika dipakai toko sungguhan), zona ongkir, manajemen pesanan.

---

## Rangkuman Estimasi

| Milestone | Estimasi |
|---|---|
| M0 Persiapan | 4-6 jam |
| M1 Setup dan fondasi | 8-10 jam |
| M2 Storefront | 14-18 jam |
| M3 Keranjang dan checkout | 10-12 jam |
| M4 Admin | 13-15 jam |
| M5 Polish dan deploy | 12-14 jam |
| **Total Fase 1** | **± 61-75 jam** |
| M6 Backend (Fase 2) | ± 30-40 jam |

Estimasi kasar untuk satu developer. Kalau kerja sambilan sekitar 2 jam per hari, Fase 1 selesai kira-kira 5-6 minggu.

---

## Risiko Teknis dan Mitigasinya

| Risiko | Mitigasi |
|---|---|
| Komponen "bocor" ke localStorage sehingga migrasi sulit | Aturan 1.1 dan lint batas impor sejak M1 |
| localStorage penuh oleh gambar base64 | Kompres di klien, batasi jumlah dan ukuran, tangani `QuotaExceededError` (M4-07, M4-12) |
| Data localStorage lama rusak setelah skema berubah | `schemaVersion` dan fallback ke seed (M1-10) |
| Bentuk response berubah di Fase 2 | Kontrak service dikunci (1.2), API Resource mengikuti kontrak |
| Format pesan WA rusak oleh karakter khusus | Tes snapshot pada builder (M3-07) |
| Scope melebar (Momen, Korporat, pembayaran) | Patuhi D3, D4, dan daftar out of scope di PRD |
| Refresh rute SPA menghasilkan 404 | Rewrite dikonfigurasi dan diuji sejak M1-15 |
| Data localStorage dimanipulasi atau rusak | Validasi Zod saat baca, fallback ke seed (M1-19) |
| Unggahan SVG berskrip atau tag HTML di deskripsi | Whitelist tipe gambar (M4-07), teks biasa (M4-13), larangan `dangerouslySetInnerHTML` (M1-18) |
| CSP terlalu ketat sehingga font/gambar hilang | Uji di deployment sejak M1-16, audit ulang di M5-13 |
| Token admin dicuri lewat XSS (Fase 2) | Sanctum mode cookie bila memungkinkan (M6-S1), CSP ketat |

---

## Urutan Kerja yang Disarankan

1. M0 → M1 secara berurutan. Jangan lompat ke halaman sebelum fondasi selesai.
2. M2 → M3 → M4 berurutan, karena checkout bergantung pada produk dan admin bergantung pada service yang sudah teruji.
3. Merge ke `main` di akhir tiap milestone, dan deploy tiap kali `main` berubah supaya demo selalu hidup.
4. Setelah setiap milestone, catat di README bagian roadmap apa yang sudah selesai.