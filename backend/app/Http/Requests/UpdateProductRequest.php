<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // Bandingkan harga coret dengan harga tersimpan bila harga tidak ikut dikirim.
        if ($this->has('original_price') && ! $this->has('price') && $this->route('product')) {
            $this->merge(['price' => $this->route('product')->price]);
        }
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id ?? $this->route('id');

        return [
            'name' => ['sometimes', 'string', 'max:150'],
            'slug' => ['sometimes', 'string', 'max:170', 'regex:/^[a-z0-9-]+$/', Rule::unique('products', 'slug')->ignore($productId)],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'price' => ['sometimes', 'integer', 'min:1'],
            'original_price' => ['nullable', 'integer', 'gt:price'],
            'description' => ['nullable', 'string', 'max:2000'],
            'badge' => ['nullable', Rule::in(['terlaris', 'baru'])],
            'is_available' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
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
