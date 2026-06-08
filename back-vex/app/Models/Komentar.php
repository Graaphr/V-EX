<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Komentar extends Model
{
    public $timestamps    = false;
    protected $table      = 'komentar';
    protected $primaryKey = 'id_komentar';

    protected $fillable = [
        'id_pengguna',
        'id_karya',
        'isi_komentar',
    ];

    // Relasi ke pengguna
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna', 'id');
    }

    // Relasi ke karya
    public function karya()
    {
        return $this->belongsTo(Karya::class, 'id_karya', 'id_karya');
    }
}