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

{Backend Implementasi (Class & Function)}

[
    (PenggunaController)
    {
        register(data:[nama,email,psssword]) --> (RegisterPage): OK, 
        registerThroughAdmin(data:[nama,email,role,prodi]) --> (FormTambahUser): OK, 
        getByRole(role): OK,
        updateThroughAdmin(data:[nama,email,role,satus]) --> (UserDetail): OK, 
        verifyOtp(data:[token,otp]) --> (VerifikasiPage): OK,
        resendOtp(token['email']): OK, 
        login(data:[email,password]) --> (LoginPage): OK, 
        logout(data:User): OK
    },

    (ChangeEmailController)
    {
        sendVerification(data:[new_email,password]) --> (GantiEmailPage): OK, 
        verify(otp): OK, 
    },

    (ChangePasswordController)
    {
        changePassword(data:[old_password,new_password,new_password_confirmation]) --> (GantiPasswordPage): OK,
    },

    (ResetPasswordController)
    {
        forgotPassword(email) --> (LupaPasswordPage): OK,
        resendEmail(email) --> (LupaPasswordPage): OK, 
        verifyResetToken(token): OK,
        resetPassword(data:[token,email,password]) --> (UbahPasswordForm): OK
    },

    (KaryaController)
    {
        index(User) --> (PageKarya) : OK,

        store(data:[
            id_pameran,
            id_stan,
            judul,
            deskripsi,
            tautan,
            gambar_poster,
            gambar_sampul
        ]) --> (AddKarya) : OK,

        update(id,data:[
            id_pameran,
            id_stan,
            judul,
            deskripsi,
            tautan,
            gambar_poster,
            gambar_sampul
        ]) --> (EditKarya): OK,

        pameranTersedia(): OK,
        stanTersedia(id_pameran): OK,

        destroy(id,User) : ,
    },

    (GameAssetController)
    {
        index() --> (ExhibitionPage) : OK,
        get3DModel(modelId) --> (ExhibitionPage) : OK,
        karyaByPameran(id) --> (ExhibitionPage): OK,
        getYoutubeThumbnail(url) : OK
    },

    (KomentarController)
    {
        index(id_karya) --> (ExhibitionPage) : ,
        store(id_karya, isi_komentar) --> (ExhibitionPage) : ,
    },

    (KpsController)
    {
        daftarKarya(User): ,
        pilihTerbaik(User, id_karya) : ,
        batalkanTerbaik(User, id_karya) : ,
        karyaTerbaik() : 
    },

    (PameranController)
    {
        index() --> (PagePameran) :OK ,
        show(id) --> (DetailPameran) :OK ,

        store(data:[
            category,
            banner,
            title,
            description,
            capacity,
            start_date,
            end_date,
            prepare_start,
            prepare_end
        ]) --> (AddPameran) :OK,

        update(data:[
            kategori,
            banner,
            judul,
            deskripsi,
            kapasitas,
            tanggal_mulai,
            tanggal_akhir,
            tanggal_akhir_persiapan,
            tanggal_mulai_persiapan
        ]) --> (EditPameran): OK,
    },

    (SukaController)
    {
        toggle(User,id_karya) --> (ExhibitionPage): ,
        status(User,id_karya) --> (ExhibitionPage): ,
    }

]

NOTE:

* Loading nya lama
* Saat back datanya ke load ulang bukannya ke refresh
* Menyimpan kookies untuk load session page admin
* Unntuk menghubungkan melalui ApiPameran bukan lagi route jadi langsung terhubung dengan controller

================================================================================
================================================================================