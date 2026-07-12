<?php

namespace App\Http\Controllers;

use App\Models\Karya;
use App\Models\Komentar;
use App\Rules\BebasKataKasar;
use Illuminate\Http\Request;

class KomentarController extends Controller
{
    // =============================
    // LIHAT KOMENTAR PER KARYA
    // =============================
    public function index($id_karya)
    {
        $karya = Karya::find($id_karya);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya tidak ditemukan.',
            ], 404);
        }

        $komentar = Komentar::with('pengguna:id,nama')
            ->where('id_karya', $id_karya)
            ->get();

        return response()->json([
            'status' => 'success',
            'total' => $komentar->count(),
            'komentar' => $komentar,
        ]);
    }

    // =============================
    // TAMBAH KOMENTAR
    // =============================
    public function store(Request $request, $id_karya)
    {
        $karya = Karya::find($id_karya);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'isi_komentar' => ['required', 'string', 'max:100', new BebasKataKasar()],
        ]);

        $komentar = Komentar::create([
            'id_pengguna' => $request->user()->id,
            'id_karya' => $id_karya,
            'isi_komentar' => $request->isi_komentar,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Komentar berhasil ditambahkan.',
            'komentar' => $komentar->load('pengguna:id,nama'),
        ], 201);
    }

}