<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobApplication;
use App\Models\SavedJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    /**
     * Candidate applies to a job
     */
    public function apply(Request $request, $id)
    {
        $job = JobListing::findOrFail($id);
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'current_city' => 'nullable|string|max:100',
            'total_experience' => 'nullable|numeric',
            'current_ctc' => 'nullable|string|max:50',
            'expected_ctc' => 'nullable|string|max:50',
            'notice_period' => 'nullable|string|max:50',
            'cover_letter' => 'nullable|string',
            'resume_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'resume_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check duplicate application (both for logged-in candidates and guest applicants)
        $existingQuery = JobApplication::where('job_listing_id', $job->id);
        if ($user) {
            $existingQuery->where(function ($q) use ($user, $request) {
                $q->where('user_id', $user->id)
                  ->orWhere('email', $request->email);
            });
        } else {
            $existingQuery->where('email', $request->email);
        }

        if ($existingQuery->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied for this job vacancy with this email address.',
            ], 400);
        }

        $resumeUrl = $request->resume_url;
        if ($request->hasFile('resume_file')) {
            $file = $request->file('resume_file');
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $path = $file->storeAs('resumes', $fileName, 'public');
            $resumeUrl = '/storage/' . $path;
            if ($user && empty($user->resume_path)) {
                $user->update(['resume_path' => $resumeUrl]);
            }
        } elseif ($user && empty($resumeUrl)) {
            $resumeUrl = $user->resume_path;
        }

        $application = JobApplication::create([
            'job_listing_id' => $job->id,
            'user_id' => $user ? $user->id : null,
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'current_city' => $request->current_city,
            'total_experience' => $request->total_experience ?? 0,
            'current_ctc' => $request->current_ctc,
            'expected_ctc' => $request->expected_ctc,
            'notice_period' => $request->notice_period,
            'resume_url' => $resumeUrl,
            'cover_letter' => $request->cover_letter,
            'status' => 'applied',
        ]);

        $job->increment('applications_count');

        return response()->json([
            'success' => true,
            'message' => 'Your application has been submitted successfully!',
            'application' => $application,
        ], 201);
    }

    /**
     * Candidate: list my applied jobs
     */
    public function candidateApplications(Request $request)
    {
        $user = $request->user();

        $applications = JobApplication::with(['jobListing.category', 'jobListing.state'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $applications,
        ]);
    }

    /**
     * Toggle Save / Bookmark job
     */
    public function toggleSave(Request $request, $id)
    {
        $user = $request->user();
        $job = JobListing::findOrFail($id);

        $saved = SavedJob::where('user_id', $user->id)
            ->where('job_listing_id', $job->id)
            ->first();

        if ($saved) {
            $saved->delete();
            $isSaved = false;
            $message = 'Job removed from saved list';
        } else {
            SavedJob::create([
                'user_id' => $user->id,
                'job_listing_id' => $job->id,
            ]);
            $isSaved = true;
            $message = 'Job saved to your bookmarks';
        }

        return response()->json([
            'success' => true,
            'is_saved' => $isSaved,
            'message' => $message,
        ]);
    }

    /**
     * Candidate: list my saved jobs
     */
    public function candidateSavedJobs(Request $request)
    {
        $user = $request->user();

        $saved = SavedJob::with(['jobListing.category', 'jobListing.state'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $saved,
        ]);
    }

    /**
     * Employer: view incoming applications
     */
    public function employerApplications(Request $request)
    {
        $user = $request->user();

        // If admin, can view all, otherwise only their jobs
        $query = JobApplication::with(['jobListing', 'user'])
            ->whereHas('jobListing', function ($q) use ($user) {
                if ($user->role !== 'admin') {
                    $q->where('user_id', $user->id);
                }
            });

        if ($request->filled('job_id')) {
            $query->where('job_listing_id', $request->job_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $applications = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $applications->items(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'total' => $applications->total(),
            ]
        ]);
    }

    /**
     * Employer: update applicant status
     */
    public function updateApplicationStatus(Request $request, $id)
    {
        $application = JobApplication::with('jobListing')->findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'admin' && $application->jobListing->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
        }

        $request->validate([
            'status' => 'required|in:applied,in_review,shortlisted,rejected,selected',
            'employer_notes' => 'nullable|string',
        ]);

        $application->update([
            'status' => $request->status,
            'employer_notes' => $request->employer_notes ?? $application->employer_notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated to ' . ucfirst($request->status),
            'application' => $application,
        ]);
    }

    /**
     * Employer: my posted jobs list
     */
    public function employerJobs(Request $request)
    {
        $user = $request->user();

        $jobs = JobListing::with(['category', 'state'])
            ->withCount('applications')
            ->where(function ($q) use ($user) {
                if ($user->role === 'admin') {
                    // admin can view all
                } else {
                    $q->where('user_id', $user->id);
                }
            })
            ->latest()
            ->paginate(15);

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
}
