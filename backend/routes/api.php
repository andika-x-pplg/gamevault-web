<?php

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

Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'GameVault API is running',
        'timestamp' => now()->toIso8601String(),
        'version' => '1.0.0',
    ], 200);
});
