<?php

namespace Database\Seeders;

use App\Models\MarketParameter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarketParameterSeeder extends Seeder
{
    public function run(): void
    {
        DB::table("market_parameters")->insert([
            "id" => "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
            "symbol" => "XAUUSD",
            "support_levels" => json_encode([2320.00, 2300.00, 2280.00, 2260.00]),
            "resistance_levels" => json_encode([2370.00, 2390.00, 2410.00, 2430.00]),
            "updated_by" => "11111111-1111-1111-1111-111111111111",
            "is_active" => true,
            "created_at" => now(),
            "updated_at" => now(),
        ]);
    }
}