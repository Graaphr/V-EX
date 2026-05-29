<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('prodi')->insert([
            ['kode_prodi' => 'TI',   'nama_prodi' => 'Teknologi Informasi'],
            ['kode_prodi' => 'TRM',  'nama_prodi' => 'Teknologi Rekayasa Multimedia'],
            ['kode_prodi' => 'TRPL', 'nama_prodi' => 'Teknologi Rekayasa Perangkat Lunak'],
        ]);
    }
}