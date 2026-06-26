<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pameran extends Model
{
    public $timestamps = false;
    protected $table   = 'pameran';
    protected $primaryKey = 'id_pameran';

    protected $fillable = [
        'model_pameran',
        'kategori',
        'banner',
        'judul',
        'deskripsi',
        'kapasitas',
        'tanggal_mulai',
        'tanggal_akhir',
        'tanggal_mulai_persiapan',
        'tanggal_akhir_persiapan',
    ];

    // Relasi ke tabel model (aset 3D)
    public function model3d()
    {
        return $this->belongsTo(ModelPameran::class, 'model_pameran', 'id_model');
    }

    // Relasi ke tabel prodi
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kategori', 'kode_prodi');
    }

    public function karya()
    {
        return $this->hasMany(Karya::class, 'id_pameran', 'id_pameran');
    }

    /**
     * Relasi tidak langsung: Pameran -> Karya -> Suka
     * Dipakai untuk withCount('suka') agar dapat total suka
     * dari seluruh karya yang ada di pameran ini.
     */
    public function suka()
    {
        return $this->hasManyThrough(
            Suka::class,
            Karya::class,
            'id_pameran', // FK di tabel karya yang merujuk ke pameran
            'id_karya',   // FK di tabel suka yang merujuk ke karya
            'id_pameran', // local key di pameran
            'id_karya'    // local key di karya
        );
    }
}