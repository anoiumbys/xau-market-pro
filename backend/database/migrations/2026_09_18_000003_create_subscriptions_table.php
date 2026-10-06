<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('plan_type', ['basic', 'pro', 'enterprise']);
            $table->enum('status', ['pending', 'active', 'expired', 'cancelled'])->default('pending');
            $table->string('payment_ref', 100)->unique();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'status']);
            $table->index('payment_ref');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
