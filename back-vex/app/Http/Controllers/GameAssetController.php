<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        $pameran = \App\Models\Pameran::with('model3d')->findOrFail($modelId);

        if (!$pameran->model3d) {
            return response()->json(['error' => 'Model tidak ditemukan'], 404);
        }

        return response()->json([
            'model_hall' => "http://localhost:8000/storage/" . $pameran->model3d->{'3d_model'},
        ]);
    }
}