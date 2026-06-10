<?php

namespace App\Http\Controllers;

use App\Models\Karya;
use Illuminate\Http\Request;

class KaryaController extends Controller
{
    public function showInExperience($id_pameran)
    {
        $karyaList = Karya::with('modelStand')
            ->where('id_pameran', $id_pameran)
            ->get();

        return response()->json(
            $karyaList->map(function ($karya) {
                return [
                    'id' => $karya->id_karya,
                    'booth_name' => $karya->judul,
                    'poster' => asset('storage/' . $karya->gambar_poster),
                    'sampul' => asset('storage/' . $karya->gambar_sampul),
                    'tautan' => $karya->tautan,
                    'model_path' => $karya->modelStand
                        ? asset('storage/' . $karya->modelStand->{'3d_model'})
                        : null,
                ];
            })
        );
    }
}
