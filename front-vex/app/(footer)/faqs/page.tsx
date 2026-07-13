export const metadata = {
  title: "FAQs | V-EX",
};

const faqs = [
  {
    q: "Apa itu V-EX (Virtual Exhibition)?",
    a: "V-EX adalah platform pameran karya PBL (Project Based Learning) berbasis 3D yang memungkinkan mahasiswa Teknik Informatika Polibatam menampilkan karya mereka secara virtual dan interaktif kepada publik.",
  },
  {
    q: "Siapa saja yang bisa mengakses V-EX?",
    a: "Siapa saja bisa mengunjungi dan menjelajahi pameran secara publik. Untuk memberi komentar dan menyukai karya, pengunjung perlu membuat akun terlebih dahulu.",
  },
  {
    q: "Bagaimana cara mendaftar akun?",
    a: "Klik tombol \"Daftar\" pada halaman utama, lalu isi data diri menggunakan email aktif. Setelah verifikasi, akun kamu siap digunakan untuk berinteraksi di pameran.",
  },
  {
    q: "Bagaimana karya dipilih menjadi \"Karya Terbaik\"?",
    a: "Karya terbaik dinilai langsung oleh Kepala Program Studi (KPS) berdasarkan kualitas, kreativitas, dan inovasi. Satu karya terbaik dipilih dari setiap program studi.",
  },
  {
    q: "Apa bedanya \"Karya Terbaik\" dan \"Karya Favorit\"?",
    a: "Karya Terbaik dipilih oleh KPS berdasarkan penilaian kualitas. Karya Favorit ditentukan dari jumlah suka (likes) terbanyak dari seluruh pengunjung.",
  },
  {
    q: "Apakah karya yang ditampilkan dilindungi hak cipta?",
    a: "Ya. Setiap karya yang diunggah otomatis diberi watermark sebagai bentuk proteksi terhadap hasil karya mahasiswa. Detail lebih lanjut ada di halaman Kebijakan Privasi.",
  },
  {
    q: "Saya lupa kata sandi akun saya, bagaimana solusinya?",
    a: "Gunakan fitur \"Lupa Kata Sandi\" pada halaman login. Sistem akan mengirimkan tautan pemulihan kata sandi ke email yang terdaftar.",
  },
];

export default function FaqsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-main-blue">
        <p className="font-poppins font-thin text-3xl sm:text-4xl leading-none">PERTANYAAN</p>
        <p className="font-tilt-wrap font-bold text-3xl sm:text-4xl leading-none">UMUM (FAQs)</p>
      </div>

      <p className="font-poppins font-light text-gray-600 max-w-2xl">
        Belum menemukan jawaban yang kamu cari? Hubungi kami melalui halaman{" "}
        <a href="/hubungi-kami" className="text-main-blue font-medium underline underline-offset-2">
          Hubungi Kami
        </a>
        .
      </p>

      <div className="flex flex-col gap-3">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="group border border-gray-200 rounded-xl px-5 py-4 open:bg-secondary-color/50 transition-colors"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-poppins font-medium text-main-blue">
              {item.q}
              <span className="shrink-0 text-xl leading-none transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 font-poppins font-light text-gray-600 text-sm sm:text-base leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}