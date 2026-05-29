<?php

namespace App\Http\Controllers;

use App\Models\Pengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // =============================
    // LIHAT SEMUA KPS & KETUA PBL
    // =============================
    public function daftarPengguna()
    {
        $kps = Pengguna::where('role', Pengguna::ROLE_KPS)
            ->select('id', 'nama', 'email', 'role', 'program_studi', 'status')
            ->get();

        $ketuaPbl = Pengguna::where('role', Pengguna::ROLE_KETUA_PBL)
            ->select('id', 'nama', 'email', 'role', 'kelas', 'program_studi', 'status')
            ->get();

        return response()->json([
            'status'    => 'success',
            'kps'       => $kps,
            'ketua_pbl' => $ketuaPbl,
        ]);
    }

    // =============================
    // DETAIL PENGGUNA
    // =============================
    public function detailPengguna($id)
    {
        $user = Pengguna::find($id);

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'user'   => $user,
        ]);
    }

    // =============================
    // TAMBAH KPS / KETUA PBL
    // =============================
    public function tambahPengguna(Request $request)
    {
        $request->validate([
            'nama'          => 'required|string|max:255',
            'email'         => 'required|email|unique:pengguna,email',
            'password'      => 'required|min:8',
            'role'          => 'required|in:KPS,Ketua PBL',
            'program_studi' => 'required|exists:prodi,kode_prodi',
            'kelas'         => 'required_if:role,Ketua PBL|nullable|exists:kelas,id_kelas',
        ]);

        $user = Pengguna::create([
            'nama'          => $request->nama,
            'email'         => $request->email,
            'password'      => Hash::make($request->password),
            'role'          => $request->role,
            'program_studi' => $request->program_studi,
            'kelas'         => $request->role === Pengguna::ROLE_KETUA_PBL
                                ? $request->kelas
                                : null,
            'status'        => Pengguna::STATUS_AKTIF,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pengguna berhasil ditambahkan.',
            'user'    => $user,
        ], 201);
    }

    // =============================
    // EDIT DATA PENGGUNA
    // =============================
    public function editPengguna(Request $request, $id)
    {
        $user = Pengguna::find($id);

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'nama'          => 'sometimes|string|max:255',
            'email'         => 'sometimes|email|unique:pengguna,email,' . $id,
            'program_studi' => 'sometimes|exists:prodi,kode_prodi',
            'kelas'         => 'sometimes|nullable|exists:kelas,id_kelas',
        ]);

        // Update hanya field yang dikirim
        $user->update($request->only([
            'nama',
            'email',
            'program_studi',
            'kelas',
        ]));

        return response()->json([
            'status'  => 'success',
            'message' => 'Data pengguna berhasil diubah.',
            'user'    => $user,
        ]);
    }

    // =============================
    // AKTIFKAN AKUN
    // =============================
    public function aktifkanAkun($id)
    {
        $user = Pengguna::find($id);

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        if ($user->isAktif()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Akun sudah aktif.',
            ], 422);
        }

        $user->update(['status' => Pengguna::STATUS_AKTIF]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Akun berhasil diaktifkan.',
            'user'    => $user,
        ]);
    }

    // =============================
    // NONAKTIFKAN AKUN
    // =============================
    public function nonaktifkanAkun($id)
    {
        $user = Pengguna::find($id);

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        if (!$user->isAktif()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Akun sudah tidak aktif.',
            ], 422);
        }

        // Hapus token agar langsung logout
        $user->tokens()->delete();

        $user->update(['status' => Pengguna::STATUS_TIDAK_AKTIF]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Akun berhasil dinonaktifkan.',
            'user'    => $user,
        ]);
    }
}