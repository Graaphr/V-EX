<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pameran', function (Blueprint $table) {
            $table->string('banner_large')->nullable()->after('banner');   // 75%
            $table->string('banner_medium')->nullable()->after('banner_large'); // 50%
            $table->string('banner_small')->nullable()->after('banner_medium'); // 25%
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pameran', function (Blueprint $table) {
            $table->dropColumn(['banner_large', 'banner_medium', 'banner_small']);
        });
    }
};
