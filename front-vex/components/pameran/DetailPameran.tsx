"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaPlay,
  FaInstagram,
  FaYoutube,
  FaFacebookSquare,
  FaRegCalendarAlt,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { useParams } from "next/navigation";

import { Button } from "../shared/ui/Button";
import { Pameran } from "@/types/pameran";
import { GetDetailPameran } from "./apiPameran";

interface Status {
  isLogin?: boolean;
 
}

export default function PageDetailPameran({ isLogin = false }: Status) {

  // SESUDAH (sesuai nama folder [slug] yang sebenarnya)
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [pameran, setPameran] = useState<Pameran | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      try {
        const data = await GetDetailPameran(slug as string);

        if (data.status !== "success")
          throw new Error(data.message ?? "Pameran tidak ditemukan");

        setPameran(data.pameran);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]); // <-- hanya jalan ulang kalau slug berubah

  // ─── Loading ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Memuat pameran...
      </div>
    );
  }

  // ─── Error / tidak ditemukan ───
  if (error || !pameran) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error ?? "Pameran tidak ditemukan."}
      </div>
    );
  }

  const {
    title,
    subtitle,
    date,
    bannerImage,
    bannerLarge,
    bannerMedium,
    description,
    stats,
    institution,
  } = pameran;


  const isOpen = isLogin;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-gray-800 select-none">
      <main className="relative pb-16 bg-white">
        {/* BANNER */}
        <div className="hidden md:block relative w-full h-[60vh] overflow-hidden">
          <img
            src={bannerLarge || bannerImage}
            alt="Banner"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>

        {/* CONTENT */}
        <div className="autoMid relative z-10 py-6 md:py-8">
          <div className="flex flex-col md:flex-row gap-8 relative">
            {/* MOBILE TITLE + EDIT */}
            <div className="md:hidden relative pr-16">
              <div className="absolute right-0 top-0 flex items-center gap-2 z-20">
              
                {isLogin && (
                  <Link
                    href={`/admin/pameran/edit/${pameran.slug}`}
                    className="bg-white border rounded-full p-2 shadow-md"
                  >
                    <HiPencilAlt size={18} />
                  </Link>
                )}
              </div>
              <h1 className="text-4xl font-extrabold uppercase">{title}  <StatusBadge isOpen={isOpen} /></h1>
              <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
              <div className="flex items-center gap-4 text-gray-600 mt-2 text-sm">
                <FaRegCalendarAlt className="text-main-blue" />
                <span>{date}</span>
              </div>
            </div>

            {/* POSTER */}
            <div className="w-full md:w-[55%] lg:w-[100%]">
              <img
                src={bannerMedium || bannerImage}
                alt={title}
                className="w-full h-full max-h-[200px] md:max-h-[280px] lg:max-h-[340px] object-cover rounded-lg shadow-lg/40"
              />
            </div>

            {/* RIGHT */}
            <div className="w-full flex flex-col justify-between relative">
              {/* DESKTOP EDIT */}
              {isLogin && (
                <Link
                  href={`/admin/pameran/edit/${pameran.slug}`}
                  className="absolute right-0 top-0 hidden md:flex bg-white border-2 rounded-full p-2 shadow-lg/10 hover:scale-120 transition-all duration-300"
                >
                  <HiPencilAlt size={24} />
                </Link>
              )}

              {/* DESKTOP TITLE */}
              <div className="hidden md:block mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-extrabold uppercase">{title}</h1>
                  <StatusBadge isOpen={isOpen} />
                </div>
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
                    link={`/exhibition/${pameran.slug}`}
                    className="w-full sm:w-auto min-w-[100%] py-5 px-38 flex items-center justify-center rounded-md"
                  >
                    <FaPlay />
                  </Button>
                ) : (
                  <div className="w-full sm:w-auto min-w-[100%] py-5 px-38 bg-gray-300 text-gray-500 rounded-md flex justify-center items-center">
                    <FaPlay />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10">
            <div className="space-y-6 text-gray-600 leading-relaxed">
              {description.map((section: any, index: number) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {section.title}
                  </h3>
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
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaFacebookSquare />
              </a>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-8 py-4 border-y">
            <div className="hidden md:flex justify-between divide-x">
              <Stat title="Total Suka" value={stats.likes} />
              <Stat title="Total Karya" value={stats.karya} />
              <Stat title="Tanggal Buka" value={stats.startDate} />
              <Stat title="Tanggal Tutup" value={stats.endDate} />
              <Stat title="Program Studi" value={stats.studyLevel} />
            </div>
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

function StatusBadge({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 w-8 h-8 px-2.5 py-1 rounded-full text-white text-xs font-semibold ${
        isOpen ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {isOpen ? <FaLockOpen size={12} /> : <FaLock size={12} />}
    </div>
  );
}