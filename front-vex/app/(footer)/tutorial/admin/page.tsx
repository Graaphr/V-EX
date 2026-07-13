import TutorialSection from '@/components/TutorialSection';
import type { TutorialSubsection } from '@/components/layout/TutorialSection';

export const metadata = {
    title: 'Tutorial - Panduan Admin | V-EX',
};

const sections: TutorialSubsection[] = [
    {
        number: '1',
        title: 'Dashboard Admin',
        description:
            'Dashboard admin merupakan halaman utama yang ditampilkan setelah admin berhasil login ke sistem. Halaman ini menampilkan ringkasan informasi dan navigasi untuk mengelola seluruh fitur aplikasi.',
        steps: [
            'Setelah berhasil login, admin akan diarahkan ke halaman dashboard yang menampilkan daftar Kepala Program Studi (KPS) dan Mahasiswa (Ketua PBL).',
        ],
    },
    {
        number: '2',
        title: 'Kelola Akun KPS dan Ketua PBL',
        description: 'Admin dapat mengelola akun pengguna dengan peran KPS (Kepala Program Studi) dan Ketua PBL.',
        steps: [
            'Pada dashboard admin, pilih menu "Pengguna".',
            'Sistem menampilkan daftar semua pengguna yang terdaftar, dikelompokkan berdasarkan Kepala Program Studi dan Mahasiswa.',
        ],
    },
    {
        number: '3',
        title: 'Tambah Pengguna',
        steps: [
            'Klik tombol "Tambah" untuk menambahkan pengguna.',
            'Pilih jenis akun: "Kepala Program Studi" atau "Ketua PBL".',
            'Isi form/data (Nama, Email, Program Studi/Kelas, dan Status).',
            'Klik "Simpan".',
        ],
    },
    {
        number: '4',
        title: 'Edit Pengguna',
        steps: [
            'Klik ikon "Edit" pada pengguna yang diinginkan.',
            'Ubah data yang diperlukan.',
            'Klik "Simpan".',
        ],
    },
    {
        number: '5',
        title: 'Edit Status',
        steps: [
            'Klik ikon "centang hijau" (✅) pada pengguna yang ingin diubah statusnya.',
            'Sistem akan mengubah status pengguna menjadi "Aktif" atau "Tidak Aktif" secara otomatis.',
            'Status berhasil diperbarui.',
        ],
    },
    {
        number: '6',
        title: 'Kelola Pameran',
        description:
            'Admin dapat mengelola pameran yang diselenggarakan. Perubahan ini akan berpengaruh kepada seluruh pengguna, di mana Ketua PBL hanya bisa menambahkan karya ketika pameran belum ter-publish.',
        steps: [
            'Pada dashboard admin, pilih menu "Pameran".',
            'Sistem menampilkan daftar semua pameran yang telah dibuat.',
        ],
    },
    {
        number: '7',
        title: 'Tambah Pameran',
        steps: [
            'Klik ikon "Tambah Pameran".',
            'Isi data: Thumbnail, Program Studi, Judul Pameran, Kapasitas Pameran, Tanggal Pameran (mulai dan berakhir), Tanggal Persiapan (mulai dan berakhir), serta Deskripsi.',
            'Klik "Simpan".',
        ],
    },
    {
        number: '8',
        title: 'Edit Pameran',
        steps: [
            'Pada daftar pameran, klik ikon "Edit" (berupa pensil) pada pameran yang ingin diubah.',
            'Sistem menampilkan form edit pameran.',
            'Ubah data yang diperlukan (Thumbnail, Program Studi, Judul Pameran, dll.).',
            'Klik "Simpan" untuk menyimpan perubahan.',
        ],
    },
    {
        number: '9',
        title: 'Hapus Karya',
        steps: [
            'Klik ikon "Karya".',
            'Klik karya yang ingin dihapus.',
            'Scroll ke bawah pada halaman detail karya, lalu klik tombol "Hapus".',
            'Sistem menampilkan konfirmasi penghapusan, klik "Ya, Hapus" untuk menghapus karya tersebut secara permanen.',
        ],
    },
];

export default function TutorialAdminPage() {
    return (
        <TutorialSection
            title="TUTORIAL"
            subtitle="PANDUAN ADMIN"
            intro="Panduan untuk admin dalam mengelola pengguna (KPS dan Ketua PBL), mengelola pameran, serta mengelola karya yang dipamerkan di V-EX."
            sections={sections}
        />
    );
}