export const metadata = {
  title: "Syarat & Ketentuan | V-EX",
};

const sections = [
  {
    title: "1. Penerimaan Ketentuan",
    body: "Dengan mengakses dan menggunakan V-EX (Virtual Exhibition), kamu dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku di platform ini.",
  },
  {
    title: "2. Akun Pengguna",
    body: "Kamu bertanggung jawab penuh atas kerahasiaan kata sandi dan seluruh aktivitas yang terjadi pada akunmu. Segera laporkan ke tim kami apabila terjadi penggunaan akun tanpa izin.",
  },
  {
    title: "3. Konten dan Karya",
    body: "Karya yang diunggah harus merupakan hasil karya asli mahasiswa dalam program PBL. Admin dan Ketua PBL bertanggung jawab atas keakuratan data karya yang dipublikasikan.",
  },
  {
    title: "4. Interaksi Pengguna",
    body: "Komentar dan bentuk interaksi lain harus disampaikan dengan bahasa yang sopan. Kami berhak menghapus konten yang mengandung ujaran kebencian, spam, atau pelanggaran lainnya.",
  },
  {
    title: "5. Hak Kekayaan Intelektual",
    body: "Hak cipta atas karya tetap dimiliki oleh mahasiswa pembuatnya. V-EX hanya berfungsi sebagai wadah publikasi dan menerapkan watermark otomatis sebagai bentuk proteksi tambahan.",
  },
  {
    title: "6. Perubahan Ketentuan",
    body: "Kami dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diinformasikan melalui platform sebelum berlaku efektif.",
  },
];

export default function SyaratKetentuanPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-main-blue">
        <p className="font-poppins font-thin text-3xl sm:text-4xl leading-none">SYARAT &</p>
        <p className="font-tilt-wrap font-bold text-3xl sm:text-4xl leading-none">KETENTUAN</p>
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