<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(FlowrysSeeder::class);

        // Akun admin demo lokal. Bukan untuk produksi (M6-S2).
        User::factory()->create([
            'name' => 'Admin Demo',
            'email' => 'admin@demo.com',
            'password' => 'demo123',
            'role' => 'admin',
        ]);
    }
}
