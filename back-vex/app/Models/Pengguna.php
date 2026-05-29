<?php

namespace App\Models;

// Tambahkan HasApiTokens agar bisa digunakan oleh Sanctum
use Laravel\Sanctum\HasApiTokens; 
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Pengguna extends Authenticatable
{
    // HasApiTokens 
    use HasApiTokens, HasFactory, Notifiable;

    public $timestamps = false;

    protected $table = 'pengguna';
    
    // konstanta role
    const ROLE_ADMIN = 'Admin';
    const ROLE_KPS = 'KPS';
    const ROLE_KETUA_PBL = 'Ketua PBL';
    const ROLE_PENGUNJUNG = 'Pengunjung';

    const STATUS_AKTIF ='Aktif';
    const STATUS_TIDAK_AKTIF ='Tidak Aktif';


   
    protected $fillable = [
        'nama',
        'email',
        'password',
        'kelas',
        'program_studi',
        'role',
        'status',
        'new_email',  //tambah untuk ganti email
        'new_email_verification_token', // tambah untuk ganti email
        'new_email_expires_at',  //tambah untuk ganti email
        
    ];

    protected $hidden = [

        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [

            'password' => 'hashed',
        ];
    }

    // Helper Methods
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isKps():  bool
    {
        return $this->role === self::ROLE_KPS;
    }

    public function isKetuaPbl(): bool
    {
        return $this->role === self::ROLE_KETUA_PBL;
    }

    public function isPengunjung(): bool
    {
        return $this->role === self::ROLE_PENGUNJUNG;
    }

    public function isAktif(): bool
    {
        return $this->status === self::STATUS_AKTIF;
    }

    public function kelasBelongsTo()
    {
        return $this->belongsTo(Kelas::class, 'kelas', 'id_kelas');
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'program_studi', 'kode_prodi');
    }
}