<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('slug', 170)->unique();
            $table->unsignedInteger('price');
            $table->unsignedInteger('original_price')->nullable();
            $table->text('description')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('sold_count')->default(0);
            $table->string('badge', 20)->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
