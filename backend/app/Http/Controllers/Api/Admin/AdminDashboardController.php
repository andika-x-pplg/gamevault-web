<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminGameResource;
use App\Models\Category;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Get real-time aggregated metrics for Admin Dashboard.
     */
    public function stats(): JsonResponse
    {
        $totalGames = Game::count();
        $publishedGames = Game::where('status', 'published')->count();
        $draftGames = Game::where('status', 'draft')->count();
        $totalUsers = User::count();
        $totalCategories = Category::count();
        $totalDownloads = (int) Game::sum('download_count');

        $recentGames = Game::with('categories')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        $popularGames = Game::with('categories')
            ->orderBy('download_count', 'desc')
            ->orderBy('rating', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_games' => $totalGames,
                'published_games' => $publishedGames,
                'draft_games' => $draftGames,
                'total_users' => $totalUsers,
                'total_categories' => $totalCategories,
                'total_downloads' => $totalDownloads,
                'recent_games' => AdminGameResource::collection($recentGames),
                'popular_games' => AdminGameResource::collection($popularGames),
            ],
        ], 200);
    }
}
