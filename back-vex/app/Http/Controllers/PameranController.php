<?php

namespace App\Http\Controllers;

use App\Models\Pameran;
use App\Models\ModelPameran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class PameranController extends Controller
{
    private const STORAGE_BASE_URL = 'https://vex.terpalb25.web.id/storage/';

    // =============================
    // HELPER: URL banner (dengan fallback ke original)
    // =============================
    private function buildBannerUrls(Pameran $item): array
    {
        $base = self::STORAGE_BASE_URL;

        return [
            'bannerImage' => $base . $item->banner,
            'bannerLarge' => $item->banner_large ? $base . $item->banner_large : $base . $item->banner,
            'bannerMedium' => $item->banner_medium ? $base . $item->banner_medium : $base . $item->banner,
            'bannerSmall' => $item->banner_small ? $base . $item->banner_small : $base . $item->banner,
        ];
    }

    // =============================
    // HELPER: Generate 3 ukuran (75%, 50%, 25%) dari file banner
    // =============================
    private function generateBannerSizes($file, string $folder): array
    {
        $manager = ImageManager::usingDriver(Driver::class);
        $ext = $file->getClientOriginalExtension();

        $sizes = [
            'banner_large' => 0.75,
            'banner_medium' => 0.50,
            'banner_small' => 0.25,
        ];

        $resizedPaths = [];

        foreach ($sizes as $column => $ratio) {
            $image = $manager->decodeSplFileInfo($file);

            $targetWidth = (int) round($image->width() * $ratio);
            $image->scale(width: $targetWidth);

            $filename = "{$folder}/{$column}.{$ext}";
            $fullPath = Storage::disk('public')->path($filename);

            $image->save($fullPath);

            $resizedPaths[$column] = $filename;
        }

        return $resizedPaths;
    }

    // =============================
    // LIHAT SEMUA PAMERAN
    // =============================
    public function index()
    {
        $pameran = Pameran::with('prodi')
            ->withCount(['karya', 'suka'])
            ->get();

        $transformed = $pameran->map(fn($item) => [
            'id' => $item->id_pameran,
            'slug' => $item->slug,
            'title' => $item->judul,
            'subtitle' => $item->prodi?->nama_prodi ?? $item->kategori,
            'category' => $item->prodi?->nama_prodi ?? $item->kategori,
            'kode_prodi' => $item->kategori,
            'date' => $item->tanggal_mulai,
            ...$this->buildBannerUrls($item),
            'likes' => $item->suka_count,
            'karya' => $item->karya_count,
            'description' => [
                [
                    'title' => 'Deskripsi',
                    'content' => $item->deskripsi,
                ],
            ],
            'stats' => [
                'likes' => $item->suka_count,
                'karya' => $item->karya_count,
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
// DETAIL PAMERAN (bisa lewat slug ATAU id)
// =============================
    public function show($identifier)
    {
        $pameran = Pameran::with(['model3d', 'prodi'])
            ->withCount(['karya', 'suka'])
            ->where('slug', $identifier)
            ->orWhere('id_pameran', $identifier)
            ->first();

        if (!$pameran) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pameran tidak ditemukan'
            ], 404);
        }

        $transformed = [
            'id' => $pameran->id_pameran,
            'slug' => $pameran->slug,
            'title' => $pameran->judul,
            'subtitle' => $pameran->prodi?->nama_prodi ?? $pameran->kategori,
            'kode_prodi' => $pameran->kategori,
            'category' => $pameran->prodi?->nama_prodi ?? $pameran->kategori,
            'date' => $pameran->tanggal_mulai,
            ...$this->buildBannerUrls($pameran),
            'likes' => $pameran->suka_count,
            'karya' => $pameran->karya_count,
            'description' => [
                [
                    'title' => 'Deskripsi',
                    'content' => $pameran->deskripsi,
                ],
            ],
            'stats' => [
                'likes' => $pameran->suka_count,
                'karya' => $pameran->karya_count,
                'kapasitas' => $pameran->kapasitas,
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
            'banner' => 'required|image|mimes:png,jpg,jpeg|max:5000',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'nullable|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'prepare_start' => 'required|date',
            'prepare_end' => 'required|date|after:prepare_start',
        ]);

        $modelPameran = ModelPameran::where('jenis', 'Pameran')->first();

        if (!$modelPameran) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model pameran tidak ditemukan.',
            ], 404);
        }

        $bannerPath = $request->file('banner')->store('banner', 'public');

        $pameran = Pameran::create([
            'model_pameran' => $modelPameran->id_model,
            'kategori' => $request->category,
            'banner' => $bannerPath,
            'judul' => $request->title,
            'deskripsi' => $request->description,
            'kapasitas' => $request->capacity ?? 24,
            'tanggal_mulai' => $request->start_date,
            'tanggal_akhir' => $request->end_date,
            'tanggal_mulai_persiapan' => $request->prepare_start,
            'tanggal_akhir_persiapan' => $request->prepare_end,
        ]);

        $folder = "pameran/{$pameran->id_pameran}";
        Storage::disk('public')->makeDirectory($folder);

        $resizedPaths = $this->generateBannerSizes($request->file('banner'), $folder);
        $pameran->update($resizedPaths);

        return response()->json([
            'status' => 'success',
            'message' => 'Pameran berhasil ditambahkan.',
            'pameran' => $pameran->fresh(),
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
            'banner' => 'sometimes|image|mimes:png,jpg,jpeg|max:5000',
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'kapasitas' => 'sometimes|integer',
            'tanggal_mulai' => 'sometimes|date',
            'tanggal_akhir' => 'sometimes|date',
            'tanggal_mulai_persiapan' => 'sometimes|date',
            'tanggal_akhir_persiapan' => 'sometimes|date',
        ]);

        if ($request->hasFile('banner')) {
            // Hapus banner lama (original + 3 ukuran) sebelum simpan yang baru
            Storage::disk('public')->delete($pameran->banner);
            if ($pameran->banner_large)
                Storage::disk('public')->delete($pameran->banner_large);
            if ($pameran->banner_medium)
                Storage::disk('public')->delete($pameran->banner_medium);
            if ($pameran->banner_small)
                Storage::disk('public')->delete($pameran->banner_small);

            $pameran->banner = $request->file('banner')->store('banner', 'public');

            $folder = "pameran/{$pameran->id_pameran}";
            Storage::disk('public')->makeDirectory($folder);

            $resizedPaths = $this->generateBannerSizes($request->file('banner'), $folder);
            $pameran->banner_large = $resizedPaths['banner_large'];
            $pameran->banner_medium = $resizedPaths['banner_medium'];
            $pameran->banner_small = $resizedPaths['banner_small'];
        }

        if ($request->filled('judul'))
            $pameran->judul = $request->judul;
        if ($request->filled('deskripsi'))
            $pameran->deskripsi = $request->deskripsi;
        if ($request->filled('kategori'))
            $pameran->kategori = $request->kategori;
        if ($request->filled('kapasitas'))
            $pameran->kapasitas = $request->kapasitas;
        if ($request->filled('tanggal_mulai'))
            $pameran->tanggal_mulai = $request->tanggal_mulai;
        if ($request->filled('tanggal_akhir'))
            $pameran->tanggal_akhir = $request->tanggal_akhir;
        if ($request->filled('tanggal_mulai_persiapan'))
            $pameran->tanggal_mulai_persiapan = $request->tanggal_mulai_persiapan;
        if ($request->filled('tanggal_akhir_persiapan'))
            $pameran->tanggal_akhir_persiapan = $request->tanggal_akhir_persiapan;

        $pameran->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Pameran berhasil diubah.',
            'pameran' => $pameran,
        ]);
    }
}