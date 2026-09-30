<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'price',
        'original_price',
        'description',
        'rating',
        'sold_count',
        'badge',
        'is_available',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'original_price' => 'integer',
            'rating' => 'float',
            'sold_count' => 'integer',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    protected static function booted(): void
    {
        // Hapus file storage milik produk; URL luar dibiarkan.
        static::deleting(function (Product $product) {
            foreach ($product->images as $image) {
                $path = $image->path;
                if (! str_starts_with($path, 'http') && ! str_starts_with($path, '/')) {
                    Storage::disk('public')->delete($path);
                }
            }
        });
    }
}
