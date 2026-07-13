import { FaFilePdf, FaArrowRight } from "react-icons/fa";

export const metadata = {
  title: "Petunjuk | V-EX",
};

const steps = [
  {
    title: "Buat atau masuk ke akun",
    desc: "Daftar menggunakan email aktif, atau langsung masuk jika kamu sudah punya akun sebelumnya.",
  },
  {
    title: "Jelajahi daftar pameran",
    desc: "Buka menu \"Pameran\" untuk melihat seluruh pameran 3D yang tersedia, atau cari berdasarkan tahun dan judul.",
  },
  {
    title: "Masuk ke ruang pameran 3D",
    desc: "Pilih salah satu pameran untuk masuk ke ruang virtual. Gunakan mouse atau sentuhan layar untuk berjalan dan melihat sekeliling.",
  },
  {
    title: "Lihat detail karya",
    desc: "Klik salah satu stan atau poster karya untuk membuka detail lengkap: deskripsi, video demo, dan tautan terkait.",
  },
  {
    title: "Beri suka dan komentar",
    desc: "Sampaikan apresiasi dengan menekan tombol suka, atau tinggalkan komentar untuk memberi masukan langsung ke pemilik karya.",
  },
];

const tutorialPdfLink = "/tutorial/V-EX Tutorial.pdf";

export default function PetunjukPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-main-blue">
        <p className="font-poppins font-thin text-3xl sm:text-4xl leading-none">CARA</p>
        <p className="font-tilt-wrap font-bold text-3xl sm:text-4xl leading-none">MENGGUNAKAN V-EX</p>
      </div>

      <p className="font-poppins font-light text-gray-600 max-w-2xl">
        Ikuti langkah-langkah berikut untuk mulai menjelajahi pameran karya PBL secara virtual.
      </p>

      <ol className="flex flex-col gap-6">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4 sm:gap-5">
            <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-main-blue text-white flex items-center justify-center font-poppins font-bold text-sm sm:text-base">
              {i + 1}
            </div>
            <div>
              <p className="font-poppins font-medium text-main-blue text-base sm:text-lg">{step.title}</p>
              <p className="font-poppins font-light text-gray-600 text-sm sm:text-base mt-1 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* CTA: Panduan Lengkap PDF */}
      <a
        href={tutorialPdfLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-4 mt-4 p-5 sm:p-6 rounded-xl border border-main-blue/20 bg-main-blue/5 hover:bg-main-blue/10 transition-colors duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-main-blue text-white flex items-center justify-center text-lg sm:text-xl">
            <FaFilePdf />
          </div>
          <div>
            <p className="font-poppins font-medium text-main-blue text-base sm:text-lg">
              Butuh penjelasan lebih lanjut?
            </p>
            <p className="font-poppins font-light text-gray-600 text-sm sm:text-base mt-0.5">
              Lihat Panduan Lengkap
            </p>
          </div>
        </div>
        <FaArrowRight className="shrink-0 text-main-blue text-lg sm:text-xl transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  );
}