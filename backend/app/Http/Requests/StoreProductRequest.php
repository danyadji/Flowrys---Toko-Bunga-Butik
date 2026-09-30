<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:170', 'regex:/^[a-z0-9-]+$/', Rule::unique('products', 'slug')],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price' => ['required', 'integer', 'min:1'],
            'original_price' => ['nullable', 'integer', 'gt:price'],
            'description' => ['nullable', 'string', 'max:2000'],
            'badge' => ['nullable', Rule::in(['terlaris', 'baru'])],
            'is_available' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'images' => ['sometimes', 'array', 'max:6'],
            'images.*' => ['string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'price.min' => 'Harga harus lebih dari 0.',
            'original_price.gt' => 'Harga coret harus lebih besar dari harga jual.',
            'slug.unique' => 'Slug sudah dipakai produk lain.',
        ];
    }
}
