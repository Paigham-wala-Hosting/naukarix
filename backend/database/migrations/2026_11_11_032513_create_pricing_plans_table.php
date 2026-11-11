<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_hi')->nullable();
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('billing_period')->default('one_time'); // monthly, one_time
            $table->integer('job_post_limit')->default(1);
            $table->integer('duration_days')->default(30);
            $table->boolean('is_featured_badge')->default(false);
            $table->boolean('applicant_contact_access')->default(false);
            $table->boolean('instant_alerts_to_candidates')->default(false);
            $table->boolean('social_media_promotion')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->json('features')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
