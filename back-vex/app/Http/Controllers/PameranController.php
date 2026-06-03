<?php

namespace App\Http\Controllers;

use App\Models\Pameran;
use App\Models\ModelPameran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PameranController extends Controller
{
    // =============================
    // LIHAT SEMUA PAMERAN
    // =============================
    public function index()
    {
        $pameran = Pameran::with(['model3d', 'prodi'])->get();

        return response()->json([
            'status'  => 'success',
            'pameran' => $pameran,
        ]);
    }

    // =============================
    // DETAIL PAMERAN
    // =============================
    public function show($id)
    {
        $pameran = Pameran::with(['model3d', 'prodi'])->find($id);

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

    // =============================
    // TAMBAH PAMERAN
    // =============================
    public function store(Request $request)
    {
        $request->validate([
            'kategori'                => 'required|exists:prodi,kode_prodi',
            'semester'                => 'required|integer|min:1|max:8',
            'banner'                  => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'judul'                   => 'required|string|max:255',
            'deskripsi'               => 'required|string',
            'kapasitas'               => 'nullable|integer',
            'tanggal_mulai'           => 'required|date',
            'tanggal_akhir'           => 'required|date|after:tanggal_mulai',
            'tanggal_mulai_persiapan' => 'required|date',
            'tanggal_akhir_persiapan' => 'required|date|after:tanggal_mulai_persiapan',
        ]);

        // ✅ Ambil otomatis model pameran
        $modelPameran = ModelPameran::where('jenis', 'Pameran')->first();

        if (!$modelPameran) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Model pameran tidak ditemukan.',
            ], 404);
        }

        // Upload banner
        $bannerPath = $request->file('banner')->store('banner', 'public');

        $pameran = Pameran::create([
            'model_pameran'           => $modelPameran->id_model,
            'kategori'                => $request->kategori,
            'tahun'                   => now()->year,
            'semester'                => $request->semester,
            'banner'                  => $bannerPath,
            'judul'                   => $request->judul,
            'deskripsi'               => $request->deskripsi,
            'kapasitas'               => $request->kapasitas ?? 24,
            'tanggal_mulai'           => $request->tanggal_mulai,
            'tanggal_akhir'           => $request->tanggal_akhir,
            'tanggal_mulai_persiapan' => $request->tanggal_mulai_persiapan,
            'tanggal_akhir_persiapan' => $request->tanggal_akhir_persiapan,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Pameran berhasil ditambahkan.',
            'pameran' => $pameran,
        ], 201);
    }

    // =============================
    // EDIT PAMERAN
    // =============================
    public function update(Request $request, $id)
    {
        $pameran = Pameran::find($id);

        if (!$pameran) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pameran tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'kategori'                => 'sometimes|exists:prodi,kode_prodi',
            'semester'                => 'sometimes|integer|min:1|max:8',
            'banner'                  => 'sometimes|image|mimes:png,jpg,jpeg|max:2048',
            'judul'                   => 'sometimes|string|max:255',
            'deskripsi'               => 'sometimes|string',
            'kapasitas'               => 'sometimes|integer',
            'tanggal_mulai'           => 'sometimes|date',
            'tanggal_akhir'           => 'sometimes|date|after:tanggal_mulai',
            'tanggal_mulai_persiapan' => 'sometimes|date',
            'tanggal_akhir_persiapan' => 'sometimes|date|after:tanggal_mulai_persiapan',
        ]);

        // Update banner jika ada file baru
        if ($request->hasFile('banner')) {
            Storage::disk('public')->delete($pameran->banner);
            $bannerPath      = $request->file('banner')->store('banner', 'public');
            $pameran->banner = $bannerPath;
            $pameran->save();
        }

        $pameran->update($request->except('banner'));

        return response()->json([
            'status'  => 'success',
            'message' => 'Pameran berhasil diubah.',
            'pameran' => $pameran,
        ]);
    }

    // =============================
    // HAPUS PAMERAN
    // =============================
    public function destroy($id)
    {
        $pameran = Pameran::find($id);

        if (!$pameran) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Pameran tidak ditemukan.',
            ], 404);
        }

        Storage::disk('public')->delete($pameran->banner);
        $pameran->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Pameran berhasil dihapus.',
        ]);
    }
}