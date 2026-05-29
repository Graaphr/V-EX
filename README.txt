[MERAPIKAN && MERAMPINGKAN && MEMASTIKAN]

[
    (auth)
    {
        halaman login (LoginPage): OK,
        halaman register (RegisterPage): OK,
        halaman lupa password :{
            email (LupaPasswordEmailPage): OK,
            ganti-password (LupaPasswordPage): OK,
        },
        halaman verifikasi (VerifikasiPage): OK,
    }, '

    (dashboard)
    {
        (admin){
            karya (KaryaPage) : OK,
            {
                halaman detail karya (PageKaryaAdmin) : OK,
            },
            pameran (PagePameran) : OK,
            {
                detail pameran (DetailPameran) : OK,  
                edit pameran (AdminEditPameran) : OK,  
                add pameran (AddPameran) : OK,  
            },
            pengguna (AdminPage): OK, 
        },
        (ketua-pbl){
            karya (KaryaPage) : OK,
            detail karya (DetailKarya) : OK,
            add karya (AddKarya) : OK,

        },
    },
]

: Folder hooks berguna untuk menyimpan kumpulan operasi di satu fungsi
: Folder context menyimpan identitas User kredensial dan session
: Folder types menyimpan types yang sering di gunakan dalam operasi

[AGAK]
_____ logika NavBar jika role?admin ==> /admin/....
[AMAN]
_____ pastikan lagi menggunakan localstorage atau sactrum SPA
