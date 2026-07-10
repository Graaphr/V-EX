<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('karya', function (Blueprint $table) {
            $table->string('gambar_poster_large')->nullable()->after('gambar_poster');
            $table->string('gambar_poster_medium')->nullable()->after('gambar_poster_large');
            $table->string('gambar_poster_small')->nullable()->after('gambar_poster_medium');
            $table->string('gambar_sampul_large')->nullable()->after('gambar_sampul');
            $table->string('gambar_sampul_medium')->nullable()->after('gambar_sampul_large');
            $table->string('gambar_sampul_small')->nullable()->after('gambar_sampul_medium');
        });
    }

    public function down(): void
    {
        Schema::table('karya', function (Blueprint $table) {
            $table->dropColumn([
                'gambar_poster_large', 'gambar_poster_medium', 'gambar_poster_small',
                'gambar_sampul_large', 'gambar_sampul_medium', 'gambar_sampul_small',
            ]);
        });
    }
};