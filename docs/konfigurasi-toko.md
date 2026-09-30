# Konfigurasi Toko (M0-07)

Nilai placeholder untuk demo Fase 1. Semua dibaca dari satu file
`frontend/src/config/store.js` (dibuat di M1). Jangan tulis ulang di komponen.

| Kunci | Nilai demo | Keterangan |
|---|---|---|
| `whatsapp` | `6281234567890` | Nomor placeholder, bukan nomor pribadi. Ganti sebelum produksi. |
| `alamat` | `Jl. Kenanga No. 12, Jakarta Selatan` | Alamat pengambilan + patokan di form ambil di toko. |
| `jamOperasional` | `09.00-19.00 WIB, Senin-Sabtu` | Batas validasi jam ambil/tiba di checkout. |
| `leadTimeHari` | `1` | Minimal H+1. Tanggal lampau dan hari ini ditolak. |
| `namaToko` | `Flowrys` | Dipakai di pesan WhatsApp dan footer. |

Keputusan: ongkir tidak dihitung otomatis (D6). Pesan metode Diantar
mencantumkan "Ongkir: dikonfirmasi admin".
