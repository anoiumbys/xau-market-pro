<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'id' => '11111111-1111-1111-1111-111111111111',
            'name' => 'Admin XAU Pro',
            'email' => 'admin@xaupro.test',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Trader
        User::create([
            'id' => '22222222-2222-2222-2222-222222222222',
            'name' => 'Trader Demo',
            'email' => 'trader@xaupro.test',
            'password' => Hash::make('password123'),
            'role' => 'trader',
            'email_verified_at' => now(),
        ]);

        // Guest (for testing)
        User::create([
            'id' => '33333333-3333-3333-3333-333333333333',
            'name' => 'Guest User',
            'email' => 'guest@xaupro.test',
            'password' => Hash::make('password123'),
            'role' => 'guest',
            'email_verified_at' => now(),
        ]);
    }
}