<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PenggunaController extends Controller
{

// construktor
    protected OtpService $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function register(Request $request)
    {

    // validasi inputan user
        $request->validate([
            'nama'     => 'required|string|max:255',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

    // cek email 
        if (Pengguna::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email sudah terdaftar',
            ], 409);
        }

    // buat token dan simpan data sementara di local
        try {
            $token     = Str::uuid();
            $otpCode   = $this->otpService->generateOtp();
            $expiresAt = $this->otpService->getExpiresAt();

            $userData = [
                'nama'           => $request->nama,
                'email'          => $request->email,
                'role'           => 'Pengunjung',
                'password'       => Hash::make($request->password),
                'otp_code'       => $otpCode,
                'otp_expires_at' => $expiresAt->timestamp * 1000,
            ];
    
    // kirim otp ke email
            $this->otpService->storeToCache($token, $userData, $expiresAt);
            $this->otpService->sendOtpEmail($request->email, $otpCode);

            return response()->json([
                'status'         => 'success',
                'message'        => 'Silakan cek email OTP Anda.',
                'token'          => $token,
                'otp_expires_at' => $expiresAt->timestamp * 1000,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {
    // validasi inputan
        $request->validate([
            'token' => 'required',
            'otp'   => 'required|digits:6',
        ]);

        // cek token cache user
        $tempUser = $this->otpService->getFromCache($request->token);

        if (!$tempUser) {
            return response()->json([
                'status'  => 'error',
                'message' => 'OTP expired atau tidak ditemukan'
            ], 408);
        }

        // buat data user ke db
        Pengguna::create([
            'nama'     => $tempUser['nama'],
            'email'    => $tempUser['email'],
            'password' => $tempUser['password'],
            'role'     => $tempUser['role'],
        ]);

        $this->otpService->forgetCache($request->token);

        return response()->json([
            'status'  => 'success',
            'message' => 'Akun berhasil diverifikasi!',
        ]);
    }

    public function resendOtp(Request $request)
    {
        // ambil token
        $token    = $request->token;
        $tempUser = $this->otpService->getFromCache($token);

        // buat kode otp baru
        $otpCode   = $this->otpService->generateOtp();
        $expiresAt = $this->otpService->getExpiresAt();

        $tempUser['otp_code'] = $otpCode;

        // simpan data di local dan kirim ulang email
        $this->otpService->storeToCache($token, $tempUser, $expiresAt);
        $this->otpService->sendOtpEmail($tempUser['email'], $otpCode);

        return response()->json([
            'status'         => 'success',
            'message'        => 'Silakan cek email OTP Anda.',
            'otp_expires_at' => $expiresAt->timestamp * 1000,
        ]);
    }

    public function login(Request $request)
    {
        // validasi inputan user
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = Pengguna::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Email atau password salah.'
            ], 401);
        }

        if (in_array($user->role, [Pengguna::ROLE_KPS, Pengguna::ROLE_KETUA_PBL])) {
            if (!$user->isAktif()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Akun Anda telah dinonaktifkan. Hubungi Admin.',
                ], 403);
            }
        }

        $user->tokens()->delete();

        // cek role 
        $abilities = match($user->role) {
            Pengguna::ROLE_ADMIN     => ['admin'],
            Pengguna::ROLE_KPS       => ['kps'],
            Pengguna::ROLE_KETUA_PBL => ['ketua-pbl'],
            default                  => ['pengunjung'],
        };

        $token = $user->createToken('token', $abilities)->plainTextToken;

        // mengarahkan ke dashboard sesuai role
        $redirectTo = match($user->role) {
            Pengguna::ROLE_ADMIN     => '/admin/pengguna',
            Pengguna::ROLE_KPS       => '/',
            Pengguna::ROLE_KETUA_PBL => '/ketua-pbl/karya',
            default                  => '/',
        };

        return response()->json([
            'status'      => 'success',
            'role'        => $user->role,
            'redirect_to' => $redirectTo,
            'token'       => $token,
            'user'        => [
                'id'            => $user->id,
                'nama'          => $user->nama,
                'email'         => $user->email,
                'role'          => $user->role,
                'kelas'         => $user->kelas,
                'program_studi' => $user->program_studi,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logout berhasil'
        ]);
    }
}