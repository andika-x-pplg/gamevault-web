<?php

namespace Database\Factories;

use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->words(fake()->numberBetween(2, 4), true);
        $title = ucwords($title);
        $slug = Str::slug($title) . '-' . fake()->unique()->numberBetween(100, 999);

        return [
            'title' => $title,
            'slug' => $slug,
            'short_description' => fake()->sentence(12),
            'description' => fake()->paragraphs(3, true),
            'developer' => fake()->company() . ' Studios',
            'publisher' => fake()->company(),
            'game_type' => fake()->randomElement(['free-to-play', 'freeware', 'open-source', 'demo']),
            'release_date' => fake()->dateTimeBetween('-4 years', 'now')->format('Y-m-d'),
            'version' => 'v' . fake()->numerify('#.#.#'),
            'file_size' => fake()->numberBetween(150, 4500) . ' MB',
            'cover_image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            'banner_image' => 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
            'supported_languages' => ['English', 'Indonesian', 'Japanese', 'German'],
            'last_updated' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'rating' => fake()->randomFloat(1, 3.5, 4.9),
            'download_count' => fake()->numberBetween(5000, 1500000),
            'official_source_name' => 'Official Developer Portal',
            'official_source_url' => 'https://github.com',
            'status' => fake()->randomElement(['published', 'published', 'published', 'draft']),
            'featured' => fake()->boolean(25),
        ];
    }

    /**
     * Indicate that the game is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    /**
     * Indicate that the game is draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Indicate that the game is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
            'status' => 'published',
        ]);
    }
}
