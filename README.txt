{Daftar Front-end yang sudah berdasarkan urutan folder}

[
    (auth)
    {
        halaman login (LoginPage): OK,
        halaman register (RegisterPage): OK,
        halaman lupa password :{
            email (LupaPasswordEmailPage): OK,
            ganti-password (GantiPasswordPage): OK,
        },
        halaman verifikasi (VerifikasiPage): OK,
    }, '

    (dashboard)
    {
        (admin){
            karya (KaryaPage) : OK,
            {
                halaman detail karya (DetailPage) : OK,
            },
            pameran (AdminPameranPage) : OK,
            {
                detail pameran (AdminDetailPameran) : OK,  
                edit pameran (AdminEditPameran) : OK,  
                add pameran (AddPameran) : OK,  
            },
            pengguna (AdminPage): OK, 
        },
        (ketua-pbl){
            karya (KaryaPage) : OK,
            detail karya (DetailKarya) : OK,
            add karya (AddKarya) : OK,
            edit karya (EditKarya) : OK

        },
    },

    (index)
    {
        halaman utama (HomePage) : OK 
    },

    (pameran)
    {
        halaman pameran (PagePameran) : OK,
        detail pameran (DetailPameran) : OK
    },

    (play)
    {
        halaman 3D exhibition (ExhibitionPage) : OK,
    }
]

    npm run build
    npm start


: Folder hooks berguna untuk menyimpan kumpulan operasi di satu fungsi
: Folder context menyimpan identitas User kredensial dan session
: Folder types menyimpan types yang sering di gunakan dalam operasi

NOTE :
[AGAK]
_____ logika NavBar jika role?admin ==> /admin/....
[AMAN]
_____ pastikan lagi menggunakan localstorage atau sactrum SPA
