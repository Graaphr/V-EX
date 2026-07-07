<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kelas;

class KelasSeeder extends Seeder
{
    public function run(): void
    {
        $kelas = ['A', 'B', 'C', 'D'];

        foreach ($kelas as $nama) {
            Kelas::create([
                'nama_kelas' => $nama,
            ]);
        }
    }
}