<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'price' => (int) $this->price,
            'original_price' => $this->original_price === null ? null : (int) $this->original_price,
            'description' => (string) $this->description,
            'images' => $this->images->map(fn ($image) => self::imageUrl($image->path))->values(),
            'rating' => (float) $this->rating,
            'sold_count' => (int) $this->sold_count,
            'badge' => $this->badge,
            'is_available' => (bool) $this->is_available,
            'is_featured' => (bool) $this->is_featured,
        ];
    }

    // Path absolut (storage) dijadikan URL penuh, path frontend dibiarkan.
    public static function imageUrl(string $path): string
    {
        if (str_starts_with($path, 'http') || str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::url($path);
    }
}
