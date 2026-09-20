<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trade_journal', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('symbol', 20);
            $table->enum('direction', ['long', 'short']);
            $table->decimal('entry_price', 12, 4);
            $table->decimal('exit_price', 12, 4)->nullable();
            $table->decimal('lot_size', 10, 4);
            $table->decimal('stop_loss', 12, 4);
            $table->decimal('take_profit', 12, 4);
            $table->decimal('pnl', 12, 2)->nullable();
            $table->decimal('risk_reward', 8, 4)->nullable();
            $table->enum('status', ['open', 'closed', 'cancelled'])->default('open');
            $table->text('notes')->nullable();
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'symbol']);
            $table->index(['opened_at', 'closed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trade_journal');
    }
};