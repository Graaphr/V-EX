import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

import { LogoWhite, LinkAkses, LinkAksesEks } from '@/components/shared/ui/Components';

import { VectorBox } from '@/components/shared/ui/BoxModel';
import '@/app/globals.css';

export default function Footer() {
  return (
    <footer className="w-full bg-main-blue text-white overflow-hidden">
      <div className="relative flex flex-col lg:flex-row items-stretch">
        {/* LEFT - Logo (bawah di HP, kiri di desktop) */}
        <div className="w-full lg:w-[45%] relative px-5 sm:px-8 lg:px-10 pt-10 pb-8 flex flex-col overflow-hidden min-h-[260px] lg:min-h-[360px] order-2 lg:order-1">
          {/* logo */}
          <div className="relative z-20">
            <LogoWhite />
          </div>

          {/* copyright */}
          <div className="mt-10 lg:mt-auto lg:pb-2 relative z-20">
            <p className="text-xs sm:text-sm  md:text-base text-white font-bold tracking-wide leading-relaxed">
              All rights reserved. V-EX (Virtual Exhibition)
            </p>
          </div>

          {/* vector */}
          <div className="absolute -bottom-24 -left-20 sm:-bottom-28 sm:-left-16 lg:bottom-[-140px] lg:left-[-120px] opacity-20 lg:opacity-80 pointer-events-none z-0">
            <VectorBox className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[420px] lg:h-[420px]" />
          </div>
        </div>

        {/* RIGHT - Links (atas di HP, kanan di desktop) */}
        <div className="w-full border-t-[5px] border-gray-300 lg:border-none lg:w-[55%] lg:bg-white bg-gray-200 text-gray-800 rounded-b-[20px] sm:rounded-t-none lg:rounded-t-none lg:rounded-tl-[60px] px-5 sm:px-8 lg:px-16 py-8 sm:py-10 flex flex-col shadow-2xl lg:mt-10 min-h-[280px] order-1 lg:order-2">
          {/* links */}
          <div className="grid mt-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div >
              <h3 className="font-extrabold text-main-blue mb-3 text-lg sm:text-xl tracking-wider">Solusi</h3>
              <ul className="text-gray-500 space-y-2 text-sm sm:text-base">
                <li>
                  <LinkAkses link={'/pameran'} title={'Pameran'} />
                </li>
                <li>
                  <LinkAkses link={'/#stan'} title={'Stan Pameran'} />
                </li>
                <li>
                  <LinkAkses link={'/#karya'} title={'Karya'} />
                </li>
                <li>
                  <LinkAkses link={'/#akun'} title={'Akun'} />
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-extrabold text-main-blue mb-4 text-lg sm:text-xl tracking-wider">Sumber</h3>
              <ul className="text-gray-500 space-y-2 text-sm sm:text-base">
                <li>
                  <LinkAkses link={'/faqs'} title={'FAQs'} />
                </li>
                <li>
                  <LinkAkses link={'/petunjuk'} title={'Petunjuk'} />
                </li>
                <li>
                  <LinkAkses link={'/pelayanan'} title={'Pelayanan'} />
                </li>
                {/* <li>
                  <LinkAkses link={'/'} title={'Harga'} />
                </li> */}
              </ul>
            </div>

            <div>
              <h3 className="font-extrabold text-main-blue mb-4 text-lg sm:text-xl tracking-wider">Hukum</h3>
              <ul className="text-gray-500 space-y-2 text-sm sm:text-base">
                <li>
                  <LinkAksesEks link={'/syarat-ketentuan'} title="Syarat & Ketentuan" />
                </li>
                <li>
                  <LinkAksesEks link={'/kebijakan-privasi'} title="Kebijakan Privasi" />
                </li>
                <li>
                  <LinkAksesEks link={'/hubungi-kami'} title="Hubungi Kami" />
                </li>
              </ul>
            </div>
          </div>

          {/* social */}
          <div className=" mt-8 lg:mt-9 flex flex-wrap justify-center sm:justify-start lg:justify-end items-center  gap-4 sm:gap-5 text-main-blue">
            {/* <LinkAksesEks link={'/'}>
              <FaLinkedin className="w-8 h-8 sm:w-10 sm:h-10 hover:scale-125 transition-all cursor-pointer" />
            </LinkAksesEks> */}
            <LinkAksesEks link="https://www.instagram.com/virtualexhibition204/">
              <FaInstagram className="w-8 h-8 sm:w-10 sm:h-10 hover:scale-125 transition-all cursor-pointer" />
            </LinkAksesEks>
            <LinkAksesEks link={'https://youtube.com/@pbl-trpl204?si=kWdrqlvURisWyhHv'}>
              <FaYoutube className="w-8 h-8 sm:w-10 sm:h-10 hover:scale-125 transition-all cursor-pointer" />
            </LinkAksesEks>
            {/* <LinkAksesEks link={'/'}>
              <FaFacebook className="w-8 h-8 sm:w-10 sm:h-10 hover:scale-125 transition-all cursor-pointer" />
            </LinkAksesEks> */}
          </div>
        </div>
      </div>
    </footer>
  );
}