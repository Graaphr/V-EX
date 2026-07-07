<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use App\Services\ResetPasswordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ResetPasswordController extends Controller
{
    protected ResetPasswordService $resetPasswordService;

    public function __construct(ResetPasswordService $resetPasswordService)
    {
        $this->resetPasswordService = $resetPasswordService;
    }

    // =======================================
    // SEND LINK CHANGE PASSWORD TO USER MAIL 
    // =======================================
    public function forgotPassword(Request $request)
    {
        try {

            $request->validate([
                'email' => 'required|email',
            ]);

            $user = Pengguna::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email tidak ditemukan.',
                ], 404);
            }

            $resetToken = $this->resetPasswordService->generateToken();
            $expiredAt = $this->resetPasswordService->getExpiresAt();

            $this->resetPasswordService->storeToCache($resetToken, $user->email, $expiredAt);

            $resetLink = $this->resetPasswordService->generateResetLink($resetToken, $user->email);
            $this->resetPasswordService->sendResetEmail($user->email, $resetLink);

            return response()->json([
                'status' => 'success',
                'message' => 'Link reset kata sandi telah dikirim ke email Anda.',
            ]);

        } catch (ValidationException $e) {

            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal.',
            ], 422);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan pada server.',
            ], 500);
        }
    }

    // ====================
    // RE-SEND TO USER MAIL 
    // ====================
    public function resendEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            $user = Pengguna::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email tidak ditemukan.',
                ], 404);
            }

            $resetToken = $this->resetPasswordService->generateToken();
            $expiredAt = $this->resetPasswordService->getExpiresAt();

            $this->resetPasswordService->storeToCache($resetToken, $user->email, $expiredAt);

            $resetLink = $this->resetPasswordService->generateResetLink($resetToken, $user->email);
            $this->resetPasswordService->sendResetEmail($user->email, $resetLink);

            return response()->json([
                'status' => 'success',
                'message' => 'Email reset berhasil dikirim ulang.',
            ]);

        } catch (ValidationException $e) {
            $errors = $e->errors();
            return response()->json([
                'status' => 'error',
                'message' => $errors['email'][0] ?? 'Validasi gagal.',
            ], 422);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan pada server.',
            ], 500);
        }
    }

    // ==========================
    // VERIFIKASI TOKEN YANG ADA 
    // ==========================
    public function verifyResetToken(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
            ]);

            $email = $this->resetPasswordService->getFromCache($request->token);

            if (!$email) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token tidak valid atau sudah kadaluarsa.',
                ], 410);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Token valid.',
                'token' => $request->token,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token wajib disertakan.',
            ], 422);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan pada server.',
            ], 500);
        }
    }

    // ================================
    // RESET PASSWORD LANGSUNG KE MODEL
    // ================================
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
            ]);

            $email = $this->resetPasswordService->getFromCache($request->token);

            if (!$email) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token tidak valid atau sudah kadaluarsa.',
                ], 410);
            }

            $user = Pengguna::where('email', $email)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User tidak ditemukan.',
                ], 404);
            }

            $user->update([
                'password' => Hash::make($request->password),
            ]);

            $this->resetPasswordService->forgetCache($request->token);

            return response()->json([
                'status' => 'success',
                'message' => 'Kata sandi berhasil diubah. Silakan login.',
            ]);

        // } catch (ValidationException $e) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Validasi gagal.',
        //     ], 422);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan pada server.',
            ], 500);
        }
    }
}