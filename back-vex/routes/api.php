<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PameranController;
use App\Http\Controllers\PublicPameranController;
use App\Http\Controllers\GameAssetController;
use App\Http\Controllers\KaryaController;
use App\Http\Controllers\KomentarController;
use App\Http\Controllers\SukaController;

// Route::post('/test', function () {
//     return response()->json(['message' => 'OK']);
// });

// =============================
// PUBLIC ROUTES SETELAH LOGIN
// =============================
Route::prefix('auth')->group(function () {

    // Akun Control
    Route::post(
        '/register',
        [PenggunaController::class, 'register']
    );
    Route::post(
        '/verify-otp',
        [PenggunaController::class, 'verifyOtp']
    );
    Route::post(
        '/resend-otp',
        [PenggunaController::class, 'resendOtp']
    );
    Route::post(
        '/login',
        [PenggunaController::class, 'login']
    );

    // Manajemen Password
    Route::post(
        '/forgot-password',
        [ResetPasswordController::class, 'forgotPassword']
    );

    Route::post(
        '/resend-email',
        [ResetPasswordController::class, 'resendEmail']
    );

    Route::post(
        '/verify-reset-token',
        [ResetPasswordController::class, 'verifyResetToken']
    );

    Route::post(
        '/reset-password',
        [ResetPasswordController::class, 'resetPassword']
    );



});



// Publik Akses Global
Route::get('/pameran', [PameranController::class, 'index']);
Route::get('/pameran/{id}', [PameranController::class, 'show']);
Route::get('/game-assets', [GameAssetController::class, 'index']);
Route::get('/karya/{id_karya}/komentar', [KomentarController::class, 'index']);   // lihat komentar

// =============================
// PROTECTED ROUTES
// =============================
Route::middleware('auth:sanctum')->group(function () {

    // Ambil data user
    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
        ]);
    })->name('auth.user');

    // Keluar
    Route::post(
        '/logout',
        [PenggunaController::class, 'logout']
    )->name('auth.logout');

    // Route::get('/dashboard', function () {
    //     return response()->json(['status' => 'success', 'page' => 'Dashboard Umum']);
    // });

    // Admin Control
    Route::middleware('role:Admin')->prefix('admin')
        ->group(function () {
            Route::get('/dashboard', function () {
                return response()->json(['status' => 'success', 'page' => 'Admin Dashboard']);
            });

            Route::post('/pengguna/register-through-admin', [PenggunaController::class, 'registerThroughAdmin']);
            Route::get('/pengguna/role/{role}', [PenggunaController::class, 'getByRole']);
            Route::put('/pengguna/{id}', [PenggunaController::class, 'updateThroughAdmin']);



            // Manajemen pameran
            Route::get('/pameran', [PameranController::class, 'index']);
            Route::post('/pameran/add', [PameranController::class, 'store']);
            Route::get('/pameran/{id}', [PameranController::class, 'show']);
            Route::put('/pameran/{id}', [PameranController::class, 'update']);
            Route::delete('/pameran/{id}', [PameranController::class, 'destroy']);
            Route::post('/pameran/{id}/update', [PameranController::class, 'update']);

            // Manajemen Karya (Admin)
            Route::delete('/karya/{id}', [KaryaController::class, 'destroy']);
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

        // Manajemen Karya (Ketua PBL)
        Route::get('/karya', [KaryaController::class, 'index']);
        Route::post('/karya', [KaryaController::class, 'store']);
        Route::put('/karya/{id}', [KaryaController::class, 'update']);
        Route::post('/karya/{id}/update', [KaryaController::class, 'update']);
        Route::delete('/karya/{id}', [KaryaController::class, 'destroy']);
    });

    // GANTI EMAIL
    Route::prefix('change-email')->group(function () {
        Route::post(
            '/send',
            [App\Http\Controllers\ChangeEmailController::class, 'sendVerification']
        );
        Route::post(
            '/verify',
            [App\Http\Controllers\ChangeEmailController::class, 'verify']
        );
    });

    // GANTI KATA SANDI 
    Route::post(
        '/change-password',
        [App\Http\Controllers\ChangePasswordController::class, 'changePassword']
    );

    // KOMENTAR DAN SUKA
     Route::prefix('karya')->group(function () {
        Route::post('/{id_karya}/komentar', [KomentarController::class, 'store']);   // tambah komentar
        Route::post('/{id_karya}/suka',     [SukaController::class,     'toggle']);  // toggle like
        Route::get('/{id_karya}/suka',      [SukaController::class,     'status']);  // cek status like
    });
    

});