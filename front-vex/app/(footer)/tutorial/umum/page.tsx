import TutorialSection from '@/components/layout/TutorialSection';
import type { TutorialSubsection } from '@/components/layout/TutorialSection';

export const metadata = {
    title: 'Tutorial - Panduan Umum | V-EX',
};

const sections: TutorialSubsection[] = [
    {
        number: '1',
        title: 'Landing Page',
        description:
            'Landing page merupakan halaman awal aplikasi V-EX (Virtual Exhibition) yang pertama kali ditampilkan kepada pengguna. Halaman ini berfungsi untuk memberikan gambaran umum tentang aplikasi serta menyediakan navigasi awal.',
        steps: [
            'Pengguna membuka aplikasi V-EX melalui browser dengan memasukkan alamat URL yang telah disediakan.',
            'Sistem menampilkan halaman utama dengan menu navigasi BERANDA, PAMERAN, serta tombol "Masuk" di pojok kanan atas untuk melanjutkan ke halaman login.',
        ],
    },
    {
        number: '2',
        title: 'Login',
        description: 'Halaman login digunakan oleh pengguna yang sudah memiliki akun untuk masuk ke dalam sistem V-EX.',
        steps: [
            'Pada landing page, pengguna menekan tombol "Masuk" di pojok kanan atas.',
            'Sistem mengarahkan ke halaman login.',
            'Pengguna memasukkan Email dan Kata Sandi.',
            'Pengguna menekan tombol "Masuk".',
            'Sistem memverifikasi data dan mengarahkan ke dashboard sesuai role.',
            'Jika lupa kata sandi, tekan "Lupa Kata Sandi?".',
            'Jika belum punya akun, tekan "Daftar".',
        ],
    },
    {
        number: '3',
        title: 'Register',
        description:
            'Halaman register digunakan oleh pengguna baru yang belum memiliki akun untuk mendaftar ke sistem V-EX.',
        steps: [
            'Pada halaman login, pengguna mengklik tombol "Daftar".',
            'Sistem mengarahkan ke halaman register.',
            'Pengguna mengisi data: Masukkan Nama, Masukkan Email, dan Kata Sandi.',
            'Pengguna mengklik tombol "Daftar".',
            'Sistem mengirimkan kode OTP (6 digit) ke email pengguna.',
            'Pengguna membuka email dan mencatat kode OTP 6 digit yang diterima.',
            'Pengguna memasukkan 6 digit kode OTP pada kolom yang tersedia.',
            'Pengguna mengklik tombol "Verifikasi".',
            'Sistem memverifikasi kode: jika benar, akun aktif dan diarahkan ke halaman login; jika salah, tampilkan pesan error; jika tidak menerima kode, tekan "Kirim Ulang OTP".',
        ],
    },
    {
        number: '4',
        title: 'Ganti Kata Sandi',
        description:
            'Halaman ganti kata sandi digunakan oleh pengguna yang sudah login untuk mengganti kata sandi akun mereka. Fitur ini memungkinkan pengguna memperbarui kata sandi lama dengan kata sandi baru untuk menjaga keamanan akun.',
        steps: [
            'Klik "ikon profil" di pojok kanan atas.',
            'Pilih menu "Ganti Kata Sandi".',
            'Sistem menampilkan form ganti kata sandi.',
            'Pengguna mengisi Kata Sandi Lama, Kata Sandi Baru, dan Konfirmasi Kata Sandi Baru.',
            'Klik tombol "Simpan Perubahan".',
            'Sistem memverifikasi dan menyimpan kata sandi baru.',
            'Jika berhasil, muncul notifikasi "Kata sandi berhasil diperbarui".',
        ],
    },
    {
        number: '5',
        title: 'Ganti Email',
        description: 'Pengunjung yang sudah login dapat mengganti email akun dengan verifikasi OTP.',
        steps: [
            'Klik "ikon profil" di pojok kanan atas.',
            'Pilih menu "Ganti Email".',
            'Sistem menampilkan form ganti email.',
            'Pengguna mengisi Email Baru dan Kata Sandi (untuk verifikasi).',
            'Klik tombol "Kirim Kode Verifikasi".',
            'Sistem mengirim kode OTP ke email baru.',
            'Pengguna memasukkan 6 digit kode OTP.',
            'Klik tombol "Verifikasi".',
            'Jika berhasil, email baru tersimpan dan muncul notifikasi "Email berhasil diubah".',
        ],
    },
];

export default function TutorialUmumPage() {
    return (
        <TutorialSection
            title="TUTORIAL"
            subtitle="PANDUAN UMUM"
            intro="Panduan dasar untuk semua pengguna V-EX: mulai dari mengenal landing page, login, register, hingga mengelola akun seperti mengganti kata sandi dan email."
            sections={sections}
        />
    );
}