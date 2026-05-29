<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use App\Services\ResetPasswordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends Controller
{
    protected ResetPasswordService $resetPasswordService;

    /**
     * Inject ResetPasswordService melalui constructor.
     */
    public function __construct(ResetPasswordService $resetPasswordService)
    {
        $this->resetPasswordService = $resetPasswordService;
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = Pengguna::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email tidak ditemukan.',
            ], 404);
        }

        // Generate token & expired
        $resetToken = $this->resetPasswordService->generateToken();
        $expiredAt  = $this->resetPasswordService->getExpiresAt();

        // Simpan di cache
        $this->resetPasswordService->storeToCache($resetToken, $user->email, $expiredAt);

        // Generate link & kirim email
        $resetLink = $this->resetPasswordService->generateResetLink($resetToken, $user->email);
        $this->resetPasswordService->sendResetEmail($user->email, $resetLink);

        return response()->json([
            'status'  => 'success',
            'message' => 'Link reset kata sandi telah dikirim ke email Anda.',
        ]);
    }

    public function verifyResetToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
        ]);

        // Cek token di cache
        $email = $this->resetPasswordService->getFromCache($request->token);

        if (!$email) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Token tidak valid atau sudah kadaluarsa.',
            ], 410);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Token valid.',
            'token'   => $request->token,
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Ambil email dari cache
        $email = $this->resetPasswordService->getFromCache($request->token);

        if (!$email) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Token tidak valid atau sudah kadaluarsa.',
            ], 410);
        }

        $user = Pengguna::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Hapus token dari cache
        $this->resetPasswordService->forgetCache($request->token);

        return response()->json([
            'status'  => 'success',
            'message' => 'Kata sandi berhasil diubah. Silakan login.',
            // 'email' => $user->email
        ]);
    }
}