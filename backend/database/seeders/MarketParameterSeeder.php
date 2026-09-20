<?php

namespace Database\Seeders;

use App\Models\MarketParameter;
use App\Models\User;
use Illuminate\Database\Seeder;

class MarketParameterSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        MarketParameter::create([
            'id' => 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
            'symbol' => 'XAUUSD',
            'support_levels' => [2320.00, 2300.00, 2280.00, 2260.00],
            'resistance_levels' => [2370.00, 2390.00, 2410.00, 2430.00],
            'updated_by' => $admin->id,
            'is_active' => true,
        ]);
    }
}