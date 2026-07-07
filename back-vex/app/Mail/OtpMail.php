<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp; // Variabel untuk menampung kode OTP

    public function __construct($otp)
    {
        $this->otp = $otp; // Terima OTP dari Controller
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Kode Verifikasi OTP Registrasi',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.otp', // Mengarah ke resources/views/emails/otp.blade.php
        );
    }
}