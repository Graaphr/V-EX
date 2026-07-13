<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pameran', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('judul');
        });

        // Backfill slug untuk data yang sudah ada
        DB::table('pameran')->orderBy('id_pameran')->get()->each(function ($item) {
            $base = Str::slug($item->judul);
            $slug = $base . '-' . Str::lower(Str::random(5));

            // Pastikan unik walau ada judul sama
            while (DB::table('pameran')->where('slug', $slug)->exists()) {
                $slug = $base . '-' . Str::lower(Str::random(5));
            }

            DB::table('pameran')->where('id_pameran', $item->id_pameran)->update(['slug' => $slug]);
        });

        Schema::table('pameran', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pameran', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};