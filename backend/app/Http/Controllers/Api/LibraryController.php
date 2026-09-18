<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionGameResource;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LibraryController extends Controller
{
    /**
     * Display a listing of the authenticated user's library games.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $games = $user->libraryGames()
            ->published()
            ->with(['categories', 'systemRequirements', 'screenshots'])
            ->orderBy('library_games.created_at', 'desc')
            ->get();

        return CollectionGameResource::collection($games);
    }

    /**
     * Add a published game to the authenticated user's library.
     */
    public function store(Request $request, string $gameIdentifier): JsonResponse
    {
        $game = is_numeric($gameIdentifier)
            ? Game::find($gameIdentifier)
            : Game::where('slug', $gameIdentifier)->first();

        if (! $game || $game->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Game not found or is not available.',
            ], 404);
        }

        $user = $request->user();

        // Idempotent attachment: syncWithoutDetaching prevents duplicate rows
        $user->libraryGames()->syncWithoutDetaching([$game->id]);

        return response()->json([
            'success' => true,
            'message' => 'Game successfully added to your library.',
            'data' => new CollectionGameResource($game->load('categories')),
        ], 200);
    }

    /**
     * Remove a game from the authenticated user's library.
     */
    public function destroy(Request $request, string $gameIdentifier): JsonResponse
    {
        $game = is_numeric($gameIdentifier)
            ? Game::find($gameIdentifier)
            : Game::where('slug', $gameIdentifier)->first();

        if (! $game) {
            return response()->json([
                'success' => false,
                'message' => 'Game not found.',
            ], 404);
        }

        $user = $request->user();
        $user->libraryGames()->detach($game->id);

        return response()->json([
            'success' => true,
            'message' => 'Game successfully removed from your library.',
        ], 200);
    }
}
