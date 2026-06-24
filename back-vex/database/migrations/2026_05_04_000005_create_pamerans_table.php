<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pameran', function (Blueprint $table) {
            $table->id('id_pameran');

            $table->unsignedBigInteger('model_pameran');
            $table->string('kategori');

            $table->foreign('model_pameran')->references('id_model')->on('model')->cascadeOnDelete();
            $table->foreign('kategori')->references('kode_prodi')->on('prodi')->cascadeOnDelete();
            $table->string('banner');
            $table->string('judul');
            $table->text('deskripsi');
            $table->integer('kapasitas')->default(24);;
            $table->date('tanggal_mulai')->useCurrent();
            $table->date('tanggal_akhir')->useCurrent();
            $table->date('tanggal_mulai_persiapan')->useCurrent();
            $table->date('tanggal_akhir_persiapan')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pameran');
    }
};
