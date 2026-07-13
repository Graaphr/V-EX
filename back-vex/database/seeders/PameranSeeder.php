<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ModelPameran;

class PameranSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil id model pameran otomatis
        $modelPameran = ModelPameran::where('jenis', 'Pameran')->first();

        DB::table('pameran')->insert([
            // TI - 2026 - Semester 5
            [
                'model_pameran'           => $modelPameran->id_model,
                'kategori'                => 'TI',
                'tahun'                   => 2026,
                'semester'                => 5,
                'banner'                  => 'banner/dummy.jpg',
                'judul'                   => 'TI EXPO 2026',
                'deskripsi'               => 'Pameran karya mahasiswa Teknologi Informasi 2026',
                'kapasitas'               => 24,
                'tanggal_mulai'           => '2026-06-01',
                'tanggal_akhir'           => '2026-06-30',
                'tanggal_mulai_persiapan' => '2026-05-01',
                'tanggal_akhir_persiapan' => '2026-05-31',
            ],
            // TI - 2025 - Semester 3
            [
                'model_pameran'           => $modelPameran->id_model,
                'kategori'                => 'TI',
                'tahun'                   => 2025,
                'semester'                => 3,
                'banner'                  => 'banner/dummy.jpg',
                'judul'                   => 'TI EXPO 2025',
                'deskripsi'               => 'Pameran karya mahasiswa Teknologi Informasi 2025',
                'kapasitas'               => 24,
                'tanggal_mulai'           => '2025-06-01',
                'tanggal_akhir'           => '2025-06-30',
                'tanggal_mulai_persiapan' => '2025-05-01',
                'tanggal_akhir_persiapan' => '2025-05-31',
            ],
            // TRM - 2026 - Semester 7
            [
                'model_pameran'           => $modelPameran->id_model,
                'kategori'                => 'TRM',
                'tahun'                   => 2026,
                'semester'                => 7,
                'banner'                  => 'banner/dummy.jpg',
                'judul'                   => 'Multimedia Creative Expo 2026',
                'deskripsi'               => 'Pameran karya mahasiswa Teknologi Rekayasa Multimedia 2026',
                'kapasitas'               => 24,
                'tanggal_mulai'           => '2026-07-01',
                'tanggal_akhir'           => '2026-07-30',
                'tanggal_mulai_persiapan' => '2026-06-01',
                'tanggal_akhir_persiapan' => '2026-06-30',
            ],
            // TRM - 2025 - Semester 5
            [
                'model_pameran'           => $modelPameran->id_model,
                'kategori'                => 'TRM',
                'tahun'                   => 2025,
                'semester'                => 5,
                'banner'                  => 'banner/dummy.jpg',
                'judul'                   => 'Multimedia Creative Expo 2025',
                'deskripsi'               => 'Pameran karya mahasiswa Teknologi Rekayasa Multimedia 2025',
                'kapasitas'               => 24,
                'tanggal_mulai'           => '2025-07-01',
                'tanggal_akhir'           => '2025-07-30',
                'tanggal_mulai_persiapan' => '2025-06-01',
                'tanggal_akhir_persiapan' => '2025-06-30',
            ],
            // TRPL - 2026 - Semester 3
            [
                'model_pameran'           => $modelPameran->id_model,
                'kategori'                => 'TRPL',
                'tahun'                   => 2026,
                'semester'                => 3,
                'banner'                  => 'banner/dummy.jpg',
                'judul'                   => 'TRPL EXPO 2026',
                'deskripsi'               => 'Pameran karya mahasiswa Teknologi Rekayasa Perangkat Lunak 2026',
                'kapasitas'               => 24,
                'tanggal_mulai'           => '2026-08-01',
                'tanggal_akhir'           => '2026-08-30',
                'tanggal_mulai_persiapan' => '2026-07-01',
                'tanggal_akhir_persiapan' => '2026-07-31',
            ],
            // TRPL - 2025 - Semester 7
            [
                'model_pameran'           => $modelPameran->id_model,
                'kategori'                => 'TRPL',
                'tahun'                   => 2025,
                'semester'                => 7,
                'banner'                  => 'banner/dummy.jpg',
                'judul'                   => 'TRPL EXPO 2025',
                'deskripsi'               => 'Pameran karya mahasiswa Teknologi Rekayasa Perangkat Lunak 2025',
                'kapasitas'               => 24,
                'tanggal_mulai'           => '2025-08-01',
                'tanggal_akhir'           => '2025-08-30',
                'tanggal_mulai_persiapan' => '2025-07-01',
                'tanggal_akhir_persiapan' => '2025-07-31',
            ],
        ]);
    }
}