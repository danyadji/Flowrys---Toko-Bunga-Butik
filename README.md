# Flowrys, Toko Bunga Butik

Website florist: jelajahi koleksi, isi keranjang, selesaikan pesanan lewat
WhatsApp. Pemilik toko mengelola katalog lewat panel admin. Seluruh data
tersimpan di backend Laravel + MySQL.

## Fitur

- Landing page: hero, kategori, produk terlaris, cara pesan, banner custom order
- Koleksi: filter kategori, pencarian, 4 urutan, filter tersimpan di URL
- Detail produk: galeri, jumlah, tambah keranjang, pesan via WhatsApp langsung
- Keranjang persisten dengan sinkronisasi katalog
- Checkout dua metode (ambil di toko, diantar) dengan validasi tanggal dan jam
- Panel admin: login token, tabel produk, tambah, ubah, hapus, toggle stok, unggah foto

## Tech stack

- React 19 + Vite 8, Tailwind CSS 3, React Router 7
- TanStack Query (data), Zustand + persist (keranjang), React Hook Form + Zod (form)
- Vitest + React Testing Library, ESLint + Prettier
- Laravel 13 REST API + MySQL + Sanctum (token), PHPUnit, Scribe

## Arsitektur ringkas

```
pages/      susun fitur jadi halaman, tanpa logika bisnis
features/   modul per domain (products, cart, checkout, admin)
components/ komponen generik (ui) dan layout
services/   satu-satunya pintu data (productService, authService -> HTTP)
utils/      fungsi murni: rupiah, slug, tanggal, pesan WhatsApp
```

## Cara menjalankan lokal

Butuh: Node 22, PHP 8.2+, Composer, MySQL. Buat database `flowrys`.

```sh
cd backend
composer install
cp .env.example .env   # sesuaikan DB_DATABASE=flowrys, FRONTEND_URL
php artisan migrate --seed   # admin: admin@demo.com / demo123 (lokal saja)
php artisan serve      # http://localhost:8000
```

```sh
cd frontend
npm install
npm run dev     # http://localhost:5173 (VITE_API_URL di .env.local)
npm run test
npm run lint
npm run build
```

Dokumentasi API otomatis: jalankan `php artisan scribe:generate`,
buka `http://localhost:8000/docs`. Spesifikasi OpenAPI dan koleksi
Postman ada di `backend/storage/app/private/scribe/`.

## Batasan saat ini

- Ongkir tidak dihitung otomatis, dikonfirmasi admin via WhatsApp.
- Nomor WhatsApp `6281234567890` masih placeholder, ganti dengan nomor toko
  di `frontend/src/config/store.js` sebelum dipakai sungguhan.
- Foto seed memakai placeholder sampai diganti foto asli lewat panel admin.

## Keamanan

- Login admin memakai token Sanctum + rate limit. Akun demo wajib diganti
  sebelum backend dibuka ke internet.
- CORS hanya untuk domain frontend. Header keamanan (CSP, nosniff,
  frame-ancestors) terpasang di `vercel.json`.
- Tidak ada secret di kode. `.env` tidak masuk Git.
- Deskripsi produk dirender sebagai teks biasa. `dangerouslySetInnerHTML`
  dilarang oleh aturan lint.
- Gambar hanya menerima JPEG/PNG/WebP (maks 2MB), nama file acak, file
  dihapus saat produk dihapus.
