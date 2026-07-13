<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Rule validasi: menolak input yang mengandung kata kasar.
 *
 * Cara pakai (di request/controller):
 *   $request->validate([
 *       'isi_komentar' => ['required', 'string', 'max:100', new BebasKataKasar()],
 *   ]);
 *
 * Catatan:
 * - Daftar kata ada di config/kata_kasar.php supaya gampang ditambah/diubah
 *   tanpa harus edit kode.
 * - Sebelum dicocokkan, teks dinormalisasi dulu (lowercase, hilangkan spasi
 *   ganda/simbol pemisah, sedikit substitusi leetspeak umum: 4->a, 1->i,
 *   3->e, 0->o, 5->s, @->a) supaya bypass sederhana seperti "b4b1",
 *   "b.a.b.i", atau "b a b i" tetap kena filter.
 * - Ini bukan filter sempurna (susah 100% menangkap semua variasi bahasa
 *   gaul/typo), tapi sudah menutup celah paling umum. Kalau butuh lebih
 *   ketat, bisa upgrade ke package pihak ketiga.
 */
class BebasKataKasar implements ValidationRule
{
    /**
     * Normalisasi teks supaya lebih sulit di-bypass.
     */
    protected function normalisasi(string $teks): string
    {
        $teks = mb_strtolower($teks);

        // Substitusi leetspeak umum
        $peta = [
            '4' => 'a',
            '@' => 'a',
            '1' => 'i',
            '!' => 'i',
            '3' => 'e',
            '0' => 'o',
            '5' => 's',
            '$' => 's',
            '7' => 't',
        ];
        $teks = strtr($teks, $peta);

        // Hilangkan semua karakter selain huruf & angka (spasi, titik,
        // strip, underscore, dst) supaya "b a b i" / "b.a.b.i" / "b_a_b_i"
        // ikut ketahuan sebagai "babi"
        $teks = preg_replace('/[^a-z0-9]/u', '', $teks);

        return $teks ?? '';
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value) || trim($value) === '') {
            return; // biar rule 'required' yang urus kalau kosong
        }

        $daftarKataKasar = config('kata_kasar.daftar', []);

        if (empty($daftarKataKasar)) {
            return; // tidak ada daftar terkonfigurasi, skip diam-diam
        }

        $normalTeks = $this->normalisasi($value);

        foreach ($daftarKataKasar as $kata) {
            $normalKata = $this->normalisasi($kata);

            if ($normalKata !== '' && str_contains($normalTeks, $normalKata)) {
                $fail('Komentar mengandung kata yang tidak pantas. Mohon gunakan bahasa yang sopan.');
                return;
            }
        }
    }
}