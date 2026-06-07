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

    <!-- <div style="margin-top: 20px;">
        <p>Silakan klik tombol di bawah ini untuk memasukkan kode tersebut:</p>
        <a href="{{ url('/lupa-password/ubah-password?') }}" 
           style="background-color: #4CAF50; 
                  color: white; 
                  padding: 12px 25px; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  display: inline-block;
                  font-weight: bold;">
            Verifikasi Sekarang
        </a>
    </div>

    <p style="font-size: 12px; color: #777; margin-top: 30px;">
        Jika tombol di atas tidak berfungsi, salin dan tempel link berikut di browser Anda:<br>
        {{ url('/lupa-password/ubah-password?') }}
    </p> -->
</body>
</html>