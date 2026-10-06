<?php

namespace Database\Seeders;

use App\Models\Market;
use Illuminate\Database\Seeder;

class MarketSeeder extends Seeder
{
    public function run(): void
    {
        Market::create([
            'id' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            'symbol' => 'XAUUSD',
            'name' => 'Gold / US Dollar',
            'asset_class' => 'COMMODITY',
            'is_active' => true,
        ]);

        // Future markets (inactive for v1)
        Market::create([
            'id' => 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            'symbol' => 'XAGUSD',
            'name' => 'Silver / US Dollar',
            'asset_class' => 'COMMODITY',
            'is_active' => false,
        ]);

        Market::create([
            'id' => 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'symbol' => 'EURUSD',
            'name' => 'Euro / US Dollar',
            'asset_class' => 'FOREX',
            'is_active' => false,
        ]);

        Market::create([
            'id' => 'dddddddd-dddd-dddd-dddd-dddddddddddd',
            'symbol' => 'BTCUSD',
            'name' => 'Bitcoin / US Dollar',
            'asset_class' => 'CRYPTO',
            'is_active' => false,
        ]);
    }
}
