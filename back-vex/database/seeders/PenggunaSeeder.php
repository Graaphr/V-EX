<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Pengguna;
class PenggunaSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        Pengguna::create([
            'nama'          => 'User',
            'email'         => 'user@pbl.com',
            'password'      => Hash::make('password123'),
            'role'          => 'Pengguna',
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

        
    }
}