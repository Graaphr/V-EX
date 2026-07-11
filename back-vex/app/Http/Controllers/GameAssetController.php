<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Karya;
use App\Models\Pameran;

class GameAssetController extends Controller
{
    // =============================
    // HELPER: Resolve pameran dari slug ATAU id
    // =============================
    private function resolvePameran(string $identifier): ?Pameran
    {
        return Pameran::with('model3d')
            ->where('slug', $identifier)
            ->orWhere('id_pameran', $identifier)
            ->first();
    }

    // ==============
    // GET AUDIO PATH
    // ==============
    public function index()
    {
        return response()->json([
            'bgm' => asset('storage/audio/bgm.mp3', true),
            'footstep' => asset('storage/audio/footstep.mp3', true),
            'jump' => asset('storage/audio/jump.mp3', true),
        ]);
    }

    // ====================
    // SERVE BOOTH GLB FILE
    // ====================
    public function serveBoothModel($filename)
    {
        $safeFilename = basename($filename); // proteksi path traversal
        $path = storage_path('app/public/models/' . $safeFilename);

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
    public function serveHallModel($identifier)
    {
        $pameran = $this->resolvePameran($identifier);

        if (!$pameran) {
            return response()->json(['error' => 'Pameran tidak ditemukan'], 404);
        }

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
    public function get3DModel($identifier)
    {
        $pameran = $this->resolvePameran($identifier);

        if (!$pameran) {
            return response()->json(['error' => 'Pameran tidak ditemukan'], 404);
        }

        if (!$pameran->model3d) {
            return response()->json(['error' => 'Model tidak ditemukan'], 404);
        }

        return response()->json([
            // pakai identifier yang sama persis yang dikirim client (slug atau id),
            // supaya endpoint hall-model juga bisa resolve dengan cara yang sama
            'model_hall' => "https://vex.terpalb25.web.id/api/experience/hall-model/{$identifier}",
        ]);
    }

    // ==========================
    // AMBIL KARYA DI TABEL KARYA
    // ==========================
    public function karyaByPameran($identifier)
    {
        $pameran = $this->resolvePameran($identifier);

        if (!$pameran) {
            return response()->json(['error' => 'Pameran tidak ditemukan'], 404);
        }

        $idPameran = $pameran->id_pameran; // selalu pakai id numerik untuk query relasi

        $karyas = DB::table('karya')
            ->leftJoin('stan', 'karya.id_stan', '=', 'stan.id_stan')
            ->leftJoin('model', 'stan.model_stan', '=', 'model.id_model')
            ->leftJoin('pengguna', 'karya.id_pengguna', '=', 'pengguna.id')
            ->leftJoin('kelas', 'pengguna.kelas', '=', 'kelas.id_kelas')
            ->where('karya.id_pameran', $idPameran)
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
                DB::raw('model.`3d_model` as booth_model'),
                'kelas.nama_kelas as zona'
            )
            ->orderBy('karya.id_karya')
            ->get();

        $karyaIds = $karyas->pluck('id_karya');

        $sukaCount = DB::table('suka')
            ->whereIn('id_karya', $karyaIds)
            ->select('id_karya', DB::raw('count(*) as total'))
            ->groupBy('id_karya')
            ->pluck('total', 'id_karya');

        $maxSuka = $sukaCount->max();
        $idTerbanyak = $maxSuka > 0 ? $sukaCount->search($maxSuka) : null;

        $komentarSemua = DB::table('komentar')
            ->leftJoin('pengguna', 'komentar.id_pengguna', '=', 'pengguna.id')
            ->whereIn('komentar.id_karya', $karyaIds)
            ->select('komentar.id_karya', 'pengguna.nama', 'komentar.isi_komentar')
            ->get()
            ->groupBy('id_karya');

        $result = $karyas->map(function ($karya) use ($idTerbanyak, $sukaCount, $komentarSemua) {
            $totalSuka = $sukaCount->get($karya->id_karya, 0);

            $komentar = ($komentarSemua->get($karya->id_karya) ?? collect())
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
                'poster' => $karya->gambar_poster ? '/storage/' . $karya->gambar_poster : null,
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
        if (!$url) return null;

        $videoId = null;
        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        if (isset($query['v'])) {
            $videoId = $query['v'];
        }

        if (!$videoId && preg_match('/youtu\.be\/([^\?&]+)/', $url, $matches)) {
            $videoId = $matches[1];
        }

        if (!$videoId && preg_match('/youtube\.com\/shorts\/([^\?&]+)/', $url, $matches)) {
            $videoId = $matches[1];
        }

        if (!$videoId) return null;

        return "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg";
    }
}