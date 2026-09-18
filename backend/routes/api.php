<?php

use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminGameController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GameController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DownloadController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\Admin\AdminDownloadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// System Health Check Endpoint
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'GameVault API is running',
        'timestamp' => now()->toIso8601String(),
        'version' => '1.0.0',
    ], 200);
});

// Integration Test Download Fixture (Safe, development-only download file)
Route::get('/downloads/fixture', [DownloadController::class, 'fixtureDownload']);

// Authentication Routes (Public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated User Routes (Sanctum SPA Session)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // User Library Collection
    Route::get('/library', [LibraryController::class, 'index']);
    Route::post('/library/{game}', [LibraryController::class, 'store']);
    Route::delete('/library/{game}', [LibraryController::class, 'destroy']);

    // User Wishlist Collection
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{game}', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{game}', [WishlistController::class, 'destroy']);

    // User Download History
    Route::get('/downloads', [DownloadController::class, 'userHistory']);
});

// Admin Protected API Routes (Sanctum + Admin Middleware)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/verify', [AuthController::class, 'verifyAdmin']);
    Route::get('/dashboard', [AdminDashboardController::class, 'stats']);
    Route::get('/downloads/stats', [AdminDownloadController::class, 'stats']);

    // Admin Games CRUD
    Route::apiResource('games', AdminGameController::class);

    // Admin Categories CRUD
    Route::apiResource('categories', AdminCategoryController::class);
});

// Public Games Endpoints
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{slug}', [GameController::class, 'show']);
Route::get('/games/{slug}/similar', [GameController::class, 'similar']);
Route::post('/games/{game}/download', [DownloadController::class, 'download']);

// Public Categories Endpoints
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

