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
        $pameran = Pameran::with('prodi')->get();

        $transformed = $pameran->map(fn($item) => [
            'id' => $item->id_pameran,
            'title' => $item->judul,
            'subtitle' => $item->prodi?->nama_prodi ?? $item->kategori,
            'category' => $item->prodi?->nama_prodi ?? $item->kategori,
            'date' => $item->tanggal_mulai,
            'bannerImage' => "http://localhost:8000/storage/{$item->banner}",
            'likes' => 0,
            'karya' => 0,
            'description' => [
                [
                    'title' => 'Deskripsi',
                    'content' => $item->deskripsi,
                ],
            ],
            'stats' => [
                'likes' => 0,
                'karya' => 0,
                'prepareStartDate' => $item->tanggal_mulai_persiapan,
                'prepareEndDate' => $item->tanggal_akhir_persiapan,
                'startDate' => $item->tanggal_mulai,
                'endDate' => $item->tanggal_akhir,
                'studyLevel' => $item->prodi?->nama_prodi ?? $item->kategori,
            ],
            'institution' => 'Politeknik Negeri Batam',
        ]);

        if (!$pameran) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pameran tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'pameran' => $transformed,
        ]);
    }

    // =============================
    // DETAIL PAMERAN
    // =============================
    public function show($id)
    {
        $pameran = Pameran::with(['model3d', 'prodi'])->find($id);

        if (!$pameran) {
            return response()->json(['status' => 'error', 'message' => 'Pameran tidak ditemukan'], 404);
        }

        $transformed = [
            'id' => $pameran->id_pameran,
            'title' => $pameran->judul,
            'subtitle' => $pameran->prodi?->nama_prodi ?? $pameran->kategori,
            'category' => $pameran->prodi?->nama_prodi ?? $pameran->kategori,
            'date' => $pameran->tanggal_mulai,
            'bannerImage' => "http://localhost:8000/storage/{$pameran->banner}",
            'likes' => 0,
            'karya' => 0,
            'description' => [
                [
                    'title' => 'Deskripsi',
                    'content' => $pameran->deskripsi,
                ],
            ],
            'stats' => [
                'likes' => 0,
                'karya' => 0,
                'prepareStartDate' => $pameran->tanggal_mulai_persiapan,
                'prepareEndDate' => $pameran->tanggal_akhir_persiapan,
                'startDate' => $pameran->tanggal_mulai,
                'endDate' => $pameran->tanggal_akhir,
                'studyLevel' => $pameran->prodi?->nama_prodi ?? $pameran->kategori,
            ],
            'institution' => 'Politeknik Negeri Batam',
        ];

        return response()->json([
            'status' => 'success',
            'pameran' => $transformed,
        ]);
    }

    // =============================
    // TAMBAH PAMERAN
    // =============================
    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|exists:prodi,kode_prodi',
            // 'semester' => 'required|integer|min:1|max:8',
            'banner' => 'required|image|mimes:png,jpg,jpeg|max:2048',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'nullable|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'prepare_start' => 'required|date',
            'prepare_end' => 'required|date|after:prepare_start',
        ]);

        // ✅ Ambil otomatis model pameran
        $modelPameran = ModelPameran::where('jenis', 'Pameran')->first();

        if (!$modelPameran) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model pameran tidak ditemukan.',
            ], 404);
        }

        // Upload banner
        $bannerPath = $request
            ->file('banner')
            ->store('banner', 'public');

        $pameran = Pameran::create([
            'model_pameran' => $modelPameran->id_model,
            'kategori' => $request->category,
            // 'tahun' => now()->year,

            'banner' => $bannerPath,

            'judul' => $request->title,
            'deskripsi' => $request->description,

            'kapasitas' => $request->capacity ?? 24,

            'tanggal_mulai' => $request->start_date,
            'tanggal_akhir' => $request->end_date,

            'tanggal_mulai_persiapan' => $request->prepare_start,
            'tanggal_akhir_persiapan' => $request->prepare_end,
        ]);

        return response()->json([
            'status' => 'success',
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
                'status' => 'error',
                'message' => 'Pameran tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'kategori' => 'sometimes|exists:prodi,kode_prodi',
            'semester' => 'sometimes|integer|min:1|max:8',
            'banner' => 'sometimes|image|mimes:png,jpg,jpeg|max:2048',
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'kapasitas' => 'sometimes|integer',
            'tanggal_mulai' => 'sometimes|date',
            'tanggal_akhir' => 'sometimes|date|after:tanggal_mulai',
            'tanggal_mulai_persiapan' => 'sometimes|date',
            'tanggal_akhir_persiapan' => 'sometimes|date|after:tanggal_mulai_persiapan',
        ]);

        // Update banner jika ada file baru
        if ($request->hasFile('banner')) {
            Storage::disk('public')->delete($pameran->banner);
            $bannerPath = $request->file('banner')->store('banner', 'public');
            $pameran->banner = $bannerPath;
            $pameran->save();
        }

        $pameran->update($request->except('banner'));

        return response()->json([
            'status' => 'success',
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
                'status' => 'error',
                'message' => 'Pameran tidak ditemukan.',
            ], 404);
        }

        Storage::disk('public')->delete($pameran->banner);
        $pameran->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pameran berhasil dihapus.',
        ]);
    }
}