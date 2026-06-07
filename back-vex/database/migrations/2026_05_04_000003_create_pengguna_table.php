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
        Schema::create('pengguna', function (Blueprint $table) {
            $table->id();

            $table->string('nama', 255); 
            $table->string('email')->unique();
            $table->string('password');

            $table->unsignedBigInteger('kelas')->nullable();
            $table->string('program_studi')->nullable();

            $table->foreign('kelas')->references('id_kelas')->on('kelas')->cascadeOnDelete();
            $table->foreign('program_studi')->references('kode_prodi')->on('prodi')->cascadeOnDelete();
            $table->enum('role', ['Admin', 'KPS', 'Ketua PBL', 'Pengunjung'])->default('Pengunjung');
            $table->enum('status', ['Aktif', 'Tidak Aktif'])->default('Aktif');

            $table->string('new_email')->nullable();
            $table->string('new_email_verification_token')->nullable();
            $table->timestamp('new_email_expires_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengguna');
    }
};
