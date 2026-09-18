<?php

namespace Tests\Feature;

use App\Models\Download;
use App\Models\Game;
use App\Models\User;
use Tests\TestCase;

class DownloadApiTest extends TestCase
{
    /**
     * Test published game with direct download type tracks download and returns direct URL.
     */
    public function test_direct_download_tracks_and_returns_url(): void
    {
        $game = Game::factory()->create([
            'title' => 'Direct Download Test Game',
            'slug' => 'direct-download-test-game',
            'status' => 'published',
            'download_type' => 'direct',
            'direct_download_url' => 'http://127.0.0.1:8000/api/downloads/fixture',
            'download_count' => 10,
        ]);

        $response = $this->postJson("/api/games/{$game->slug}/download");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'type' => 'direct',
                    'url' => 'http://127.0.0.1:8000/api/downloads/fixture',
                    'download_count' => 11,
                ],
            ]);

        // Verify tracking record was created
        $this->assertDatabaseHas('downloads', [
            'game_id' => $game->id,
            'user_id' => null,
            'download_type' => 'direct',
        ]);

        // Verify game download count incremented
        $this->assertEquals(11, $game->fresh()->download_count);

        $game->delete();
    }

    /**
     * Test published game with external store download tracks download and returns store destination.
     */
    public function test_external_download_tracks_and_returns_store_url(): void
    {
        $game = Game::factory()->create([
            'title' => 'External Steam Game',
            'slug' => 'external-steam-game',
            'status' => 'published',
            'download_type' => 'external',
            'official_source_name' => 'Steam',
            'official_source_url' => 'https://store.steampowered.com/app/123456',
            'download_count' => 5,
        ]);

        $response = $this->postJson("/api/games/{$game->slug}/download");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'type' => 'external',
                    'provider' => 'Steam',
                    'url' => 'https://store.steampowered.com/app/123456',
                    'download_count' => 6,
                ],
            ]);

        $this->assertDatabaseHas('downloads', [
            'game_id' => $game->id,
            'user_id' => null,
            'download_type' => 'external',
        ]);

        $this->assertEquals(6, $game->fresh()->download_count);

        $game->delete();
    }

    /**
     * Test authenticated user download links user_id in downloads record.
     */
    public function test_authenticated_user_download_links_user_id(): void
    {
        $user = User::factory()->create();
        $game = Game::factory()->create([
            'title' => 'Auth Download Test Game',
            'slug' => 'auth-download-test-game',
            'status' => 'published',
            'download_type' => 'direct',
            'direct_download_url' => 'http://127.0.0.1:8000/api/downloads/fixture',
        ]);

        $response = $this->actingAs($user)->postJson("/api/games/{$game->slug}/download");
        $response->assertStatus(200);

        $this->assertDatabaseHas('downloads', [
            'game_id' => $game->id,
            'user_id' => $user->id,
            'download_type' => 'direct',
        ]);

        // User can view their download history
        $historyResponse = $this->actingAs($user)->getJson('/api/downloads');
        $historyResponse->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'download_type', 'created_at', 'game'],
                ],
            ]);

        $user->delete();
        $game->delete();
    }

    /**
     * Test draft games cannot be downloaded (returns 404, no count increment, no tracking record).
     */
    public function test_draft_game_download_is_rejected(): void
    {
        $draftGame = Game::factory()->create([
            'title' => 'Draft Game Forbidden',
            'slug' => 'draft-game-forbidden',
            'status' => 'draft',
            'download_type' => 'direct',
            'direct_download_url' => 'http://127.0.0.1:8000/api/downloads/fixture',
            'download_count' => 0,
        ]);

        $response = $this->postJson("/api/games/{$draftGame->slug}/download");
        $response->assertStatus(404);

        $this->assertDatabaseMissing('downloads', [
            'game_id' => $draftGame->id,
        ]);

        $this->assertEquals(0, $draftGame->fresh()->download_count);

        $draftGame->delete();
    }

    /**
     * Test direct download with missing URL fails safely (422, no count increment, no record).
     */
    public function test_direct_download_without_url_fails_safely(): void
    {
        $game = Game::factory()->create([
            'title' => 'Invalid Direct Game',
            'slug' => 'invalid-direct-game',
            'status' => 'published',
            'download_type' => 'direct',
            'direct_download_url' => null,
            'download_count' => 0,
        ]);

        $response = $this->postJson("/api/games/{$game->slug}/download");
        $response->assertStatus(422);

        $this->assertDatabaseMissing('downloads', [
            'game_id' => $game->id,
        ]);

        $this->assertEquals(0, $game->fresh()->download_count);

        $game->delete();
    }

    /**
     * Test development fixture download endpoint returns zip file response.
     */
    public function test_fixture_download_endpoint_returns_file(): void
    {
        $response = $this->get('/api/downloads/fixture');
        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/zip');
    }

    /**
     * Test Admin can access download stats.
     */
    public function test_admin_can_access_download_stats(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->getJson('/api/admin/downloads/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_downloads',
                    'downloads_today',
                    'downloads_this_week',
                    'downloads_this_month',
                    'weekly_trend',
                    'license_breakdown',
                    'leaderboard',
                    'recent_downloads',
                ],
            ]);

        $admin->delete();
    }

    /**
     * Test normal user or guest is forbidden from accessing Admin download stats.
     */
    public function test_non_admin_cannot_access_download_stats(): void
    {
        // Guest
        $this->getJson('/api/admin/downloads/stats')->assertStatus(401);

        // Normal user
        $user = User::factory()->create(['role' => 'user']);
        $this->actingAs($user)->getJson('/api/admin/downloads/stats')->assertStatus(403);
        $user->delete();
    }
}
