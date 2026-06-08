<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ModelPameran;

class StanSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil model stan
        $modelStan = ModelPameran::where('jenis', 'Stan')->get();

        // Gunakan id_pameran = 1 (yang sudah ada)
        foreach ($modelStan as $model) {
            DB::table('stan')->insert([
                'id_pameran' => 1,
                'model_stan' => $model->id_model,
            ]);
        }
    }
}