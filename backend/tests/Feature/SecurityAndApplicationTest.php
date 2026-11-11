<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityAndApplicationTest extends TestCase
{
    /**
     * Test 1: Candidate cannot access Admin routes (Must return 403)
     */
    public function test_candidate_cannot_access_admin_stats(): void
    {
        $candidate = User::where('role', 'candidate')->first() ?? User::factory()->create(['role' => 'candidate']);

        $response = $this->actingAs($candidate, 'sanctum')
            ->getJson('/api/admin/stats');

        $response->assertStatus(403);
    }

    /**
     * Test 2: Admin can access Admin routes (Must return 200)
     */
    public function test_admin_can_access_admin_stats(): void
    {
        $admin = User::where('role', 'admin')->first();

        if ($admin) {
            $response = $this->actingAs($admin, 'sanctum')
                ->getJson('/api/admin/stats');

            $response->assertStatus(200)
                ->assertJsonStructure(['success', 'stats']);
        }
    }

    /**
     * Test 3: Candidate cannot post jobs (Must return 403)
     */
    public function test_candidate_cannot_post_job(): void
    {
        $candidate = User::where('role', 'candidate')->first() ?? User::factory()->create(['role' => 'candidate']);
        $category = Category::first();

        $response = $this->actingAs($candidate, 'sanctum')
            ->postJson('/api/jobs', [
                'title' => 'Malicious Job Post',
                'sector' => 'private',
                'job_type' => 'full-time',
                'work_mode' => 'on-site',
                'category_id' => $category?->id ?? 1,
                'company_name' => 'Fake Corp',
                'description' => 'Test description',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test 4: Duplicate job applications with same email are rejected
     */
    public function test_duplicate_application_is_prevented(): void
    {
        $job = JobListing::where('status', 'active')->first();
        if (!$job) return;

        $payload = [
            'full_name' => 'Duplicate Tester',
            'email' => 'duplicate.tester@example.com',
            'phone' => '+919999988888',
        ];

        // First application
        $first = $this->postJson("/api/jobs/{$job->id}/apply", $payload);
        $first->assertStatus(201);

        // Immediate duplicate application
        $second = $this->postJson("/api/jobs/{$job->id}/apply", $payload);
        $second->assertStatus(400);

        // Cleanup test application
        JobApplication::where('email', 'duplicate.tester@example.com')->delete();
    }
}
