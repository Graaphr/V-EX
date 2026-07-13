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
        Schema::create('suka', function (Blueprint $table) {
            $table->id('id_suka');

            $table->unsignedBigInteger('id_pengguna');
            $table->unsignedBigInteger('id_karya');

            $table->foreign('id_pengguna')->references('id')->on('pengguna')->cascadeOnDelete();
            $table->foreign('id_karya')->references('id_karya')->on('karya')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suka');
    }
};
