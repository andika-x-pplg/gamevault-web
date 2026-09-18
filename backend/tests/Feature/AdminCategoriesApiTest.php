<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Game;
use App\Models\User;
use Tests\TestCase;

class AdminCategoriesApiTest extends TestCase
{
    protected User $adminUser;

    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::where('email', 'admin@gamevault.dev')->first()
            ?? User::factory()->create(['role' => 'admin', 'status' => 'active', 'email' => 'admin@gamevault.dev']);

        $this->regularUser = User::where('email', 'demo@gamevault.dev')->first()
            ?? User::factory()->create(['role' => 'user', 'status' => 'active', 'email' => 'demo@gamevault.dev']);
    }

    protected function tearDown(): void
    {
        Category::whereIn('slug', ['virtual-reality', 'vr-games', 'temporary-category'])->delete();
        parent::tearDown();
    }

    public function test_guest_cannot_access_admin_categories(): void
    {
        $this->getJson('/api/admin/categories')->assertStatus(401);
        $this->postJson('/api/admin/categories', ['name' => 'VR', 'slug' => 'vr'])->assertStatus(401);
        $this->putJson('/api/admin/categories/1', ['name' => 'VR', 'slug' => 'vr'])->assertStatus(401);
        $this->deleteJson('/api/admin/categories/1')->assertStatus(401);
    }

    public function test_regular_user_cannot_access_admin_categories(): void
    {
        $this->actingAs($this->regularUser)->getJson('/api/admin/categories')->assertStatus(403);
        $this->actingAs($this->regularUser)->postJson('/api/admin/categories', ['name' => 'VR', 'slug' => 'vr'])->assertStatus(403);
        $this->actingAs($this->regularUser)->putJson('/api/admin/categories/1', ['name' => 'VR', 'slug' => 'vr'])->assertStatus(403);
        $this->actingAs($this->regularUser)->deleteJson('/api/admin/categories/1')->assertStatus(403);
    }

    public function test_admin_can_create_new_category(): void
    {
        Category::where('slug', 'virtual-reality')->delete();

        $response = $this->actingAs($this->adminUser)->postJson('/api/admin/categories', [
            'name' => 'Virtual Reality',
            'slug' => 'virtual-reality',
            'description' => 'Immersive VR games and experiences.',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'Virtual Reality',
                    'slug' => 'virtual-reality',
                ],
            ]);

        $this->assertDatabaseHas('categories', [
            'slug' => 'virtual-reality',
            'name' => 'Virtual Reality',
        ]);
    }

    public function test_category_validation_prevents_duplicate_name_or_slug(): void
    {
        $cat = Category::first();

        $res = $this->actingAs($this->adminUser)->postJson('/api/admin/categories', [
            'name' => $cat->name,
            'slug' => $cat->slug,
        ]);

        $res->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'slug']);
    }

    public function test_admin_can_update_category(): void
    {
        $cat = Category::where('slug', 'virtual-reality')->first() ?? Category::create([
            'name' => 'VR Games',
            'slug' => 'vr-games',
            'description' => 'VR games.',
        ]);

        $response = $this->actingAs($this->adminUser)->putJson("/api/admin/categories/{$cat->id}", [
            'name' => 'Virtual Reality Pro',
            'slug' => 'virtual-reality',
            'description' => 'Updated VR description.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $cat->id,
                    'name' => 'Virtual Reality Pro',
                    'slug' => 'virtual-reality',
                ],
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $cat->id,
            'name' => 'Virtual Reality Pro',
        ]);
    }

    public function test_admin_cannot_delete_category_assigned_to_games(): void
    {
        // Find a category with assigned games
        $usedCat = Category::has('games')->first();

        if ($usedCat) {
            $response = $this->actingAs($this->adminUser)->deleteJson("/api/admin/categories/{$usedCat->id}");

            $response->assertStatus(409)
                ->assertJson([
                    'success' => false,
                ]);

            // Ensure category was NOT deleted
            $this->assertDatabaseHas('categories', ['id' => $usedCat->id]);
        }
    }

    public function test_admin_can_delete_unused_category(): void
    {
        $unused = Category::create([
            'name' => 'Temporary Category',
            'slug' => 'temporary-category',
            'description' => 'Unused category for delete test.',
        ]);

        $response = $this->actingAs($this->adminUser)->deleteJson("/api/admin/categories/{$unused->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('categories', ['id' => $unused->id]);
    }
}
