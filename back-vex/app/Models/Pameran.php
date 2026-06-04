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
        'tahun',
        'semester',
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
}