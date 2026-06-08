================================================================================
================================================================================

{Daftar Front-end yang sudah berdasarkan urutan folder}

[
    (auth): OK
    {
        halaman register (RegisterPage): OK,
        halaman login (LoginPage): OK,
        halaman lupa password (LupaPasswordPage): OK
        {
            ubah password (UbahPasswordPage): OK,
        },
        halaman verifikasi (VerifikasiPage): OK,
        halaman ganti email (GantiEmailPage): OK,
        halaman ganti password (GantiPasswordPage): OK
    },

    (dashboard)
    {
        (admin)
        {
            karya (KaryaPage): OK,
            {
                halaman detail karya (DetailPage): OK,
            },
            pameran (AdminPameranPage): OK,
            {
                detail pameran (AdminDetailPameran): OK,
                edit pameran (AdminEditPameran): OK,
                add pameran (AddPameran): OK,
            },
            pengguna (AdminPage): OK,
        },

        (ketua-pbl)
        {
            karya (KaryaPage): OK,
            detail karya (DetailKarya): OK,
            add karya (AddKarya): OK,
            edit karya (EditKarya): OK
        },
    },

    (index)
    {
        halaman utama (HomePage): OK
    },

    (pameran)
    {
        halaman pameran (PagePameran): OK,
        detail pameran (DetailPameran): OK
    },

    (play)
    {
        halaman 3D exhibition (ExhibitionPage): OK,
    }
]

: Folder hooks berguna untuk menyimpan kumpulan operasi di satu fungsi
: Folder context menyimpan identitas User kredensial dan session
: Folder types menyimpan types yang sering di gunakan dalam operasi

================================================================================
================================================================================

{Backend Implementasi}

[
    (PenggunaControler)
    {
        register(data): (RegisterPage): OK, # register pengguna
        registerThroughAdmin(data): (FormTambahUser): OK, # register akun Ketua PBL & KPS
        getByRole(role): , # Validasi untuk role yang dapat add, put
        updateThroughAdmin(data): (UserDetail): OK, # update akun Ketua PBL & KPS
        verifyOtp(otp): (VerifikasiPage): OK, # verifikasi OTP dengan send email
        resendOtp(email): , # resend OTP register
        login(data): (LoginPage): OK, # login ke akun pengguna dengan token
        logout(): # keluar dan hapus token
    },

    (ChangeEmailController)
    {
        sendVerification(data): (GantiEmailPage): OK, # Kirim otp verivikasi ganti email
        verify(otp): , # Memverifikasi otp dengan email -> ganti email
    },

    (ChangePasswordController)
    {
        changePassword(data): (GantiPasswordPage): OK, # mengganti password direct
    },

    (ResetPasswordController)
    {
        forgotPassword(data): (LupaPasswordPage): OK, # kirim link dan token
        resendEmail(email): , # kirim ulang email
        verifyResetToken(token): , # verifikai token yang di kirim
        resetPassword(data): # ganti password force
    },

    (GetPameranAll)
    {
        sudah terhubung dengan controller namun belum dioptimalisasi
    },

    (GetDetailPameran)
    {
        sudah terhubung dengan controller
    },

    (PostPameran)
    {
        sudah terhubung dengan controller.

        *note: tampilan admin masih di dalam
        pameran/detail/[id]/page.tsx belum digabung
    }
]

NOTE:

* Loading nya lama
* Saat back datanya ke load ulang bukannya ke refresh
* Menyimpan kookies untuk load session page admin
* Unntuk menghubungkan melalui ApiPameran bukan lagi route jadi langsung terhubung dengan controller

================================================================================
================================================================================