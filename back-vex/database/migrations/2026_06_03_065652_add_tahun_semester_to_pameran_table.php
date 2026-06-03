<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pameran', function (Blueprint $table) {
            $table->year('tahun')->after('kategori');
            $table->tinyInteger('semester')->unsigned()->after('tahun'); // ✅ angka 1-8
        });
    }

    public function down(): void
    {
        Schema::table('pameran', function (Blueprint $table) {
            $table->dropColumn(['tahun', 'semester']);
        });
    }
};