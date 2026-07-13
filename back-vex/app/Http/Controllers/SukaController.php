<?php

namespace App\Http\Controllers;

use App\Models\Karya;
use App\Models\Suka;
use Illuminate\Http\Request;

class SukaController extends Controller
{
    // =============================
    // TOGGLE LIKE
    // =============================
    public function toggle(Request $request, $id_karya)
    {
        $karya = Karya::find($id_karya);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya tidak ditemukan.',
            ], 404);
        }

        $user = $request->user();

        // Cek apakah sudah like
        $suka = Suka::where('id_pengguna', $user->id)
            ->where('id_karya', $id_karya)
            ->first();

        if ($suka) {
            // Sudah like → unlike
            $suka->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Like berhasil dihapus.',
                'liked' => false,
                'total_suka' => Suka::where('id_karya', $id_karya)->count(),
            ]);
        }

        // Belum like → like
        Suka::create([
            'id_pengguna' => $user->id,
            'id_karya' => $id_karya,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Like berhasil ditambahkan.',
            'liked' => true,
            'total_suka' => Suka::where('id_karya', $id_karya)->count(),
        ]);
    }

    // =============================
    // CEK STATUS LIKE USER
    // =============================
    public function status(Request $request, $id_karya)
    {
        $user = $request->user();

        $liked = Suka::where('id_pengguna', $user->id)
            ->where('id_karya', $id_karya)
            ->exists();

        $totalSuka = Suka::where('id_karya', $id_karya)->count();

        return response()->json([
            'status' => 'success',
            'liked' => $liked,
            'total_suka' => $totalSuka,
        ]);
    }
}