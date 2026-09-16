<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Game;
use App\Models\GameScreenshot;
use App\Models\GameSystemRequirement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseLayerTest extends TestCase
{
    /**
     * Test categories, users, and games count from seeders.
     */
    public function test_database_entities_seeded_properly(): void
    {
        $this->assertDatabaseCount('categories', 10);
        $this->assertDatabaseHas('users', ['email' => 'admin@gamevault.dev', 'role' => 'admin']);
        $this->assertDatabaseHas('users', ['email' => 'demo@gamevault.dev', 'role' => 'user']);
        $this->assertTrue(Game::count() >= 16);
    }

    /**
     * Test Eloquent relationships and scopes.
     */
    public function test_game_relationships_and_published_scope(): void
    {
        $publishedGames = Game::published()->get();
        $this->assertGreaterThanOrEqual(14, $publishedGames->count());

        $draftGames = Game::where('status', 'draft')->get();
        $this->assertEquals(2, $draftGames->count());

        $game = Game::with(['categories', 'systemRequirements', 'screenshots'])->first();
        $this->assertNotNull($game);
        $this->assertNotEmpty($game->categories);
        $this->assertNotEmpty($game->systemRequirements);
    }

    /**
     * Test duplicate library prevention via unique constraint.
     */
    public function test_duplicate_library_prevention(): void
    {
        $user = User::where('email', 'demo@gamevault.dev')->first();
        $game = Game::first();

        // Already exists or attach once
        $user->libraryGames()->syncWithoutDetaching([$game->id]);

        $this->expectException(\Illuminate\Database\QueryException::class);
        $user->libraryGames()->attach($game->id);
    }
}
