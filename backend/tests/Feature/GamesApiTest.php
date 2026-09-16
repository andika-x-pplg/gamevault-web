<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Game;
use Tests\TestCase;

class GamesApiTest extends TestCase
{
    /**
     * Test GET /api/games returns published games with pagination.
     */
    public function test_get_games_index_returns_published_games_with_meta(): void
    {
        $response = $this->getJson('/api/games');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'slug',
                        'short_description',
                        'developer',
                        'game_type',
                        'release_date',
                        'version',
                        'file_size',
                        'rating',
                        'download_count',
                        'featured',
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

        $data = $response->json('data');
        $this->assertNotEmpty($data);

        // Ensure all returned items have status published
        foreach ($data as $item) {
            $this->assertEquals('published', $item['status']);
        }
    }

    /**
     * Test draft games are excluded from GET /api/games.
     */
    public function test_draft_games_are_not_in_games_list(): void
    {
        $draftGame = Game::where('status', 'draft')->first();
        $this->assertNotNull($draftGame);

        $response = $this->getJson('/api/games?per_page=48');
        $response->assertStatus(200);

        $slugs = collect($response->json('data'))->pluck('slug')->toArray();
        $this->assertNotContains($draftGame->slug, $slugs);
    }

    /**
     * Test searching by title, developer, or publisher.
     */
    public function test_games_search_filter(): void
    {
        $response = $this->getJson('/api/games?search=Trackmania');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertStringContainsString('Trackmania', $data[0]['title']);
    }

    /**
     * Test filtering by category slug.
     */
    public function test_games_category_filter(): void
    {
        $response = $this->getJson('/api/games?category=racing');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $item) {
            $categorySlugs = collect($item['categories'])->pluck('slug')->toArray();
            $this->assertContains('racing', $categorySlugs);
        }
    }

    /**
     * Test filtering by game type.
     */
    public function test_games_type_filter(): void
    {
        $response = $this->getJson('/api/games?type=open-source');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $item) {
            $this->assertEquals('open-source', $item['game_type']);
        }
    }

    /**
     * Test sorting games.
     */
    public function test_games_sorting(): void
    {
        $responseRating = $this->getJson('/api/games?sort=rating');
        $responseRating->assertStatus(200);
        $dataRating = $responseRating->json('data');
        $this->assertGreaterThanOrEqual($dataRating[1]['rating'], $dataRating[0]['rating']);

        $responseAz = $this->getJson('/api/games?sort=az');
        $responseAz->assertStatus(200);
    }

    /**
     * Test featured filter.
     */
    public function test_games_featured_filter(): void
    {
        $response = $this->getJson('/api/games?featured=true');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);

        foreach ($data as $item) {
            $this->assertTrue($item['featured']);
        }
    }

    /**
     * Test combined filters.
     */
    public function test_games_combined_filters(): void
    {
        $response = $this->getJson('/api/games?category=strategy&type=open-source&sort=downloads&per_page=5');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
    }

    /**
     * Test GET /api/games/{slug} returns full details for valid published game.
     */
    public function test_get_game_detail_valid_slug(): void
    {
        $game = Game::published()->first();
        $response = $this->getJson("/api/games/{$game->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $game->id,
                    'slug' => $game->slug,
                    'title' => $game->title,
                ],
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'title',
                    'slug',
                    'description',
                    'system_requirements' => [
                        'minimum',
                        'recommended',
                    ],
                    'screenshots',
                    'official_source',
                ],
            ]);
    }

    /**
     * Test GET /api/games/{slug} returns 404 for non-existent slug.
     */
    public function test_get_game_detail_invalid_slug_returns_404(): void
    {
        $response = $this->getJson('/api/games/non-existent-game-slug-404');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Game not found',
            ]);
    }

    /**
     * Test GET /api/games/{slug} returns 404 for draft game.
     */
    public function test_get_game_detail_draft_slug_returns_404(): void
    {
        $draftGame = Game::where('status', 'draft')->first();
        $this->assertNotNull($draftGame);

        $response = $this->getJson("/api/games/{$draftGame->slug}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Game not found',
            ]);
    }

    /**
     * Test GET /api/games/{slug}/similar returns related games excluding self.
     */
    public function test_get_similar_games(): void
    {
        $game = Game::published()->whereHas('categories')->first();
        $response = $this->getJson("/api/games/{$game->slug}/similar");

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['success', 'data']);

        $similar = $response->json('data');
        $this->assertLessThanOrEqual(4, count($similar));

        // Self must not be included
        $slugs = collect($similar)->pluck('slug')->toArray();
        $this->assertNotContains($game->slug, $slugs);
    }

    /**
     * Test invalid query parameters return 422 JSON validation error.
     */
    public function test_invalid_query_parameters_return_422(): void
    {
        $response = $this->getJson('/api/games?type=invalid_type_name');

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure(['success', 'message', 'errors']);
    }
}
