<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

// Data yang sama dengan frontend seed (docs/seed-products.js, M0-03).
// rating dan sold_count adalah mock untuk tampilan kartu.
// Gambar memakai path frontend; diganti file storage saat diunggah via API.
class FlowrysSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Buket Bunga', 'slug' => 'buket', 'description' => 'Buket tangan untuk wisuda, ulang tahun, dan pernyataan cinta.'],
            ['name' => 'Bunga Papan', 'slug' => 'bunga-papan', 'description' => 'Papan ucapan untuk pembukaan toko, pernikahan, dan duka cita.'],
            ['name' => 'Bunga Meja', 'slug' => 'bunga-meja', 'description' => 'Vas dan pot kecil untuk meja kerja dan ruang tamu.'],
            ['name' => 'Hampers', 'slug' => 'hampers', 'description' => 'Kotak hadiah berisi bunga dan camilan untuk orang tersayang.'],
        ];
        $categoryIds = [];
        foreach ($categories as $category) {
            $categoryIds[$category['slug']] = Category::create($category)->id;
        }

        $products = [
            ['Buket Rose Blush', 'buket-rose-blush', 'buket', 250000, null, '12 tangkai mawar pink dengan baby breath, dibungkus kertas blush dan pita satin. Tinggi sekitar 45 cm.', 4.9, 1240, 'terlaris', true, true],
            ['Buket Matahari Ceria', 'buket-matahari-ceria', 'buket', 185000, null, '5 bunga matahari dengan daisy kuning dan daun eucalyptus. Bungkus kraft cokelat, cocok untuk wisuda.', 4.8, 860, null, true, true],
            ['Buket Lavender Dream', 'buket-lavender-dream', 'buket', 165000, 195000, 'Rangkaian lavender kering dengan gypsophila ungu. Tahan lama sampai 6 bulan, tidak perlu air.', 4.7, 540, 'baru', true, false],
            ['Buket Peony Putih', 'buket-peony-putih', 'buket', 320000, null, '8 kuntum peony putih dengan eucalyptus silver. Bungkus putih transparan, favorit untuk lamaran.', 4.9, 410, null, true, true],
            ['Buket Merah Merona', 'buket-merah-merona', 'buket', 350000, 395000, '20 tangkai mawar merah segar dengan bungkus hitam elegan. Pilihan klasik untuk pasangan.', 4.8, 720, 'terlaris', true, false],
            ['Buket Mini Daisy', 'buket-mini-daisy', 'buket', 95000, null, 'Buket mini daisy putih dalam bungkus kraft. Ukuran genggam, pas untuk hadiah kecil dan kejutan.', 4.6, 980, null, true, false],
            ['Papan Selamat Sukses', 'papan-selamat-sukses', 'bunga-papan', 650000, null, 'Papan busa 2x1,25 m dengan marigold kuning dan aster ungu. Termasuk teks ucapan dan antar area kota.', 4.9, 320, null, true, true],
            ['Papan Duka Cita', 'papan-duka-cita', 'bunga-papan', 750000, null, 'Papan 2x1,25 m dengan lili putih dan krisan. Rangkaian sopan dengan pita hitam dan teks belasungkawa.', 5.0, 280, null, true, false],
            ['Papan Grand Opening', 'papan-grand-opening', 'bunga-papan', 850000, 950000, 'Papan premium dengan mawar dan anggrek asli di bagian atas. Cocok untuk pembukaan toko dan kantor.', 4.8, 190, 'baru', true, false],
            ['Papan Wisuda Ceria', 'papan-wisuda-ceria', 'bunga-papan', 550000, null, 'Papan ukuran sedang dengan gerbera warna-warni dan foto wisuda (opsional). Teks nama dan gelar gratis.', 4.7, 150, null, true, false],
            ['Vas Mawar Pastel', 'vas-mawar-pastel', 'bunga-meja', 225000, null, '9 mawar pastel dalam vas kaca 20 cm. Termasuk vas, tinggal pajang di meja kerja atau ruang tamu.', 4.8, 460, null, true, true],
            ['Anggrek Bulan Mini', 'anggrek-bulan-mini', 'bunga-meja', 285000, null, 'Anggrek bulan putih dua tangkai dalam pot keramik krem. Mekar 1-2 bulan dengan perawatan mudah.', 4.9, 390, 'terlaris', true, false],
            ['Sukulen Trio', 'sukulen-trio', 'bunga-meja', 135000, null, 'Tiga sukulen berbeda dalam pot tanah liat 8 cm di atas nampan bambu. Siram seminggu sekali.', 4.6, 510, null, true, false],
            ['Lili Kuning Vas', 'lili-kuning-vas', 'bunga-meja', 195000, null, '6 tangkai lili kuning dalam vas kaca. Wangi lembut, mekar bertahap sekitar satu minggu.', 4.7, 220, null, false, false],
            ['Hampers Sweet Day', 'hampers-sweet-day', 'hampers', 360000, null, 'Kotak hadiah berisi mawar mini, 6 cokelat praline, dan kartu ucapan tulis tangan. Pita satin rose.', 4.9, 610, 'terlaris', true, true],
            ['Hampers Teh Sore', 'hampers-teh-sore', 'hampers', 295000, null, 'Bunga kering lavender, 2 kaleng teh artisan, dan madu 100 ml dalam keranjang rotan kecil.', 4.7, 240, 'baru', true, false],
            ['Hampers Bayi Baru', 'hampers-bayi-baru', 'hampers', 425000, 475000, 'Bunga warna lembut, boneka kelinci 25 cm, dan selimut bayi katun. Kartu ucapan selamat datang gratis.', 4.8, 180, null, true, false],
            ['Hampers Terima Kasih', 'hampers-terima-kasih', 'hampers', 275000, null, 'Mawar dan daisy dalam kotak, lilin aroma vanila, dan kartu catatan kosong. Untuk guru, mentor, dan klien.', 4.6, 200, null, true, false],
        ];

        foreach ($products as $index => [$name, $slug, $category, $price, $original, $description, $rating, $sold, $badge, $available, $featured]) {
            $product = Product::create([
                'category_id' => $categoryIds[$category],
                'name' => $name,
                'slug' => $slug,
                'price' => $price,
                'original_price' => $original,
                'description' => $description,
                'rating' => $rating,
                'sold_count' => $sold,
                'badge' => $badge,
                'is_available' => $available,
                'is_featured' => $featured,
                'created_at' => now()->subDays(60 - $index),
                'updated_at' => now()->subDays(30 - intdiv($index, 2)),
            ]);
            $product->images()->create([
                'path' => "/images/products/{$slug}.webp",
                'sort_order' => 0,
            ]);
        }
    }
}
