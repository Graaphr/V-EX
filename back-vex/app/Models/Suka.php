<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suka extends Model
{
    public $timestamps    = false;
    protected $table      = 'suka';
    protected $primaryKey = 'id_suka';

    protected $fillable = [
        'id_pengguna',
        'id_karya',
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