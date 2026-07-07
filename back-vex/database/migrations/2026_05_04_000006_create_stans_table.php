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
        Schema::create('stan', function (Blueprint $table) {
            $table->id('id_stan');

            $table->unsignedBigInteger('id_pameran');
            $table->unsignedBigInteger('model_stan');

            $table->foreign('id_pameran')->references('id_pameran')->on('pameran')->cascadeOnDelete();
            $table->foreign('model_stan')->references('id_model')->on('model')->cascadeOnDelete();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stan');
    }
};
