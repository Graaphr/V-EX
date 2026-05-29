<?php

namespace App\Services;

use App\Mail\ResetPasswordMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ResetPasswordService
{
    const CACHE_PREFIX        = 'reset_token_';
    const RESET_EXPIRY_MINUTES = 15;

    /**
     * Generate token UUID untuk reset password.
     */
    public function generateToken(): string
    {
        return Str::uuid();
    }

    /**
     * Hitung waktu kedaluwarsa token.
     */
    public function getExpiresAt(): Carbon
    {
        return Carbon::now()->addMinutes(self::RESET_EXPIRY_MINUTES);
    }

    /**
     * Simpan email user ke cache dengan token sebagai key.
     */
    public function storeToCache(string $token, string $email, Carbon $expiresAt): void
    {
        Cache::put(
            self::CACHE_PREFIX . $token,
            $email,
            $expiresAt
        );
    }

    /**
     * Ambil email user dari cache berdasarkan token.
     */
    public function getFromCache(string $token): ?string
    {
        return Cache::get(self::CACHE_PREFIX . $token);
    }

    /**
     * Hapus token dari cache.
     */
    public function forgetCache(string $token): void
    {
        Cache::forget(self::CACHE_PREFIX . $token);
    }

    /**
     * Kirim email link reset password ke user.
     */
    public function sendResetEmail(string $email, string $resetLink): void
    {
        Mail::to($email)->send(new ResetPasswordMail($resetLink));
    }

    /**
     * Generate link reset password untuk frontend.
     */
    public function generateResetLink(string $token, string $email): string
    {
        return config('app.frontend_url') 
            . '/auth/lupa-password/ganti-password'
            . '?id=' . $token
            . '&email=' . urlencode($email);
    }
}