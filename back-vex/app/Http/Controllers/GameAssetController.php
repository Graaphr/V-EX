<?php

//-----------------------
// !! JANGAN DISENTUH !!
//-----------------------

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Karya;
use App\Models\Pameran;

class GameAssetController extends Controller
{
    public function index()
    {
        return response()->json([
            'bgm'       => asset('storage/audio/bgm.mp3'),
            'footstep'  => asset('storage/audio/footstep.mp3'),
            'jump'      => asset('storage/audio/jump.mp3'),
        ]);
    }

    public function get3DModel($modelId)
    {
        $pameran = Pameran::with('model3d')->findOrFail($modelId);

        if (!$pameran->model3d) {
            return response()->json(['error' => 'Model tidak ditemukan'], 404);
        }

        return response()->json([
            'model_hall' => asset('storage/' . $pameran->model3d->{'3d_model'}),
        ]);
    }

    /**
     * Ambil semua karya untuk satu pameran, lengkap dengan:
     * - model_path  booth 3-D model (dari relasi Stan)
     * - poster      URL gambar poster
     * - sampul      URL gambar sampul
     * - tautan      embed link
     * - komentar    (eager-loaded)
     * - total_suka  (count)
     * - is_terbaik
     */
    public function karyaByPameran($id_pameran)
    {
        $karyas = Karya::with(['komentar.pengguna', 'suka'])
            ->where('id_pameran', $id_pameran)
            ->get()
            ->map(function ($karya) {
                // Resolve booth 3-D model path via Stan relation
                $modelPath = null;
                if ($karya->model && $karya->model->{'3d_model'}) {
                    $modelPath = asset('storage/' . $karya->model->{'3d_model'});
                }

                return [
                    'id_karya'   => $karya->id_karya,
                    'id_stan'    => $karya->id_stan,
                    'booth_name' => $karya->judul,
                    'judul'      => $karya->judul,
                    'deskripsi'  => $karya->deskripsi,
                    'tautan'     => $karya->tautan,
                    'poster'     => $karya->gambar_poster
                                        ? asset('storage/' . $karya->gambar_poster)
                                        : null,
                    'sampul'     => $karya->gambar_sampul
                                        ? asset('storage/' . $karya->gambar_sampul)
                                        : null,
                    'model_path' => $modelPath,
                    'lantai'     => $karya->lantai,
                    'is_terbaik' => $karya->is_terbaik,
                    'total_suka' => $karya->suka()->count(),
                    'komentar'   => $karya->komentar->map(fn($k) => [
                        'nama' => $k->pengguna->nama ?? 'Anonim',
                        'isi'  => $k->isi,
                    ]),
                ];
            });

        return response()->json($karyas);
    }
}