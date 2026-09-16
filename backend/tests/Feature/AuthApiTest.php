<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    public function test_it_can_register_a_new_user(): void
    {
        // Cleanup test email if exists
        User::where('email', 'gamerpro@example.com')->delete();

        $payload = [
            'name' => 'GamerPro99',
            'email' => 'gamerpro@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name' => 'GamerPro99',
                    'username' => 'GamerPro99',
                    'email' => 'gamerpro@example.com',
                    'role' => 'user',
                    'status' => 'active',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'gamerpro@example.com',
            'name' => 'GamerPro99',
            'role' => 'user',
            'status' => 'active',
        ]);

        $user = User::where('email', 'gamerpro@example.com')->first();
        $this->assertTrue(Hash::check('SecurePass123!', $user->password));
        $this->assertNotEquals('SecurePass123!', $user->password);

        // Cleanup
        $user->delete();
    }

    public function test_it_validates_registration_fields_and_prevents_duplicate_emails(): void
    {
        // 1. Missing / mismatch password confirmation
        $res1 = $this->postJson('/api/register', [
            'name' => 'Test',
            'email' => 'invalidformat',
            'password' => 'Short1',
            'password_confirmation' => 'Mismatch1',
        ]);
        $res1->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'errors']);

        // 2. Duplicate email with existing seeded user
        $res2 = $this->postJson('/api/register', [
            'name' => 'Demo Clone',
            'email' => 'demo@gamevault.dev',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);
        $res2->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_it_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'demo@gamevault.dev',
            'password' => 'GameVault123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'demo@gamevault.dev',
                    'role' => 'user',
                    'status' => 'active',
                ],
            ]);

        $this->assertAuthenticated();
    }

    public function test_it_rejects_login_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'demo@gamevault.dev',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'The provided credentials are incorrect.',
            ]);

        $this->assertGuest();
    }

    public function test_it_rejects_login_for_suspended_user(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'rogue99@darknet.org',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'This account is currently unavailable. Please contact support.',
            ]);

        $this->assertGuest();
    }

    public function test_it_can_retrieve_current_authenticated_user(): void
    {
        $user = User::where('email', 'demo@gamevault.dev')->first();

        $response = $this->actingAs($user)->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'email' => 'demo@gamevault.dev',
                    'role' => 'user',
                ],
            ]);
    }

    public function test_it_rejects_unauthenticated_user_request(): void
    {
        $response = $this->getJson('/api/user');
        $response->assertStatus(401);
    }

    public function test_it_can_logout_and_invalidate_session(): void
    {
        $user = User::where('email', 'demo@gamevault.dev')->first();

        $response = $this->actingAs($user)->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged out successfully',
            ]);
    }

    public function test_admin_middleware_allows_admin_user(): void
    {
        $admin = User::where('email', 'admin@gamevault.dev')->first();

        $response = $this->actingAs($admin)->getJson('/api/admin/verify');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Administrator authorized',
            ]);
    }

    public function test_admin_middleware_forbids_regular_user(): void
    {
        $user = User::where('email', 'demo@gamevault.dev')->first();

        $response = $this->actingAs($user)->getJson('/api/admin/verify');

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Access denied. Administrator privileges required.',
            ]);
    }
}
