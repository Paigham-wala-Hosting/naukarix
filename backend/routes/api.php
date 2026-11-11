<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\MetaController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Naukarix API Routes
|--------------------------------------------------------------------------
*/

// Mobile App Specific Endpoints (For Flutter, React Native, Android & iOS Apps)
Route::prefix('app')->group(function () {
    Route::get('/config', [AppController::class, 'config']);
    Route::get('/home', [AppController::class, 'homeFeed']);
});

// Public Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Meta (Categories, States, Pricing Plans)
Route::get('/categories', [MetaController::class, 'categories']);
Route::get('/states', [MetaController::class, 'states']);
Route::get('/pricing-plans', [MetaController::class, 'pricingPlans']);

// Public Jobs
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/featured', [JobController::class, 'featured']);
Route::get('/jobs/{slug}', [JobController::class, 'show']);

// Public Job Alerts & Public Application (Candidates without login can also apply)
Route::post('/job-alerts', [AlertController::class, 'subscribe']);
Route::post('/jobs/{id}/apply', [ApplicationController::class, 'apply']);

// Protected Routes (Sanctum Auth)
Route::middleware('auth:sanctum')->group(function () {
    // Current User
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/upload-resume', [AuthController::class, 'uploadResume']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Candidate Specific
    Route::get('/candidate/applications', [ApplicationController::class, 'candidateApplications']);
    Route::post('/jobs/{id}/save', [ApplicationController::class, 'toggleSave']);
    Route::get('/candidate/saved-jobs', [ApplicationController::class, 'candidateSavedJobs']);

    // Employer Specific (Post & Manage Jobs, View Applicants)
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    Route::get('/employer/jobs', [ApplicationController::class, 'employerJobs']);
    Route::get('/employer/applications', [ApplicationController::class, 'employerApplications']);
    Route::put('/employer/applications/{id}/status', [ApplicationController::class, 'updateApplicationStatus']);

    // Paid Job Posting & Checkout
    Route::post('/checkout/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/checkout/verify', [PaymentController::class, 'verifyPayment']);

    // Admin Panel Routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/jobs', [AdminController::class, 'jobs']);
        Route::put('/jobs/{id}/status', [AdminController::class, 'updateJobStatus']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::get('/transactions', [AdminController::class, 'transactions']);
        Route::get('/categories', [AdminController::class, 'categories']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);
    });
});
