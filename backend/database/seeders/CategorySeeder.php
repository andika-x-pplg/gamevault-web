<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Action',
                'slug' => 'action',
                'description' => 'Fast-paced combat, reflex challenges, and thrilling tactical engagements.',
            ],
            [
                'name' => 'Adventure',
                'slug' => 'adventure',
                'description' => 'Rich storyline, narrative journeys, and expansive world exploration.',
            ],
            [
                'name' => 'RPG',
                'slug' => 'rpg',
                'description' => 'Deep character progression, skill trees, item crafting, and epic roleplaying.',
            ],
            [
                'name' => 'Racing',
                'slug' => 'racing',
                'description' => 'High-speed track competitions, acrobatics, time trials, and circuit mastery.',
            ],
            [
                'name' => 'Strategy',
                'slug' => 'strategy',
                'description' => 'Tactical command, real-time strategy (RTS), base building, and turn-based games.',
            ],
            [
                'name' => 'Simulation',
                'slug' => 'simulation',
                'description' => 'Realistic vehicle, flight, space, physics, and world simulations.',
            ],
            [
                'name' => 'Sports',
                'slug' => 'sports',
                'description' => 'Competitive athletics, arcade football, racing, and team tournaments.',
            ],
            [
                'name' => 'Indie',
                'slug' => 'indie',
                'description' => 'Creative and passionate masterworks from independent studios and developers.',
            ],
            [
                'name' => 'Horror',
                'slug' => 'horror',
                'description' => 'Psychological thrillers, atmospheric survival frights, and dark mysteries.',
            ],
            [
                'name' => 'Multiplayer',
                'slug' => 'multiplayer',
                'description' => 'Online co-op, team deathmatch, and community multiplayer action.',
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['slug' => $cat['slug']],
                ['name' => $cat['name'], 'description' => $cat['description']]
            );
        }
    }
}
