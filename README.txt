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
                halaman detail karya (DetailPage) : OK,
            },
            pameran (PagePameran) : OK,
            {
                detail pameran (DetailPameran) : OK,  
                edit pameran (export default function AdminEditPameran) : OK,  
            },
            pengguna (AdminPage): OK, 
        },
        (ketua-pbl){

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
