<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Pengguna;

class PenggunaTambahan extends Seeder
{
    public function run(): void
    {
        // ✅ Hapus data lama dulu
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('pengguna')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Ketua PBL
        $mhsData = [
            [
                'nama' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi01@student.test',
                'program_studi' => 'IF',
                'kelas' => 1,
            ],
            [
                'nama' => 'Siti Rahma',
                'email' => 'siti.rahma02@student.test',
                'program_studi' => 'IF',
                'kelas' => 2,
            ],
            [
                'nama' => 'Budi Santoso',
                'email' => 'budi.santoso03@student.test',
                'program_studi' => 'TRM',
                'kelas' => 1,
            ],
            [
                'nama' => 'Dewi Lestari',
                'email' => 'dewi.lestari04@student.test',
                'program_studi' => 'TRM',
                'kelas' => 3,
            ],
            [
                'nama' => 'Andi Pratama',
                'email' => 'andi.pratama05@student.test',
                'program_studi' => 'TRPL',
                'kelas' => 2,
            ],
            [
                'nama' => 'Nabila Putri',
                'email' => 'nabila.putri06@student.test',
                'program_studi' => 'TRPL',
                'kelas' => 4,
            ],
            [
                'nama' => 'Rizky Hidayat',
                'email' => 'rizky.hidayat07@student.test',
                'program_studi' => 'AN',
                'kelas' => 1,
            ],
            [
                'nama' => 'Fitri Noviana',
                'email' => 'fitri.noviana08@student.test',
                'program_studi' => 'RKS',
                'kelas' => 2,
            ],
            [
                'nama' => 'Muhammad Farhan',
                'email' => 'muhammad.farhan09@student.test',
                'program_studi' => 'GM',
                'kelas' => 3,
            ],
            [
                'nama' => 'Aulia Maharani',
                'email' => 'aulia.maharani10@student.test',
                'program_studi' => 'TP',
                'kelas' => 4,
            ],
            [
                'nama' => 'Aulia Maharani',
                'email' => 'auli.maharani10@student.test',
                'program_studi' => 'TP',
                'kelas' => 4,
            ],
        ];

        $kpsData = [
            [
                'nama' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi01@kps.test',
                'program_studi' => 'IF',
                'kelas' => 1,
            ],
            [
                'nama' => 'Siti Rahma',
                'email' => 'siti.rahma02@kps.test',
                'program_studi' => 'IF',
                'kelas' => 2,
            ],
            [
                'nama' => 'Budi Santoso',
                'email' => 'budi.santoso03@kps.test',
                'program_studi' => 'TRM',
                'kelas' => 1,
            ],
            [
                'nama' => 'Dewi Lestari',
                'email' => 'dewi.lestari04@kps.test',
                'program_studi' => 'TRM',
                'kelas' => 3,
            ],
            [
                'nama' => 'Andi Pratama',
                'email' => 'andi.pratama05@kps.test',
                'program_studi' => 'TRPL',
                'kelas' => 2,
            ],
            [
                'nama' => 'Nabila Putri',
                'email' => 'nabila.putri06@kps.test',
                'program_studi' => 'TRPL',
                'kelas' => 4,
            ],
            [
                'nama' => 'Rizky Hidayat',
                'email' => 'rizky.hidayat07@kps.test',
                'program_studi' => 'AN',
                'kelas' => 1,
            ],
            [
                'nama' => 'Fitri Noviana',
                'email' => 'fitri.noviana08@kps.test',
                'program_studi' => 'RKS',
                'kelas' => 2,
            ],
            [
                'nama' => 'Muhammad Farhan',
                'email' => 'muhammad.farhan09@kps.test',
                'program_studi' => 'GM',
                'kelas' => 3,
            ],
            [
                'nama' => 'Aulia Maharani',
                'email' => 'aulia.maharani10@kps.test',
                'program_studi' => 'TP',
                'kelas' => 4,
            ],
            [
                'nama' => 'Aulia Maharani',
                'email' => 'auli.maharani10@kps.test',
                'program_studi' => 'TP',
                'kelas' => 4,
            ],
        ];

        foreach ($mhsData as $mhs) {
            Pengguna::create([
                'nama' => $mhs['nama'],
                'email' => $mhs['email'],
                'password' => Hash::make('password123'),
                'role' => Pengguna::ROLE_KETUA_PBL,
                'program_studi' => $mhs['program_studi'],
                'kelas' => $mhs['kelas'],
                'status' => Pengguna::STATUS_AKTIF,
            ]);
        }

        foreach ($kpsData as $kps) {
            Pengguna::create([
                'nama' => $kps['nama'],
                'email' => $kps['email'],
                'password' => Hash::make('password123'),
                'role' => Pengguna::ROLE_KPS,
                'program_studi' => $kps['program_studi'],
                'kelas' => null,
                'status' => Pengguna::STATUS_AKTIF,
            ]);
        }

    }
}
