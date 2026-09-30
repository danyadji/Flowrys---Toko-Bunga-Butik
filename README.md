# Flowrys, Toko Bunga Butik

Website florist sederhana: jelajahi koleksi, isi keranjang, selesaikan
pesanan lewat WhatsApp. Pemilik toko mengelola katalog lewat panel admin.

> Demo publik belum di-deploy. Cara menjalankan lokal ada di bawah.

## Fitur

- Landing page: hero, kategori, produk terlaris, cara pesan, banner custom order
- Koleksi: filter kategori, pencarian, 4 urutan, filter tersimpan di URL
- Detail produk: galeri, jumlah, tambah keranjang, pesan via WhatsApp langsung
- Keranjang persisten (localStorage) dengan sinkronisasi katalog
- Checkout dua metode (ambil di toko, diantar) dengan validasi tanggal dan jam
- Panel admin: login simulasi, tabel produk, tambah, ubah, hapus, toggle stok, reset data demo

## Tech stack

- React 19 + Vite 8, Tailwind CSS 3, React Router 7
- TanStack Query (data), Zustand + persist (keranjang), React Hook Form + Zod (form)
- Vitest + React Testing Library, ESLint + Prettier
- Fase 2 (rencana): Laravel REST API + MySQL, lihat `docs/api-contract.md`

## Arsitektur ringkas

```
pages/      susun fitur jadi halaman, tanpa logika bisnis
features/   modul per domain (products, cart, checkout, admin)
components/ komponen generik (ui) dan layout
services/   satu-satunya pintu data (productService, authService)
services/adapters  localStorage (Fase 1), HTTP (Fase 2)
utils/      fungsi murni: rupiah, slug, tanggal, pesan WhatsApp
```

Semua akses data berupa Promise dengan bentuk `{ data, meta }` seperti
kontrak API, sehingga Fase 2 hanya mengganti adapter.

## Akun demo

- Admin: `admin@demo.com` / `demo123`
- Login admin hanya simulasi untuk demo, bukan pengamanan sungguhan.

## Cara menjalankan lokal

```sh
cd frontend
npm install
npm run dev     # http://localhost:5173
npm run test    # 54 tes
npm run lint
npm run build
```

## Backend (Fase 2, M6)

Laravel 13 + MySQL + Sanctum mode token. Syarat: PHP 8.2+, Composer,
MySQL (misal Laragon). Buat database `flowrys` dan `flowrys_testing`.

```sh
cd backend
composer install
cp .env.example .env   # sesuaikan DB_DATABASE=flowrys, FRONTEND_URL
php artisan migrate --seed
php artisan test    # 7 tes
php artisan serve   # http://localhost:8000
```

Frontend memakai backend dengan:

```sh
cd frontend
VITE_DATA_SOURCE=api VITE_API_URL=http://localhost:8000/api/v1 npm run dev
```

Dokumentasi API otomatis: jalankan `php artisan scribe:generate`,
buka `http://localhost:8000/docs`. Spesifikasi OpenAPI dan koleksi
Postman ada di `backend/storage/app/private/scribe/`.

## Batasan demo mode

- Data hanya tersimpan di browser masing-masing (localStorage). Perubahan yang
  dibuat admin tidak terlihat pengunjung lain.
- Login admin simulasi. Jangan pakai data asli.
- Ongkir tidak dihitung otomatis, dikonfirmasi admin via WhatsApp.
- Nomor WhatsApp `6281234567890` adalah placeholder.
- Foto produk di seed memakai placeholder sampai diunduh dari
  `docs/foto-produk.md`.

## Keamanan dan batasan demo mode

- Header keamanan (CSP, nosniff, frame-ancestors) terpasang di `vercel.json`.
- Tidak ada secret di kode. Variabel `VITE_*` hanya berisi flag demo dan email demo.
- Deskripsi produk dirender sebagai teks biasa. `dangerouslySetInnerHTML`
  dilarang oleh aturan lint.
- Gambar admin hanya menerima JPEG/PNG/WebP dan URL `https://`.
- Yang diamankan di Fase 2: autentikasi Sanctum, rate limit login, validasi
  Form Request, upload ke storage, `APP_DEBUG=false`, backup database.

## Roadmap Fase 2

Backend Laravel di folder `backend/`: migrasi `categories`, `products`,
`product_images`, `users`; endpoint publik dan admin sesuai
`docs/api-contract.md`; skema di `docs/erd.md`. Frontend cukup mengganti
adapter lewat `VITE_DATA_SOURCE=api`.
