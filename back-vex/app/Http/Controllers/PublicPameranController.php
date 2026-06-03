<?php

namespace App\Http\Controllers;

use App\Models\Pameran;
use App\Models\Prodi;
use Illuminate\Http\Request;

class PublicPameranController extends Controller
{
    // =============================
    // ISI DROPDOWN FILTER
    // =============================
    public function filterOptions()
    {
        // Ambil semua prodi
        $prodi = Prodi::select('kode_prodi', 'nama_prodi')->get();

        // Ambil tahun yang tersedia di pameran
        $tahun = Pameran::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // Ambil semester yang tersedia di pameran
        $semester = Pameran::select('semester')
            ->distinct()
            ->orderBy('semester', 'asc')
            ->pluck('semester');

        return response()->json([
            'status'   => 'success',
            'prodi'    => $prodi,
            'tahun'    => $tahun,
            'semester' => $semester,
        ]);
    }

    // =============================
    // FILTER & SEARCH PAMERAN
    // =============================
    public function index(Request $request)
    {
        $query = Pameran::with('prodi');

        // Filter berdasarkan search (judul)
        if ($request->filled('search')) {
            $query->where('judul', 'like', '%' . $request->search . '%');
        }

        // Filter berdasarkan prodi
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Filter berdasarkan tahun
        if ($request->filled('tahun')) {
            $query->where('tahun', $request->tahun);
        }

        // Filter berdasarkan semester
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        $pameran = $query->get();

        return response()->json([
            'status'  => 'success',
            'total'   => $pameran->count(),
            'pameran' => $pameran,
        ]);
    }

    // =============================
    // DETAIL PAMERAN (PUBLIC)
    // =============================
    public function show($id)
    {
        $pameran = Pameran::with(['prodi', 'model3d'])->find($id);

        if (!$pameran) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pameran tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status'  => 'success',
            'pameran' => $pameran,
        ]);
    }
}