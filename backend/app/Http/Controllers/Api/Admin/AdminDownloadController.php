<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Download;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AdminDownloadController extends Controller
{
    /**
     * Get aggregate download statistics, trends, license distribution, and recent events.
     */
    public function stats(Request $request): JsonResponse
    {
        $totalDownloadsSum = (int) Game::sum('download_count');
        $totalRecorded = Download::count();
        $totalDownloads = max($totalDownloadsSum, $totalRecorded);

        $todayCount = Download::whereDate('created_at', Carbon::today())->count();
        $thisWeekCount = Download::where('created_at', '>=', Carbon::now()->startOfWeek())->count();
        $thisMonthCount = Download::where('created_at', '>=', Carbon::now()->startOfMonth())->count();

        // 1. Past 7 days daily trend
        $weeklyTrend = [];
        $maxDailyCount = 1;

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayName = $date->format('D');
            $count = Download::whereDate('created_at', $date)->count();

            if ($count > $maxDailyCount) {
                $maxDailyCount = $count;
            }

            $weeklyTrend[] = [
                'day' => $dayName,
                'date' => $date->format('Y-m-d'),
                'count' => $count,
                'raw_count' => $count,
            ];
        }

        // Calculate visual height percentage for bar chart
        foreach ($weeklyTrend as &$item) {
            $ratio = $maxDailyCount > 0 ? ($item['count'] / $maxDailyCount) : 0;
            $percentage = max(15, (int) round($ratio * 100));
            $item['height'] = $item['count'] > 0 ? "{$percentage}%" : '10%';
        }
        unset($item);

        // 2. License Breakdown
        $allGames = Game::select('game_type', 'download_count')->get();
        $licenseCounts = [];
        $totalSumForBreakdown = 0;

        foreach ($allGames as $g) {
            $type = $g->game_type ?: 'free-to-play';
            $formatted = match ($type) {
                'free-to-play' => 'Free-to-Play',
                'open-source' => 'Open Source',
                'freeware' => 'Freeware',
                'demo' => 'Demo',
                default => ucfirst($type),
            };

            $cnt = (int) $g->download_count;
            $licenseCounts[$formatted] = ($licenseCounts[$formatted] ?? 0) + $cnt;
            $totalSumForBreakdown += $cnt;
        }

        $licenseBreakdown = [];
        foreach ($licenseCounts as $type => $total) {
            $percentage = $totalSumForBreakdown > 0 ? (int) round(($total / $totalSumForBreakdown) * 100) : 0;
            $licenseBreakdown[] = [
                'type' => $type,
                'total' => $total,
                'percentage' => $percentage,
            ];
        }

        // 3. Top 6 Downloaded Games Leaderboard
        $leaderboard = Game::select('id', 'title', 'slug', 'cover_image', 'game_type', 'download_count', 'status')
            ->orderBy('download_count', 'desc')
            ->take(6)
            ->get()
            ->map(function ($g) {
                return [
                    'id' => $g->id,
                    'title' => $g->title,
                    'slug' => $g->slug,
                    'cover_image' => $g->cover_image,
                    'game_type' => $g->game_type,
                    'download_count' => (int) $g->download_count,
                    'status' => $g->status,
                ];
            });

        // 4. Recent Download Events (Privacy safe: no IP, no cookies, Guest or User name only)
        $recentDownloads = Download::with(['game:id,title,slug,cover_image', 'user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get()
            ->map(function ($dl) {
                return [
                    'id' => $dl->id,
                    'game_title' => $dl->game?->title ?? 'Deleted Game',
                    'game_slug' => $dl->game?->slug,
                    'download_type' => $dl->download_type,
                    'user_name' => $dl->user?->name ?? 'Guest',
                    'is_guest' => is_null($dl->user_id),
                    'created_at' => $dl->created_at?->toIso8601String(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_downloads' => $totalDownloads,
                'downloads_today' => $todayCount,
                'downloads_this_week' => $thisWeekCount,
                'downloads_this_month' => $thisMonthCount,
                'weekly_trend' => $weeklyTrend,
                'license_breakdown' => $licenseBreakdown,
                'leaderboard' => $leaderboard,
                'recent_downloads' => $recentDownloads,
            ],
        ], 200);
    }
}
