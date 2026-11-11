<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\State;
use App\Models\PricingPlan;
use Illuminate\Http\Request;

class MetaController extends Controller
{
    public function categories()
    {
        $categories = Category::withCount(['jobListings' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function states()
    {
        $states = State::where('is_active', true)
            ->withCount(['jobListings' => function ($q) {
                $q->where('status', 'active');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $states,
        ]);
    }

    public function pricingPlans()
    {
        $plans = PricingPlan::all();

        return response()->json([
            'success' => true,
            'data' => $plans,
        ]);
    }
}
