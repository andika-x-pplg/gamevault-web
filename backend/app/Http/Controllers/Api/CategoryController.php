<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories with their published games count.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount(['games' => function ($query) {
            $query->published();
        }])
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ], 200);
    }

    /**
     * Display the specified category by its slug.
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::withCount(['games' => function ($query) {
            $query->published();
        }])
            ->where('slug', strtolower(trim($slug)))
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
}
