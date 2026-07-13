import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export const metadata = {
  title: "Hubungi Kami | V-EX",
};

const kontak = [
  {
    icon: FaInstagram,
    label: "Instagram",
    value: "@virtualexhibition204",
    link: "https://www.instagram.com/virtualexhibition204/",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    value: "PBL-TRPL204",
    link: "https://youtube.com/@pbl-trpl204?si=kWdrqlvURisWyhHv",
  },
//   {
//     icon: FaLinkedin,
//     label: "LinkedIn",
//     value: "PBL TRPL-204",
//     link: "/",
//   },
];

export default function HubungiKamiPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-main-blue">
        <p className="font-poppins font-thin text-3xl sm:text-4xl leading-none">HUBUNGI</p>
        <p className="font-tilt-wrap font-bold text-3xl sm:text-4xl leading-none">KAMI</p>
      </div>

      <p className="font-poppins font-light text-gray-600 max-w-2xl">
        Punya pertanyaan, masukan, atau kendala teknis seputar V-EX? Jangan ragu untuk menghubungi kami melalui
        kanal berikut.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {kontak.map((item, i) => {
          const Icon = item.icon;
          return (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-start gap-3 border border-gray-200 rounded-xl px-5 py-5 hover:shadow-md hover:border-main-blue/40 transition-all"
            >
              <Icon className="text-3xl text-main-blue" />
              <div>
                <p className="font-poppins font-medium text-main-blue text-sm sm:text-base">{item.label}</p>
                <p className="font-poppins font-light text-gray-500 text-xs sm:text-sm">{item.value}</p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-6 mt-2">
        <p className="font-poppins font-medium text-main-blue text-base sm:text-lg mb-2">Alamat</p>
        <p className="font-poppins font-light text-gray-600 text-sm sm:text-base leading-relaxed">
          Jurusan Teknik Informatika, Politeknik Negeri Batam
          <br />
          Jl. Ahmad Yani, Batam Kota, Batam, Kepulauan Riau 29461
        </p>
      </div>
    </div>
  );
}