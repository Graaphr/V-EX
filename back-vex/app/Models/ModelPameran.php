<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModelPameran extends Model
{
    public $timestamps    = false;
    protected $table      = 'model';
    protected $primaryKey = 'id_model';

    protected $fillable = [
        'jenis',
        'nama_model',
        '3d_model',
    ];

    // Relasi ke pameran
    public function pameran()
    {
        return $this->hasMany(Pameran::class, 'model_pameran', 'id_model');
    }
}