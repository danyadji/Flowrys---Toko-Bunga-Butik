<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class ImageUrl
{
    // Path absolut (http) dibiarkan. Path /images/* milik frontend
    // dibiarkan relatif. File storage dijadikan URL absolut ke backend
    // agar bisa dimuat dari domain mana pun.
    public static function url(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }
        if (str_starts_with($path, 'http')) {
            return $path;
        }
        if (str_starts_with($path, '/images/')) {
            return $path;
        }
        if (str_starts_with($path, '/storage/')) {
            return url($path);
        }

        return url(Storage::url($path));
    }
}
