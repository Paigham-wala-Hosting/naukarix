<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('candidate')->after('email'); // candidate, employer, admin
            $table->string('phone')->nullable()->after('role');
            $table->string('headline')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('headline');
            $table->decimal('experience_years', 4, 1)->default(0)->after('bio');
            $table->text('skills')->nullable()->after('experience_years');
            $table->string('education')->nullable()->after('skills');
            $table->string('current_city')->nullable()->after('education');
            $table->string('state')->nullable()->after('current_city');
            $table->string('resume_path')->nullable()->after('state');
            $table->string('company_name')->nullable()->after('resume_path');
            $table->string('company_website')->nullable()->after('company_name');
            $table->string('company_logo')->nullable()->after('company_website');
            $table->text('company_description')->nullable()->after('company_logo');
            $table->string('avatar')->nullable()->after('company_description');
            $table->boolean('is_active')->default(true)->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 'phone', 'headline', 'bio', 'experience_years', 'skills', 
                'education', 'current_city', 'state', 'resume_path', 
                'company_name', 'company_website', 'company_logo', 'company_description',
                'avatar', 'is_active'
            ]);
        });
    }
};
