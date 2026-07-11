<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pameran extends Model
{
    public $timestamps = false;
    protected $table = 'pameran';
    protected $primaryKey = 'id_pameran';

    protected $fillable = [
        'model_pameran',
        'kategori',
        'banner',
        'judul',
        'slug',
        'deskripsi',
        'kapasitas',
        'tanggal_mulai',
        'tanggal_akhir',
        'tanggal_mulai_persiapan',
        'tanggal_akhir_persiapan',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pameran) {
            if (empty($pameran->slug)) {
                $base = Str::slug($pameran->judul);
                $slug = $base . '-' . Str::lower(Str::random(5));

                while (static::where('slug', $slug)->exists()) {
                    $slug = $base . '-' . Str::lower(Str::random(5));
                }

                $pameran->slug = $slug;
            }
        });
    }

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

    public function suka()
    {
        return $this->hasManyThrough(
            Suka::class,
            Karya::class,
            'id_pameran',
            'id_karya',
            'id_pameran',
            'id_karya'
        );
    }
}