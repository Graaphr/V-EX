<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModelSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('model')->insert([
            // Model untuk Hall Pameran (hanya 1)
            [
                'jenis'       => 'Pameran',
                'nama_model'  => 'Hall Utama',
                '3d_model'    => 'models/hall-utama.glb',
            ],
            // Model untuk Stan (bisa lebih dari 1)
            [
                'jenis'       => 'Stan',
                'nama_model'  => 'Stan A',
                '3d_model'    => 'models/stan-a.glb',
            ],
            [
                'jenis'       => 'Stan',
                'nama_model'  => 'Stan B',
                '3d_model'    => 'models/stan-b.glb',
            ],
        ]);
    }
}