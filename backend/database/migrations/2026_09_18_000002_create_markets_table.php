<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('markets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('symbol', 20)->unique();
            $table->string('name', 100);
            $table->string('asset_class', 30);
            $table->boolean('is_active')->default(false);
            $table->timestamps();
            
            $table->index('symbol');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('markets');
    }
};