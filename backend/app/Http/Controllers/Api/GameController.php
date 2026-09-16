<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GameFilterRequest;
use App\Http\Resources\GameDetailResource;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\JsonResponse;

class GameController extends Controller
{
    /**
     * Display a listing of published games with filters, search, and pagination.
     */
    public function index(GameFilterRequest $request): JsonResponse
    {
        $query = Game::published()->with('categories');

        // Search Filter (Title, Developer, Publisher)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('developer', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%");
            });
        }

        // Category / Genre Filter (via category slug)
        if ($categorySlug = $request->input('category')) {
            $cleanSlug = strtolower(trim($categorySlug));
            if ($cleanSlug !== 'all') {
                $query->whereHas('categories', function ($q) use ($cleanSlug) {
                    $q->where('slug', $cleanSlug);
                });
            }
        }

        // Game Type / License Filter
        if ($type = $request->input('type')) {
            if ($type !== 'all') {
                $query->where('game_type', $type);
            }
        }

        // Featured Filter
        if ($request->has('featured')) {
            $isFeatured = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
            $query->where('featured', $isFeatured);
        }

        // Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'oldest':
                $query->orderBy('release_date', 'asc')->orderBy('id', 'asc');
                break;
            case 'popular':
                $query->orderBy('download_count', 'desc')->orderBy('rating', 'desc');
                break;
            case 'downloads':
                $query->orderBy('download_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'az':
                $query->orderBy('title', 'asc');
                break;
            case 'newest':
            default:
                $query->orderBy('release_date', 'desc')->orderBy('id', 'desc');
                break;
        }

        // Pagination (Default 12, max 48)
        $perPage = min((int) $request->input('per_page', 12), 48);
        $games = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => GameResource::collection($games->items()),
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
     * Display the specified game by its slug.
     */
    public function show(string $slug): JsonResponse
    {
        $game = Game::published()
            ->with(['categories', 'systemRequirements', 'screenshots'])
            ->where('slug', $slug)
            ->first();

        if (! $game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new GameDetailResource($game),
        ], 200);
    }

    /**
     * Get similar games sharing categories with the target game.
     */
    public function similar(string $slug): JsonResponse
    {
        $currentGame = Game::published()
            ->with('categories')
            ->where('slug', $slug)
            ->first();

        if (! $currentGame) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found',
            ], 404);
        }

        $categoryIds = $currentGame->categories->pluck('id')->toArray();

        $query = Game::published()
            ->with('categories')
            ->where('id', '!=', $currentGame->id);

        if (! empty($categoryIds)) {
            $similar = (clone $query)
                ->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.id', $categoryIds);
                })
                ->orderByDesc('rating')
                ->orderByDesc('download_count')
                ->limit(4)
                ->get();
        } else {
            $similar = collect();
        }

        // Backfill if fewer than 4 similar games found
        if ($similar->count() < 4) {
            $needed = 4 - $similar->count();
            $existingIds = $similar->pluck('id')->push($currentGame->id)->toArray();

            $fallback = Game::published()
                ->with('categories')
                ->whereNotIn('id', $existingIds)
                ->orderByDesc('rating')
                ->orderByDesc('download_count')
                ->limit($needed)
                ->get();

            $similar = $similar->concat($fallback);
        }

        return response()->json([
            'success' => true,
            'data' => GameResource::collection($similar),
        ], 200);
    }
}
