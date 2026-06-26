<?php

namespace App\Http\Controllers;

use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ChangeEmailController extends Controller
{
    public function __construct(
        private OtpService $otpService
    ) {
    }

    // =======================
    // KIRIM OTP KE EMAIL BARU
    // ======================= 
    public function sendVerification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'new_email' => 'required|email|unique:pengguna,email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password yang Anda masukkan salah !!'
            ], 401);
        }

        if ($request->new_email === $user->email) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email baru tidak boleh sama dengan email saat ini'
            ], 422);
        }

        $otp = $this->otpService->generateOtp();
        $expiresAt = $this->otpService->getExpiresAt();

        $cacheKey = 'change_email_' . $user->id;

        $this->otpService->storeToCache(
            $cacheKey,
            [
                'user_id' => $user->id,
                'new_email' => $request->new_email,
                'otp' => $otp,
            ],
            $expiresAt
        );

        $this->otpService->sendOtpEmail(
            $request->new_email,
            $otp
        );

        return response()->json([
            'status' => 'success',
            'message' => 'OTP telah dikirim ke email baru',
            'data' => [
                'new_email' => $request->new_email,
                'expires_at' => $expiresAt->toDateTimeString()
            ]
        ], 200);
    }

    // =======================================
    // VERIFIKASI OTP DAN GANTI EMAIL KE MODEL
    // =======================================
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'otp' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP wajib diisi',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        $cacheKey = 'change_email_' . $user->id;

        $cacheData = $this->otpService->getFromCache($cacheKey);

        if (!$cacheData) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP tidak ditemukan'
            ], 400);
        }

        if ((string) $cacheData['otp'] !== (string) $request->otp) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP tidak valid'
            ], 400);
        }

        $oldEmail = $user->email;
        $newEmail = $cacheData['new_email'];

        $user->update([
            'email' => $newEmail
        ]);

        $this->otpService->forgetCache($cacheKey);

        return response()->json([
            'status' => 'success',
            'message' => 'Email berhasil diubah',
            'data' => [
                'old_email' => $oldEmail,
                'new_email' => $newEmail
            ]
        ], 200);
    }
}
