# Design System: Flowrys

**Versi:** 1.0
**Sumber:** 3 gambar referensi (landing hero + kategori, halaman koleksi, section produk terlaris)
**Catatan:** Referensi dipakai sebagai **inspirasi arah visual**, bukan untuk disalin. Flowrys memakai nama, logo, ilustrasi, dan copywriting sendiri. Kode warna di bawah adalah estimasi visual dari gambar dan boleh disesuaikan.

---

## 1. Karakter Visual

**Kata kunci:** hangat, lembut, feminin tapi bersih, playful, terpercaya.

| Prinsip | Penerapan |
|---|---|
| **Foto adalah bintang** | Foto produk besar, sudut membulat, tanpa border berat. UI tidak boleh bersaing dengan foto. |
| **Lembut, bukan manis berlebihan** | Warna pastel dipakai sebagai latar dan dekorasi. Warna gelap (plum) dipakai untuk teks dan aksi utama agar tetap tegas dan terbaca. |
| **Sentuhan tangan** | Garis bawah dan lingkaran hand-drawn pada kata kunci heading, ilustrasi bunga flat di hero. |
| **Bentuk membulat konsisten** | Tombol pill, kartu radius besar, kategori berbentuk arch (lengkung atas). |
| **Ruang napas** | Whitespace lega, satu fokus per section. |

**Mood:** toko bunga butik yang ramah, bukan katalog korporat.

---

## 2. Warna

### 2.1 Palet inti

| Token | Hex | Fungsi |
|---|---|---|
| `plum-900` | `#4A2030` | Teks heading, tombol primer, banner CTA, logo |
| `plum-700` | `#6B3F52` | Hover tombol primer, heading sekunder |
| `plum-500` | `#7A5565` | Chip aktif alternatif, ikon |
| `ink-body` | `#6B4A56` | Teks paragraf |
| `ink-muted` | `#9A8088` | Deskripsi kecil, harga coret, placeholder |
| `cream-50` | `#FAF6F3` | Background halaman utama |
| `cream-100` | `#F5EEE9` | Background section selang-seling |
| `white` | `#FFFFFF` | Navbar, kartu, chip, input |
| `line` | `#EBE0DB` | Border tipis input, chip, divider |

### 2.2 Aksen pastel (dekorasi dan latar kategori)

| Token | Hex | Pemakaian |
|---|---|---|
| `rose-200` | `#F6C9D3` | Garis bawah heading, dot kecil, latar kartu Buket |
| `rose-400` | `#E8A0B4` | Ilustrasi kelopak, aksen |
| `sage-200` | `#DCEBD5` | Latar kartu kategori (hijau) |
| `sage-400` | `#A9CFA0` | Ilustrasi daun dan batang |
| `peach-200` | `#FCE5D0` | Latar kartu kategori (peach) |
| `peach-400` | `#F4B98A` | Ilustrasi aksen |
| `lavender-200` | `#E9E0F3` | Latar kartu kategori (lavender) |

### 2.3 Fungsional

| Token | Hex | Pemakaian |
|---|---|---|
| `star` | `#F5B82E` | Ikon bintang rating (dekoratif, selalu disertai angka) |
| `success` | `#4C9A6A` | Notifikasi berhasil (admin) |
| `danger` | `#C0455B` | Error, hapus, stok habis |
| `warning` | `#D9952B` | Peringatan |

### 2.4 Aturan pakai

- Teks di atas `cream-50`/`white`: pakai `plum-900` atau `ink-body`. Rasio kontras sudah memadai untuk teks normal.
- Teks putih hanya di atas `plum-900` atau overlay gelap pada foto.
- Jangan letakkan teks di atas pastel dengan warna pastel lain.
- Satu section maksimal satu warna pastel dominan, kecuali section kategori yang memang memakai empat warna.
- Perbandingan visual kira-kira: 70% krem/putih, 20% plum, 10% pastel dan aksen.

---

## 3. Tipografi

### 3.1 Keputusan font

Font pada referensi terlihat seperti **Quicksand** (geometris, terminal membulat), dan itu pas dengan karakter lembut bunga. Namun Quicksand kurang nyaman untuk teks kecil (deskripsi produk, form). Keputusan saya sebagai perancang:

| Peran | Font | Alasan |
|---|---|---|
| **Heading dan angka harga** | **Quicksand** (600, 700) | Kembar dengan gaya referensi, ramah, kuat untuk judul besar. |
| **Body, form, UI kecil** | **Nunito** (400, 500, 600, 700) | Masih rounded sehingga serasi dengan Quicksand, tetapi lebih mudah dibaca di ukuran 12-16px dan mendukung teks Indonesia dengan baik. |

Keduanya gratis di Google Fonts. Fallback: `ui-rounded, system-ui, -apple-system, "Segoe UI", sans-serif`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Quicksand:wght@600;700&display=swap" rel="stylesheet">
```

Kalau ingin lebih sederhana (satu font saja), pakai Quicksand untuk semuanya dan naikkan ukuran teks kecil minimal 13px. Untuk Flowrys saya tetap sarankan dua font di atas.

### 3.2 Skala tipografi

| Level | Desktop | Mobile | Font / bobot | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Display (hero H1) | 64-72px | 40px | Quicksand 700 | 1.05 | -0.02em |
| H2 (judul section) | 40-44px | 30px | Quicksand 700 | 1.1 | -0.01em |
| H3 (judul kartu besar) | 24-28px | 22px | Quicksand 700 | 1.2 | 0 |
| H4 (nama produk) | 16-18px | 16px | Quicksand 700 | 1.3 | 0 |
| Body L (subjudul hero) | 18px | 16px | Nunito 400 | 1.6 | 0 |
| Body | 15-16px | 15px | Nunito 400 | 1.6 | 0 |
| Small (deskripsi produk) | 13px | 13px | Nunito 400 | 1.5 | 0 |
| Caption (rating, badge) | 11-12px | 11px | Nunito 600 | 1.4 | 0.02em |
| Eyebrow | 11-12px | 11px | Nunito 700, uppercase | 1.4 | 0.18em |
| Harga | 16-18px | 16px | Quicksand 700 | 1.2 | 0 |

**Eyebrow:** teks kecil uppercase dengan garis tipis di kiri (contoh "KOLEKSI KAMI", "PRODUK TERLARIS"), berwarna `ink-muted`.

---

## 4. Spacing, Grid, dan Bentuk

### 4.1 Spacing (basis 4px)

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128`

- Jarak antar section (desktop): 96-128px, (mobile): 64px
- Padding kartu: 16-24px
- Gap grid produk: 16px (mobile), 24px (desktop)

### 4.2 Container dan grid

- Max-width konten: **1200px**, padding horizontal 24px (mobile 16px)
- Grid produk: 4 kolom (desktop), 3 (tablet), 2 (mobile)
- Breakpoint: `sm 640`, `md 768`, `lg 1024`, `xl 1280`

### 4.3 Radius

| Token | Nilai | Pemakaian |
|---|---|---|
| `rounded-pill` | 9999px | Tombol, chip, input, navbar, badge |
| `rounded-card` | 24px | Kartu produk (gambar), banner CTA, kartu custom order |
| `rounded-md` | 12px | Input textarea, modal kecil, dropdown |
| `rounded-arch` | `9999px 9999px 20px 20px` | Kartu kategori (lengkung atas) |

### 4.4 Bayangan

- Navbar: `0 4px 24px rgba(74, 32, 48, 0.06)`
- Kartu hover: `0 12px 32px rgba(74, 32, 48, 0.10)`
- Default kartu produk: tanpa bayangan (foto dan bentuk sudah cukup)

---

## 5. Komponen

### 5.1 Navbar
- **Floating pill**: putih, radius pill, bayangan lembut, `margin-top` 16-20px, tidak menempel ke tepi layar.
- Kiri: logo (ikon bunga kecil + wordmark "Flowrys"). Tengah: menu (Koleksi, Cara Pesan, Kontak; tambahkan Momen hanya jika fitur momen dibuat). Kanan: tombol "Pesan Sekarang" (primer) dan ikon keranjang dengan badge jumlah.
- Sticky saat scroll. Mobile: hamburger membuka panel penuh, keranjang tetap terlihat.

### 5.2 Tombol

| Varian | Gaya |
|---|---|
| **Primer** | Bg `plum-900`, teks putih, pill, padding 12x24px, font Nunito 600 14-15px, ikon panah di kanan (opsional). Hover: `plum-700` + panah bergeser 2px. |
| **Sekunder (ghost)** | Tanpa bg, teks `plum-900`, tanpa border (contoh "Lihat Koleksi"). Hover: garis bawah. |
| **Outline pill** | Bg transparan/putih, border `line`, teks `plum-900` (contoh "Lihat semua koleksi"). Hover: border `plum-900`. |
| **Terang di atas gelap** | Bg putih, teks `plum-900`, dipakai di banner plum dan kartu custom order, dengan ikon WhatsApp. |
| **Ikon bulat** | Lingkaran 32-36px, border `line`, ikon panah diagonal (kartu kategori). |
| **Link bergaris** | Teks `plum-900` dengan garis bawah `rose-200` 2px, ikon panah diagonal (contoh "Mau custom? Konsultasi gratis"). |

Tinggi minimum area tap 44px di mobile. Fokus keyboard: ring 2px `plum-500` dengan offset 2px.

### 5.3 Kartu produk (koleksi)
- Gambar rasio **4:5**, radius 24px, `object-fit: cover`. Hover: gambar zoom 1.03 (200ms), kartu naik 2px.
- Badge overlay kiri atas, jarak 12px dari tepi.
- Di bawah gambar (tanpa kotak/border):
  1. Baris rating: bintang kuning + angka + titik + "1,2rb terjual" (caption, `ink-muted`)
  2. Nama produk (H4)
  3. Deskripsi satu baris, terpotong dengan ellipsis (Small, `ink-muted`)
  4. Harga (bold) dan harga coret di sebelahnya (abu, `line-through`) bila diskon
- Seluruh kartu bisa diklik menuju detail produk.
- Kartu stok habis: gambar diberi overlay putih 55% dan label "Stok habis".

### 5.4 Badge

| Badge | Gaya |
|---|---|
| Terlaris #1 | Bg putih, teks `plum-900`, uppercase 10-11px, tracking lebar, pill |
| Baru | Bg putih, teks `plum-900`, uppercase, pill |
| Diskon (-14%) | Bg `plum-900`, teks putih, bold, pill |
| Stok habis | Bg `danger`, teks putih |

Maksimal dua badge per kartu, diletakkan sejajar.

### 5.5 Kartu kategori (landing)
- Bentuk **arch** dengan latar pastel berbeda per kategori (rose, sage, peach, lavender), diberi pola titik halus.
- Nomor kecil di atas ("01"-"04") warna `ink-muted`.
- Ilustrasi produk di dalam lingkaran putih transparan.
- **Price tag** miring sedikit (rotasi -6 sampai -8 derajat) di kanan bawah ilustrasi: label "MULAI" kecil + harga tebal, latar putih.
- Di bawah kartu: nama kategori (H3 kecil), tombol ikon bulat panah, dan deskripsi satu-dua baris.
- Kartu selang-seling tinggi (kolom 2 dan 4 lebih rendah dan diturunkan) untuk ritme visual yang tidak kaku.

### 5.6 Filter dan pencarian (koleksi)
- **Chip kategori**: pill putih border `line`, dengan angka jumlah kecil berwarna `ink-muted`. Aktif: bg `plum-900`, teks putih.
- **Search**: pill lebar penuh, putih, ikon kaca pembesar di kiri, placeholder `ink-muted`.
- **Select** (momen, urutkan): pill putih dengan chevron.
- Teks hasil: "Menampilkan **7** produk" (Small).
- Di mobile: chip discroll horizontal, search satu baris penuh, select berdampingan.

### 5.7 Section produk terlaris (bento grid)
- Grid 4 kolom. **Kartu besar** (Terlaris #1) memakan 2 kolom x 2 baris, gambar full dengan **gradient overlay plum** dari bawah, teks putih (rating, nama, deskripsi), harga coret + harga, dan tombol "Pesan Sekarang" putih dengan ikon WhatsApp.
- Kartu lain memakai gaya kartu produk biasa (5.3).
- **Kartu Custom Order**: bg `plum-900`, radius 24px, eyebrow "CUSTOM ORDER", judul putih, deskripsi kecil, tombol putih "Konsultasi gratis", dengan ornamen bunga garis tipis transparan di pojok kanan bawah.
- Tab kecil di kanan judul (Semua, Buket, Bunga Meja) berbentuk segmented pill.

### 5.8 Banner CTA
- Bg `plum-900`, radius 24px, padding 32-40px. Kiri: judul putih + deskripsi lembut. Kanan: tombol putih pill. Mobile: ditumpuk vertikal.

### 5.9 Form (checkout dan admin)
- Input: bg putih, border `line`, radius pill untuk input satu baris dan 12px untuk textarea, tinggi 44-48px, teks Nunito 15px.
- Label di atas input, Nunito 600 13px, `plum-900`. Pesan error di bawah, `danger`, 12-13px.
- Fokus: border `plum-700` + ring `rgba(107, 63, 82, 0.15)`.
- Pilihan metode penerimaan (Ambil di toko / Diantar): dua kartu radio besar, aktif memakai border `plum-900` dan latar `rose-200` transparan.

### 5.10 Keranjang
- Daftar item dalam kartu putih radius 24px: thumbnail 72px radius 16px, nama, harga, stepper jumlah (pill dengan tombol - dan +), tombol hapus ikon.
- Ringkasan sticky di desktop (kartu kanan), di mobile berupa bar bawah dengan total dan tombol lanjut.

### 5.11 Admin (tidak ada di referensi, mengikuti turunan sistem yang sama)
- Layout: sidebar `plum-900` (teks krem) + area konten `cream-50`.
- Tabel produk di dalam kartu putih radius 24px, header `ink-muted` caps kecil, baris dengan divider `line`, thumbnail radius 12px.
- Aksi: ikon edit, hapus, dan toggle stok. Hapus selalu lewat modal konfirmasi.
- Banner demo mode di atas: bg `peach-200`, teks `plum-900`, tombol "Reset data demo".
- Tampilan admin boleh lebih padat dan fungsional dibanding storefront, tetapi tetap memakai token yang sama.

### 5.12 Toast dan modal
- Toast: pill putih, bayangan halus, ikon status, muncul dari bawah, hilang otomatis 3 detik.
- Modal: putih, radius 24px, overlay `rgba(74, 32, 48, 0.4)`, tombol tutup di pojok, fokus terkunci di dalam modal.

---

## 6. Ilustrasi dan Fotografi

### 6.1 Ilustrasi
- Gaya **flat vector**, bentuk sederhana bersudut membulat, tanpa outline tebal, palet pastel (rose, sage, peach, lavender) dengan batang hijau sage.
- Dipakai di: hero (bunga kiri-kanan bawah, bunga kecil kanan atas), kartu kategori, empty state, dan halaman 404.
- **Dekorasi melayang**: kelopak kecil, sparkle (bintang empat sudut) berukuran 8-16px, tersebar jarang di hero. Animasi: mengambang pelan (translateY 6-8px, 4-6 detik, ease-in-out, loop). Nonaktifkan dengan `prefers-reduced-motion`.
- **Coretan tangan (SVG)**: garis bawah gelombang `rose-200` di bawah frasa kunci heading (contoh "lebih bermakna"), dan lingkaran oval tak sempurna `rose-400` mengelilingi satu kata (contoh "bunganya"). Maksimal satu coretan per heading dan tidak dipakai di semua section.

> Karena referensi memakai ilustrasi custom, Flowrys perlu ilustrasi sendiri. Opsi: gambar sendiri di Figma, pakai koleksi ilustrasi gratis berlisensi bebas (unDraw, Open Peeps, dan sejenisnya, cek lisensi), atau minta dibuatkan.

### 6.2 Fotografi produk
- Tone hangat, cahaya natural lembut, fokus pada bunga. Latar bersih (putih, krem, atau bokeh hijau/gelap).
- Konsisten: rasio **4:5**, bunga memenuhi 70-80% frame.
- Variasi diterima: close-up bunga, buket dipegang tangan, buket dalam vas. Hindari foto ber-watermark atau beda tone ekstrem.
- Ukuran: lebar 800-1200px, format WebP, `loading="lazy"`, wajib `alt` deskriptif.
- Sumber gratis: Unsplash, Pexels. Cantumkan atribusi bila diminta lisensinya.

---

## 7. Panduan Layout per Halaman

### 7.1 Landing page
1. **Navbar** floating pill.
2. **Hero** (tengah, rata tengah): pill kecil "badge lokasi/tagline" (contoh "FLORIST TERFAVORIT DI ..."), H1 Display 3 baris dengan coretan tangan pada frasa kunci, subjudul Body L max-width ~520px, dua CTA (primer "Pesan Bunga Sekarang" + ghost "Lihat Koleksi"). Ilustrasi bunga di kiri dan kanan bawah, dekorasi melayang di sekitarnya. Tinggi hero sekitar 80-90vh.
3. **Kategori**: eyebrow "KOLEKSI KAMI", H2 di kiri, paragraf + dua link bergaris di kanan. Empat kartu arch di bawahnya.
4. **Produk terlaris**: eyebrow + H2 kiri, tab segmented kanan, bento grid (5.7), tombol outline "Lihat semua koleksi" di tengah bawah.
5. **Cara pesan**: 3-4 langkah, kartu bersih dengan ikon dan nomor besar pastel.
6. **Testimoni**: kartu putih radius 24px, foto bulat kecil, bintang, kutipan singkat.
7. **Banner CTA** plum (5.8).
8. **Footer**: bg `plum-900`, teks krem, kolom tautan, kontak WhatsApp, media sosial, hak cipta.

### 7.2 Koleksi
- Breadcrumb (Small, `ink-muted`), H1 "Koleksi Bunga" di kiri, paragraf singkat di kanan.
- Chip kategori, baris search + select, teks jumlah hasil, grid 4 kolom.
- Banner CTA plum "Tidak menemukan yang pas?" di bawah grid.
- Empty state: ilustrasi bunga kecil + teks ramah + tombol reset filter.

### 7.3 Detail produk
- Dua kolom (desktop): galeri kiri (gambar utama radius 24px + thumbnail), info kanan (badge, nama H2, rating, harga, deskripsi, stepper jumlah, tombol "Tambah ke Keranjang" primer + "Pesan via WhatsApp" outline).
- Di bawah: produk terkait memakai kartu produk standar.
- Mobile: galeri di atas, info di bawah, bar aksi sticky di dasar layar.

### 7.4 Keranjang dan Checkout
- Dua kolom di desktop (form/daftar kiri, ringkasan kanan), satu kolom di mobile.
- Checkout: kartu radio metode penerimaan di atas, field muncul atau tersembunyi sesuai pilihan (lihat PRD 6.4). Tombol "Pesan via WhatsApp" primer dengan ikon WhatsApp.

### 7.5 Admin
- Login: kartu tengah di atas latar `cream-50`, tampilkan kredensial demo dalam kotak kecil `peach-200`.
- Dashboard produk: lihat 5.11.

---

## 8. Motion

| Elemen | Efek | Durasi / easing |
|---|---|---|
| Hover kartu | Naik 2px + bayangan | 200ms, ease-out |
| Hover gambar produk | Scale 1.03 | 300ms, ease-out |
| Hover tombol primer | Warna bergeser + panah maju 2px | 150ms |
| Dekorasi hero | Mengambang pelan | 4-6s, loop |
| Muncul saat scroll | Fade + naik 12px | 400ms, sekali saja |
| Toast dan modal | Fade + slide 8px | 200ms |

Aturan: animasi halus dan hemat, tidak ada animasi yang menghalangi konten. Hormati `prefers-reduced-motion` dengan mematikan semua animasi dekoratif.

---

## 9. Responsif (mobile-first)

| Area | Mobile (<640) | Tablet (640-1023) | Desktop (>=1024) |
|---|---|---|---|
| Navbar | Logo + keranjang + hamburger | Sama seperti mobile atau menu ringkas | Menu penuh |
| Hero H1 | 40px, ilustrasi lebih kecil dan dikurangi | 52px | 64-72px |
| Kategori | Scroll horizontal (snap) atau 2 kolom | 2 kolom | 4 kolom (selang-seling tinggi) |
| Grid produk | 2 kolom | 3 kolom | 4 kolom |
| Bento terlaris | Kartu besar memakai 2 kolom, sisanya 2 kolom | Sama | Bento penuh |
| Filter | Chip scroll horizontal | Chip wrap | Chip wrap |
| Banner CTA | Vertikal | Horizontal | Horizontal |
| Detail produk | 1 kolom + bar aksi sticky | 1-2 kolom | 2 kolom |

Target sentuh minimal 44x44px. Uji di lebar 360px.

---

## 10. Aksesibilitas

- Kontras teks minimal 4.5:1 (teks normal), 3:1 (teks besar).
- Semua gambar produk punya `alt`; ilustrasi dekoratif memakai `alt=""` atau `aria-hidden`.
- Informasi tidak bergantung pada warna saja (rating selalu ada angka, stok habis ada label).
- Fokus keyboard terlihat jelas pada semua elemen interaktif.
- Form: label terkait input, error dibacakan (`aria-live` atau `aria-describedby`).
- Modal mengunci fokus dan bisa ditutup dengan Esc.

---

## 11. Design Tokens untuk Tailwind

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plum: { 500: "#7A5565", 700: "#6B3F52", 900: "#4A2030" },
        ink: { body: "#6B4A56", muted: "#9A8088" },
        cream: { 50: "#FAF6F3", 100: "#F5EEE9" },
        line: "#EBE0DB",
        rose: { 200: "#F6C9D3", 400: "#E8A0B4" },
        sage: { 200: "#DCEBD5", 400: "#A9CFA0" },
        peach: { 200: "#FCE5D0", 400: "#F4B98A" },
        lavender: { 200: "#E9E0F3" },
        star: "#F5B82E",
        success: "#4C9A6A",
        danger: "#C0455B",
        warning: "#D9952B",
      },
      fontFamily: {
        heading: ["Quicksand", "ui-rounded", "system-ui", "sans-serif"],
        body: ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        arch: "9999px 9999px 20px 20px",
      },
      boxShadow: {
        nav: "0 4px 24px rgba(74, 32, 48, 0.06)",
        card: "0 12px 32px rgba(74, 32, 48, 0.10)",
      },
      maxWidth: { container: "1200px" },
    },
  },
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cream-50 font-body text-ink-body antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-heading font-bold text-plum-900;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center gap-2 rounded-full bg-plum-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-plum-700;
  }
  .btn-outline {
    @apply inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-plum-900 transition hover:border-plum-900;
  }
  .chip {
    @apply rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-plum-900;
  }
  .chip-active {
    @apply border-plum-900 bg-plum-900 text-white;
  }
  .eyebrow {
    @apply text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted;
  }
}
```

---

## 12. Dampak ke PRD

Referensi visual memuat elemen yang belum ada di PRD v1.1. Perlu diputuskan sebelum coding:

| Elemen di referensi | Butuh perubahan data/fitur | Rekomendasi |
|---|---|---|
| Kategori **Bunga Papan** | Tambah kategori `bunga-papan` | Tambahkan sebagai kategori resmi |
| Harga coret dan badge diskon | Field `originalPrice` pada produk | Tambahkan (diskon dihitung otomatis) |
| Badge Terlaris / Baru | Field `badge` atau dihitung dari `soldCount` dan `createdAt` | Tambahkan field `badge` (opsional) yang diatur admin |
| Rating dan jumlah terjual | Field `rating`, `soldCount` | Tambahkan sebagai data mock; Fase 1 tidak ada sistem review |
| Filter **Momen** (ulang tahun, wisuda, dll.) | Field `occasions` (array) | Opsional, boleh ditunda; jika tidak dibuat, hapus dropdown momen dan menu "Momen" |
| Sort "Terpopuler" | Berdasarkan `soldCount` | Tambahkan ke opsi sort |
| Kartu **Custom Order / Konsultasi gratis** | Tombol ke WhatsApp dengan pesan template | Tambahkan (tidak butuh backend) |
| Halaman/menu **Korporat** | Konten baru | Di luar scope Fase 1 |

Model produk yang disarankan setelah revisi:

```js
{
  id, name, slug, categoryId,
  price, originalPrice,        // originalPrice opsional
  description, images,
  rating, soldCount,           // mock
  badge,                       // "terlaris" | "baru" | null
  occasions,                   // opsional
  isAvailable, isFeatured,
  createdAt, updatedAt
}
```

---

## 13. Checklist Implementasi

- [ ] Token warna, font, radius, dan bayangan masuk ke `tailwind.config.js`
- [ ] Font Quicksand dan Nunito termuat, ada fallback
- [ ] Komponen dasar: Button, Chip, Badge, Input, Select, Card, Modal, Toast
- [ ] Navbar floating pill responsif
- [ ] Kartu produk, kartu kategori arch, bento terlaris, banner CTA
- [ ] Ilustrasi hero, dekorasi melayang, dan coretan tangan tersedia
- [ ] Foto produk konsisten (rasio 4:5, WebP)
- [ ] Uji tampilan di 360px, 768px, dan 1280px
- [ ] Cek kontras dan fokus keyboard
- [ ] Animasi mematuhi `prefers-reduced-motion`