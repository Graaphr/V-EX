<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    public $timestamps    = false;
    protected $table      = 'prodi';
    protected $primaryKey = 'kode_prodi';
    public $incrementing  = false;
    protected $keyType    = 'string';

    protected $fillable = [
        'kode_prodi',
        'nama_prodi',
    ];
}