<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Support\ImageUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(Category::orderBy('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['nullable', 'string', 'max:120', 'regex:/^[a-z0-9-]+$/', Rule::unique('categories', 'slug')],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:500'],
        ], [
            'slug.unique' => 'Slug sudah dipakai kategori lain.',
        ]);

        $category = Category::create([
            'name' => $data['name'],
            'slug' => $this->uniqueSlug($data['slug'] ?? Str::slug($data['name'])),
            'image' => $data['image'] ?? null,
            'description' => $data['description'] ?? null,
        ]);

        return (new CategoryResource($category))->response()->setStatusCode(201);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'slug' => ['sometimes', 'string', 'max:120', 'regex:/^[a-z0-9-]+$/', Rule::unique('categories', 'slug')->ignore($category->id)],
            'image' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:500'],
        ], [
            'slug.unique' => 'Slug sudah dipakai kategori lain.',
        ]);

        if (array_key_exists('slug', $data) && $data['slug'] !== $category->slug) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $category->id);
        }
        $category->update($data);

        return new CategoryResource($category);
    }

    public function storeImage(Request $request, Category $category)
    {
        $data = $request->validate([
            'image' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $this->deleteFile($category->image);
        $path = $data['image']->store('categories', 'public');
        $category->update(['image' => $path]);

        return response()->json(
            ['path' => $path, 'url' => ImageUrl::url($path)],
            201
        );
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return response()->json(
                ['message' => 'Kategori masih dipakai produk. Pindahkan produknya dulu.'],
                422
            );
        }
        $this->deleteFile($category->image);
        $category->delete();

        return response()->noContent();
    }

    private function deleteFile(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'http') && ! str_starts_with($path, '/')) {
            Storage::disk('public')->delete($path);
        }
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base === '' ? Str::random(8) : $base;
        $candidate = $slug;
        $counter = 2;
        while (Category::where('slug', $candidate)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $candidate = "{$slug}-{$counter}";
            $counter++;
        }

        return $candidate;
    }
}
