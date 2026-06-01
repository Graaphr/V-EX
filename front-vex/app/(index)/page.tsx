// komponen
import { Card, Logo, BestTag, FavTag } from '@/components/shared/ui/Components';
import { Button } from '@/components/shared/ui/Button';
import Carousel from '@/components/shared/ui/Carousel';
// icon
import { BiCube, BiGlobe } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-secondary-color select-none">
      {/* SECTION 1 - Hero */}
      <section className="bg-[url(/image/BG1.jpg)] bg-cover bg-center w-full">
        <div className="autoMid min-h-screen px-4 sm:px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-2 items-start lg:items-center pt-8 sm:pt-10 lg:pt-0">
          <div className="hidden lg:block" />

          <div className="flex justify-center lg:justify-end items-start lg:items-center">
            <div className="w-full max-w-[460px] xl:max-w-[520px] flex flex-col gap-6">
              <div className="flex justify-center lg:justify-start">
                <Logo />
              </div>

              <div className="aspect-video rounded-md overflow-hidden shadow-[0px_0px_8px_2px_rgba(0,0,0,0.25)]">
                <iframe
                  src="https://www.youtube.com/embed/Gdq5k6fmuK0?si=gwPbWVPc5CKjnWtk"
                  className="w-full h-full"
                  title="Demo V-Ex"
                  allowFullScreen
                />
              </div>

              <div className="flex justify-end">
                <Button
                  link="/pameran"
                  className="font-bold px-8 sm:px-12 py-3 rounded-md transition-all duration-300 hover:scale-105"
                >
                  Lainnya
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Tampilkan Karyamu */}
      <section className="bg-secondary-color w-full">
        <div className="autoMid px-4 sm:px-6 lg:px-[20px] py-[80px] lg:py-[180px] min-h-[740px] grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="relative order-1 lg:order-2 w-full">
            <Card link="/image/BG1.svg" title="lobby" className="w-full h-full object-cover rounded-xl" />
          </div>

          <div className="order-2 lg:order-1 flex flex-col gap-8 justify-center">
            <div className="text-main-blue leading-none">
              <p className="font-poppins font-thin text-4xl sm:text-5xl lg:text-6xl leading-none">TAMPILKAN</p>
              <p className="font-tilt-wrap font-bold text-4xl sm:text-5xl lg:text-6xl leading-none">KARYAMU</p>
            </div>

            <div className="flex flex-col gap-5 text-black max-w-[500px]">
              <div className="flex items-start gap-3">
                <BiCube className="text-[22px] sm:text-lg shrink-0 mt-1" />
                <p className="text-[16px] sm:text-[18px] lg:text-lg font-poppins font-light">
                  Jelajahi karya dari berbagai sudut dalam ruang virtual.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <BiGlobe className="text-[22px] sm:text-lg shrink-0 mt-1" />
                <p className="text-[16px] sm:text-[18px] lg:text-lg font-poppins font-light">
                  Rasakan suasana pameran seperti di dunia nyata.
                </p>
              </div>
            </div>

            <Button className="w-[50%] px-10 sm:px-14 lg:px-18 py-2 lg:py-3 rounded-md hover:scale-102 duration-500">
              Tutorial
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 3 - Pilih Stan */}
      <section className="bg-secondary-color w-full">
        <div className="autoMid py-[60px] min-h-[740px] flex flex-col gap-10 px-4 sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end w-full pb-6 lg:pb-10">
            <div className="order-2 lg:order-1 flex items-end">
              <p className="font-poppins font-light text-[16px] sm:text-[18px] lg:text-lg w-full max-w-[500px]">
                Kami menyediakan 3 aset bawaan yang dapat anda pilih untuk menampilkan karya-karya anda.
              </p>
            </div>

            <div className="order-1 lg:order-2 text-main-blue flex flex-col lg:items-end text-left lg:text-right">
              <p className="font-poppins font-thin text-4xl sm:text-5xl lg:text-6xl leading-none">
                PILIH DARI BERBAGAI
              </p>
              <p className="font-tilt-wrap font-bold text-4xl sm:text-5xl lg:text-6xl leading-none">STAN</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[50px] w-full">
            <Card
              link="/image/img-stan1.svg"
              title="img stan 1"
              className="w-full aspect-[4/3] object-cover rounded-xl"
            />
            <Card
              link="/image/img-stan2.svg"
              title="img stan 2"
              className="w-full aspect-[4/3] object-cover rounded-xl"
            />
            <div className="sm:col-span-2 lg:col-span-1">
              <Card
                link="/image/img-stan3.svg"
                title="img stan 3"
                className="w-full aspect-[4/3] object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - Penghargaan */}
      <section className="bg-white w-full">
        <div className="autoMid min-h-[460px] py-[84px] px-4 sm:px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start self-start">
            <Card
              link="/image/BestBadge.svg"
              title="best badge"
              className="w-full aspect-[4/3] object-cover rounded-xl self-start"
            />
            <Card
              link="/image/FavoriteBadge.svg"
              title="favorite badge"
              className="w-full aspect-[4/3] object-cover rounded-xl self-start"
            />
          </div>

          <div className="flex flex-col justify-start items-start lg:items-end text-main-blue text-left lg:text-right gap-1 self-start">
            <p className="font-poppins font-thin text-4xl sm:text-5xl lg:text-6xl leading-none">DAPATKAN</p>
            <p className="font-tilt-wrap font-bold text-4xl sm:text-5xl lg:text-6xl leading-none">PENGHARGAAN</p>
          </div>
        </div>
      </section>

      {/* SECTION 5 - Karya Terbaik */}
      <section className="bg-secondary-color w-full">
        <div className="autoMid pt-[68px] pb-[78px] min-h-[580px] grid grid-cols-1 lg:grid-cols-8 gap-10 px-4 sm:px-6 lg:px-0 items-start">
          <div className="order-1 lg:order-2 lg:col-span-5 relative w-full">
            <BestTag className="absolute right-0 top-0 z-10 scale-75 sm:scale-90 lg:scale-100 origin-top-right" />
            <div className="w-full aspect-[3/4] md:aspect-video">
              <Carousel type="DataFotoTerbaik" className="w-full h-full rounded-xl overflow-hidden" />
            </div>
          </div>

          <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-8">
            <div className="text-main-blue">
              <p className="font-poppins font-thin text-4xl sm:text-5xl lg:text-6xl leading-none">KARYA</p>
              <p className="font-tilt-wrap font-bold text-4xl sm:text-5xl lg:text-6xl leading-none">TERBAIK</p>
            </div>

            <div className="grid gap-5 max-w-[500px]">
              {[
                'Dinilai langsung oleh kepala program studi berdasarkan kualitas, kreativitas, inovasi, dan nilai terbaik dari setiap karya.',
                'Setiap program studi memilih satu karya terbaik sebagai perwakilan yang akan ditampilkan di landing page hingga pameran berikutnya.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaStar className="text-[22px] sm:text-lg shrink-0 mt-1" />
                  <p className="text-[16px] sm:text-[18px] lg:text-lg font-poppins font-light text-justify">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - Karya Favorit */}
      <section className="bg-secondary-color w-full">
        <div className="autoMid pt-[68px] pb-[78px] min-h-[580px] grid grid-cols-1 lg:grid-cols-8 gap-10 px-4 sm:px-6 lg:px-0 items-start">
          <div className="order-1 lg:col-span-5 relative rounded-xl shadow-xl overflow-hidden w-full">
            <FavTag className="absolute left-0 top-0 z-10 scale-75 sm:scale-90 lg:scale-100 origin-top-left" />
            <div className="w-full aspect-[3/4] md:aspect-video">
              <Carousel type="DataFotoTerfavorit" className="w-full h-full rounded-xl overflow-hidden" />
            </div>
          </div>

          <div className="order-2 lg:col-span-3 flex flex-col gap-8">
            <div className="text-main-blue flex flex-col items-start lg:items-end text-left lg:text-right">
              <p className="font-poppins font-thin text-4xl sm:text-5xl lg:text-6xl leading-none">KARYA</p>
              <p className="font-tilt-wrap font-bold text-4xl sm:text-5xl lg:text-6xl leading-none">FAVORIT</p>
            </div>

            <div className="grid gap-5">
              {[
                'Ditentukan berdasarkan jumlah likes terbanyak dari seluruh pengunjung sebagai karya terfavorit global dari keseluruhan pameran.',
                'Karya dengan likes tertinggi akan menjadi yang paling populer dan berhak memperoleh medali karya terfavorit utama.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FaStar className="text-[22px] sm:text-lg shrink-0 mt-1" />
                  <p className="text-[16px] sm:text-[18px] lg:text-lg font-poppins font-light text-justify">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - CTA */}
      <section className="bg-white w-full">
        <div className="autoMid min-h-[460px] py-[48px] px-4 sm:px-6 lg:px-0 grid grid-cols-1 lg:grid-cols-10 gap-10 lg:gap-20 items-start">
          <div className="order-1 lg:order-2 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card
              link="/image/img-best1.svg"
              className="w-full aspect-video object-cover rounded-xl shadow-xl"
              title="Best 1"
            />
            <Card
              link="/image/img-best1.svg"
              className="w-full aspect-video object-cover rounded-xl shadow-xl"
              title="Best 2"
            />
          </div>

          <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col gap-8">
            <div className="text-main-blue">
              <p className="font-poppins font-thin text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-none">
                PENASARAN?
              </p>
              <div className="flex items-end gap-3 whitespace-nowrap leading-none">
                <p className="font-tilt-wrap font-bold text-4xl sm:text-5xl lg:text-6xl">COBA</p>
                <p className="font-poppins font-thin text-4xl sm:text-5xl lg:text-6xl">SEKARANG</p>
              </div>
            </div>

            <p className="font-poppins font-light text-[16px] sm:text-lg max-w-[520px]">
              Buat, eksplorasi, dan temukan karya-karya menarik lainnya dengan pengalaman interaktif yang seru dan
              mendalam.
            </p>
          </div>

          <div className="order-3 lg:col-span-10 flex justify-center lg:justify-end w-full">
            <Button
              link="/register"
              className="px-10 sm:px-14 lg:px-18 py-2 lg:py-3 rounded-md hover:scale-110 transition"
            >
              Daftar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
