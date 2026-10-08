<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE `trade_journal` MODIFY `stop_loss` DECIMAL(12,4) NULL');
        DB::statement('ALTER TABLE `trade_journal` MODIFY `take_profit` DECIMAL(12,4) NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE `trade_journal` MODIFY `stop_loss` DECIMAL(12,4) NOT NULL');
        DB::statement('ALTER TABLE `trade_journal` MODIFY `take_profit` DECIMAL(12,4) NOT NULL');
    }
};
