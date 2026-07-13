<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Pengguna;

class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Hapus data lama dulu
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('pengguna')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Pengunjung
        Pengguna::create([
            'nama'          => 'User',
            'email'         => 'user@pbl.com',
            'password'      => Hash::make('password123'),
            'role'          => Pengguna::ROLE_PENGUNJUNG,
            'kelas'         => null,
            'program_studi' => null,
        ]);

        // Admin
        Pengguna::create([
            'nama'          => 'Admin Utama',
            'email'         => 'admin@pbl.com',
            'password'      => Hash::make('password123'),
            'role'          => Pengguna::ROLE_ADMIN,
            'kelas'         => null,
            'program_studi' => null,
        ]);

        // KPS
        $kpsData = [
            ['nama' => 'KPS Informatika',                       'email' => 'kps.if@pbl.com',   'program_studi' => 'IF'],
            ['nama' => 'KPS Teknologi Rekayasa Multimedia',     'email' => 'kps.trm@pbl.com',  'program_studi' => 'TRM'],
            ['nama' => 'KPS Teknologi Rekayasa Perangkat Lunak','email' => 'kps.trpl@pbl.com', 'program_studi' => 'TRPL'],
            ['nama' => 'KPS Animasi',                           'email' => 'kps.an@pbl.com',   'program_studi' => 'AN'],
            ['nama' => 'KPS Rekayasa Keamanan Siber',           'email' => 'kps.rks@pbl.com',  'program_studi' => 'RKS'],
            ['nama' => 'KPS Teknologi Geomatika',               'email' => 'kps.gm@pbl.com',   'program_studi' => 'GM'],
            ['nama' => 'KPS Teknologi Permainan',               'email' => 'kps.tp@pbl.com',   'program_studi' => 'TP'],
        ];

        foreach ($kpsData as $kps) {
            Pengguna::create([
                'nama'          => $kps['nama'],
                'email'         => $kps['email'],
                'password'      => Hash::make('password123'),
                'role'          => Pengguna::ROLE_KPS,
                'program_studi' => $kps['program_studi'],
                'kelas'         => null,
                'status'        => Pengguna::STATUS_AKTIF,
            ]);
        }
    }
}