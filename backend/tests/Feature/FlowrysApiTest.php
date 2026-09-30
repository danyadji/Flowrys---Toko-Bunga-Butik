<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FlowrysApiTest extends TestCase
{
    use RefreshDatabase;

    private function adminToken(): string
    {
        $user = User::factory()->create(['role' => 'admin']);
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        return $response->json('token');
    }

    private function seedProduct(): Product
    {
        $category = Category::create(['name' => 'Buket Bunga', 'slug' => 'buket']);

        return Product::create([
            'category_id' => $category->id,
            'name' => 'Buket Uji',
            'slug' => 'buket-uji',
            'price' => 100000,
            'description' => 'Deskripsi uji.',
        ]);
    }

    public function test_daftar_kategori_dan_produk_publik(): void
    {
        $this->seedProduct();

        $this->getJson('/api/v1/categories')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/products?sort=popular')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'buket-uji');
    }

    public function test_detail_produk_dan_404(): void
    {
        $this->seedProduct();

        $this->getJson('/api/v1/products/buket-uji')
            ->assertOk()
            ->assertJsonPath('data.category.slug', 'buket');
        $this->getJson('/api/v1/products/tidak-ada')->assertNotFound();
    }

    public function test_login_salah_dan_tanpa_token_ditolak(): void
    {
        User::factory()->create(['email' => 'admin@demo.com', 'role' => 'admin']);

        $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@demo.com', 'password' => 'salah',
        ])->assertStatus(422);

        $this->postJson('/api/v1/admin/products', ['name' => 'x'])->assertUnauthorized();
    }

    public function test_bukan_admin_mendapat_403(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $token = $user->createToken('x')->plainTextToken;

        $this->postJson('/api/v1/admin/products', ['name' => 'x'], ['Authorization' => "Bearer {$token}"])
            ->assertForbidden();
    }

    public function test_crud_produk_dan_validasi(): void
    {
        $headers = ['Authorization' => 'Bearer '.$this->adminToken()];
        $category = Category::create(['name' => 'Buket Bunga', 'slug' => 'buket']);

        $this->postJson('/api/v1/admin/products', [
            'name' => 'X', 'category_id' => $category->id, 'price' => 0,
        ], $headers)->assertStatus(422);

        $created = $this->postJson('/api/v1/admin/products', [
            'name' => 'Buket Baru', 'category_id' => $category->id, 'price' => 150000,
        ], $headers)->assertCreated();
        $id = $created->json('data.id');
        $this->assertSame('buket-baru', $created->json('data.slug'));

        $this->putJson("/api/v1/admin/products/{$id}", ['price' => 160000], $headers)
            ->assertOk()
            ->assertJsonPath('data.price', 160000);

        $this->patchJson("/api/v1/admin/products/{$id}/availability", ['is_available' => false], $headers)
            ->assertOk()
            ->assertJsonPath('data.is_available', false);

        $this->deleteJson("/api/v1/admin/products/{$id}", [], $headers)->assertNoContent();
        $this->assertDatabaseMissing('products', ['id' => $id]);
    }

    public function test_unggah_gambar_ditolak_bila_bukan_foto(): void
    {
        Storage::fake('public');
        $headers = ['Authorization' => 'Bearer '.$this->adminToken()];
        $product = $this->seedProduct();

        $this->postJson("/api/v1/admin/products/{$product->id}/images", [
            'image' => UploadedFile::fake()->create('jahat.svg', 10, 'image/svg+xml'),
        ], $headers)->assertStatus(422);

        $this->postJson("/api/v1/admin/products/{$product->id}/images", [
            'image' => UploadedFile::fake()->image('foto.jpg', 800, 1000),
        ], $headers)->assertCreated()->assertJsonPath('url', fn ($url) => str_starts_with($url, 'http'));

        Storage::disk('public')->assertCount('products', 1);
    }

    public function test_crud_kategori(): void
    {
        $headers = ['Authorization' => 'Bearer '.$this->adminToken()];

        $created = $this->postJson('/api/v1/admin/categories', ['name' => 'Paket Wedding'], $headers)
            ->assertCreated();
        $this->assertSame('paket-wedding', $created->json('data.slug'));
        $id = $created->json('data.id');

        $this->putJson("/api/v1/admin/categories/{$id}", ['name' => 'Paket Lamaran', 'description' => 'Khusus lamaran.'], $headers)
            ->assertOk()
            ->assertJsonPath('data.description', 'Khusus lamaran.');

        $this->postJson("/api/v1/admin/categories/{$id}/image", [
            'image' => UploadedFile::fake()->image('kategori.jpg', 600, 600),
        ], $headers)->assertCreated()->assertJsonPath('url', fn ($url) => str_starts_with($url, 'http'));

        // Kategori berisi produk tidak boleh dihapus.
        $category = Category::where('slug', 'paket-wedding')->first();
        Product::create([
            'category_id' => $category->id, 'name' => 'X', 'slug' => 'x',
            'price' => 1000,
        ]);
        $this->deleteJson("/api/v1/admin/categories/{$id}", [], $headers)->assertStatus(422);

        $category->products()->delete();
        $this->deleteJson("/api/v1/admin/categories/{$id}", [], $headers)->assertNoContent();
    }

    public function test_login_dibatasi_laju(): void
    {
        User::factory()->create(['email' => 'admin@demo.com', 'role' => 'admin']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/admin/login', ['email' => 'admin@demo.com', 'password' => 'salah']);
        }
        $this->postJson('/api/v1/admin/login', ['email' => 'admin@demo.com', 'password' => 'salah'])
            ->assertStatus(429);
    }
}
