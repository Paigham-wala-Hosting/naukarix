<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->string('qualification_level')->default('10th_pass')->after('education_required'); // 8th_pass, 10th_pass, 12th_pass, any_graduate, none
            $table->string('contact_phone')->nullable()->after('company_website');
            $table->string('whatsapp_number')->nullable()->after('contact_phone');
            $table->string('benefits_included')->nullable()->after('application_fee_details'); // e.g. Free Meals, Room, PF/ESI, Daily Incentive
            $table->string('shift_timing')->nullable()->after('work_mode'); // Day Shift, Night Shift, Rotational
        });
    }

    public function down(): void
    {
        Schema::table('job_listings', function (Blueprint $table) {
            $table->dropColumn(['qualification_level', 'contact_phone', 'whatsapp_number', 'benefits_included', 'shift_timing']);
        });
    }
};
