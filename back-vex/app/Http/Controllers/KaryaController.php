<?php

namespace App\Http\Controllers;

use App\Models\Karya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KaryaController extends Controller
{
    // =============================
    // DAFTAR KARYA MILIK KETUA PBL
    // =============================
    public function index(Request $request)
    {
        $user = $request->user();

        $karya = Karya::where('id_pengguna', $user->id)
            ->with(['stan', 'pameran'])
            ->get()
            ->map(fn($item) => [
                'id' => $item->id_karya,
                'title' => $item->judul,
                'category' => $item->pameran?->kategori ?? '',
                'image' => $item->gambar_poster
                    ? asset("http://localhost:8000/storage/{$item->gambar_poster}")
                    : '',
                'thumbnail' => $item->gambar_sampul
                    ? asset("http://localhost:8000/storage/{$item->gambar_sampul}")
                    : '',
                'link' => $item->tautan,
                'description' => $item->deskripsi,
                'booth' => $item->id_stan ? (string) $item->id_stan : '',
                'pameranId' => $item->id_pameran,
                'pameranTitle' => $item->pameran?->judul ?? '',
                'year' => $item->pameran?->tanggal_mulai
                    ? date('Y', strtotime($item->pameran->tanggal_mulai))
                    : '',
                'semester' => '',
                'isTerbaik' => $item->is_terbaik,   // expose ke frontend
            ]);

        return response()->json([
            'status' => 'success',
            'karya' => $karya,
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
            'id_stan' => 'required|exists:stan,id_stan',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tautan' => 'required|url',
            'gambar_poster' => 'required|image|mimes:png,jpg,jpeg|max:5000',
            'gambar_sampul' => 'required|image|mimes:png,jpg,jpeg|max:5000',
        ]);

        $idPameran = $request->id_pameran;

        // =============================
        // CEK APAKAH USER SUDAH PUNYA KARYA
        // DI PAMERAN INI
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

        $karya = Karya::create([
            'id_pengguna' => $user->id,
            'id_pameran' => $idPameran,
            'id_stan' => $request->id_stan,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tautan' => $request->tautan,
            'gambar_poster' => '/',
            'gambar_sampul' => '/',
            'lantai' => 1,
        ]);

        // =============================
        // BUAT FOLDER
        // =============================
        $idKarya = $karya->id_karya;

        Storage::disk('public')
            ->makeDirectory("pameran/{$idPameran}/{$idKarya}/poster");

        Storage::disk('public')
            ->makeDirectory("pameran/{$idPameran}/{$idKarya}/sampul");

        // =============================
        // UPLOAD FILE
        // =============================
        $posterPath = $request->file('gambar_poster')
            ->store("pameran/{$idPameran}/{$idKarya}/poster", 'public');

        $sampulPath = $request->file('gambar_sampul')
            ->store("pameran/{$idPameran}/{$idKarya}/sampul", 'public');

        // =============================
        // UPDATE KARYA
        // =============================
        $karya->update([
            'gambar_poster' => $posterPath,
            'gambar_sampul' => $sampulPath,
        ]);


        return response()->json([
            'status' => 'success',
            'message' => 'Karya PBL berhasil ditambahkan.',
            'karya' => $karya,
        ], 201);
    }

    // =============================
    // EDIT KARYA PBL
    // =============================
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $karya = Karya::find($id);

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

        $request->validate([
            'id_pameran' => 'sometimes|exists:pameran,id_pameran',
            'id_stan' => 'sometimes|exists:stan,id_stan',
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'tautan' => 'sometimes|url',
            'gambar_poster' => 'sometimes|image|mimes:png,jpg,jpeg|max:5000',
            'gambar_sampul' => 'sometimes|image|mimes:png,jpg,jpeg|max:5000',
        ]);

        // Gunakan id_pameran baru jika ada, fallback ke yang lama
        // agar path penyimpanan gambar tetap konsisten dengan store()
        $idPameran = $request->filled('id_pameran')
            ? $request->id_pameran
            : $karya->id_pameran;

        if ($request->hasFile('gambar_poster')) {
            // Hapus file lama
            if ($karya->gambar_poster) {
                Storage::disk('public')->delete($karya->gambar_poster);
            }
            // Simpan ke path yang sama dengan store()
            Storage::disk('public')->makeDirectory("karya/{$idPameran}/poster");
            $karya->gambar_poster = $request->file('gambar_poster')
                ->store("karya/{$idPameran}/poster", 'public');
        }

        if ($request->hasFile('gambar_sampul')) {
            if ($karya->gambar_sampul) {
                Storage::disk('public')->delete($karya->gambar_sampul);
            }
            Storage::disk('public')->makeDirectory("karya/{$idPameran}/sampul");
            $karya->gambar_sampul = $request->file('gambar_sampul')
                ->store("karya/{$idPameran}/sampul", 'public');
        }

        if ($request->filled('id_pameran'))
            $karya->id_pameran = $request->id_pameran;
        if ($request->filled('id_stan'))
            $karya->id_stan = $request->id_stan;
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
            'karya' => $karya,
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

        $pameran = \App\Models\Pameran::with('prodi')
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
        $stan = \App\Models\Stan::where('id_pameran', $id_pameran)
            ->with('model3d')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id_stan,
                'model_stan' => $item->model3d?->nama_model ?? $item->model_stan,
            ]);

        return response()->json([
            'status' => 'success',
            'stan' => $stan,
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

        if ($karya->gambar_poster) {
            Storage::disk('public')->delete($karya->gambar_poster);
        }
        if ($karya->gambar_sampul) {
            Storage::disk('public')->delete($karya->gambar_sampul);
        }

        $karya->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karya PBL berhasil dihapus.',
        ]);
    }
}