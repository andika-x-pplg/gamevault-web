<?php

namespace Tests\Feature;

use App\Models\Category;
use Tests\TestCase;

class CategoriesApiTest extends TestCase
{
    /**
     * Test GET /api/categories returns list with games_count.
     */
    public function test_get_categories_index(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'description',
                        'games_count',
                    ],
                ],
            ]);

        $data = $response->json('data');
        $this->assertCount(10, $data);
    }

    /**
     * Test GET /api/categories/{slug} returns single category with games_count.
     */
    public function test_get_category_detail_valid(): void
    {
        $category = Category::first();
        $response = $this->getJson("/api/categories/{$category->slug}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ],
            ]);
    }

    /**
     * Test GET /api/categories/{slug} returns 404 for non-existent category.
     */
    public function test_get_category_detail_invalid_returns_404(): void
    {
        $response = $this->getJson('/api/categories/non-existent-category-slug');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Category not found',
            ]);
    }
}
