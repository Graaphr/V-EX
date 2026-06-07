<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('prodi')->insert([
            ['kode_prodi' => 'IF', 'nama_prodi' => 'Informaika'],
            ['kode_prodi' => 'TRM', 'nama_prodi' => 'Teknologi Rekayasa Multimedia'],
            ['kode_prodi' => 'TRPL', 'nama_prodi' => 'Teknologi Rekayasa Perangkat Lunak'],
            ['kode_prodi' => 'AN', 'nama_prodi' => 'Animasi'],
            ['kode_prodi' => 'RKS', 'nama_prodi' => 'Rekayasa Keamanan Siber'],
            ['kode_prodi' => 'GM', 'nama_prodi' => 'Teknologi Geomatika'],
            ['kode_prodi' => 'TP', 'nama_prodi' => 'Teknologi Permainan'],
        ]);
    }
}