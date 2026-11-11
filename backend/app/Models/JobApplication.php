<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_listing_id',
        'user_id',
        'full_name',
        'email',
        'phone',
        'current_city',
        'total_experience',
        'current_ctc',
        'expected_ctc',
        'notice_period',
        'resume_url',
        'cover_letter',
        'status',
        'employer_notes',
    ];

    protected $casts = [
        'total_experience' => 'float',
    ];

    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
