<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\PameranController;
use App\Http\Controllers\GameAssetController;
use App\Http\Controllers\KaryaController;
use App\Http\Controllers\KomentarController;
use App\Http\Controllers\SukaController;
use App\Http\Controllers\KpsController;

// =============================
// PUBLIC ROUTES
// =============================
Route::get('/', function () {
    return view('error-api');
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [PenggunaController::class, 'register']);
    Route::post('/verify-otp', [PenggunaController::class, 'verifyOtp']);
    Route::post('/resend-otp', [PenggunaController::class, 'resendOtp']);
    Route::post('/login', [PenggunaController::class, 'login']);
    Route::post('/forgot-password', [ResetPasswordController::class, 'forgotPassword']);
    Route::post('/resend-email', [ResetPasswordController::class, 'resendEmail']);
    Route::post('/verify-reset-token', [ResetPasswordController::class, 'verifyResetToken']);
    Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);
});

// Publik Akses Global
Route::get('/pameran', [PameranController::class, 'index']);
Route::get('/pameran/{id}', [PameranController::class, 'show']);
Route::get('/karya/{id_karya}/komentar', [KomentarController::class, 'index']);
Route::get('/karya-terbaik', [KpsController::class, 'karyaTerbaik']); // ✅ public
Route::get('/public/karya/terbaik', [KaryaController::class, 'karyaTerbaikAktif']);
Route::get('/public/karya/favorit', [KaryaController::class, 'karyaFavoritAktif']);

//-----------------------
// !! JANGAN DISENTUH !!
//-----------------------

Route::prefix('experience')->group(function () {
    Route::get('/game-assets', [GameAssetController::class, 'index']);
    Route::get('/3d-models/{id}', [GameAssetController::class, 'get3DModel']);
    Route::get('/hall-model/{modelId}', [GameAssetController::class, 'serveHallModel']);     // ← tambah
    Route::get('/booth-model/{filename}', [GameAssetController::class, 'serveBoothModel']); // ← tambah
    Route::get('/karya/pameran/{id_pameran}', [GameAssetController::class, 'karyaByPameran']);
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

    // =============================
    // ADMIN
    // =============================
    Route::middleware('role:Admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['status' => 'success', 'page' => 'Admin Dashboard']);
        });

        Route::post('/pengguna/register-through-admin', [PenggunaController::class, 'registerThroughAdmin']);
        Route::get('/pengguna/role/{role}', [PenggunaController::class, 'getByRole']);
        Route::put('/pengguna/{id}', [PenggunaController::class, 'updateThroughAdmin']);

        // Manajemen Pameran
        Route::get('/pameran', [PameranController::class, 'index']);
        Route::post('/pameran/add', [PameranController::class, 'store']);
        Route::get('/pameran/{id}', [PameranController::class, 'show']);
        Route::put('/pameran/{id}', [PameranController::class, 'update']);
        Route::delete('/pameran/{id}', [PameranController::class, 'destroy']);
        Route::post('/pameran/{id}/update', [PameranController::class, 'update']);

        // Manajemen Karya (Admin)
        Route::get('/karya', [KaryaController::class, 'indexAdmin']);
        Route::delete('/karya/{id}', [KaryaController::class, 'destroy']);
    
    });

    // =============================
    // KPS
    // =============================
    Route::middleware('role:KPS')->prefix('kps')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['status' => 'success', 'page' => 'KPS Dashboard']);
        });

        // ✅ Manajemen karya terbaik
        Route::get('/karya', [KpsController::class, 'daftarKarya']);
        Route::patch('/karya/{id_karya}/terbaik', [KpsController::class, 'pilihTerbaik']);
        Route::patch('/karya/{id_karya}/batalkan', [KpsController::class, 'batalkanTerbaik']);
    });

    // =============================
    // KETUA PBL
    // =============================
    Route::middleware('role:Ketua PBL')->prefix('ketua-pbl')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['status' => 'success', 'page' => 'Ketua PBL Dashboard']);
        });
        // Pameran tersedia untuk karya (tahap persiapan, sesuai prodi)
        Route::get('/pameran-tersedia', [KaryaController::class, 'pameranTersedia']);
        Route::get('/stan/{id_pameran}', [KaryaController::class, 'stanTersedia']);
        // Manajemen Karya
        Route::get('/karya', [KaryaController::class, 'index']);
        Route::post('/karya', [KaryaController::class, 'store']);
        Route::put('/karya/{id}', [KaryaController::class, 'update']);
        Route::post('/karya/{id}/update', [KaryaController::class, 'update']);
        Route::get('/model-stan', [KaryaController::class, 'getModelStan']);
        
    });

    // =============================
    // GANTI EMAIL
    // =============================
    Route::prefix('change-email')->group(function () {
        Route::post('/send', [App\Http\Controllers\ChangeEmailController::class, 'sendVerification']);
        Route::post('/verify', [App\Http\Controllers\ChangeEmailController::class, 'verify']);
    });

    // =============================
    // GANTI KATA SANDI
    // =============================
    Route::post('/change-password', [App\Http\Controllers\ChangePasswordController::class, 'changePassword']);

    // =============================
    // KOMENTAR DAN SUKA
    // =============================
    Route::prefix('karya')->group(function () {
        Route::post('/{id_karya}/komentar', [KomentarController::class, 'store']);
        Route::post('/{id_karya}/suka', [SukaController::class, 'toggle']);
        Route::get('/{id_karya}/suka', [SukaController::class, 'status']);
    });
});