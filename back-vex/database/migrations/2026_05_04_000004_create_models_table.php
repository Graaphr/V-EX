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
        Schema::create('model', function (Blueprint $table) {
            $table->id('id_model');
            $table->enum('jenis', ['Pameran', 'Stan']);
            $table->string('nama_model')->unique();
            $table->string('3d_model')->unique();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model');
    }
};
