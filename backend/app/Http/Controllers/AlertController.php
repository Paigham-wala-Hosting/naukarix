<?php

namespace App\Http\Controllers;

use App\Models\JobAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AlertController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'keyword' => 'nullable|string|max:100',
            'category_id' => 'nullable|exists:categories,id',
            'state_id' => 'nullable|exists:states,id',
            'sector' => 'nullable|in:government,private',
            'work_mode' => 'nullable|in:remote,on-site,hybrid',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $alert = JobAlert::create([
            'email' => $request->email,
            'phone' => $request->phone,
            'keyword' => $request->keyword,
            'category_id' => $request->category_id,
            'state_id' => $request->state_id,
            'sector' => $request->sector,
            'work_mode' => $request->work_mode,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Free Job Alert subscribed successfully! You will receive new matching vacancy updates.',
            'alert' => $alert,
        ], 201);
    }
}
