<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pricing_plan_id',
        'amount',
        'currency',
        'payment_method',
        'transaction_id',
        'order_id',
        'payment_status',
        'invoice_number',
        'payment_response',
    ];

    protected $casts = [
        'amount' => 'float',
        'payment_response' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pricingPlan()
    {
        return $this->belongsTo(PricingPlan::class);
    }
}
