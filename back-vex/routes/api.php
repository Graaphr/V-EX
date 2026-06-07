<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PameranController;
use App\Http\Controllers\PublicPameranController;
use App\Http\Controllers\GameAssetController;

// Route::post('/test', function () {
//     return response()->json(['message' => 'OK']);
// });

// =============================
// PUBLIC ROUTES
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

Route::prefix('pengguna')->group(function(){
    Route::post('/register-through-admin',[PenggunaController::class, 'registerThroughAdmin']);
    Route::get('/role/{role}', [PenggunaController::class, 'getByRole']);
    Route::put('/{id}', [PenggunaController::class, 'updateThroughAdmin']);
});

// Publik Akses
Route::get('/pameran', [PameranController::class, 'index']);
Route::get('/pameran/{id}', [PameranController::class, 'show']);
Route::get('/game-assets', [GameAssetController::class, 'index']);

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

            // Manajemen pengguna
            Route::get('/pengguna', [AdminController::class, 'daftarPengguna']);
            Route::post('/pengguna', [AdminController::class, 'tambahPengguna']);
            Route::get('/pengguna/{id}', [AdminController::class, 'detailPengguna']);
            Route::put('/pengguna/{id}', [AdminController::class, 'editPengguna']);
            Route::patch('/pengguna/{id}/aktifkan', [AdminController::class, 'aktifkanAkun']);
            Route::patch('/pengguna/{id}/nonaktifkan', [AdminController::class, 'nonaktifkanAkun']);

            // Manajemen pameran
            Route::get('/pameran', [PameranController::class, 'index']);
            Route::post('/pameran', [PameranController::class, 'store']);
            Route::get('/pameran/{id}', [PameranController::class, 'show']);
            Route::put('/pameran/{id}', [PameranController::class, 'update']);
            Route::delete('/pameran/{id}', [PameranController::class, 'destroy']);
       

            // Manajemen pengguna
            Route::get('/pengguna', [AdminController::class, 'daftarPengguna']);
            Route::post('/pengguna', [AdminController::class, 'tambahPengguna']);
            Route::get('/pengguna/{id}', [AdminController::class, 'detailPengguna']);
            Route::put('/pengguna/{id}', [AdminController::class, 'editPengguna']);
            Route::patch('/pengguna/{id}/aktifkan', [AdminController::class, 'aktifkanAkun']);
            Route::patch('/pengguna/{id}/nonaktifkan', [AdminController::class, 'nonaktifkanAkun']);

            // Manajemen pameran
            Route::get('/pameran', [PameranController::class, 'index']);
            Route::post('/pameran/add', [PameranController::class, 'store']);
            Route::get('/pameran/{id}', [PameranController::class, 'show']);
            Route::put('/pameran/{id}', [PameranController::class, 'update']);
            Route::delete('/pameran/{id}', [PameranController::class, 'destroy']);
            Route::post('/pameran/{id}/update', [PameranController::class, 'update']);
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

});