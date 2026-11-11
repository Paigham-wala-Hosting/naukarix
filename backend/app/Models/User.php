<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'headline',
        'bio',
        'experience_years',
        'skills',
        'education',
        'current_city',
        'state',
        'resume_path',
        'company_name',
        'company_website',
        'company_logo',
        'company_description',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'experience_years' => 'float',
        ];
    }

    public function jobListings()
    {
        return $this->hasMany(JobListing::class, 'user_id');
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'user_id');
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class, 'user_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'user_id');
    }
}
