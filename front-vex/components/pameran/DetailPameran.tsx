'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { FaPlay, FaInstagram, FaYoutube, FaFacebookSquare, FaRegCalendarAlt } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { useParams } from 'next/navigation';

import { Button } from '../ui/Button';
import { Pameran } from '@/types/pameran';
import pameranData from '@/public/data/Pameran.json';

interface Status {
  isLogin?: boolean;
}

export default function DetailPameran({ isLogin = false }: Status) {
  const params = useParams();
  const id = params.id as string;

const exhibitionData = useMemo(() => {
  return (pameranData as Pameran[]).find((item) => item.id === Number(id)) ?? (pameranData as Pameran[])[0];
}, [id]);

  const { title, subtitle, date, bannerImage, description, stats, institution } = exhibitionData;

  const posterImage = bannerImage;
  const today = new Date();
  const openDate = convertDate(stats.startDate);
  const closeDate = convertDate(stats.endDate);
  const isBeforeOpen = today < openDate;
  const isAfterClose = today > closeDate;
  const isOpen = !isBeforeOpen && !isAfterClose;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800 select-none">
      <main className="relative pb-16 bg-white">
        {/* BANNER */}
        <div className="hidden md:block relative w-full h-[60vh] overflow-hidden">
          <img src={bannerImage} alt="Banner" className="w-full h-full object-cover object-center opacity-80" />

          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>

        {/* CONTENT */}
        <div className="autoMid relative z-10 py-6 md:py-8">
          {/* TOP */}
          <div className="flex flex-col md:flex-row gap-8 relative">
            {/* MOBILE TITLE + EDIT FIX */}
            <div className="md:hidden relative pr-14">
              {isLogin && (
                <Link
                  href={`/admin/pameran/edit/${id}`}
                  className="absolute right-0 top-0 bg-white border rounded-full p-2 shadow-md z-20"
                >
                  <HiPencilAlt size={18} />
                </Link>
              )}

              <h1 className="text-2xl font-bold uppercase leading-tight">{title}</h1>

              <p className="text-gray-500 text-sm mt-1">{subtitle}</p>

              <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
                <FaRegCalendarAlt />
                <span>{date}</span>
              </div>
            </div>

            {/* POSTER */}
            <div className="w-full md:w-[55%] lg:w-[100%]">
              <img
                src={posterImage}
                alt={title}
                className="w-full h-full min-h-[100px] md:min-h-[168px] lg:min-h-[300px] object-cover rounded-lg shadow-lg/40"
              />
            </div>

            {/* RIGHT */}
            <div className="w-full flex flex-col justify-between relative">
              {/* DESKTOP EDIT */}
              {isLogin && (
                <Link
                  href={`/admin/pameran/edit/${id}`}
                  className="absolute right-0 top-0 hidden md:flex bg-white border-2 rounded-full p-2 shadow-lg/10 hover:scale-120 transition-all duration-300"
                >
                  <HiPencilAlt size={24} />
                </Link>
              )}

              {/* DESKTOP TITLE */}
              <div className="hidden md:block mb-6">
                <h1 className="text-4xl font-extrabold uppercase">{title}</h1>

                <p className="text-gray-500 mt-2">{subtitle}</p>

                <div className="flex items-center gap-2 mt-3">
                  <FaRegCalendarAlt className="text-main-blue" />
                  <span>{date}</span>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isOpen ? (
                  <Button
                    link={`/exhibition/${id}`}
                    className="w-full sm:w-auto min-w-[140px] py-5 px-38 flex items-center justify-center rounded-md"
                  >
                    <FaPlay />
                  </Button>
                ) : (
                  <div className="w-full sm:w-auto min-w-[140px] py-5 px-38 bg-gray-300 text-gray-500 rounded-md flex justify-center items-center">
                    <FaPlay />
                  </div>
                )}

                <div
                  className={`w-full sm:w-auto min-w-[140px] py-4 px-10 rounded-md text-white font-bold text-center ${
                    isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {isOpen ? 'BUKA' : 'TUTUP'}
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Deskripsi</h2>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              {description.map((section: any, index: number) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-800 mb-1">{section.title}</h3>

                  {section.content && <p>{section.content}</p>}

                  {section.list && (
                    <ul className="list-disc pl-5 space-y-1">
                      {section.list.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SOCIAL */}
          <div className="mt-12 flex justify-end items-center gap-10">
            <p className="font-bold text-main-blue">{institution}</p>

            <div className="flex gap-4 text-main-blue text-2xl">
              <FaInstagram />
              <FaYoutube />
              <FaFacebookSquare />
            </div>
          </div>

          {/* STATS */}
          <div className="mt-8 py-4 border-y">
            {/* DESKTOP */}
            <div className="hidden md:flex justify-between divide-x">
              <Stat title="Total Suka" value={stats.likes} />
              <Stat title="Total Karya" value={stats.karya} />
              <Stat title="Tanggal Buka" value={stats.startDate} />
              <Stat title="Tanggal Tutup" value={stats.endDate} />
              <Stat title="Program Studi" value={stats.studyLevel} />
            </div>

            {/* MOBILE */}
            <div className="md:hidden space-y-3">
              <Row title="Total Suka" value={stats.likes} />
              <Row title="Total Karya" value={stats.karya} />
              <Row title="Tanggal Buka" value={stats.startDate} />
              <Row title="Tanggal Tutup" value={stats.endDate} />
              <Row title="Program Studi" value={stats.studyLevel} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* HELPER */

function convertDate(value: string) {
  const split = value.split('/');

  return new Date(Number(split[2]), Number(split[1]) - 1, Number(split[0]));
}

function Stat({ title, value }: { title: string; value: any }) {
  return (
    <div className="flex-1 px-4 text-center">
      <p className="text-xs text-gray-400 uppercase">{title}</p>

      <p className="font-semibold mt-1">{value}</p>
    </div>
  );
}

function Row({ title, value }: { title: string; value: any }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{title}</span>

      <span className="font-bold">{value}</span>
    </div>
  );
}
