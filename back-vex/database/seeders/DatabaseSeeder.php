<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PenggunaSeeder::class
            ]);
    }
    public function runProdi(): void
    {
        $this->call([
            ProdiSeeder::class
            ]);
    }
    public function runModel(): void
    {
        $this->call([
            ModelSeeder::class
            ]);
    }
    public function runKelas(): void
    {
        $this->call([
            KelasSeeder::class
            ]);
    }
}
