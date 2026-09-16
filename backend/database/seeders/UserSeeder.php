<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Admin Account
        User::updateOrCreate(
            ['email' => 'admin@gamevault.dev'],
            [
                'name' => 'GameVault Admin',
                'password' => Hash::make('GameVaultAdmin123!'),
                'role' => 'admin',
                'status' => 'active',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                'email_verified_at' => now(),
            ]
        );

        // 2. Demo User Account
        User::updateOrCreate(
            ['email' => 'demo@gamevault.dev'],
            [
                'name' => 'Demo Player',
                'password' => Hash::make('GameVault123!'),
                'role' => 'user',
                'status' => 'active',
                'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                'email_verified_at' => now(),
            ]
        );

        // 3. Mock Gamers for testing community metrics
        $mockUsers = [
            [
                'name' => 'CyberValkyrie',
                'email' => 'valkyrie@gamernet.io',
                'role' => 'user',
                'status' => 'active',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            ],
            [
                'name' => 'ShadowRogue99',
                'email' => 'rogue99@darknet.org',
                'role' => 'user',
                'status' => 'suspended',
                'avatar' => 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
            ],
            [
                'name' => 'PixelKnight',
                'email' => 'pixel@indiegames.dev',
                'role' => 'user',
                'status' => 'active',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            ],
        ];

        foreach ($mockUsers as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('Password123!'),
                    'role' => $u['role'],
                    'status' => $u['status'],
                    'avatar' => $u['avatar'],
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
