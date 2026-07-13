import TutorialSection from '@/components/TutorialSection';
import type { TutorialSubsection } from '@/components/layout/TutorialSection';

export const metadata = {
    title: 'Tutorial - Panduan Ketua PBL | V-EX',
};

const sections: TutorialSubsection[] = [
    {
        number: '1',
        title: 'Dashboard Ketua PBL',
        description: 'Dashboard Ketua PBL merupakan halaman utama yang ditampilkan setelah Ketua PBL berhasil login ke sistem.',
        steps: ['Setelah berhasil login, Ketua PBL akan diarahkan ke halaman dashboard Ketua PBL.'],
    },
    {
        number: '2',
        title: 'Kelola Karya',
        steps: [
            'Pada dashboard Ketua PBL, pilih menu "Kelola Karya".',
            'Sistem menampilkan daftar semua karya yang telah ditambahkan.',
        ],
    },
    {
        number: '3',
        title: 'Menambahkan Karya',
        steps: [
            'Klik tombol "Tambah" untuk menambahkan karya.',
            'Isi data yang terdiri dari: Judul Karya, Program Studi, Pameran (pilih pameran yang tersedia), Pilih Stan/Booth, Link Video Demo (YouTube), Upload Poster (maksimal 2MB), Upload Sampul (maksimal 2MB), dan Deskripsi karya (maksimal 200 karakter).',
            'Klik "Simpan" untuk menyimpan karya.',
        ],
    },
    {
        number: '4',
        title: 'Edit Karya',
        steps: [
            'Pada daftar karya, Ketua PBL dapat mengklik poster yang ingin diubah/diedit.',
            'Ubah data yang diperlukan (judul, deskripsi, gambar, video, dll.).',
            'Klik "Simpan".',
        ],
    },
];

export default function TutorialKetuaPblPage() {
    return (
        <TutorialSection
            title="TUTORIAL"
            subtitle="PANDUAN KETUA PBL"
            intro="Panduan untuk Ketua PBL dalam mengelola dan menambahkan karya kelompok ke dalam pameran V-EX."
            sections={sections}
        />
    );
}