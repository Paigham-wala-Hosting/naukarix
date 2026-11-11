<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\Category;
use App\Models\State;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['category', 'state'])
            ->where('status', 'active');

        // Sector Filter: government or private
        if ($request->filled('sector')) {
            $query->where('sector', $request->sector);
        }

        // Category Filter
        if ($request->filled('category')) {
            if (is_numeric($request->category)) {
                $query->where('category_id', $request->category);
            } else {
                $category = Category::where('slug', $request->category)->first();
                if ($category) {
                    $query->where('category_id', $category->id);
                }
            }
        }

        // City and State Smart Filter
        $fallbackToState = false;
        if ($request->filled('city')) {
            $cityParam = trim($request->city);
            // Check if jobs exist for this city
            $cityMatchCount = JobListing::where('status', 'active')
                ->where(function ($cq) use ($cityParam) {
                    $cq->where('city', 'like', "%{$cityParam}%")
                       ->orWhere('location_display', 'like', "%{$cityParam}%");
                })->count();

            if ($cityMatchCount > 0) {
                $query->where(function ($cq) use ($cityParam) {
                    $cq->where('city', 'like', "%{$cityParam}%")
                       ->orWhere('location_display', 'like', "%{$cityParam}%")
                       ->orWhere('work_mode', 'remote');
                });
            } else {
                $fallbackToState = true;
                // Fall back to state if provided
                if ($request->filled('state')) {
                    $state = State::where('slug', $request->state)->orWhere('name_en', 'like', "%{$request->state}%")->orWhere('code', strtoupper($request->state))->first();
                    if ($state) {
                        $query->where(function ($q) use ($state) {
                            $q->where('state_id', $state->id)
                              ->orWhere('state_id', 1)
                              ->orWhere('work_mode', 'remote');
                        });
                    }
                }
            }
        } elseif ($request->filled('state')) {
            if (is_numeric($request->state)) {
                $query->where('state_id', $request->state);
            } else {
                $state = State::where('slug', $request->state)->orWhere('code', strtoupper($request->state))->first();
                if ($state) {
                    $query->where(function ($q) use ($state) {
                        $q->where('state_id', $state->id)
                          ->orWhere('state_id', 1); // Also include All India
                    });
                }
            }
        }

        // Qualification Filter (8th pass, 10th pass, 12th pass, etc.)
        if ($request->filled('qualification')) {
            $query->where('qualification_level', $request->qualification);
        }

        // Work Mode: remote (WFH), on-site, hybrid
        if ($request->filled('work_mode')) {
            $query->where('work_mode', $request->work_mode);
        }

        // Fresher Filter
        if ($request->has('is_fresher') && $request->is_fresher !== '' && $request->is_fresher !== null) {
            $isFresher = filter_var($request->is_fresher, FILTER_VALIDATE_BOOLEAN);
            if ($isFresher) {
                $query->where('is_fresher', true);
            }
        }

        // Experience Max
        if ($request->filled('experience')) {
            $exp = (int) $request->experience;
            $query->where('min_experience', '<=', $exp);
        }

        // Salary Min
        if ($request->filled('min_salary')) {
            $salary = (float) $request->min_salary;
            $query->where(function ($q) use ($salary) {
                $q->where('max_salary', '>=', $salary)
                  ->orWhere('min_salary', '>=', $salary);
            });
        }

        // Keyword Search
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sq) use ($q) {
                $sq->where('title', 'like', "%{$q}%")
                   ->orWhere('title_hi', 'like', "%{$q}%")
                   ->orWhere('company_name', 'like', "%{$q}%")
                   ->orWhere('city', 'like', "%{$q}%")
                   ->orWhere('description', 'like', "%{$q}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort', 'latest');
        if ($sortBy === 'salary_high') {
            $query->orderByDesc('max_salary');
        } elseif ($sortBy === 'views') {
            $query->orderByDesc('views_count');
        } elseif ($sortBy === 'deadline') {
            $query->orderBy('application_deadline', 'asc');
        } else {
            // Default: featured first, then newest
            $query->orderByDesc('is_featured')->orderByDesc('id');
        }

        $perPage = $request->get('per_page', 12);
        $jobs = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $jobs->items(),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
                'fallback_to_state' => $fallbackToState,
                'requested_city' => $request->city,
                'requested_state' => $request->state,
            ]
        ]);
    }

    public function featured()
    {
        $featured = JobListing::with(['category', 'state'])
            ->where('status', 'active')
            ->where('is_featured', true)
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $featured
        ]);
    }

    public function show($slug)
    {
        $job = JobListing::with(['category', 'state', 'user'])
            ->where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? $slug : 0)
            ->firstOrFail();

        // Increment view count
        $job->increment('views_count');

        // Related jobs
        $related = JobListing::with(['category', 'state'])
            ->where('status', 'active')
            ->where('id', '!=', $job->id)
            ->where(function ($q) use ($job) {
                $q->where('category_id', $job->category_id)
                  ->orWhere('sector', $job->sector);
            })
            ->latest()
            ->take(4)
            ->get();

        return response()->json([
            'success' => true,
            'job' => $job,
            'related' => $related,
            'schema_json_ld' => $job->toJobPostingSchema(),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Candidates cannot post job listings
        if ($user && $user->role === 'candidate') {
            return response()->json([
                'success' => false,
                'message' => 'Candidates cannot post vacancies. Please register or log in with an Employer account.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_hi' => 'nullable|string|max:255',
            'sector' => 'required|in:government,private',
            'job_type' => 'required|in:full-time,part-time,contract,internship',
            'work_mode' => 'required|in:on-site,remote,hybrid',
            'is_fresher' => 'boolean',
            'category_id' => 'required|exists:categories,id',
            'state_id' => 'nullable|exists:states,id',
            'city' => 'nullable|string|max:100',
            'location_display' => 'nullable|string|max:255',
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|string|max:500',
            'company_website' => 'nullable|string|max:255',
            'min_salary' => 'nullable|numeric',
            'max_salary' => 'nullable|numeric',
            'salary_type' => 'nullable|string',
            'is_salary_disclosed' => 'boolean',
            'min_experience' => 'nullable|integer',
            'max_experience' => 'nullable|integer',
            'education_required' => 'nullable|string|max:255',
            'qualification_level' => 'nullable|string|in:8th_pass,10th_pass,12th_pass,any_graduate,none',
            'vacancies_count' => 'nullable|integer',
            'description' => 'required|string',
            'description_hi' => 'nullable|string',
            'skills_required' => 'nullable|array',
            'responsibilities' => 'nullable|string',
            'eligibility_criteria' => 'nullable|string',
            'application_start_date' => 'nullable|date',
            'application_deadline' => 'nullable|date',
            'official_notification_url' => 'nullable|url',
            'official_apply_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_urgent' => 'boolean',
        ]);

        // Prevent unauthorized bypass of paid features (is_featured / is_urgent)
        if (!$user || $user->role !== 'admin') {
            $hasPaidPlan = Transaction::where('user_id', $user?->id)
                ->where('payment_status', 'completed')
                ->whereHas('pricingPlan', function ($q) {
                    $q->where('is_featured_badge', true);
                })
                ->exists();

            if (!$hasPaidPlan) {
                $validated['is_featured'] = false;
                $validated['is_urgent'] = false;
            }
        }

        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;
        while (JobListing::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $validated['slug'] = $slug;
        $validated['user_id'] = $user ? $user->id : null;
        $validated['status'] = 'active';
        $validated['location_display'] = $validated['location_display'] ?? ($validated['city'] ?? 'All India');

        $job = JobListing::create($validated);
        Category::where('id', $job->category_id)->increment('job_count');

        return response()->json([
            'success' => true,
            'message' => 'Job posted successfully!',
            'job' => $job->load(['category', 'state']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $job = JobListing::findOrFail($id);
        $user = $request->user();

        // Check ownership or admin
        if ($user->role !== 'admin' && $job->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'sector' => 'sometimes|required|in:government,private',
            'job_type' => 'sometimes|required|in:full-time,part-time,contract,internship',
            'work_mode' => 'sometimes|required|in:on-site,remote,hybrid',
            'min_salary' => 'nullable|numeric',
            'max_salary' => 'nullable|numeric',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|in:active,pending_approval,expired,closed',
            'is_featured' => 'boolean',
            'is_urgent' => 'boolean',
        ]);

        $job->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Job listing updated successfully',
            'job' => $job->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $job = JobListing::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'admin' && $job->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
        }

        Category::where('id', $job->category_id)->decrement('job_count');
        $job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job listing deleted successfully',
        ]);
    }
}
