<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? Str::slug($data['name']));
        $images = $data['images'] ?? [];
        unset($data['images']);

        $product = Product::create($data);
        $this->syncImages($product, $images);

        return (new ProductResource($product->load(['category', 'images'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        if (array_key_exists('slug', $data) && $data['slug'] !== $product->slug) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $product->id);
        }
        $product->update($data);

        return new ProductResource($product->load(['category', 'images']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }

    public function updateAvailability(Request $request, Product $product)
    {
        $data = $request->validate([
            'is_available' => ['required', 'boolean'],
        ]);
        $product->update($data);

        return new ProductResource($product->load(['category', 'images']));
    }

    public function storeImage(Request $request, Product $product)
    {
        $data = $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($product->images()->count() >= 6) {
            return response()->json(['message' => 'Maksimal 6 gambar.'], 422);
        }

        $path = $data['image']->store('products', 'public');

        $image = $product->images()->create([
            'path' => $path,
            'sort_order' => $product->images()->max('sort_order') + 1,
        ]);

        return response()->json(
            ['path' => $path, 'url' => Storage::url($path), 'id' => $image->id],
            201
        );
    }

    public function productImages(Product $product)
    {
        return response()->json([
            'data' => $product->images()->orderBy('sort_order')->get()->map(fn ($image) => [
                'id' => $image->id,
                'path' => $image->path,
                'url' => ProductResource::imageUrl($image->path),
            ])->values(),
        ]);
    }

    public function destroyImage(Product $product, ProductImage $image)
    {
        if ($image->product_id !== $product->id) {
            return response()->json(['message' => 'Gambar tidak ditemukan.'], 404);
        }

        $path = $image->path;
        $image->delete();
        if (! str_starts_with($path, 'http') && ! str_starts_with($path, '/')) {
            Storage::disk('public')->delete($path);
        }

        return response()->noContent();
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base === '' ? Str::random(8) : $base;
        $candidate = $slug;
        $counter = 2;
        while (Product::where('slug', $candidate)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $candidate = "{$slug}-{$counter}";
            $counter++;
        }

        return $candidate;
    }

    private function syncImages(Product $product, array $images): void
    {
        foreach (array_values($images) as $index => $path) {
            $product->images()->create(['path' => $path, 'sort_order' => $index]);
        }
    }
}
