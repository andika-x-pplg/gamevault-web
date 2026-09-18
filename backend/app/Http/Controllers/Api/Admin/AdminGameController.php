<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminGameRequest;
use App\Http\Resources\Admin\AdminGameResource;
use App\Models\Category;
use App\Models\Game;
use App\Models\GameScreenshot;
use App\Models\GameSystemRequirement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminGameController extends Controller
{
    /**
     * Display a paginated listing of all games (both published and draft).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Game::with('categories');

        // Search Filter (Title, Developer, Publisher, Slug)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('developer', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Category Filter (by slug or id)
        if ($category = $request->input('category')) {
            $cleanCategory = strtolower(trim((string) $category));
            if ($cleanCategory !== 'all') {
                $query->whereHas('categories', function ($q) use ($cleanCategory) {
                    $q->where('slug', $cleanCategory)
                        ->orWhere('name', $cleanCategory)
                        ->orWhere('categories.id', $cleanCategory);
                });
            }
        }

        // Game Type Filter
        if ($type = $request->input('type')) {
            $cleanType = Str::slug((string) $type);
            if ($cleanType !== 'all') {
                $query->where('game_type', $cleanType);
            }
        }

        // Status Filter (draft / published)
        if ($status = $request->input('status')) {
            $cleanStatus = strtolower(trim((string) $status));
            if ($cleanStatus !== 'all') {
                $query->where('status', $cleanStatus);
            }
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'oldest':
                $query->orderBy('id', 'asc');
                break;
            case 'popular':
            case 'downloads':
                $query->orderBy('download_count', 'desc')->orderBy('rating', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc')->orderBy('download_count', 'desc');
                break;
            case 'az':
            case 'title-asc':
                $query->orderBy('title', 'asc');
                break;
            case 'title-desc':
                $query->orderBy('title', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('id', 'desc');
                break;
        }

        $perPage = min((int) $request->input('per_page', 12), 100);
        $games = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => AdminGameResource::collection($games->items()),
            'meta' => [
                'current_page' => $games->currentPage(),
                'last_page' => $games->lastPage(),
                'per_page' => $games->perPage(),
                'total' => $games->total(),
                'from' => $games->firstItem(),
                'to' => $games->lastItem(),
                'has_more_pages' => $games->hasMorePages(),
            ],
        ], 200);
    }

    /**
     * Display the specified game by ID (or slug).
     */
    public function show(string $id): JsonResponse
    {
        $game = Game::with(['categories', 'systemRequirements', 'screenshots'])
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->first();

        if (! $game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new AdminGameResource($game),
        ], 200);
    }

    /**
     * Store a newly created game in MySQL with atomic relationships.
     */
    public function store(AdminGameRequest $request): JsonResponse
    {
        $game = DB::transaction(function () use ($request) {
            $gameData = $request->only([
                'title',
                'slug',
                'short_description',
                'description',
                'developer',
                'publisher',
                'game_type',
                'download_type',
                'direct_download_url',
                'release_date',
                'version',
                'file_size',
                'cover_image',
                'banner_image',
                'supported_languages',
                'last_updated',
                'rating',
                'download_count',
                'official_source_name',
                'official_source_url',
                'status',
                'featured',
            ]);

            $gameData['status'] = $gameData['status'] ?? 'published';
            $gameData['rating'] = $gameData['rating'] ?? 4.5;
            $gameData['download_count'] = $gameData['download_count'] ?? 0;
            $gameData['last_updated'] = $gameData['last_updated'] ?? now()->toDateString();

            /** @var Game $newGame */
            $newGame = Game::create($gameData);

            // 1. Sync Categories
            $this->syncCategories($newGame, $request);

            // 2. Create Screenshots
            $this->syncScreenshots($newGame, $request);

            // 3. Create System Requirements
            $this->syncSystemRequirements($newGame, $request);

            return $newGame;
        });

        $game->load(['categories', 'systemRequirements', 'screenshots']);

        return response()->json([
            'success' => true,
            'message' => 'Game created successfully.',
            'data' => new AdminGameResource($game),
        ], 201);
    }

    /**
     * Update an existing game in MySQL atomically.
     */
    public function update(AdminGameRequest $request, string $id): JsonResponse
    {
        $game = Game::where('id', $id)->orWhere('slug', $id)->first();

        if (! $game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found',
            ], 404);
        }

        DB::transaction(function () use ($request, $game) {
            $gameData = $request->only([
                'title',
                'slug',
                'short_description',
                'description',
                'developer',
                'publisher',
                'game_type',
                'download_type',
                'direct_download_url',
                'release_date',
                'version',
                'file_size',
                'cover_image',
                'banner_image',
                'supported_languages',
                'last_updated',
                'rating',
                'download_count',
                'official_source_name',
                'official_source_url',
                'status',
                'featured',
            ]);

            $gameData['last_updated'] = $gameData['last_updated'] ?? now()->toDateString();

            $game->update($gameData);

            // 1. Sync Categories
            if ($request->has('categories') || $request->has('category_ids') || $request->has('genre')) {
                $this->syncCategories($game, $request);
            }

            // 2. Sync Screenshots
            if ($request->has('screenshots')) {
                $this->syncScreenshots($game, $request);
            }

            // 3. Sync System Requirements
            if ($request->has('system_requirements') || $request->has('minOs')) {
                $this->syncSystemRequirements($game, $request);
            }
        });

        $game->load(['categories', 'systemRequirements', 'screenshots']);

        return response()->json([
            'success' => true,
            'message' => 'Game updated successfully.',
            'data' => new AdminGameResource($game),
        ], 200);
    }

    /**
     * Remove the specified game permanently from MySQL.
     */
    public function destroy(string $id): JsonResponse
    {
        $game = Game::where('id', $id)->orWhere('slug', $id)->first();

        if (! $game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found',
            ], 404);
        }

        $gameTitle = $game->title;
        $game->delete();

        return response()->json([
            'success' => true,
            'message' => "Game \"{$gameTitle}\" deleted successfully.",
        ], 200);
    }

    /**
     * Resolve and sync category IDs for the given game.
     */
    protected function syncCategories(Game $game, Request $request): void
    {
        $rawCategories = $request->input('categories') ?? $request->input('category_ids') ?? [];

        // If genre single string sent
        if (empty($rawCategories) && $request->has('genre')) {
            $rawCategories = [$request->input('genre')];
        }

        if (! is_array($rawCategories)) {
            $rawCategories = [$rawCategories];
        }

        $categoryIds = [];
        foreach ($rawCategories as $item) {
            if (is_numeric($item)) {
                $categoryIds[] = (int) $item;
            } elseif (is_string($item)) {
                $clean = trim($item);
                $cat = Category::where('slug', Str::slug($clean))
                    ->orWhere('name', $clean)
                    ->first();
                if ($cat) {
                    $categoryIds[] = $cat->id;
                }
            } elseif (is_array($item) && isset($item['id'])) {
                $categoryIds[] = (int) $item['id'];
            }
        }

        $game->categories()->sync(array_unique($categoryIds));
    }

    /**
     * Recreate screenshots sequence for the given game.
     */
    protected function syncScreenshots(Game $game, Request $request): void
    {
        $screenshots = $request->input('screenshots');

        if (is_string($screenshots)) {
            $screenshots = array_values(array_filter(array_map('trim', explode(',', $screenshots))));
        }

        if (is_array($screenshots)) {
            $game->screenshots()->delete();

            $sortOrder = 0;
            foreach ($screenshots as $url) {
                if (is_array($url) && isset($url['image_url'])) {
                    $url = $url['image_url'];
                }
                if (is_string($url) && trim($url) !== '') {
                    GameScreenshot::create([
                        'game_id' => $game->id,
                        'image_url' => trim($url),
                        'sort_order' => $sortOrder++,
                    ]);
                }
            }
        }
    }

    /**
     * Upsert system requirements for the given game.
     */
    protected function syncSystemRequirements(Game $game, Request $request): void
    {
        $sysReq = $request->input('system_requirements', []);

        // Support flat fields fallback if sent
        $minData = $sysReq['minimum'] ?? [
            'os' => $request->input('minOs'),
            'processor' => $request->input('minProcessor'),
            'memory' => $request->input('minMemory'),
            'graphics' => $request->input('minGraphics'),
            'storage' => $request->input('minStorage'),
            'directx' => $request->input('minDirectX'),
        ];

        $recData = $sysReq['recommended'] ?? [
            'os' => $request->input('recOs'),
            'processor' => $request->input('recProcessor'),
            'memory' => $request->input('recMemory'),
            'graphics' => $request->input('recGraphics'),
            'storage' => $request->input('recStorage'),
            'directx' => $request->input('recDirectX'),
        ];

        // Process minimum requirements
        if (! empty(array_filter($minData))) {
            GameSystemRequirement::updateOrCreate(
                ['game_id' => $game->id, 'type' => 'minimum'],
                [
                    'os' => $minData['os'] ?? null,
                    'processor' => $minData['processor'] ?? null,
                    'memory' => $minData['memory'] ?? null,
                    'graphics' => $minData['graphics'] ?? null,
                    'storage' => $minData['storage'] ?? null,
                    'directx' => $minData['directx'] ?? null,
                ]
            );
        }

        // Process recommended requirements
        if (! empty(array_filter($recData))) {
            GameSystemRequirement::updateOrCreate(
                ['game_id' => $game->id, 'type' => 'recommended'],
                [
                    'os' => $recData['os'] ?? null,
                    'processor' => $recData['processor'] ?? null,
                    'memory' => $recData['memory'] ?? null,
                    'graphics' => $recData['graphics'] ?? null,
                    'storage' => $recData['storage'] ?? null,
                    'directx' => $recData['directx'] ?? null,
                ]
            );
        }
    }
}
