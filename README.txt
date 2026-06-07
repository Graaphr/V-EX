{Daftar Front-end yang sudah berdasarkan urutan folder}
yyuy
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
        halaman ganti email (GantiEmailPage) : OK 
    }, 

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

{fitur backend implementasi}[
    (GetPameranAll){
        sudah terhubung dengan controller namun belum dioptimalisasi
    }

    (GetDetailPameran){
        sudah terhubung dengan controller
    }

    (PostPameran){
        sudah terhubung dengan controller.

        *note: tampilan admin masih di dalam pameran/detail/[id]/page.tsx belum digabung
    }
]


NOTE :

* Loading nya lama
* Saat back datanya ke load ulang bukannya ke refresh
* Menyimpan kookies untuk load session page admin 
* Unntuk menghubungkan melalui ApiPameran bukan lagi route jadi langsung terhubung dengan controller