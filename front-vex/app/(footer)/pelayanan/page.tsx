export const metadata = {
  title: "Pelayanan | V-EX",
};

const layanan = [
  {
    title: "Pameran Virtual 3D",
    desc: "Ruang pameran interaktif berbasis 3D untuk menampilkan karya PBL secara imersif, dapat diakses kapan saja tanpa batas lokasi.",
  },
  {
    title: "Manajemen Karya",
    desc: "Ketua PBL dan Admin dapat mengunggah, memperbarui, serta mengatur karya dan stan pameran melalui dashboard yang mudah digunakan.",
  },
  {
    title: "Penilaian Karya Terbaik",
    desc: "Kepala Program Studi (KPS) dapat menilai dan memilih karya terbaik dari setiap program studi langsung melalui sistem.",
  },
  {
    title: "Interaksi Pengunjung",
    desc: "Pengunjung dapat memberikan komentar dan suka pada karya, membuka ruang apresiasi dan masukan langsung dari publik.",
  },
  {
    title: "Dukungan Teknis",
    desc: "Tim kami siap membantu jika kamu mengalami kendala teknis saat menggunakan platform. Hubungi kami melalui halaman Hubungi Kami.",
  },
];

export default function PelayananPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-main-blue">
        <p className="font-poppins font-thin text-3xl sm:text-4xl leading-none">LAYANAN</p>
        <p className="font-tilt-wrap font-bold text-3xl sm:text-4xl leading-none">KAMI</p>
      </div>

      <p className="font-poppins font-light text-gray-600 max-w-2xl">
        Berikut layanan yang tersedia di V-EX untuk mendukung publikasi karya PBL mahasiswa Teknik Informatika
        Polibatam.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {layanan.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl px-5 py-5 flex flex-col gap-2 hover:shadow-md transition-shadow"
          >
            <p className="font-poppins font-medium text-main-blue text-base sm:text-lg">{item.title}</p>
            <p className="font-poppins font-light text-gray-600 text-sm sm:text-base leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}