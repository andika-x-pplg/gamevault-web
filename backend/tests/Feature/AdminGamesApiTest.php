<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Game;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AdminGamesApiTest extends TestCase
{
    protected User $adminUser;

    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::where('email', 'admin@gamevault.dev')->first()
            ?? User::factory()->create(['role' => 'admin', 'status' => 'active', 'email' => 'admin@gamevault.dev']);

        $this->regularUser = User::where('email', 'demo@gamevault.dev')->first()
            ?? User::factory()->create(['role' => 'user', 'status' => 'active', 'email' => 'demo@gamevault.dev']);
    }

    public function test_guest_cannot_access_admin_games_endpoints(): void
    {
        $this->getJson('/api/admin/games')->assertStatus(401);
        $this->postJson('/api/admin/games', [])->assertStatus(401);
        $this->getJson('/api/admin/games/1')->assertStatus(401);
        $this->putJson('/api/admin/games/1', [])->assertStatus(401);
        $this->deleteJson('/api/admin/games/1')->assertStatus(401);
    }

    public function test_regular_authenticated_user_gets_403_forbidden(): void
    {
        $this->actingAs($this->regularUser)->getJson('/api/admin/games')->assertStatus(403);
        $this->actingAs($this->regularUser)->postJson('/api/admin/games', ['title' => 'Test'])->assertStatus(403);
        $this->actingAs($this->regularUser)->getJson('/api/admin/games/1')->assertStatus(403);
        $this->actingAs($this->regularUser)->putJson('/api/admin/games/1', ['title' => 'Test'])->assertStatus(403);
        $this->actingAs($this->regularUser)->deleteJson('/api/admin/games/1')->assertStatus(403);
    }

    public function test_admin_can_list_all_games_including_draft_and_published(): void
    {
        $response = $this->actingAs($this->adminUser)->getJson('/api/admin/games');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'slug',
                        'developer',
                        'game_type',
                        'status',
                        'rating',
                        'categories',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
            ]);
    }

    public function test_admin_can_create_new_game_with_atomic_relationships(): void
    {
        // Ensure clean test slug
        Game::where('slug', 'super-tux-kart-deluxe')->delete();

        $category = Category::firstOrCreate(
            ['slug' => 'racing'],
            ['name' => 'Racing', 'description' => 'Fast-paced racing']
        );

        $payload = [
            'title' => 'Super Tux Kart Deluxe',
            'slug' => 'super-tux-kart-deluxe',
            'short_description' => 'Open source 3D kart racing game featuring Tux and friends.',
            'description' => 'SuperTuxKart is a 3D open-source arcade racer with a variety of characters, tracks, and modes to play.',
            'developer' => 'SuperTuxKart Team',
            'publisher' => 'Open Source Community',
            'game_type' => 'open-source',
            'release_date' => '2026-05-15',
            'version' => 'v1.4.0',
            'file_size' => '850 MB',
            'cover_image' => 'https://example.com/cover.jpg',
            'banner_image' => 'https://example.com/banner.jpg',
            'supported_languages' => ['English', 'Indonesian', 'French'],
            'status' => 'published',
            'featured' => true,
            'official_source_name' => 'GitHub Repository',
            'official_source_url' => 'https://github.com/supertuxkart/stk-code',
            'categories' => [$category->id],
            'screenshots' => [
                'https://example.com/shot1.jpg',
                'https://example.com/shot2.jpg',
            ],
            'system_requirements' => [
                'minimum' => [
                    'os' => 'Windows 10 64-bit',
                    'processor' => 'Intel Core i3',
                    'memory' => '2 GB RAM',
                    'graphics' => 'Intel HD Graphics 4000',
                    'storage' => '1 GB space',
                    'directx' => 'Version 11',
                ],
                'recommended' => [
                    'os' => 'Windows 11 64-bit',
                    'processor' => 'Intel Core i5',
                    'memory' => '4 GB RAM',
                    'graphics' => 'NVIDIA GTX 750 Ti',
                    'storage' => '2 GB space',
                    'directx' => 'Version 12',
                ],
            ],
        ];

        $response = $this->actingAs($this->adminUser)->postJson('/api/admin/games', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Game created successfully.',
                'data' => [
                    'title' => 'Super Tux Kart Deluxe',
                    'slug' => 'super-tux-kart-deluxe',
                    'game_type' => 'open-source',
                    'status' => 'published',
                    'featured' => true,
                ],
            ]);

        $createdGameId = $response->json('data.id');

        // Verify MySQL database records
        $this->assertDatabaseHas('games', [
            'id' => $createdGameId,
            'slug' => 'super-tux-kart-deluxe',
            'title' => 'Super Tux Kart Deluxe',
            'status' => 'published',
        ]);

        $this->assertDatabaseHas('category_game', [
            'game_id' => $createdGameId,
            'category_id' => $category->id,
        ]);

        $this->assertDatabaseHas('game_screenshots', [
            'game_id' => $createdGameId,
            'image_url' => 'https://example.com/shot1.jpg',
            'sort_order' => 0,
        ]);

        $this->assertDatabaseHas('game_system_requirements', [
            'game_id' => $createdGameId,
            'type' => 'minimum',
            'processor' => 'Intel Core i3',
        ]);

        $this->assertDatabaseHas('game_system_requirements', [
            'game_id' => $createdGameId,
            'type' => 'recommended',
            'processor' => 'Intel Core i5',
        ]);

        // Cleanup test game
        Game::find($createdGameId)?->delete();
    }

    public function test_create_game_validation_rejects_missing_fields_and_duplicate_slug(): void
    {
        // 1. Missing required fields
        $res1 = $this->actingAs($this->adminUser)->postJson('/api/admin/games', []);
        $res1->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'slug', 'description', 'developer', 'game_type']);

        // 2. Duplicate slug with existing game
        $existing = Game::first();
        $res2 = $this->actingAs($this->adminUser)->postJson('/api/admin/games', [
            'title' => 'New Game Clone',
            'slug' => $existing->slug,
            'description' => 'Some description',
            'developer' => 'Dev Studio',
            'game_type' => 'free-to-play',
            'status' => 'draft',
        ]);

        $res2->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_admin_can_view_game_detail_including_draft(): void
    {
        $draftGame = Game::create([
            'title' => 'Secret Draft Game',
            'slug' => 'secret-draft-game',
            'description' => 'This game is currently in draft mode.',
            'developer' => 'Secret Dev',
            'game_type' => 'demo',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->adminUser)->getJson("/api/admin/games/{$draftGame->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $draftGame->id,
                    'title' => 'Secret Draft Game',
                    'slug' => 'secret-draft-game',
                    'status' => 'draft',
                ],
            ]);

        // Verify Draft game is NOT accessible in public API
        $publicRes = $this->getJson("/api/games/{$draftGame->slug}");
        $publicRes->assertStatus(404);

        $draftGame->delete();
    }

    public function test_admin_can_update_existing_game_without_creating_duplicates(): void
    {
        Game::where('slug', 'original-game-title')->delete();

        $game = Game::create([
            'title' => 'Original Game Title',
            'slug' => 'original-game-title',
            'description' => 'Original game description.',
            'developer' => 'Original Dev',
            'game_type' => 'free-to-play',
            'status' => 'draft',
        ]);

        $cat1 = Category::firstOrCreate(['slug' => 'action'], ['name' => 'Action']);
        $cat2 = Category::firstOrCreate(['slug' => 'rpg'], ['name' => 'RPG']);

        $updatePayload = [
            'title' => 'Updated Game Title',
            'slug' => 'original-game-title', // Keeps same slug without 422
            'description' => 'Updated full description.',
            'developer' => 'Updated Developer Studio',
            'game_type' => 'open-source',
            'status' => 'published',
            'categories' => [$cat1->id, $cat2->id],
            'screenshots' => ['https://example.com/updated1.jpg'],
            'system_requirements' => [
                'minimum' => [
                    'os' => 'Windows 11',
                    'processor' => 'AMD Ryzen 5',
                ],
            ],
        ];

        $response = $this->actingAs($this->adminUser)->putJson("/api/admin/games/{$game->id}", $updatePayload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Game updated successfully.',
                'data' => [
                    'id' => $game->id,
                    'title' => 'Updated Game Title',
                    'game_type' => 'open-source',
                    'status' => 'published',
                ],
            ]);

        // Verify database updated the same row
        $this->assertDatabaseHas('games', [
            'id' => $game->id,
            'title' => 'Updated Game Title',
            'status' => 'published',
        ]);

        $this->assertDatabaseCount('games', Game::count());

        $game->delete();
    }

    public function test_admin_can_delete_game_and_cascades_relations(): void
    {
        $game = Game::create([
            'title' => 'Game To Delete',
            'slug' => 'game-to-delete',
            'description' => 'Temporary game for delete test.',
            'developer' => 'Temp Dev',
            'game_type' => 'freeware',
            'status' => 'published',
        ]);

        $cat = Category::firstOrCreate(['slug' => 'indie'], ['name' => 'Indie']);
        $game->categories()->attach($cat->id);

        $game->screenshots()->create(['image_url' => 'https://example.com/temp.jpg', 'sort_order' => 0]);
        $game->systemRequirements()->create(['type' => 'minimum', 'os' => 'Windows 10']);

        $response = $this->actingAs($this->adminUser)->deleteJson("/api/admin/games/{$game->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        // Verify records deleted
        $this->assertDatabaseMissing('games', ['id' => $game->id]);
        $this->assertDatabaseMissing('category_game', ['game_id' => $game->id]);
        $this->assertDatabaseMissing('game_screenshots', ['game_id' => $game->id]);
        $this->assertDatabaseMissing('game_system_requirements', ['game_id' => $game->id]);
    }

    public function test_admin_dashboard_metrics_endpoint(): void
    {
        $response = $this->actingAs($this->adminUser)->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_games',
                    'published_games',
                    'draft_games',
                    'total_users',
                    'total_categories',
                    'total_downloads',
                    'recent_games',
                    'popular_games',
                ],
            ]);
    }
}
