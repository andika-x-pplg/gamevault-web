<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Taxonomies
        $this->call(CategorySeeder::class);

        // 2. Seed Users
        $this->call(UserSeeder::class);

        // 3. Seed Games with system requirements & screenshots
        $this->call(GameSeeder::class);

        // 4. Connect sample games to Demo User Library & Wishlist
        $demoUser = User::where('email', 'demo@gamevault.dev')->first();
        if ($demoUser) {
            $shattered = Game::where('slug', 'shattered-pixel-dungeon')->first();
            $trackmania = Game::where('slug', 'trackmania-nations-forever')->first();
            $bar = Game::where('slug', 'beyond-all-reason')->first();
            $openra = Game::where('slug', 'open-ra')->first();
            $veloren = Game::where('slug', 'veloren')->first();

            if ($shattered && $trackmania) {
                $demoUser->libraryGames()->syncWithoutDetaching([$shattered->id, $trackmania->id]);
            }

            if ($bar && $openra && $veloren) {
                $demoUser->wishlistGames()->syncWithoutDetaching([$bar->id, $openra->id, $veloren->id]);
            }
        }
    }
}
