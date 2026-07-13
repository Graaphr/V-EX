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
        Schema::create('komentar', function (Blueprint $table) {
            $table->id('id_komentar');

            $table->unsignedBigInteger('id_pengguna');
            $table->unsignedBigInteger('id_karya');

            $table->foreign('id_pengguna')->references('id')->on('pengguna')->cascadeOnDelete();
            $table->foreign('id_karya')->references('id_karya')->on('karya')->cascadeOnDelete();
            $table->text('isi_komentar');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('komentar');
    }
};
