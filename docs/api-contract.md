# API Contract (Fase 2)

Disalin dari PRD bagian 8. Bentuk response dikunci mengikuti kontrak
`productService` Fase 1 agar komponen frontend tidak berubah.

Base URL: `/api/v1`

## Publik

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/categories` | Daftar kategori |
| GET | `/products` | Daftar produk (query: `category`, `search`, `sort`, `page`) |
| GET | `/products/{slug}` | Detail produk |

Sort: `popular`, `newest`, `price-asc`, `price-desc`.

Contoh `GET /products`:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Buket Rose Blush",
      "slug": "buket-rose-blush",
      "category": { "id": 1, "name": "Buket Bunga", "slug": "buket" },
      "price": 250000,
      "original_price": null,
      "description": "...",
      "images": ["https://.../rose-blush.webp"],
      "rating": 4.9,
      "sold_count": 1240,
      "badge": "terlaris",
      "is_available": true,
      "is_featured": true
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "total": 24 }
}
```

## Admin (token Sanctum)

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/admin/login` | Login, mengembalikan token |
| POST | `/admin/logout` | Logout |
| POST | `/admin/products` | Tambah produk |
| PUT | `/admin/products/{id}` | Ubah produk |
| DELETE | `/admin/products/{id}` | Hapus produk |
| PATCH | `/admin/products/{id}/availability` | Ubah status stok |
| POST | `/admin/products/{id}/images` | Unggah gambar |

## Error

| Kode | Arti |
|---|---|
| 422 | Validasi gagal (detail per field) |
| 401 | Tanpa token atau token kedaluwarsa |
| 404 | Data tidak ditemukan |

Frontend memetakan 404 slug ke halaman NotFound dan 422 ke pesan per field.
