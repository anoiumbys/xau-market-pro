<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_parameters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('symbol', 20);
            $table->json('support_levels');
            $table->json('resistance_levels');
            $table->uuid('updated_by');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('cascade');
            $table->index(['symbol', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_parameters');
    }
};