<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KaryaSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil id stan yang ada
        $stan = DB::table('stan')->get();

        // Ambil id pengguna Ketua PBL yang ada
        $ketuaPbl = DB::table('pengguna')
            ->where('role', 'Ketua PBL')
            ->first();

        if (!$ketuaPbl || $stan->isEmpty()) {
            $this->command->info('Data stan atau Ketua PBL tidak ditemukan!');
            return;
        }

        foreach ($stan as $index => $s) {
            DB::table('karya')->insert([
                'id_pengguna'   => $ketuaPbl->id,
                'id_stan'       => $s->id_stan,
                'judul'         => 'Karya ' . ($index + 1),
                'deskripsi'     => 'Deskripsi karya ' . ($index + 1),
                'tautan'        => 'https://github.com/dummy-' . ($index + 1),
                'gambar_poster' => 'poster/dummy.jpg',
                'gambar_sampul' => 'sampul/dummy.jpg',
            ]);
        }
    }
}