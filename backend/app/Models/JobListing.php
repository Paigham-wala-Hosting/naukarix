<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'title_hi',
        'slug',
        'sector',
        'job_type',
        'work_mode',
        'is_fresher',
        'category_id',
        'state_id',
        'city',
        'location_display',
        'company_name',
        'company_logo',
        'company_website',
        'min_salary',
        'max_salary',
        'salary_type',
        'salary_currency',
        'is_salary_disclosed',
        'min_experience',
        'max_experience',
        'education_required',
        'qualification_level',
        'vacancies_count',
        'contact_phone',
        'whatsapp_number',
        'benefits_included',
        'shift_timing',
        'description',
        'description_hi',
        'skills_required',
        'responsibilities',
        'eligibility_criteria',
        'application_fee_details',
        'selection_process',
        'application_start_date',
        'application_deadline',
        'official_notification_url',
        'official_apply_url',
        'is_featured',
        'is_urgent',
        'is_verified',
        'status',
        'views_count',
        'applications_count',
    ];

    protected $casts = [
        'is_fresher' => 'boolean',
        'is_salary_disclosed' => 'boolean',
        'is_featured' => 'boolean',
        'is_urgent' => 'boolean',
        'is_verified' => 'boolean',
        'min_salary' => 'float',
        'max_salary' => 'float',
        'min_experience' => 'integer',
        'max_experience' => 'integer',
        'vacancies_count' => 'integer',
        'views_count' => 'integer',
        'applications_count' => 'integer',
        'skills_required' => 'array',
        'application_start_date' => 'date',
        'application_deadline' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }

    /**
     * Generate Google JobPosting JSON-LD Schema
     */
    public function toJobPostingSchema(): array
    {
        $employmentTypeMap = [
            'full-time' => 'FULL_TIME',
            'part-time' => 'PART_TIME',
            'contract' => 'CONTRACTOR',
            'internship' => 'INTERN',
        ];

        $schema = [
            '@context' => 'https://schema.org/',
            '@type' => 'JobPosting',
            'title' => $this->title,
            'description' => strip_tags($this->description),
            'identifier' => [
                '@type' => 'PropertyValue',
                'name' => $this->company_name,
                'value' => 'NAUKARIX-' . $this->id,
            ],
            'datePosted' => $this->created_at ? $this->created_at->toIso8601String() : now()->toIso8601String(),
            'validThrough' => $this->application_deadline ? $this->application_deadline->toIso8601String() : now()->addMonths(2)->toIso8601String(),
            'employmentType' => $employmentTypeMap[$this->job_type] ?? 'FULL_TIME',
            'hiringOrganization' => [
                '@type' => 'Organization',
                'name' => $this->company_name,
                'sameAs' => $this->company_website ?? 'https://naukarix.in',
                'logo' => $this->company_logo ?? 'https://naukarix.in/images/default-company.png',
            ],
            'jobLocation' => [
                '@type' => 'Place',
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => $this->city ?? 'All India',
                    'addressRegion' => $this->state?->name_en ?? 'All India',
                    'addressCountry' => 'IN',
                ],
            ],
        ];

        if ($this->work_mode === 'remote') {
            $schema['jobLocationType'] = 'TELECOMMUTE';
        }

        if ($this->is_salary_disclosed && $this->min_salary) {
            $schema['baseSalary'] = [
                '@type' => 'MonetaryAmount',
                'currency' => 'INR',
                'value' => [
                    '@type' => 'QuantitativeValue',
                    'minValue' => $this->min_salary,
                    'maxValue' => $this->max_salary ?? $this->min_salary,
                    'unitText' => $this->salary_type === 'per_month' ? 'MONTH' : 'YEAR',
                ],
            ];
        }

        return $schema;
    }
}
