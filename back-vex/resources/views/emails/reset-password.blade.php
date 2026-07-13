<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 40px 0;">

                <table width="500" cellpadding="0" cellspacing="0"
                    style="background:#ffffff; border-radius:8px; overflow:hidden;">

                    {{-- Header --}}
                    <tr>
                        <td align="center"
                            style="background-color:#3730A3; padding:30px;">
                            <h1 style="color:#ffffff; margin:0; font-size:24px;">
                                Reset Kata Sandi
                            </h1>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color:#333333; font-size:16px; margin:0 0 20px;">
                                Halo,
                            </p>
                            <p style="color:#333333; font-size:16px; margin:0 0 30px;">
                                Kami menerima permintaan untuk mereset kata sandi akun Anda.
                                Klik tombol di bawah untuk melanjutkan.
                            </p>

                            {{-- Tombol --}}
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $resetLink }}"
                                            style="background-color:#3730A3;
                                                  color:#ffffff;
                                                  padding:14px 32px;
                                                  text-decoration:none;
                                                  border-radius:6px;
                                                  font-size:16px;
                                                  font-weight:bold;
                                                  display:inline-block;">
                                            Reset Kata Sandi
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color:#666666; font-size:14px; margin:30px 0 0;">
                                Link ini akan kadaluarsa dalam <strong>15 menit</strong>.
                            </p>
                            <p style="color:#666666; font-size:14px; margin:10px 0 0;">
                                Jika Anda tidak merasa meminta reset kata sandi,
                                abaikan email ini.
                            </p>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td align="center"
                            style="background-color:#f4f4f4; padding:20px;">
                            <p style="color:#999999; font-size:12px; margin:0;">
                                © {{ date('Y') }} All rights reserved. V-EX (Virtual Exhibition)
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>