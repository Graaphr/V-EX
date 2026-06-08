<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karya extends Model
{
    public $timestamps    = false;
    protected $table      = 'karya';
    protected $primaryKey = 'id_karya';

    protected $fillable = [
        'id_pengguna',
        'id_stan',
        'judul',
        'deskripsi',
        'tautan',
        'gambar_poster',
        'gambar_sampul',
    ];

    // Relasi ke pengguna (Ketua PBL)
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna', 'id');
    }

    // Relasi ke stan
    public function stan()
    {
        return $this->belongsTo(Stan::class, 'id_stan', 'id_stan');
    }

    // ✅ Relasi ke komentar
    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'id_karya', 'id_karya');
    }

    // ✅ Relasi ke suka
    public function suka()
    {
        return $this->hasMany(Suka::class, 'id_karya', 'id_karya');
    }

    // ✅ Hitung total suka
    public function totalSuka()
    {
        return $this->suka()->count();
    }
}