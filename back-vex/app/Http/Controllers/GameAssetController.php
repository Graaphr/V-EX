<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Karya;
use App\Models\Pameran;

class GameAssetController extends Controller
{
    // ==============
    // GET AUDIO PATH
    // ==============
    public function index()
    {
        return response()->json([
            'bgm' => asset('storage/audio/bgm.mp3'),
            'footstep' => asset('storage/audio/footstep.mp3'),
            'jump' => asset('storage/audio/jump.mp3'),
        ]);
    }

    // ====================
    // SERVE BOOTH GLB FILE
    // ====================
    public function serveBoothModel($filename)
    {
        $path = storage_path('app/public/models/' . $filename);

        if (!file_exists($path)) {
            return response()->json(['error' => 'File tidak ditemukan'], 404);
        }

        return response()->file($path, [
            'Content-Type' => 'model/gltf-binary',
            'Access-Control-Allow-Origin' => 'https://vex.terpalb25.web.id',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    // ===================
    // SERVE HALL GLB FILE
    // ===================
    public function serveHallModel($modelId)
    {
        $pameran = Pameran::with('model3d')->findOrFail($modelId);

        if (!$pameran->model3d) {
            return response()->json(['error' => 'Model tidak ditemukan'], 404);
        }

        // 3d_model sudah include subfolder, misal "models/hall-utama.glb"
        $path = storage_path('app/public/' . $pameran->model3d->{'3d_model'});

        if (!file_exists($path)) {
            return response()->json(['error' => 'File tidak ditemukan'], 404);
        }

        return response()->file($path, [
            'Content-Type' => 'model/gltf-binary',
            'Access-Control-Allow-Origin' => 'https://vex.terpalb25.web.id',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    // ==============
    // AMBIL 3D MODEL
    // ==============
    public function get3DModel($modelId)
    {
        $pameran = Pameran::with('model3d')->findOrFail($modelId);

        if (!$pameran->model3d) {
            return response()->json(['error' => 'Model tidak ditemukan'], 404);
        }

        return response()->json([
            'model_hall' => "https://vex.terpalb25.web.id/api/experience/hall-model/{$modelId}",
        ]);
    }

    // ==========================
    // AMBIL KARYA DI TABEL KARYA
    // ==========================
    public function karyaByPameran($id_pameran)
    {
        $karyas = DB::table('karya')
            ->leftJoin('stan', 'karya.id_stan', '=', 'stan.id_stan')
            ->leftJoin('model', 'stan.model_stan', '=', 'model.id_model')
            ->leftJoin('pengguna', 'karya.id_pengguna', '=', 'pengguna.id')
            ->leftJoin('kelas', 'pengguna.kelas', '=', 'kelas.id_kelas')
            ->where('karya.id_pameran', $id_pameran)
            ->select(
                'karya.id_karya',
                'karya.id_stan',
                'karya.id_pengguna',
                'karya.judul',
                'karya.deskripsi',
                'karya.tautan',
                'karya.gambar_poster',
                'karya.gambar_sampul',
                'karya.lantai',
                'karya.is_terbaik',
                'model.nama_model as nama_stan',
                'model.3d_model as booth_model',
                'kelas.nama_kelas as zona'
            )
            ->orderBy('karya.id_karya')
            ->get();

        // Setelah get semua karya, hitung total suka per karya
        $sukaCount = $karyas->mapWithKeys(function ($k) {
            return [$k->id_karya => DB::table('suka')->where('id_karya', $k->id_karya)->count()];
        });

        $maxSuka = $sukaCount->max();
        $idTerbanyak = $maxSuka > 0 ? $sukaCount->search($maxSuka) : null;

        $result = $karyas->map(function ($karya) use ($idTerbanyak) {
            $totalSuka = DB::table('suka')
                ->where('id_karya', $karya->id_karya)
                ->count();



            $komentar = DB::table('komentar')
                ->leftJoin('pengguna', 'komentar.id_pengguna', '=', 'pengguna.id')
                ->where('komentar.id_karya', $karya->id_karya)
                ->select('pengguna.nama', 'komentar.isi_komentar')
                ->get()
                ->map(fn($k) => [
                    'nama' => $k->nama ?? 'Anonim',
                    'isi' => $k->isi_komentar,
                ]);

            $boothModel = $karya->booth_model;

            return [
                'id_karya' => $karya->id_karya,
                'id_stan' => $karya->nama_stan ?? ('Stan ' . $karya->id_stan),
                'kelas' => strtolower(substr($karya->zona ?? '', 0, 1)),
                'booth_name' => $karya->judul,
                'judul' => $karya->judul,
                'deskripsi' => $karya->deskripsi,
                'tautan' => $karya->tautan,
                'poster' => $karya->gambar_poster
                    ? '/storage/' . $karya->gambar_poster
                    : null,
                'sampul' => $this->getYoutubeThumbnail($karya->tautan),
                'model_path' => $boothModel
                    ? "https://vex.terpalb25.web.id/api/experience/booth-model/" . basename($boothModel)
                    : null,
                'lantai' => $karya->lantai,
                'is_terbaik' => (bool) $karya->is_terbaik,
                'is_terbanyak' => $idTerbanyak !== null && $karya->id_karya === $idTerbanyak,
                'total_suka' => $totalSuka,
                'komentar' => $komentar,
            ];
        });

        return response()->json($result);
    }

    // ========================
    // THUMBNAIL YT DARI LINK
    // ========================
    private function getYoutubeThumbnail($url)
    {
        if (!$url)
            return null;

        $videoId = null;

        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        if (isset($query['v'])) {
            $videoId = $query['v'];
        }

        if (!$videoId && preg_match('/youtu\.be\/([^\?&]+)/', $url, $matches)) {
            $videoId = $matches[1];
        }

        if (!$videoId)
            return null;

        return "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg";
    }
}