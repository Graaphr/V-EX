export const metadata = {
  title: "Kebijakan Privasi | V-EX",
};

const sections = [
  {
    title: "1. Data yang Kami Kumpulkan",
    body: "Kami mengumpulkan data dasar seperti nama, email, dan program studi saat kamu mendaftar akun, serta data karya yang diunggah oleh Ketua PBL untuk keperluan pameran.",
  },
  {
    title: "2. Penggunaan Data",
    body: "Data digunakan untuk keperluan autentikasi, personalisasi pengalaman pameran, serta komunikasi terkait aktivitas akunmu di V-EX. Kami tidak membagikan data pribadimu ke pihak ketiga tanpa izin.",
  },
  {
    title: "3. Proteksi Karya",
    body: "Setiap karya yang dipublikasikan otomatis diberi watermark sebagai bentuk perlindungan terhadap penyalahgunaan atau klaim kepemilikan oleh pihak yang tidak berhak.",
  },
  {
    title: "4. Keamanan Data",
    body: "Kami menerapkan praktik keamanan standar seperti enkripsi kata sandi untuk menjaga kerahasiaan data akunmu dari akses yang tidak sah.",
  },
  {
    title: "5. Hak Pengguna",
    body: "Kamu berhak mengakses, memperbarui, atau menghapus data akunmu kapan saja melalui menu pengaturan akun, atau dengan menghubungi tim kami.",
  },
  {
    title: "6. Perubahan Kebijakan",
    body: "Kebijakan privasi ini dapat diperbarui sewaktu-waktu mengikuti perkembangan layanan. Perubahan penting akan diinformasikan melalui platform.",
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-main-blue">
        <p className="font-poppins font-thin text-3xl sm:text-4xl leading-none">KEBIJAKAN</p>
        <p className="font-tilt-wrap font-bold text-3xl sm:text-4xl leading-none">PRIVASI</p>
      </div>

      <p className="font-poppins font-light text-gray-500 text-sm">Terakhir diperbarui: 12 Juli 2026</p>

      <div className="flex flex-col gap-6">
        {sections.map((s, i) => (
          <div key={i}>
            <p className="font-poppins font-medium text-main-blue text-base sm:text-lg mb-2">{s.title}</p>
            <p className="font-poppins font-light text-gray-600 text-sm sm:text-base leading-relaxed text-justify">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}