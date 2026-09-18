<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Download;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DownloadController extends Controller
{
    /**
     * Initiate and track a game download (Direct or External Official Source).
     */
    public function download(Request $request, string $gameIdentifier): JsonResponse
    {
        $game = is_numeric($gameIdentifier)
            ? Game::find($gameIdentifier)
            : Game::where('slug', $gameIdentifier)->first();

        // 1. Validate Game existence and published status
        if (! $game || $game->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Game is not available for download.',
            ], 404);
        }

        $downloadType = $game->download_type ?: 'external';

        // 2. Validate configuration based on download_type
        if ($downloadType === 'direct') {
            if (empty($game->direct_download_url)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Direct download is currently not configured for this game.',
                ], 422);
            }

            // Create tracking record
            Download::create([
                'game_id' => $game->id,
                'user_id' => $request->user('sanctum')?->id,
                'download_type' => 'direct',
            ]);

            // Atomic count increment
            $game->increment('download_count');

            return response()->json([
                'success' => true,
                'message' => 'Direct download prepared.',
                'data' => [
                    'type' => 'direct',
                    'url' => $game->direct_download_url,
                    'download_count' => (int) $game->fresh()->download_count,
                ],
            ], 200);
        }

        // External Official Distribution
        if (empty($game->official_source_url)) {
            return response()->json([
                'success' => false,
                'message' => 'Official distribution link is not configured for this game.',
            ], 422);
        }

        // Create tracking record
        Download::create([
            'game_id' => $game->id,
            'user_id' => $request->user('sanctum')?->id,
            'download_type' => 'external',
        ]);

        // Atomic count increment
        $game->increment('download_count');

        return response()->json([
            'success' => true,
            'message' => 'External distribution link prepared.',
            'data' => [
                'type' => 'external',
                'provider' => $game->official_source_name ?: 'Official Portal',
                'url' => $game->official_source_url,
                'download_count' => (int) $game->fresh()->download_count,
            ],
        ], 200);
    }

    /**
     * Download safe integration development fixture.
     */
    public function fixtureDownload(): BinaryFileResponse|JsonResponse
    {
        $path = storage_path('app/public/test-downloads/gamevault-download-test.zip');

        if (! file_exists($path)) {
            return response()->json([
                'success' => false,
                'message' => 'Integration test fixture file not found.',
            ], 404);
        }

        return response()->download($path, 'gamevault-download-test.zip', [
            'Content-Type' => 'application/zip',
            'Cache-Control' => 'no-cache, must-revalidate',
        ]);
    }

    /**
     * Get download history for authenticated user.
     */
    public function userHistory(Request $request): JsonResponse
    {
        $user = $request->user();

        $history = Download::where('user_id', $user->id)
            ->with(['game:id,title,slug,cover_image,game_type,file_size'])
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get()
            ->map(function ($dl) {
                return [
                    'id' => $dl->id,
                    'download_type' => $dl->download_type,
                    'created_at' => $dl->created_at?->toIso8601String(),
                    'game' => $dl->game ? [
                        'id' => $dl->game->id,
                        'title' => $dl->game->title,
                        'slug' => $dl->game->slug,
                        'cover_image' => $dl->game->cover_image,
                        'game_type' => $dl->game->game_type,
                        'file_size' => $dl->game->file_size,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $history,
        ], 200);
    }
}
