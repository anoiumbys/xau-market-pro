<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('symbol', 20)->default('XAUUSD');
            $table->enum('condition', ['above', 'below', 'cross']);
            $table->decimal('price_level', 12, 4);
            $table->boolean('is_triggered')->default(false);
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'is_triggered']);
            $table->index(['symbol', 'is_triggered']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_alerts');
    }
};