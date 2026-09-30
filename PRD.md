# PRD: Flowrys

**Versi:** 1.2
**Status:** Draft
**Jenis projek:** Portofolio (showcase)
**Tech stack:** React (frontend, fase 1), Laravel + MySQL (backend, fase 2)

> v1.2: mengunci keputusan D1-D10 dari `TASKS.md` (kategori `buket`, `bunga-papan`, `bunga-meja`, `hampers`; model produk + `originalPrice`, `rating`, `soldCount`, `badge`; filter Momen dan halaman Korporat ditunda; tombol Custom Order via WhatsApp ikut dibuat).

---

## 1. Ringkasan

Flowrys adalah website toko bunga (florist) sederhana yang menjual buket bunga, bunga meja, hampers, dan produk bunga lainnya. Pengunjung dapat menjelajahi koleksi, memasukkan produk ke keranjang, lalu menyelesaikan pesanan dengan diarahkan ke WhatsApp toko. Pemilik toko mengelola katalog melalui panel admin.

Projek dikerjakan bertahap:

- **Fase 1 (scope dokumen ini):** frontend saja, dengan mock data dan penyimpanan localStorage.
- **Fase 2:** backend Laravel REST API + MySQL, menggantikan mock data.

## 2. Latar Belakang dan Tujuan

Banyak toko bunga UMKM menerima pesanan lewat WhatsApp dan katalog di Instagram, sehingga pesanan tidak terstruktur dan katalog sulit dikelola.

**Tujuan projek:**

1. Menunjukkan kemampuan membangun aplikasi React yang utuh: landing page, katalog, keranjang, dan dashboard admin.
2. Menunjukkan pemahaman arsitektur fullstack melalui perencanaan API dan skema database, walau backend dibangun belakangan.
3. Menghasilkan demo publik yang bisa dicoba recruiter atau klien tanpa instalasi.

**Bukan tujuan:** menjadi platform e-commerce lengkap dengan pembayaran online.

## 3. Target Pengguna

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Pembeli** | Orang yang membeli bunga untuk hadiah, acara, atau dekorasi. Mayoritas membuka lewat HP. | Melihat pilihan dengan mudah, tahu harga, memesan cepat, mengatur tanggal kirim dan kartu ucapan. |
| **Admin toko** | Pemilik atau staf Flowrys. | Menambah, mengubah, dan menghapus produk, serta menandai stok habis, tanpa keahlian teknis. |
| **Reviewer portofolio** | Recruiter atau klien potensial. | Memahami projek dengan cepat, mencoba fitur, dan melihat kualitas kode dan dokumentasi. |

## 4. Scope

### 4.1 In scope (Fase 1)

- Landing page
- Halaman koleksi (daftar, filter, pencarian, sort) dan detail produk
- Keranjang belanja
- Checkout yang menghasilkan pesan WhatsApp, dengan pilihan metode penerimaan (ambil di toko atau diantar, termasuk ke lokasi acara)
- Panel admin dengan CRUD produk (login mock)
- Demo mode: mock data, penyimpanan localStorage, tombol reset data
- Responsif (mobile-first)
- Deploy ke hosting statis (Vercel/Netlify)
- Dokumentasi: README, PRD, rencana ERD dan API contract

### 4.2 Out of scope (Fase 1)

- Backend Laravel dan database MySQL (direncanakan di dokumen ini, dibangun di Fase 2)
- Pembayaran online
- Akun dan login pembeli
- Manajemen pesanan di sisi admin
- Stok real-time dan multi-user
- Perhitungan ongkir otomatis (ongkir dikonfirmasi manual via WhatsApp)
- Multi-bahasa
- Notifikasi email

### 4.3 Rencana Fase 2 (informasi)

Laravel REST API, MySQL, Sanctum untuk autentikasi admin, upload gambar ke storage. Filament dicatat sebagai alternatif panel admin jika projek dipakai toko sungguhan. Pengembangan lain yang dipertimbangkan: zona pengiriman dengan tarif estimasi.

## 5. Kategori Produk

| Kategori | Slug |
|---|---|
| Buket Bunga | `buket` |
| Bunga Meja | `bunga-meja` |
| Hampers | `hampers` |
| Lainnya (opsional, dapat ditambah admin) | `lainnya` |

## 6. Fitur dan User Stories

### 6.1 Landing Page (`/`)

**Section:**
1. Navbar (logo, menu, ikon keranjang dengan jumlah item)
2. Hero (headline, subjudul, tombol "Lihat Koleksi")
3. Kategori (kartu ke halaman koleksi terfilter)
4. Produk unggulan (produk yang ditandai *featured*)
5. Cara pemesanan (3-4 langkah singkat)
6. Testimoni
7. Kontak dan lokasi
8. Footer (tautan, WhatsApp, media sosial)

**User stories:**
- Sebagai pembeli, saya ingin langsung memahami apa yang dijual Flowrys agar tahu apakah toko ini sesuai kebutuhan saya.
- Sebagai pembeli, saya ingin melihat produk unggulan agar cepat menemukan pilihan populer.

**Kriteria penerimaan:**
- Semua CTA mengarah ke halaman yang benar.
- Tampilan rapi di lebar 360px hingga desktop.

### 6.2 Koleksi (`/koleksi`) dan Detail Produk (`/produk/:slug`)

**Koleksi:**
- Grid produk (gambar, nama, harga, label stok habis bila ada)
- Filter kategori
- Pencarian berdasarkan nama
- Sort: terbaru, harga terendah, harga tertinggi
- Empty state saat hasil kosong

**Detail produk:**
- Galeri gambar (minimal 1 gambar)
- Nama, harga, kategori, deskripsi
- Pemilihan jumlah
- Tombol "Tambah ke Keranjang" (nonaktif jika stok habis)
- Tombol "Pesan via WhatsApp" langsung untuk produk tunggal
- Produk terkait (kategori sama)

**User stories:**
- Sebagai pembeli, saya ingin menyaring produk berdasarkan kategori agar tidak perlu menggulir semuanya.
- Sebagai pembeli, saya ingin melihat detail dan harga jelas sebelum memesan.

**Kriteria penerimaan:**
- Filter, pencarian, dan sort dapat dikombinasikan.
- Produk berstatus habis tidak bisa ditambahkan ke keranjang.
- URL detail memakai slug; slug tidak ditemukan menampilkan halaman 404.

### 6.3 Keranjang (`/keranjang`)

- Daftar item (gambar, nama, harga, jumlah)
- Ubah jumlah, hapus item
- Subtotal per item dan total
- Keranjang tersimpan di localStorage (tidak hilang saat refresh)
- Empty state dengan tautan ke koleksi

### 6.4 Checkout ke WhatsApp (`/checkout`)

**Metode penerimaan** (dipilih di bagian atas form):

| Metode | Perilaku form |
|---|---|
| **Ambil di toko** | Field alamat dan penerima disembunyikan. Tampil info alamat toko dan jam operasional. Pembeli hanya mengisi tanggal dan jam ambil. |
| **Diantar** | Field alamat dan data acara tampil. Pembeli mengisi tujuan, lokasi, serta tanggal dan jam tiba yang diinginkan. |

**Field form:**

| Field | Ambil di toko | Diantar | Keterangan |
|---|---|---|---|
| Nama pemesan | Wajib | Wajib | |
| Nomor HP pemesan | Wajib | Wajib | Validasi format Indonesia |
| Tanggal ambil / tanggal kirim | Wajib | Wajib | Minimal H+1 (lead time dari konfigurasi), tidak boleh tanggal lampau |
| Jam ambil / jam tiba | Wajib | Wajib | Dibatasi jam operasional toko |
| Jenis tujuan | - | Wajib | Pilihan: Rumah, Kantor, Acara/Venue |
| Nama acara atau lokasi | - | Opsional | Contoh: "Pernikahan Rina & Dimas", "Gedung Serbaguna X" |
| Nama penerima | - | Wajib | Bisa sama dengan pemesan |
| Nomor HP penerima | - | Opsional | |
| Alamat pengiriman | - | Wajib | |
| Patokan / catatan lokasi | - | Opsional | Contoh: "Lobi utama, hubungi panitia" |
| Kartu ucapan | Opsional | Opsional | Batas 200 karakter |
| Catatan tambahan | Opsional | Opsional | |

**Ongkos kirim (Fase 1):** tidak dihitung otomatis. Untuk metode Diantar, ringkasan pesanan menampilkan "Ongkir: dikonfirmasi admin via WhatsApp", dan total belum termasuk ongkir. Pilihan zona pengiriman dengan tarif estimasi dicatat sebagai pengembangan Fase 2.

**Alur:**
1. Pembeli memilih metode penerimaan, lalu mengisi form dan meninjau ringkasan pesanan.
2. Klik "Pesan via WhatsApp".
3. Sistem membentuk pesan terformat dan membuka `https://wa.me/<nomor>?text=<pesan ter-encode>`.
4. Setelah membuka WhatsApp, keranjang dikosongkan atau pembeli diberi opsi untuk mempertahankannya.

**Konfigurasi toko** (satu file config, bukan ditulis di banyak tempat): nomor WhatsApp, alamat toko, jam operasional, lead time minimal pemesanan.

**Contoh format pesan, metode Diantar:**

```
Halo Flowrys, saya ingin memesan:

*Pesanan*
1. Buket Rose Blush x1 - Rp250.000
2. Hampers Sweet Day x2 - Rp360.000

*Subtotal: Rp610.000*
Ongkir: dikonfirmasi admin

*Data Pemesan*
Nama: ...
No. HP: ...

*Metode: Diantar*
Tujuan: Acara/Venue
Acara/Lokasi: Pernikahan Rina & Dimas, Gedung Serbaguna X
Penerima: ...
Alamat: ...
Patokan: Lobi utama, hubungi panitia
Tanggal/Jam tiba: 14 Februari 2026, 10.00

*Kartu ucapan*
"..."

*Catatan*
...
```

**Contoh format pesan, metode Ambil di toko:**

```
Halo Flowrys, saya ingin memesan:

*Pesanan*
1. Buket Rose Blush x1 - Rp250.000

*Total: Rp250.000*

*Data Pemesan*
Nama: ...
No. HP: ...

*Metode: Ambil di toko*
Tanggal/Jam ambil: 14 Februari 2026, 10.00

*Kartu ucapan*
"..."
```

**User stories:**
- Sebagai pembeli, saya ingin memilih ambil di toko agar tidak perlu mengisi data pengiriman yang tidak relevan.
- Sebagai pembeli, saya ingin bunga diantar langsung ke lokasi acara pada jam tertentu.

**Kriteria penerimaan:**
- Mengganti metode penerimaan menampilkan atau menyembunyikan field yang sesuai, dan field tersembunyi tidak divalidasi.
- Semua field wajib pada metode terpilih tervalidasi sebelum tombol aktif.
- Pesan ter-encode dengan benar (karakter khusus, baris baru) dan formatnya menyesuaikan metode.
- Tanggal dan jam di luar aturan lead time atau jam operasional ditolak dengan pesan jelas.
- Nomor WhatsApp toko dibaca dari konfigurasi, bukan ditulis di banyak tempat.
- Di demo publik memakai nomor placeholder atau nomor khusus demo.

### 6.5 Panel Admin (`/admin`)

**Autentikasi (mock):**
- Halaman login dengan kredensial demo (contoh: `admin@demo.com` / `demo123`)
- Status login tersimpan di localStorage
- Rute `/admin/*` diproteksi; pengguna belum login diarahkan ke `/admin/login`

**Manajemen produk:**
- Tabel produk (gambar kecil, nama, kategori, harga, status stok, aksi)
- Pencarian dan filter kategori di tabel
- Tambah produk: nama, kategori, harga, deskripsi, gambar, status stok, tanda *featured*
- Edit produk dengan form yang sama
- Hapus produk dengan dialog konfirmasi
- Toggle cepat stok tersedia/habis
- Validasi form dan pesan error yang jelas

**Demo mode:**
- Banner "Demo mode: data disimpan di browser Anda"
- Tombol **Reset data demo** untuk mengembalikan data awal

**Catatan gambar (Fase 1):** gambar diinput lewat URL atau diunggah lalu disimpan sebagai data URL (base64) dengan batas ukuran, karena belum ada storage server. Di Fase 2 diganti upload ke Laravel storage.

**User stories:**
- Sebagai admin, saya ingin menambah produk baru agar katalog selalu terbarui.
- Sebagai admin, saya ingin menandai produk habis tanpa menghapusnya.
- Sebagai reviewer, saya ingin mengembalikan data ke kondisi awal setelah mencoba-coba.

## 7. Struktur Data

### 7.1 Model frontend (Fase 1)

```js
// Category
{ id, name, slug }

// Product
{
  id,
  name,
  slug,
  categoryId,
  price,            // integer, rupiah
  description,
  images,           // array of url
  isAvailable,      // boolean
  isFeatured,       // boolean
  createdAt,
  updatedAt
}

// CartItem
{ productId, quantity }
```

### 7.2 Rencana skema MySQL (Fase 2)

**categories**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint, PK | |
| name | varchar(100) | |
| slug | varchar(120), unique | |
| created_at, updated_at | timestamp | |

**products**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint, PK | |
| category_id | bigint, FK -> categories.id | |
| name | varchar(150) | |
| slug | varchar(170), unique | |
| price | unsigned int | Rupiah |
| description | text | |
| is_available | boolean | default true |
| is_featured | boolean | default false |
| created_at, updated_at | timestamp | |

**product_images**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint, PK | |
| product_id | bigint, FK -> products.id (cascade delete) | |
| path | varchar(255) | |
| sort_order | tinyint | |

**users** (admin), memakai tabel bawaan Laravel dengan kolom `role` sederhana atau seeder satu akun admin.

## 8. Rencana API (Fase 2)

Base URL: `/api/v1`

**Publik**

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/categories` | Daftar kategori |
| GET | `/products` | Daftar produk (query: `category`, `search`, `sort`, `page`) |
| GET | `/products/{slug}` | Detail produk |

**Admin (butuh token Sanctum)**

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/admin/login` | Login, mengembalikan token |
| POST | `/admin/logout` | Logout |
| POST | `/admin/products` | Tambah produk |
| PUT | `/admin/products/{id}` | Ubah produk |
| DELETE | `/admin/products/{id}` | Hapus produk |
| PATCH | `/admin/products/{id}/availability` | Ubah status stok |
| POST | `/admin/products/{id}/images` | Unggah gambar |

**Contoh response `GET /products`:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Buket Rose Blush",
      "slug": "buket-rose-blush",
      "category": { "id": 1, "name": "Buket Bunga", "slug": "buket" },
      "price": 250000,
      "description": "...",
      "images": ["https://.../rose-blush.jpg"],
      "is_available": true,
      "is_featured": true
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "total": 24 }
}
```

**Strategi migrasi:** semua akses data di frontend melalui `services/productService.js` dengan fungsi `getProducts`, `getProductBySlug`, `createProduct`, `updateProduct`, `deleteProduct`, dan `setAvailability`. Fase 2 hanya mengganti implementasi di dalam service (localStorage -> HTTP client). Komponen UI tidak diubah.

## 9. Tech Stack dan Struktur Folder

**Fase 1**
- React + Vite
- Tailwind CSS
- React Router
- State keranjang: Context API atau Zustand
- Form: React Hook Form (opsional) dengan validasi (Zod/Yup opsional)
- Deploy: Vercel atau Netlify

**Fase 2**
- Laravel (REST API), Sanctum, MySQL
- Deploy backend menyusul (VPS/hosting PHP)

**Struktur repo**

```
flowrys/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/      # UI reusable (Button, Card, Modal, ...)
│       ├── features/
│       │   ├── products/
│       │   ├── cart/
│       │   ├── checkout/
│       │   └── admin/
│       ├── pages/
│       ├── services/        # productService, authService
│       ├── data/            # mock data awal
│       ├── hooks/
│       ├── utils/           # format rupiah, builder pesan WA, slugify
│       └── routes/
├── backend/                 # kosong; dibuat di Fase 2
├── docs/
│   ├── PRD.md
│   ├── design.md            # dari pemilik projek, dikirim bertahap
│   ├── erd.md
│   └── api-contract.md
└── README.md
```

## 10. Desain dan Identitas

- **Nama toko:** Flowrys
- **Panduan desain:** mengikuti `design.md` yang dikirim bertahap selama pengerjaan (palet warna, tipografi, gaya komponen, dan aset).
- **Prinsip umum:** mobile-first, foto produk sebagai fokus utama, tampilan bersih dan konsisten.
- **Aset:** 12-20 foto produk dengan tone konsisten dari sumber berlisensi bebas (Unsplash/Pexels), dengan atribusi bila diperlukan.

> Bagian ini akan diperbarui setelah `design.md` diterima. Sebelum itu, komponen dibangun dengan token desain (warna, font, radius) yang mudah diganti di satu tempat.

## 11. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Responsif | Nyaman dari 360px hingga desktop |
| Performa | Skor Lighthouse Performance >= 85 di mobile; gambar dioptimasi dan lazy load |
| Aksesibilitas | Alt text gambar, kontras memadai, navigasi keyboard dasar, label form |
| SEO dasar | Title dan meta description per halaman, judul heading berurutan, Open Graph untuk landing |
| Kualitas kode | Struktur folder konsisten, komponen reusable, ESLint dan Prettier |
| Kompatibilitas | Chrome, Safari, Firefox, Edge versi terbaru |
| Keamanan (Fase 1) | Tidak menyimpan data sensitif; kredensial admin bersifat demo dan dinyatakan jelas |

## 12. Batasan dan Asumsi

- Admin Fase 1 hanya mengubah data di browser yang sama, sehingga pengunjung lain tidak melihat perubahannya. Ini dinyatakan di README dan banner demo.
- Login admin Fase 1 hanya simulasi, **bukan** pengamanan sungguhan.
- Harga dan produk bersifat dummy.
- Checkout tidak menyimpan pesanan; pesanan hanya berupa pesan WhatsApp.
- Ongkir tidak dihitung otomatis; dibahas manual lewat WhatsApp, dan total di pesan belum termasuk ongkir.
- Alamat toko, jam operasional, dan lead time pemesanan di demo berupa data placeholder.

## 13. Milestone

| # | Milestone | Deliverable |
|---|---|---|
| M0 | Persiapan | PRD final, `design.md` awal, aset foto, mock data |
| M1 | Setup | Repo, Vite + Tailwind + Router, struktur folder, `productService` dengan mock data, layout dasar |
| M2 | Storefront | Landing page, koleksi, detail produk |
| M3 | Keranjang dan checkout | Keranjang persisten, form checkout dengan metode ambil/antar, pesan WhatsApp |
| M4 | Admin | Login mock, tabel produk, CRUD, toggle stok, reset data demo |
| M5 | Polish dan deploy | Cek mobile, loading/empty/error state, SEO dasar, deploy, README |
| M6 | Fase 2 | ERD final, Laravel API, MySQL, integrasi ke `productService` |

## 14. Kriteria Selesai (Fase 1)

- [ ] Semua halaman pada bagian 6 berfungsi tanpa error di konsol.
- [ ] Alur pesan sampai membuka WhatsApp dengan pesan yang benar dan terformat, untuk kedua metode penerimaan.
- [ ] CRUD admin berfungsi dan tombol reset data demo bekerja.
- [ ] Tampilan sesuai `design.md` dan rapi di mobile.
- [ ] Demo ter-deploy dan dapat diakses publik, termasuk refresh di rute `/admin`.
- [ ] README berisi link demo, screenshot atau GIF, kredensial demo, fitur, tech stack, cara menjalankan lokal, dan roadmap Fase 2.
- [ ] Dokumen ERD dan API contract tersedia di `docs/`.

## 15. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Foto produk tidak konsisten | Kesan portofolio menurun | Pilih satu tone/sumber sejak awal |
| localStorage penuh oleh gambar base64 | Admin error | Batasi ukuran gambar, utamakan input URL |
| Scope melebar (fitur pesanan, pembayaran) | Projek tidak selesai | Patuhi bagian Out of Scope |
| Refresh rute SPA 404 di hosting | Demo terlihat rusak | Tambahkan konfigurasi rewrite (`vercel.json` / `_redirects`) |
| Pengunjung mengirim pesan ke nomor pribadi | Gangguan privasi | Gunakan nomor demo/placeholder |

## 16. Pertanyaan Terbuka

1. Nomor WhatsApp yang dipakai untuk demo?
2. Apakah ada kategori tambahan selain buket, bunga meja, dan hampers?
3. Isi `design.md`: palet warna, tipografi, dan gaya visual.
4. Apakah produk perlu varian (misalnya ukuran S/M/L)? Default Fase 1: tidak.
5. Data placeholder toko: alamat, jam operasional, dan lead time minimal pemesanan (default: H+1).