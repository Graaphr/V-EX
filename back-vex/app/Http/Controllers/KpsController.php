<?php

namespace App\Http\Controllers;

use App\Models\Karya;
use App\Models\Stan;
use App\Models\Pameran;
use Illuminate\Http\Request;

class KpsController extends Controller
{
    // =============================
    // LIHAT SEMUA KARYA PER PRODI
    // (KPS hanya lihat karya dari prodinya)
    // =============================
    public function daftarKarya(Request $request)
    {
        $kps = $request->user();

        // Ambil karya berdasarkan prodi KPS
        $karya = Karya::with(['stan.pameran', 'pengguna:id,nama'])
            ->withCount('suka')
            ->whereHas('stan.pameran', function ($query) use ($kps) {
                $query->where('kategori', $kps->program_studi);
            })
            ->get();

        return response()->json([
            'status' => 'success',
            'total' => $karya->count(),
            'karya' => $karya,
        ]);
    }

    // =============================
    // PILIH KARYA TERBAIK
    // =============================
    public function pilihTerbaik(Request $request, $id_karya)
    {
        $kps = $request->user();
        $karya = Karya::with('stan.pameran')->find($id_karya);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya tidak ditemukan.',
            ], 404);
        }

        // Pastikan karya dari prodi KPS
        if ($karya->stan->pameran->kategori !== $kps->program_studi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak berhak memilih karya dari prodi lain.',
            ], 403);
        }

        // Cek apakah sudah ada karya terbaik di prodi ini
        $karya_terbaik = Karya::whereHas('stan.pameran', function ($query) use ($kps) {
            $query->where('kategori', $kps->program_studi);
        })
            ->where('is_terbaik', true)
            ->first();

        if ($karya_terbaik) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sudah ada karya terbaik untuk prodi ini.',
                'karya_terbaik' => $karya_terbaik,
            ], 422);
        }

        // Set karya terbaik
        $karya->update(['is_terbaik' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Karya berhasil dipilih sebagai karya terbaik.',
            'karya' => $karya,
        ]);
    }

    // =============================
    // BATALKAN KARYA TERBAIK
    // =============================
    public function batalkanTerbaik(Request $request, $id_karya)
    {
        $kps = $request->user();
        $karya = Karya::with('stan.pameran')->find($id_karya);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya tidak ditemukan.',
            ], 404);
        }

        // Pastikan karya dari prodi KPS
        if ($karya->stan->pameran->kategori !== $kps->program_studi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak berhak membatalkan karya dari prodi lain.',
            ], 403);
        }

        // Cek apakah karya ini memang terbaik
        if (!$karya->is_terbaik) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya ini bukan karya terbaik.',
            ], 422);
        }

        // Batalkan karya terbaik
        $karya->update(['is_terbaik' => false]);

        return response()->json([
            'status' => 'success',
            'message' => 'Karya terbaik berhasil dibatalkan.',
            'karya' => $karya,
        ]);
    }

    // =============================
    // LIHAT KARYA TERBAIK PER PRODI
    // (untuk halaman utama)
    // =============================
    public function karyaTerbaik()
    {
        $karya = Karya::with(['stan.pameran.prodi', 'pengguna:id,nama'])
            ->withCount('suka')
            ->where('is_terbaik', true)
            ->get();

        return response()->json([
            'status' => 'success',
            'total' => $karya->count(),
            'karya' => $karya,
        ]);
    }
}