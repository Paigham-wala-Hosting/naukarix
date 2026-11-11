<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobListing;
use App\Models\JobApplication;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function stats(Request $request)
    {
        $totalJobs = JobListing::count();
        $govtJobs = JobListing::where('sector', 'government')->count();
        $pvtJobs = JobListing::where('sector', 'private')->count();
        $totalCandidates = User::where('role', 'candidate')->count();
        $totalEmployers = User::where('role', 'employer')->count();
        $totalApplications = JobApplication::count();
        $totalRevenue = Transaction::where('payment_status', 'completed')->sum('amount');

        $recentApplications = JobApplication::with(['jobListing', 'user'])
            ->latest()
            ->take(6)
            ->get();

        $recentJobs = JobListing::with(['category', 'state'])
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_jobs' => $totalJobs,
                'govt_jobs' => $govtJobs,
                'pvt_jobs' => $pvtJobs,
                'total_candidates' => $totalCandidates,
                'total_employers' => $totalEmployers,
                'total_applications' => $totalApplications,
                'total_revenue' => (float) $totalRevenue,
            ],
            'recent_applications' => $recentApplications,
            'recent_jobs' => $recentJobs,
        ]);
    }

    public function jobs(Request $request)
    {
        $query = JobListing::with(['category', 'state', 'user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('sector')) {
            $query->where('sector', $request->sector);
        }

        $jobs = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $jobs->items(),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'total' => $jobs->total(),
            ]
        ]);
    }

    public function updateJobStatus(Request $request, $id)
    {
        $job = JobListing::findOrFail($id);

        $request->validate([
            'status' => 'nullable|in:active,pending_approval,expired,closed',
            'is_featured' => 'nullable|boolean',
            'is_urgent' => 'nullable|boolean',
            'is_verified' => 'nullable|boolean',
        ]);

        $data = $request->only(['status', 'is_featured', 'is_urgent', 'is_verified']);
        $job->update(array_filter($data, fn($v) => !is_null($v)));

        return response()->json([
            'success' => true,
            'message' => 'Job status updated',
            'job' => $job->fresh(),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sq) use ($q) {
                $sq->where('name', 'like', "%{$q}%")
                   ->orWhere('email', 'like', "%{$q}%")
                   ->orWhere('company_name', 'like', "%{$q}%");
            });
        }

        $users = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    public function toggleUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ($user->id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Cannot modify own account status'], 400);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User status changed to ' . ($user->is_active ? 'Active' : 'Suspended'),
            'user' => $user,
        ]);
    }

    public function transactions(Request $request)
    {
        $transactions = Transaction::with(['user', 'pricingPlan'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'total' => $transactions->total(),
            ]
        ]);
    }

    public function categories()
    {
        $categories = Category::withCount('jobListings')->orderBy('id', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name_en' => 'required|string|max:100',
            'name_hi' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:categories,slug',
            'icon' => 'nullable|string|max:50',
            'is_govt' => 'nullable|boolean',
        ]);

        $slug = $request->slug ? Str::slug($request->slug) : Str::slug($request->name_en);
        $base = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $counter++;
        }

        $category = Category::create([
            'name_en' => $request->name_en,
            'name_hi' => $request->name_hi,
            'slug' => $slug,
            'icon' => $request->icon ?? 'Briefcase',
            'is_govt' => (bool) $request->is_govt,
            'job_count' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'category' => $category,
        ]);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name_en' => 'required|string|max:100',
            'name_hi' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:categories,slug,' . $id,
            'icon' => 'nullable|string|max:50',
            'is_govt' => 'nullable|boolean',
        ]);

        $slug = $request->slug ? Str::slug($request->slug) : $category->slug;

        $category->update([
            'name_en' => $request->name_en,
            'name_hi' => $request->name_hi,
            'slug' => $slug,
            'icon' => $request->icon ?? $category->icon,
            'is_govt' => $request->has('is_govt') ? (bool) $request->is_govt : $category->is_govt,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'category' => $category,
        ]);
    }

    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        
        $jobCount = JobListing::where('category_id', $id)->count();
        if ($jobCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete category containing {$jobCount} active job vacancies. Please reassign those jobs first.",
            ], 400);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }
}
