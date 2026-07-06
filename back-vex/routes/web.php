<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PenggunaController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'app' => 'Virtual Exhibition API',
        'status' => 'Online',
        'message' => 'Backend is ready to connect with Next.js'
    ]);
});
// Route::post('/register', [PenggunaController::class, 'register']);
// Route::post('/verify-otp', [PenggunaController::class, 'verifyOtp']);
// Route::post('/resend-otp', [PenggunaController::class, 'resendOtp']);
// Route::post('/login', [PenggunaController::class, 'login']);

// Tambahkan rute fallback ini di paling bawah file web.php
// Gunanya: Jika Anda akses URL yang salah, tetap muncul JSON (bagus untuk debugging)
// Route::fallback(function () {
//     return response()->json([
//         'message' => 'Route tidak ditemukan. Pastikan URL benar.',
//         'help' => 'Cek /api/... untuk endpoint data atau /sanctum/csrf-cookie untuk session.'
//     ], 404);
// });


Route::fallback(function () {

    if (request()->is('api/*')) {

        return view('error-api');
    }

    abort(404);
});