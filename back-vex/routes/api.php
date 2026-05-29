<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\AdminController;

// Route::post('/test', function () {
//     return response()->json(['message' => 'OK']);
// });

// =============================
// PUBLIC ROUTES
// =============================
Route::prefix('auth')->group(function () {
    Route::post('/register', [PenggunaController::class, 'register']);
    Route::post('/verify-otp', [PenggunaController::class, 'verifyOtp']);
    Route::post('/resend-otp', [PenggunaController::class, 'resendOtp']);
    Route::post('/login', [PenggunaController::class, 'login']);
    Route::post('/forgot-password', [ResetPasswordController::class, 'forgotPassword']);
    Route::post('/verify-reset-token', [ResetPasswordController::class, 'verifyResetToken']);
    Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);
});

// =============================
// PROTECTED ROUTES
// =============================
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
        ]);
    })->name('auth.user');

    Route::post('/logout', [PenggunaController::class, 'logout'])->name('auth.logout');

    Route::get('/dashboard', function () {
        return response()->json(['status' => 'success', 'page' => 'Dashboard Umum']);
    });

    // Admin
    Route::middleware('role:Admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['status' => 'success', 'page' => 'Admin Dashboard']);
        });

        //manajemen pengguna
        Route::get('/pengguna',                    [AdminController::class, 'daftarPengguna']);
        Route::post('/pengguna',                   [AdminController::class, 'tambahPengguna']);
        Route::get('/pengguna/{id}',               [AdminController::class, 'detailPengguna']);
        Route::put('/pengguna/{id}',               [AdminController::class, 'editPengguna']);
        Route::patch('/pengguna/{id}/aktifkan',    [AdminController::class, 'aktifkanAkun']);
        Route::patch('/pengguna/{id}/nonaktifkan', [AdminController::class, 'nonaktifkanAkun']);
    });

    // KPS
    Route::middleware('role:KPS')->prefix('kps')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['status' => 'success', 'page' => 'KPS Dashboard']);
        });
    });

    // Ketua PBL
    Route::middleware('role:Ketua PBL')->prefix('ketua-pbl')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['status' => 'success', 'page' => 'Ketua PBL Dashboard']);
        });
    });

    // GANTI EMAIL
    Route::prefix('change-email')->group(function () {
        Route::post('/send', [App\Http\Controllers\ChangeEmailController::class, 'sendVerification']);
        Route::post('/verify', [App\Http\Controllers\ChangeEmailController::class, 'verify']);
    });

});