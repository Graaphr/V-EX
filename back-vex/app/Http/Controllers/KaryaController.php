<?php

namespace App\Http\Controllers;

use App\Models\Karya;
use App\Models\Pameran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ModelPameran;
use App\Models\Stan;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Services\Steganography;

class KaryaController extends Controller
{
    private const STORAGE_BASE_URL = 'http://localhost:8000/storage/';

    // =============================
    // HELPER: Cek status edit karya berdasarkan tanggal pameran
    // =============================
    private function getPameranEditStatus(?Pameran $pameran): array
    {
        if (!$pameran || !$pameran->tanggal_mulai) {
            return ['can_edit' => true, 'message' => null];
        }

        $now = Carbon::now();
        $tanggalMulai = Carbon::parse($pameran->tanggal_mulai)->startOfDay();

        if ($now->lessThan($tanggalMulai)) {
            return ['can_edit' => true, 'message' => null];
        }

        $tanggalAkhir = $pameran->tanggal_akhir
            ? Carbon::parse($pameran->tanggal_akhir)->endOfDay()
            : null;

        $message = ($tanggalAkhir && $now->greaterThan($tanggalAkhir))
            ? 'Karya tidak dapat diedit karena pameran sudah selesai.'
            : 'Karya tidak dapat diedit karena pameran sedang berlangsung.';

        return ['can_edit' => false, 'message' => $message];
    }

    private function resolveSizePath(?string $originalPath, string $size): ?string
    {
        if (!$originalPath) {
            return null;
        }

        if ($size === 'original') {
            return $originalPath;
        }

        // Ganti segmen folder "/original/" jadi "/{size}/"
        return preg_replace('#/original/#', "/{$size}/", $originalPath, 1);
    }
    // =============================
    // HELPER: Generate original + 3 ukuran (75%, 50%, 25%), semua di-watermark LSB
    // Output SELALU .png (wajib, agar watermark tidak rusak oleh kompresi JPEG)
    // Return: ['original' => path, 'large' => path, 'medium' => path, 'small' => path]
    // =============================
    private function generateWatermarkedVersions($file, string $folder, string $watermarkMessage): array
    {
        $manager = ImageManager::usingDriver(Driver::class);
        $steganography = new Steganography();

        $sizes = [
            'original' => 1.0,
            'large' => 0.75,
            'medium' => 0.50,
            'small' => 0.25,
        ];

        // nama file tetap sama di semua ukuran, cuma folder ukurannya beda
        $filename = uniqid() . '.png';

        $paths = [];

        foreach ($sizes as $label => $ratio) {
            $sizeFolder = "{$folder}/{$label}";
            Storage::disk('public')->makeDirectory($sizeFolder);

            $image = $manager->decodeSplFileInfo($file);

            if ($ratio < 1.0) {
                $targetWidth = (int) round($image->width() * $ratio);
                $image->scale(width: $targetWidth);
            }

            $relativePath = "{$sizeFolder}/{$filename}";
            $fullPath = Storage::disk('public')->path($relativePath);

            $image->save($fullPath);
            $steganography->embed($fullPath, $fullPath, $watermarkMessage);

            $paths[$label] = $relativePath;
        }

        return $paths; // ambil $paths['original'] buat disimpan ke DB
    }

    // =============================
    // HELPER: Hapus semua versi file (original + large/medium/small)
    // =============================
    private function deleteAllVersions(?string $originalPath): void
    {
        if (!$originalPath) {
            return;
        }

        foreach (['original', 'large', 'medium', 'small'] as $size) {
            $path = $this->resolveSizePath($originalPath, $size);
            Storage::disk('public')->delete($path);
        }
    }

    // =============================
    // HELPER: Bangun URL image/thumbnail dengan fallback ke original
    // =============================
    private function buildKaryaImageUrls($item): array
    {
        $base = self::STORAGE_BASE_URL;

        $poster = $item->gambar_poster;
        $sampul = $item->gambar_sampul;

        return [
            'image' => $poster ? asset($base . $poster) : '',
            'imageLarge' => $poster ? asset($base . $this->resolveSizePath($poster, 'large')) : '',
            'imageSmall' => $poster ? asset($base . $this->resolveSizePath($poster, 'small')) : '',
            'thumbnail' => $sampul ? asset($base . $sampul) : '',
            'thumbnailMedium' => $sampul ? asset($base . $this->resolveSizePath($sampul, 'medium')) : '',
        ];
    }

    // =============================
    // DAFTAR KARYA MILIK KETUA PBL
    // =============================
    public function index(Request $request)
    {
        $user = $request->user();

        $karya = Karya::where('id_pengguna', $user->id)
            ->with(['stan', 'pameran'])
            ->get()
            ->map(function ($item) {
                $editStatus = $this->getPameranEditStatus($item->pameran);

                return [
                    'id' => $item->id_karya,
                    'title' => $item->judul,
                    'category' => $item->pameran?->kategori ?? '',
                    ...$this->buildKaryaImageUrls($item),
                    'link' => $item->tautan,
                    'description' => $item->deskripsi,
                    'booth' => $item->id_stan ? (string) $item->id_stan : '',
                    'pameranId' => $item->id_pameran,
                    'pameranTitle' => $item->pameran?->judul ?? '',
                    'year' => $item->pameran?->tanggal_mulai
                        ? date('Y', strtotime($item->pameran->tanggal_mulai))
                        : '',
                    'semester' => '',
                    'isTerbaik' => $item->is_terbaik,
                    'canEdit' => $editStatus['can_edit'],
                    'editMessage' => $editStatus['message'],
                ];
            });

        return response()->json([
            'status' => 'success',
            'karya' => $karya,
        ]);
    }

    // =============================
    // AMBIL MODEL STAN (jenis = 'stan')
    // =============================
    public function getModelStan()
    {
        $models = ModelPameran::where('jenis', 'stan')->get(['id_model', 'nama_model', '3d_model']);

        return response()->json([
            'status' => 'success',
            'data' => $models,
        ]);
    }

    // =============================
    // TAMBAH KARYA
    // =============================
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'id_pameran' => 'required|exists:pameran,id_pameran',
            'id_model' => 'required|exists:model,id_model',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tautan' => 'required|url',
            'gambar_poster' => 'required|image|mimes:png,jpg,jpeg|max:5000',
            'gambar_sampul' => 'required|image|mimes:png,jpg,jpeg|max:5000',
        ]);

        $idPameran = $request->id_pameran;

        // =============================
        // CEK APAKAH USER SUDAH PUNYA KARYA DI PAMERAN INI
        // =============================
        $existingKarya = Karya::where('id_pengguna', $user->id)
            ->where('id_pameran', $idPameran)
            ->first();

        if ($existingKarya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah mengunggah karya pada pameran ini.',
                'karya_id' => $existingKarya->id_karya,
            ], 409);
        }

        // =============================
        // BUAT ENTRY STAN + KARYA BARU
        // =============================
        $karya = null;
        DB::transaction(function () use ($request, $user, $idPameran, &$karya) {
            $stan = Stan::create([
                'id_pameran' => $idPameran,
                'model_stan' => $request->id_model,
            ]);

            $karya = Karya::create([
                'id_pengguna' => $user->id,
                'id_pameran' => $idPameran,
                'id_stan' => $stan->id_stan,
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'tautan' => $request->tautan,
                'gambar_poster' => '/',
                'gambar_sampul' => '/',
                'lantai' => 1,
            ]);
        });

        $idKarya = $karya->id_karya;

        // =============================
        // GENERATE + WATERMARK (original + 3 ukuran) UNTUK POSTER & SAMPUL
        // =============================
        $posterFolder = "pameran/{$idPameran}/{$idKarya}/poster";
        $sampulFolder = "pameran/{$idPameran}/{$idKarya}/sampul";

        $steganography = new Steganography();

        $namaAuthor = $steganography->getUsernameById($user->id) ?? 'unknown';

        $watermarkPoster = "nama: $namaAuthor, judul: {$request->judul}, " . now()->format('Y-m-d H:i:s');
        $watermarkSampul = "nama: $namaAuthor, judul: {$request->judul}, " . now()->format('Y-m-d H:i:s');

        $posterPaths = $this->generateWatermarkedVersions($request->file('gambar_poster'), $posterFolder, $watermarkPoster);
        $sampulPaths = $this->generateWatermarkedVersions($request->file('gambar_sampul'), $sampulFolder, $watermarkSampul);

        $karya->update([
            'gambar_poster' => $posterPaths['original'],
            'gambar_sampul' => $sampulPaths['original'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Karya PBL berhasil ditambahkan.',
            'karya' => $karya->fresh(),
        ], 201);
    }

    // =============================
// EDIT KARYA PBL
// =============================
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $karya = Karya::with('pameran')->find($id);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya PBL tidak ditemukan.',
            ], 404);
        }

        if ($karya->id_pengguna !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda hanya dapat mengedit karya milik Anda sendiri.',
            ], 403);
        }

        $editStatus = $this->getPameranEditStatus($karya->pameran);

        if (!$editStatus['can_edit']) {
            return response()->json([
                'status' => 'error',
                'message' => $editStatus['message'],
            ], 403);
        }

        $request->validate([
            'id_pameran' => 'sometimes|exists:pameran,id_pameran',
            'model_stan' => 'sometimes|exists:model,id_model',
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'tautan' => 'sometimes|url',
            'gambar_poster' => 'sometimes|image|mimes:png,jpg,jpeg|max:5000',
            'gambar_sampul' => 'sometimes|image|mimes:png,jpg,jpeg|max:5000',
        ]);

        $idPameran = $request->filled('id_pameran') ? $request->id_pameran : $karya->id_pameran;
        $idKarya = $karya->id_karya;

        // =============================
        // RESOLVE id_stan DARI model_stan
        // =============================
        if ($request->filled('model_stan')) {
            $stan = Stan::where('id_pameran', $idPameran)
                ->where('model_stan', $request->model_stan)
                ->first();

            if (!$stan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stan dengan model tersebut tidak tersedia untuk pameran ini.',
                ], 404);
            }

            $karya->id_stan = $stan->id_stan;
        }

        if ($request->hasFile('gambar_poster')) {
            $posterFolder = "pameran/{$idPameran}/{$idKarya}/poster";

            $this->deleteAllVersions($karya->gambar_poster);

            $watermarkPoster = "karya:{$idKarya}|user:{$user->id}|type:poster";
            $posterPaths = $this->generateWatermarkedVersions($request->file('gambar_poster'), $posterFolder, $watermarkPoster);

            $karya->gambar_poster = $posterPaths['original'];
        }

        if ($request->hasFile('gambar_sampul')) {
            $sampulFolder = "pameran/{$idPameran}/{$idKarya}/sampul";

            $this->deleteAllVersions($karya->gambar_sampul);

            $watermarkSampul = "karya:{$idKarya}|user:{$user->id}|type:sampul";
            $sampulPaths = $this->generateWatermarkedVersions($request->file('gambar_sampul'), $sampulFolder, $watermarkSampul);

            $karya->gambar_sampul = $sampulPaths['original'];
        }

        if ($request->filled('id_pameran'))
            $karya->id_pameran = $request->id_pameran;
        if ($request->filled('judul'))
            $karya->judul = $request->judul;
        if ($request->filled('deskripsi'))
            $karya->deskripsi = $request->deskripsi;
        if ($request->filled('tautan'))
            $karya->tautan = $request->tautan;

        $karya->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Karya PBL berhasil diperbarui.',
            'karya' => $karya->fresh(),
        ]);
    }

    // =============================
    // VERIFIKASI WATERMARK (bukti kepemilikan)
    // =============================
    public function verifyWatermark(Request $request, $id)
    {
        $karya = Karya::find($id);

        if (!$karya || !$karya->gambar_poster) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya atau gambar tidak ditemukan.',
            ], 404);
        }

        $steganography = new Steganography();
        $fullPath = Storage::disk('public')->path($karya->gambar_poster);
        $extracted = $steganography->extract($fullPath);

        return response()->json([
            'status' => 'success',
            'watermark' => $extracted,
            'valid' => $extracted !== null,
        ]);
    }

    // =============================
    // PAMERAN TERSEDIA UNTUK KARYA
    // =============================
    public function pameranTersedia(Request $request)
    {
        $user = $request->user();
        $prodi = $user->prodi?->kode_prodi ?? null;

        if (!$prodi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Prodi ketua PBL tidak ditemukan.',
            ], 404);
        }

        $today = now()->toDateString();

        $pameran = Pameran::with('prodi')
            ->where('kategori', $prodi)
            ->where('tanggal_mulai_persiapan', '<=', $today)
            ->where('tanggal_akhir_persiapan', '>=', $today)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id_pameran,
                'title' => $item->judul,
            ]);

        return response()->json([
            'status' => 'success',
            'pameran' => $pameran,
        ]);
    }

    // =============================
    // STAN TERSEDIA BERDASARKAN PAMERAN
    // =============================
    public function stanTersedia(Request $request, $id_pameran)
    {
        $stan = Stan::where('id_pameran', $id_pameran)
            ->with('model3d')
            ->orderBy('id_stan')
            ->get()
            ->values()
            ->map(function ($item, $index) {
                return [
                    'id' => $item->id_stan,
                    'nomor' => $index + 1,
                    'model_stan' => $item->model3d?->nama_model ?? $item->model_stan,
                ];
            });

        return response()->json([
            'status' => 'success',
            'stan' => $stan,
        ]);
    }

    // =============================
    // DAFTAR SEMUA KARYA (ADMIN)
    // =============================
    public function indexAdmin(Request $request)
    {
        $karya = Karya::with(['stan', 'pameran'])
            ->get()
            ->map(function ($item) {
                $editStatus = $this->getPameranEditStatus($item->pameran);

                return [
                    'id' => $item->id_karya,
                    'title' => $item->judul,
                    'category' => $item->pameran?->kategori ?? '',
                    ...$this->buildKaryaImageUrls($item),
                    'link' => $item->tautan,
                    'description' => $item->deskripsi,
                    'booth' => $item->id_stan ? (string) $item->id_stan : '',
                    'pameranId' => $item->id_pameran,
                    'pameranTitle' => $item->pameran?->judul ?? '',
                    'year' => $item->pameran?->tanggal_mulai
                        ? date('Y', strtotime($item->pameran->tanggal_mulai))
                        : '',
                    'semester' => '',
                    'isTerbaik' => $item->is_terbaik,
                    'canEdit' => $editStatus['can_edit'],
                    'editMessage' => $editStatus['message'],
                ];
            });

        return response()->json([
            'status' => 'success',
            'karya' => $karya,
        ]);
    }

    // =============================
    // HAPUS KARYA
    // =============================
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $karya = Karya::find($id);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya PBL tidak ditemukan.',
            ], 404);
        }

        if ($user->role !== 'Admin' && $karya->id_pengguna !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Anda tidak memiliki izin untuk menghapus karya ini.',
            ], 403);
        }

        $this->deleteAllVersions($karya->gambar_poster);
        $this->deleteAllVersions($karya->gambar_sampul);

        $karya->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karya PBL berhasil dihapus.',
        ]);
    }

    // =============================
    // KARYA TERBAIK (PAMERAN AKTIF)
    // =============================
    public function karyaTerbaikAktif()
    {
        $today = now()->toDateString();

        $pameranAktifIds = Pameran::where('tanggal_mulai', '<=', $today)
            ->where('tanggal_akhir', '>=', $today)
            ->pluck('id_pameran');

        if ($pameranAktifIds->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'karya' => [],
            ]);
        }

        $karya = Karya::where('is_terbaik', true)
            ->whereIn('id_pameran', $pameranAktifIds)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id_karya,
                'title' => $item->judul,
                'banner' => $item->gambar_sampul ? asset(self::STORAGE_BASE_URL . $item->gambar_sampul) : '',
                'bannerLarge' => $item->gambar_sampul
                    ? asset(self::STORAGE_BASE_URL . $this->resolveSizePath($item->gambar_sampul, 'large'))
                    : '',
                'poster' => $item->gambar_poster ? asset(self::STORAGE_BASE_URL . $item->gambar_poster) : '',
                'posterMedium' => $item->gambar_poster
                    ? asset(self::STORAGE_BASE_URL . $this->resolveSizePath($item->gambar_poster, 'medium'))
                    : '',
            ]);

        return response()->json([
            'status' => 'success',
            'karya' => $karya,
        ]);
    }

    // =============================
    // KARYA FAVORIT (ALL PAMERAN)
    // =============================
    public function karyaFavoritAktif()
    {
        $karya = Karya::withCount('suka')
            ->orderByDesc('suka_count')
            ->take(1)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id_karya,
                'title' => $item->judul,
                'banner' => $item->gambar_sampul ? asset(self::STORAGE_BASE_URL . $item->gambar_sampul) : '',
                'bannerLarge' => $item->gambar_sampul
                    ? asset(self::STORAGE_BASE_URL . $this->resolveSizePath($item->gambar_sampul, 'large'))
                    : '',
                'poster' => $item->gambar_poster ? asset(self::STORAGE_BASE_URL . $item->gambar_poster) : '',
                'posterMedium' => $item->gambar_poster
                    ? asset(self::STORAGE_BASE_URL . $this->resolveSizePath($item->gambar_poster, 'medium'))
                    : '',
            ]);

        return response()->json([
            'status' => 'success',
            'karya' => $karya,
        ]);
    }
}