<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    public $timestamps    = false;
    protected $table      = 'kelas';
    protected $primaryKey = 'id_kelas';

    protected $fillable = [
        'nama_kelas',
    ];

    // Relasi ke pengguna (Ketua PBL)
    public function pengguna()
    {
        return $this->hasMany(Pengguna::class, 'kelas', 'id_kelas');
    }
}