<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_hi',
        'slug',
        'icon',
        'is_govt',
        'job_count',
    ];

    protected $casts = [
        'is_govt' => 'boolean',
        'job_count' => 'integer',
    ];

    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }
}
