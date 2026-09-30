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

        // Akun admin demo & admin utama.
        User::firstOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name' => 'Admin Demo',
                'password' => 'demo123',
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin2@flowrys.com'],
            [
                'name' => 'Admin Utama',
                'password' => 'admin123',
                'role' => 'admin',
            ]
        );
    }
}
