<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with(['category', 'images']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->string('category')));
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(fn ($q) => $q->where('name', 'like', $search)->orWhere('description', 'like', $search));
        }

        match ($request->string('sort', 'newest')->toString()) {
            'price-asc' => $query->orderBy('price'),
            'price-desc' => $query->orderByDesc('price'),
            'popular' => $query->orderByDesc('sold_count'),
            default => $query->orderByDesc('created_at'),
        };

        $products = $query->paginate(min((int) $request->input('pageSize', 12), 100));

        return ProductResource::collection($products);
    }

    public function show(string $slug)
    {
        $product = Product::with(['category', 'images'])->where('slug', $slug)->firstOrFail();

        return new ProductResource($product);
    }
}
