import TutorialSection from '@/components/layout/TutorialSection';
import type { TutorialSubsection } from '@/components/layout/TutorialSection';

export const metadata = {
    title: 'Tutorial - Panduan Pengunjung | V-EX',
};

const sections: TutorialSubsection[] = [
    {
        number: '1',
        title: 'Dashboard Pengunjung',
        description:
            'Dashboard pengunjung merupakan halaman utama yang ditampilkan setelah pengunjung berhasil login ke sistem. Halaman ini menampilkan ringkasan informasi dan navigasi untuk mengakses berbagai fitur yang tersedia.',
        steps: [
            'Setelah berhasil login, pengunjung akan diarahkan ke halaman dashboard pengunjung.',
            'Pengunjung dapat mulai menjelajahi pameran yang tersedia dengan mengklik salah satu pameran yang ditampilkan.',
        ],
    },
    {
        number: '2',
        title: 'Akses Pameran',
        description:
            'Pengunjung dapat mengakses pameran yang sedang berlangsung atau melihat pameran yang akan segera hadir melalui halaman dashboard atau daftar pameran.',
        steps: [
            'Pada halaman dashboard, pengunjung dapat melihat daftar pameran yang tersedia.',
            'Pameran yang tersedia akan menampilkan informasi: Judul Pameran (contoh: TERPAL DEMO DAY 2025), Program Studi penyelenggara (contoh: Teknologi Rekayasa Perangkat Lunak), dan jumlah karya yang dipamerkan.',
            'Pengunjung juga dapat melihat pameran yang segera hadir.',
            'Untuk mengakses pameran, pengunjung mengklik salah satu pameran yang tersedia.',
            'Sistem akan menampilkan halaman detail pameran.',
        ],
    },
    {
        number: '3',
        title: 'Melakukan Pencarian Pameran',
        description: 'Pengunjung dapat mencari pameran yang diinginkan menggunakan fitur pencarian yang tersedia.',
        steps: [
            'Pada menu navigasi, pengunjung memilih menu "PAMERAN".',
            'Sistem akan menampilkan daftar semua pameran yang tersedia.',
            'Pengunjung dapat melakukan pencarian berdasarkan kata kunci (judul pameran), tahun pelaksanaan, semester, dan Program Studi.',
            'Sistem akan menampilkan hasil pencarian yang sesuai dengan kriteria yang dipilih.',
            'Pengunjung dapat mengklik salah satu hasil pencarian untuk melihat detail pameran.',
        ],
    },
    {
        number: '4',
        title: 'Akses Virtual Exhibition',
        steps: [
            'Pada halaman dashboard atau daftar pameran, pilih salah satu pameran (contoh: TERPAL DEMO DAY 2025).',
            'Sistem menampilkan halaman detail pameran berisi judul, program studi, tanggal, deskripsi, dan tema pameran.',
            'Klik tombol putar (play) untuk masuk ke pameran 3D.',
        ],
    },
    {
        number: '5',
        title: 'Panduan Virtual Exhibition',
        description: 'Sebelum masuk ke pameran 3D, sistem menampilkan panduan kontrol navigasi.',
        steps: [
            'Baca Panduan Kontrol yang berisi instruksi navigasi: gunakan mouse untuk melihat sekeliling, klik untuk berinteraksi, dan gunakan tombol navigasi (WASD/panah) untuk bergerak, serta tombol SPACE untuk loncat.',
            'Klik tombol "Lanjut" untuk masuk ke pameran 3D, atau "Lewati" jika ingin langsung menjelajah.',
        ],
    },
    {
        number: '6',
        title: 'Tampilan Virtual Exhibition',
        steps: [
            'Sistem memuat tampilan pameran 3D setelah pengunjung menekan "Lanjut".',
            'Jelajahi ruang pameran dengan mouse untuk melihat ke segala arah, keyboard (panah/WASD) untuk bergerak, dan klik objek/poster untuk berinteraksi.',
            'Untuk melihat detail karya, arahkan kursor ke poster karya di stan, lalu klik. Sistem menampilkan pop-up detail karya berisi judul, deskripsi, informasi pembuat, dan jumlah suka.',
            'Tutup pop-up dan lanjutkan ke stan lain.',
            'Untuk keluar dari tampilan 3D, tekan tombol "ESC" pada keyboard lalu tekan tombol "Keluar". Sistem mengarahkan kembali ke halaman detail pameran.',
        ],
    },
    {
        number: '7',
        title: 'Melihat Detail Karya',
        description: 'Pengunjung dapat melihat informasi lengkap tentang suatu karya yang dipamerkan.',
        steps: [
            'Dalam tampilan pameran 3D, pengunjung mendekati stan yang diinginkan.',
            'Pengunjung mengklik poster yang ada di stan.',
            'Sistem akan menampilkan pop-up detail karya yang dipilih.',
            'Pengunjung dapat membaca deskripsi untuk memahami lebih lanjut tentang karya tersebut.',
        ],
    },
    {
        number: '8',
        title: 'Memberikan Like dan Komentar',
        description: 'Pengunjung yang sudah login dapat memberikan suka (like) dan komentar pada karya yang dipamerkan.',
        steps: [
            'Pada halaman detail karya, pengunjung melihat ikon suka dan jumlah suka yang tersedia.',
            'Pengunjung mengklik ikon suka untuk menyukai karya tersebut.',
            'Sistem akan menambahkan suka dan menampilkan jumlah total suka secara real-time.',
            'Jika pengunjung mengklik lagi, sistem akan mencabut suka (unlike).',
            'Untuk berkomentar, pengunjung menggulir ke bagian komentar dan melihat daftar komentar dari pengguna lain.',
            'Pengunjung menulis komentar pada kolom yang tersedia lalu menekan tombol "Kirim" untuk mengirim komentar.',
        ],
    },
    {
        number: '9',
        title: 'Melihat Peta Pameran',
        description: 'Peta pameran menampilkan layout ruangan dan daftar semua karya yang dipamerkan dalam sebuah pameran.',
        steps: [
            'Dalam tampilan pameran 3D, pengunjung mengklik tombol "Peta Pameran" yang berada di pojok kanan atas layar.',
            'Sistem menampilkan peta pameran yang berisi layout ruangan dengan pembagian area (contoh: Kelas A, B, C, D), daftar semua karya pada setiap area, serta informasi setiap karya (judul, deskripsi, komponen).',
            'Untuk melihat detail karya, pengunjung mengklik salah satu karya yang ada di peta.',
            'Sistem menampilkan informasi lengkap karya tersebut.',
            'Untuk kembali ke tampilan 3D, pengunjung mengklik tombol "tanda silang" (X) di pojok kanan atas peta.',
        ],
    },
];

export default function TutorialPengunjungPage() {
    return (
        <TutorialSection
            title="TUTORIAL"
            subtitle="PANDUAN PENGUNJUNG"
            intro="Panduan lengkap untuk pengunjung: mulai dari menjelajahi pameran, masuk ke ruang virtual exhibition 3D, melihat detail karya, memberi like dan komentar, hingga menggunakan peta pameran."
            sections={sections}
        />
    );
}