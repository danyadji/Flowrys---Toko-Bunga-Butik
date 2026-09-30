<?php

use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    Route::prefix('admin')->middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::put('/products/{product}', [AdminProductController::class, 'update']);
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);
        Route::patch('/products/{product}/availability', [AdminProductController::class, 'updateAvailability']);
        Route::post('/products/{product}/images', [AdminProductController::class, 'storeImage']);
        Route::get('/products/{product}/images', [AdminProductController::class, 'productImages']);
        Route::delete('/products/{product}/images/{image}', [AdminProductController::class, 'destroyImage']);
    });
});
