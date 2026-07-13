import TutorialSection from '@/components/TutorialSection';
import type { TutorialSubsection } from '@/components/layout/TutorialSection';

export const metadata = {
    title: 'Tutorial - Panduan KPS | V-EX',
};

const sections: TutorialSubsection[] = [
    {
        number: '1',
        title: 'Dashboard KPS',
        description: 'Dashboard KPS merupakan halaman utama yang ditampilkan setelah KPS berhasil login ke sistem.',
        steps: ['Setelah berhasil login, KPS akan diarahkan ke halaman dashboard yang menampilkan daftar karya berdasarkan pameran.'],
    },
    {
        number: '2',
        title: 'Memilih Karya Terbaik',
        description: 'KPS dapat memilih satu karya terbaik dari setiap program studi berdasarkan kriteria yang telah ditentukan.',
        steps: [
            'Pada dashboard KPS, pilih menu "Daftar Karya".',
            'Sistem menampilkan daftar semua karya yang tersedia.',
            'KPS memilih salah satu karya yang dinilai terbaik.',
            'KPS mengklik tombol "Pilih Terbaik" atau ikon bintang di samping judul karya.',
            'Sistem menyimpan pilihan dan menampilkan lencana "KARYA TERBAIK" pada karya tersebut.',
            'Karya terbaik akan ditampilkan di landing page hingga pameran berikutnya.',
        ],
    },
    {
        number: '3',
        title: 'Membatalkan Pilihan Karya Terbaik',
        steps: [
            'Pada daftar karya, KPS mencari karya yang sebelumnya dipilih sebagai karya terbaik.',
            'KPS mengklik tombol "Batalkan Terbaik" pada karya tersebut.',
            'Sistem menghapus lencana "KARYA TERBAIK" dari karya tersebut.',
            'KPS dapat memilih karya lain sebagai karya terbaik.',
        ],
    },
    {
        number: '4',
        title: 'Keluar',
        steps: [
            'Pada pojok kanan atas halaman, pengguna mengklik "ikon profil".',
            'Sistem menampilkan dropdown/sidebar menu profil yang berisi beberapa pilihan menu.',
            'Pengguna memilih dan mengklik menu "Logout".',
            'Sistem menampilkan pop-up konfirmasi dengan pesan "Apakah Anda yakin?".',
            'Pengguna menekan tombol "Ok" untuk mengonfirmasi keluar.',
            'Sistem menghapus sesi login dan mengarahkan pengguna kembali ke halaman landing page.',
            'Jika pengguna memilih "Cancel", pop-up ditutup dan pengguna tetap berada di halaman sebelumnya.',
        ],
    },
];

export default function TutorialKpsPage() {
    return (
        <TutorialSection
            title="TUTORIAL"
            subtitle="PANDUAN KPS"
            intro="Panduan untuk Kepala Program Studi (KPS) dalam menilai dan memilih karya terbaik dari setiap program studi pada pameran V-EX."
            sections={sections}
        />
    );
}