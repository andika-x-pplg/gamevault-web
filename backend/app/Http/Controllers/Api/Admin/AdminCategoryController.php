<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of categories with total games count.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('games')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ], 200);
    }

    /**
     * Display the specified category.
     */
    public function show(string $id): JsonResponse
    {
        $category = Category::withCount('games')
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->first();

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
        ], 200);
    }

    /**
     * Store a newly created category in MySQL.
     */
    public function store(AdminCategoryRequest $request): JsonResponse
    {
        $category = Category::create([
            'name' => trim($request->input('name')),
            'slug' => strtolower(trim($request->input('slug'))),
            'description' => $request->input('description'),
        ]);

        $category->loadCount('games');

        return response()->json([
            'success' => true,
            'message' => "Category \"{$category->name}\" created successfully.",
            'data' => new CategoryResource($category),
        ], 201);
    }

    /**
     * Update the specified category in MySQL.
     */
    public function update(AdminCategoryRequest $request, string $id): JsonResponse
    {
        $category = Category::where('id', $id)->orWhere('slug', $id)->first();

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $category->update([
            'name' => trim($request->input('name')),
            'slug' => strtolower(trim($request->input('slug'))),
            'description' => $request->input('description'),
        ]);

        $category->loadCount('games');

        return response()->json([
            'success' => true,
            'message' => "Category \"{$category->name}\" updated successfully.",
            'data' => new CategoryResource($category),
        ], 200);
    }

    /**
     * Remove the specified category safely from MySQL.
     * Rejects deletion with HTTP 409 if category is currently assigned to any game.
     */
    public function destroy(string $id): JsonResponse
    {
        $category = Category::where('id', $id)->orWhere('slug', $id)->first();

        if (! $category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $assignedGamesCount = $category->games()->count();
        if ($assignedGamesCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Category cannot be deleted because it is still used by {$assignedGamesCount} game(s).",
            ], 409);
        }

        $categoryName = $category->name;
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => "Category \"{$categoryName}\" deleted successfully.",
        ], 200);
    }
}
