<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_hi',
        'slug',
        'price',
        'billing_period',
        'job_post_limit',
        'duration_days',
        'is_featured_badge',
        'applicant_contact_access',
        'instant_alerts_to_candidates',
        'social_media_promotion',
        'is_popular',
        'features',
    ];

    protected $casts = [
        'price' => 'float',
        'job_post_limit' => 'integer',
        'duration_days' => 'integer',
        'is_featured_badge' => 'boolean',
        'applicant_contact_access' => 'boolean',
        'instant_alerts_to_candidates' => 'boolean',
        'social_media_promotion' => 'boolean',
        'is_popular' => 'boolean',
        'features' => 'array',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
