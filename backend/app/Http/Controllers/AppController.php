<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\JobListing;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;

class AppController extends Controller
{
    /**
     * Mobile App Global Configuration & Splash Info
     * Used by Flutter / React Native on Launch
     */
    public function config()
    {
        return response()->json([
            'success' => true,
            'app_info' => [
                'app_name' => 'Naukarix',
                'android_latest_version' => '1.0.0',
                'android_min_version' => '1.0.0',
                'ios_latest_version' => '1.0.0',
                'ios_min_version' => '1.0.0',
                'force_update' => false,
                'maintenance_mode' => false,
                'contact_whatsapp' => '919876543210',
                'contact_phone' => '+91 98765 43210',
                'contact_email' => 'support@naukarix.in',
                'privacy_policy_url' => 'https://naukarix.in/privacy',
                'terms_url' => 'https://naukarix.in/terms',
                'share_message' => 'Naukarix App पर 8वीं, 10वीं और 12वीं पास के लिए कॉल सेंटर, होटल और दुकानों में नौकरियां देखें: https://naukarix.in',
            ]
        ]);
    }

    /**
     * Mobile App Fast Home Feed
     * Delivers everything needed for mobile home screen in 1 fast query
     */
    public function homeFeed(Request $request)
    {
        $city = $request->query('city', 'Lucknow');
        $state = $request->query('state', 'Uttar Pradesh');

        // Banners for mobile carousel
        $banners = [
            [
                'id' => 1,
                'title' => 'कॉल सेंटर व टेलीकॉलिंग में सीधी भर्ती',
                'subtitle' => '₹14,000 से ₹22,000 महीना + इंसेंटिव',
                'category_slug' => 'call-center-bpo',
                'image_url' => 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&h=300&fit=crop',
            ],
            [
                'id' => 2,
                'title' => 'होटल एवं रेस्टोरेंट स्टाफ आवश्यकता',
                'subtitle' => 'रहना और खाना बिल्कुल फ्री',
                'category_slug' => 'hotel-hospitality',
                'image_url' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=300&fit=crop',
            ],
            [
                'id' => 3,
                'title' => 'घर बैठे काम (Work From Home)',
                'subtitle' => 'स्मार्टफोन से कॉलिंग व डेटा एंट्री',
                'category_slug' => 'call-center-bpo',
                'image_url' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=300&fit=crop',
            ]
        ];

        // Categories
        $categories = Category::all();

        // City specific or Nearby Jobs
        $cityJobs = JobListing::with(['category', 'state'])
            ->where('status', 'active')
            ->where(function ($q) use ($city) {
                $q->where('city', 'like', "%{$city}%")
                  ->orWhere('work_mode', 'remote');
            })
            ->latest()
            ->take(6)
            ->get();

        if ($cityJobs->isEmpty()) {
            $cityJobs = JobListing::with(['category', 'state'])
                ->where('status', 'active')
                ->latest()
                ->take(6)
                ->get();
        }

        // 8th & 10th Pass Quick Jobs
        $freshersJobs = JobListing::with(['category', 'state'])
            ->where('status', 'active')
            ->whereIn('qualification_level', ['8th_pass', '10th_pass'])
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'banners' => $banners,
                'categories' => $categories,
                'nearby_jobs' => $cityJobs,
                'entry_level_jobs' => $freshersJobs,
                'total_active_jobs' => JobListing::where('status', 'active')->count(),
            ]
        ]);
    }
}
