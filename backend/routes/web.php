<?php

use Illuminate\Support\Facades\Route;

// If user opens http://localhost:8000/ or any frontend route on port 8000,
// automatically redirect to the Next.js Frontend on port 3000!
Route::get('/', function () {
    return redirect('http://localhost:3000');
});

Route::get('/admin', function () {
    return redirect('http://localhost:3000/admin');
});

Route::get('/admin/{any}', function ($any) {
    return redirect('http://localhost:3000/admin/' . $any);
})->where('any', '.*');

Route::fallback(function () {
    $path = request()->path();
    if (!str_starts_with($path, 'api')) {
        return redirect('http://localhost:3000/' . ltrim($path, '/'));
    }
    return response()->json(['success' => false, 'message' => 'API Route Not Found'], 404);
});
