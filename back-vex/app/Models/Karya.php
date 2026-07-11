<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karya extends Model
{
    public $timestamps = false;
    protected $table = 'karya';
    protected $primaryKey = 'id_karya';

    protected $fillable = [
        'id_pengguna',
        'id_stan',
        'id_pameran',
        'judul',
        'deskripsi',
        'tautan',
        'gambar_poster',
        'gambar_poster_large',
        'gambar_poster_medium',
        'gambar_poster_small',
        'gambar_sampul',
        'gambar_sampul_large',
        'gambar_sampul_medium',
        'gambar_sampul_small',
        'lantai',
        'is_terbaik',
    ];

    protected $casts = [
        'is_terbaik' => 'boolean',
        'lantai' => 'integer',
    ];

    // Relasi ke pengguna (Ketua PBL)
    public function pengguna()
    {
        return $this->belongsTo(Pengguna::class, 'id_pengguna', 'id');
    }

    /**
     * Relasi ke stan.
     * Nama relasi diubah dari 'model' → 'stan' agar konsisten
     * dengan Controller yang memanggil ->with(['stan', 'pameran'])
     * dan $item->stan->...
     *
     * FK: id_stan → stan.id_stan (bukan model_stan)
     */
    public function stan()
    {
        return $this->belongsTo(Stan::class, 'id_stan', 'id_stan');
    }

    public function pameran()
    {
        return $this->belongsTo(Pameran::class, 'id_pameran', 'id_pameran');
    }

    // Relasi ke komentar
    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'id_karya', 'id_karya');
    }

    // Relasi ke suka
    public function suka()
    {
        return $this->hasMany(Suka::class, 'id_karya', 'id_karya');
    }

    // Hitung total suka
    public function totalSuka()
    {
        return $this->suka()->count();
    }
}