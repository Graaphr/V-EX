<?php

//-----------------------
// !! JANGAN DISENTUH !!
//-----------------------

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Karya;
use App\Models\Pameran;

class GameAssetController extends Controller
{
    public function index()
    {
        return response()->json([
            'bgm' => asset('storage/audio/bgm.mp3'),
            'footstep' => asset('storage/audio/footstep.mp3'),
            'jump' => asset('storage/audio/jump.mp3'),
        ]);
    }

    public function get3DModel($modelId)
    {
        $pameran = Pameran::with('model3d')->findOrFail($modelId);

        if (!$pameran->model3d) {
            return response()->json(['error' => 'Model tidak ditemukan'], 404);
        }

        return response()->json([
            'model_hall' => '/storage/' . $pameran->model3d->{'3d_model'},
        ]);
    }

    public function karyaByPameran($id_pameran)
    {
        // karya.id_stan → stan.id_stan → stan.model_stan → model.id_model
        $karyas = DB::table('karya')
            ->leftJoin('stan', 'karya.id_stan', '=', 'stan.id_stan')
            ->leftJoin('model', 'stan.model_stan', '=', 'model.id_model')
            ->where('karya.id_pameran', $id_pameran)
            ->select(
                'karya.id_karya',
                'karya.id_stan',
                'karya.judul',
                'karya.deskripsi',
                'karya.tautan',
                'karya.gambar_poster',
                'karya.gambar_sampul',
                'karya.lantai',
                'karya.is_terbaik',
                'model.nama_model as nama_stan',
                'model.3d_model as booth_model'
            )
            ->get();

        $result = $karyas->map(function ($karya) {
            $totalSuka = DB::table('suka')->where('id_karya', $karya->id_karya)->count();

            $komentar = DB::table('komentar')
                ->leftJoin('pengguna', 'komentar.id_pengguna', '=', 'pengguna.id')
                ->where('komentar.id_karya', $karya->id_karya)
                ->select('pengguna.nama', 'komentar.isi_komentar')
                ->get()
                ->map(fn($k) => [
                    'nama' => $k->nama ?? 'Anonim',
                    'isi' => $k->isi,
                ]);

            return [
                'id_karya' => $karya->id_karya,
                'id_stan' => $karya->nama_stan ?? ('Stan ' . $karya->id_stan), // "Stan A", "Stan B" dst
                'booth_name' => $karya->judul,
                'judul' => $karya->judul,
                'deskripsi' => $karya->deskripsi,
                'tautan' => $karya->tautan,
                'poster' => $karya->gambar_poster
                    ? '/storage/' . $karya->gambar_poster
                    : null,
                'sampul' => $this->getYoutubeThumbnail($karya->tautan),
                'model_path' => $karya->booth_model
                    ? '/storage/' . $karya->booth_model
                    : null,
                'lantai' => $karya->lantai,
                'is_terbaik' => (bool) $karya->is_terbaik,
                'total_suka' => $totalSuka,
                'komentar' => $komentar,
            ];
        });

        return response()->json($result);
    }

    private function getYoutubeThumbnail($url)
    {
        if (!$url) {
            return null;
        }

        $videoId = null;

        // https://www.youtube.com/watch?v=xxxx
        parse_str(parse_url($url, PHP_URL_QUERY), $query);

        if (isset($query['v'])) {
            $videoId = $query['v'];
        }

        // https://youtu.be/xxxx
        if (!$videoId && preg_match('/youtu\.be\/([^\?&]+)/', $url, $matches)) {
            $videoId = $matches[1];
        }

        if (!$videoId) {
            return null;
        }

        return "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg";
    }
}