<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\User;
use Tests\TestCase;

class LibraryApiTest extends TestCase
{
    /**
     * Test guest cannot access Library endpoints (returns 401 Unauthorized).
     */
    public function test_guest_cannot_access_library(): void
    {
        $this->getJson('/api/library')->assertStatus(401);
        $this->postJson('/api/library/shattered-pixel-dungeon')->assertStatus(401);
        $this->deleteJson('/api/library/shattered-pixel-dungeon')->assertStatus(401);
    }

    /**
     * Test authenticated user can get their own empty library.
     */
    public function test_authenticated_user_can_get_library(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/library');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
            ]);

        $this->assertIsArray($response->json('data'));

        $user->delete();
    }

    /**
     * Test authenticated user can add a published game to library.
     */
    public function test_user_can_add_published_game_to_library(): void
    {
        $user = User::factory()->create();
        $game = Game::published()->first();
        $this->assertNotNull($game);

        $response = $this->actingAs($user)->postJson("/api/library/{$game->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $game->id,
                    'slug' => $game->slug,
                ],
            ]);

        $this->assertDatabaseHas('library_games', [
            'user_id' => $user->id,
            'game_id' => $game->id,
        ]);

        $user->delete();
    }

    /**
     * Test adding duplicate game to library does not duplicate database entries.
     */
    public function test_cannot_duplicate_library_game(): void
    {
        $user = User::factory()->create();
        $game = Game::published()->first();

        // Add once
        $this->actingAs($user)->postJson("/api/library/{$game->slug}")->assertStatus(200);

        // Add second time
        $response = $this->actingAs($user)->postJson("/api/library/{$game->slug}");
        $response->assertStatus(200);

        // Verify only 1 pivot record exists
        $count = $user->libraryGames()->where('games.id', $game->id)->count();
        $this->assertEquals(1, $count);

        $user->delete();
    }

    /**
     * Test user can remove a game from library without deleting the game from games table.
     */
    public function test_user_can_remove_library_game(): void
    {
        $user = User::factory()->create();
        $game = Game::published()->first();

        // Attach game first
        $user->libraryGames()->attach($game->id);
        $this->assertDatabaseHas('library_games', [
            'user_id' => $user->id,
            'game_id' => $game->id,
        ]);

        // Remove via API
        $response = $this->actingAs($user)->deleteJson("/api/library/{$game->slug}");
        $response->assertStatus(200)->assertJson(['success' => true]);

        // Check pivot is deleted
        $this->assertDatabaseMissing('library_games', [
            'user_id' => $user->id,
            'game_id' => $game->id,
        ]);

        // Verify game itself is NOT deleted
        $this->assertDatabaseHas('games', [
            'id' => $game->id,
        ]);

        $user->delete();
    }

    /**
     * Test user cannot add a draft game to library.
     */
    public function test_user_cannot_add_draft_game_to_library(): void
    {
        $user = User::factory()->create();
        $draftGame = Game::where('status', 'draft')->first();
        $this->assertNotNull($draftGame);

        $response = $this->actingAs($user)->postJson("/api/library/{$draftGame->slug}");
        $response->assertStatus(404);

        $this->assertDatabaseMissing('library_games', [
            'user_id' => $user->id,
            'game_id' => $draftGame->id,
        ]);

        $user->delete();
    }

    /**
     * Test User A collection is completely isolated from User B.
     */
    public function test_user_library_isolation(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $game1 = Game::published()->skip(0)->first();
        $game2 = Game::published()->skip(1)->first();

        // User A adds game1
        $this->actingAs($userA)->postJson("/api/library/{$game1->slug}")->assertStatus(200);

        // User B adds game2
        $this->actingAs($userB)->postJson("/api/library/{$game2->slug}")->assertStatus(200);

        // Check User A's library
        $responseA = $this->actingAs($userA)->getJson('/api/library');
        $slugsA = collect($responseA->json('data'))->pluck('slug')->toArray();
        $this->assertContains($game1->slug, $slugsA);
        $this->assertNotContains($game2->slug, $slugsA);

        // Check User B's library
        $responseB = $this->actingAs($userB)->getJson('/api/library');
        $slugsB = collect($responseB->json('data'))->pluck('slug')->toArray();
        $this->assertContains($game2->slug, $slugsB);
        $this->assertNotContains($game1->slug, $slugsB);

        $userA->delete();
        $userB->delete();
    }

    /**
     * Test deleting a game removes related entries in library_games pivot without errors.
     */
    public function test_deleted_game_cascades_from_library(): void
    {
        $user = User::factory()->create();
        $tempGame = Game::factory()->create([
            'title' => 'Temp Cascade Game',
            'slug' => 'temp-cascade-game',
            'status' => 'published',
        ]);

        $user->libraryGames()->attach($tempGame->id);
        $this->assertDatabaseHas('library_games', [
            'user_id' => $user->id,
            'game_id' => $tempGame->id,
        ]);

        // Delete game from database
        $tempGame->delete();

        // Check pivot is automatically cleaned up
        $this->assertDatabaseMissing('library_games', [
            'user_id' => $user->id,
            'game_id' => $tempGame->id,
        ]);

        // Library endpoint should continue working without errors
        $response = $this->actingAs($user)->getJson('/api/library');
        $response->assertStatus(200);

        $user->delete();
    }
}
