<?php

namespace App\Services;

use App\Mail\OtpMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class OtpService
{
    const CACHE_PREFIX       = 'temp_user_';
    const OTP_EXPIRY_MINUTES = 10;

    /**
     * Generate angka OTP 6 digit secara acak.
     */
    public function generateOtp(): int
    {
        return rand(100000, 999999);
    }

    /**
     * Hitung waktu kedaluwarsa OTP.
     */
    public function getExpiresAt(): Carbon
    {
        return Carbon::now()->addMinutes(self::OTP_EXPIRY_MINUTES);
    }

    /**
     * Simpan data user sementara ke cache.
     */
    public function storeToCache(string $token, array $userData, Carbon $expiresAt): void
    {
        Cache::put(
            self::CACHE_PREFIX . $token,
            $userData,
            $expiresAt
        );
    }

    /**
     * Ambil data user sementara dari cache.
     */
    public function getFromCache(string $token): ?array
    {
        return Cache::get(self::CACHE_PREFIX . $token);
    }

    /**
     * Hapus data user sementara dari cache.
     */
    public function forgetCache(string $token): void
    {
        Cache::forget(self::CACHE_PREFIX . $token);
    }

    /**
     * Kirim email OTP ke user.
     */
    public function sendOtpEmail(string $email, int $otpCode): void
    {
        Mail::to($email)->send(new OtpMail($otpCode));
    }
}