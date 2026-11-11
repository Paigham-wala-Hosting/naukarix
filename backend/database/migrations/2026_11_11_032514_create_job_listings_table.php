<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('title_hi')->nullable();
            $table->string('slug')->unique();
            $table->enum('sector', ['government', 'private'])->default('private');
            $table->enum('job_type', ['full-time', 'part-time', 'contract', 'internship'])->default('full-time');
            $table->enum('work_mode', ['on-site', 'remote', 'hybrid'])->default('on-site');
            $table->boolean('is_fresher')->default(false);
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('state_id')->nullable()->constrained('states')->nullOnDelete();
            $table->string('city')->nullable();
            $table->string('location_display')->default('All India');
            
            // Company / Department Details
            $table->string('company_name');
            $table->string('company_logo')->nullable();
            $table->string('company_website')->nullable();

            // Salary details
            $table->decimal('min_salary', 12, 2)->nullable();
            $table->decimal('max_salary', 12, 2)->nullable();
            $table->string('salary_type')->default('per_annum'); // per_month, per_annum
            $table->string('salary_currency')->default('INR');
            $table->boolean('is_salary_disclosed')->default(true);

            // Experience & Education
            $table->unsignedInteger('min_experience')->default(0); // in years
            $table->unsignedInteger('max_experience')->default(0);
            $table->string('education_required')->nullable();
            $table->unsignedInteger('vacancies_count')->default(1);

            // Job description & content
            $table->longText('description');
            $table->longText('description_hi')->nullable();
            $table->json('skills_required')->nullable();
            $table->text('responsibilities')->nullable();
            $table->text('eligibility_criteria')->nullable();
            $table->text('application_fee_details')->nullable(); // For Govt jobs
            $table->text('selection_process')->nullable(); // For Govt jobs

            // Links and dates
            $table->date('application_start_date')->nullable();
            $table->date('application_deadline')->nullable();
            $table->string('official_notification_url')->nullable(); // PDF or link
            $table->string('official_apply_url')->nullable(); // External link

            // Badges & flags
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_urgent')->default(false);
            $table->boolean('is_verified')->default(true);
            $table->enum('status', ['active', 'pending_approval', 'expired', 'closed'])->default('active');
            
            $table->unsignedBigInteger('views_count')->default(0);
            $table->unsignedBigInteger('applications_count')->default(0);
            $table->timestamps();

            // Indexes for fast searching
            $table->index(['sector', 'status']);
            $table->index(['category_id', 'status']);
            $table->index(['state_id', 'status']);
            $table->index(['work_mode', 'status']);
            $table->index(['is_fresher', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
