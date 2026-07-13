<?php

namespace App\Services;

use App\Models\Pengguna;
use RuntimeException;

class Steganography
{
    private const DELIMITER = '<<<END>>>';

    public function embed(string $inputPath, string $outputPath, string $message): void
    {
        $image = $this->loadAsTrueColor($inputPath);
        $width = imagesx($image);
        $height = imagesy($image);

        $binaryMessage = $this->stringToBinary($message . self::DELIMITER);
        $totalBits = strlen($binaryMessage);
        $capacity = $width * $height;

        if ($totalBits > $capacity) {
            imagedestroy($image);
            throw new RuntimeException('Gambar terlalu kecil untuk menampung watermark.');
        }

        $bitIndex = 0;

        for ($y = 0; $y < $height && $bitIndex < $totalBits; $y++) {
            for ($x = 0; $x < $width && $bitIndex < $totalBits; $x++) {
                $rgb = imagecolorat($image, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;

                $bit = (int) $binaryMessage[$bitIndex];
                $b = ($b & 0xFE) | $bit;

                $newColor = ($r << 16) | ($g << 8) | $b;
                imagesetpixel($image, $x, $y, $newColor);

                $bitIndex++;
            }
        }

        imagepng($image, $outputPath, 6);
        imagedestroy($image);
    }

    public function extract(string $imagePath): ?string
    {
        $image = $this->loadAsTrueColor($imagePath);
        $width = imagesx($image);
        $height = imagesy($image);

        $bits = '';
        $delimiterBinary = $this->stringToBinary(self::DELIMITER);

        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width; $x++) {
                $rgb = imagecolorat($image, $x, $y);
                $bits .= (string) ($rgb & 1);

                if (strlen($bits) % 8 === 0 && str_ends_with($bits, $delimiterBinary)) {
                    imagedestroy($image);
                    $withoutDelimiter = substr($bits, 0, -strlen($delimiterBinary));
                    return $this->binaryToString($withoutDelimiter);
                }
            }
        }

        imagedestroy($image);
        return null;
    }

    // =============================
    // AMBIL NAMA USER DARI ID (model Pengguna)
    // =============================
    public function getUsernameById(int $userId): ?string
    {
        $pengguna = Pengguna::find($userId);

        return $pengguna?->nama;
    }

    // =============================
    // EMBED WATERMARK YANG OTOMATIS MENYERTAKAN NAMA USER
    // Format pesan: "karya:{id}|user:{id}|nama:{nama}|type:{type}"
    // Kalau nama user tidak ditemukan, fallback ke ID saja
    // =============================
    public function embedWithUsername(
        string $inputPath,
        string $outputPath,
        int $karyaId,
        int $userId,
        string $type
    ): void {
        $nama = $this->getUsernameById($userId);
        $nama = $nama ? str_replace('|', '', $nama) : 'unknown'; // hindari karakter '|' merusak parsing pesan

        $message = "karya:{$karyaId}|user:{$userId}|nama:{$nama}|type:{$type}";

        $this->embed($inputPath, $outputPath, $message);
    }

    private function loadAsTrueColor(string $path)
    {
        $info = getimagesize($path);
        if (!$info) {
            throw new RuntimeException("File gambar tidak valid: {$path}");
        }

        $image = match ($info['mime']) {
            'image/png' => imagecreatefrompng($path),
            'image/jpeg' => imagecreatefromjpeg($path),
            default => throw new RuntimeException("Format tidak didukung untuk steganografi: {$info['mime']}"),
        };

        if (!imageistruecolor($image)) {
            $trueColor = imagecreatetruecolor(imagesx($image), imagesy($image));
            imagecopy($trueColor, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
            imagedestroy($image);
            $image = $trueColor;
        }

        return $image;
    }

    private function stringToBinary(string $string): string
    {
        $binary = '';
        foreach (str_split($string) as $char) {
            $binary .= str_pad(decbin(ord($char)), 8, '0', STR_PAD_LEFT);
        }
        return $binary;
    }

    private function binaryToString(string $binary): string
    {
        $string = '';
        foreach (str_split($binary, 8) as $byte) {
            if (strlen($byte) < 8) break;
            $string .= chr(bindec($byte));
        }
        return $string;
    }
}