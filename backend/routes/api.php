<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GameController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider / Application routing
| within a group which is assigned the "api" middleware group.
|
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

// Public Games Endpoints
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{slug}', [GameController::class, 'show']);
Route::get('/games/{slug}/similar', [GameController::class, 'similar']);

// Public Categories Endpoints
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
