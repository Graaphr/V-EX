<!DOCTYPE html>
<html>

<head>
    <title>Kode Verifikasi OTP</title>
</head>

<body>
    <h2>Halo!</h2>
    <p>Terima kasih telah mendaftar di Virtual Exhibition PBL.</p>
    <p>Berikut adalah kode verifikasi Anda:</p>
    <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">
        {{ $otp }}
    </h1>
    <p>Kode ini akan kedaluwarsa dalam 10 menit.</p>
    <p style="color:#999999; font-size:12px; margin-top:10px;">
        © {{ date('Y') }} All rights reserved. V-EX (Virtual Exhibition)
    </p>

</body>

</html>