"use client";

import { useMemo, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { GetPameran } from "./apiPameran";
import { useAuth } from "@/context/AuthContext";

import ProjectCard from "@/components/shared/ui/ProjectCard";
import { ProdiType } from "@/components/shared/filter/SelectProdi";
import { TahunType } from "@/components/shared/filter/SelectTahun";
import { SemesterType } from "@/components/shared/filter/SelectSemester";

import FilterSection from "@/components/pameran/FilterSection";
import CarouselSection from "@/components/pameran/CarouselSection";
import CategorySection from "@/components/pameran/CategorySection";

interface PameranProps {
  href?: string;
}

export default function PagePameran({ href = "/pameran/" }: PameranProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [emblaRef] = useEmblaCarousel({ align: "start" });
  const [selectedProdi, setSelectedProdi] = useState<ProdiType | null>(null);
  const [selectedTahun, setSelectedTahun] = useState<TahunType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(
    null,
  );
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPameran() {
      try {
        const res = await GetPameran();
        setData(res.pameran || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadPameran();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchProdi = !selectedProdi || item.category === selectedProdi.name;
      const matchTahun =
        !selectedTahun ||
        new Date(item.date).getFullYear().toString() === selectedTahun.name;
      return matchSearch && matchProdi && matchTahun;
    });
  }, [data, search, selectedProdi, selectedTahun]);

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  oneWeekLater.setHours(23, 59, 59, 999);

  // Carousel: admin → semua yang belum mulai, user → 1-7 hari ke depan
  const upcomingData = filteredData
    .filter((item) => {
      const start = new Date(item.stats?.startDate);
      if (isAdmin) return start > today;
      return start > today && start <= oneWeekLater;
    })
    .sort(
      (a, b) =>
        new Date(a.stats?.startDate).getTime() -
        new Date(b.stats?.startDate).getTime(),
    )
    .slice(0, 5);

  // Category: admin → semua, user → hanya yang sedang berlangsung
  const openData = filteredData.filter((item) => {
    if (isAdmin) return true;
    const start = new Date(item.stats?.startDate);
    const end = new Date(item.stats?.endDate);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  });

  const categories = [...new Set(openData.map((i) => i.category))];

  // Jadi ini:
if (loading) {
  return (
    <div className="min-h-screen bg-secondary-color font-poppins">
      {/* HERO SKELETON */}
      <section className="bg-main-blue rounded-b-[25px] md:rounded-b-[40px] py-6">
        <div className="autoMid">
          {/* Filter bar skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="h-[42px] rounded-xl bg-white/20 animate-pulse flex-1" />
            <div className="h-[42px] rounded-xl bg-white/20 animate-pulse w-full sm:w-[140px]" />
            <div className="h-[42px] rounded-xl bg-white/20 animate-pulse w-full sm:w-[140px]" />
          </div>

          {/* "Segera Hadir" title skeleton */}
          <div className="h-[28px] md:h-[36px] w-[180px] rounded-lg bg-white/20 animate-pulse mb-5 md:mb-6" />

          {/* Carousel skeleton */}
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[200px] sm:min-w-[240px] h-[120px] rounded-xl bg-white/20 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SKELETON */}
      <main className="autoMid py-10 space-y-10">
        {Array.from({ length: 2 }).map((_, catIdx) => (
          <div key={catIdx}>
            {/* Category title skeleton */}
            <div className="h-[22px] w-[120px] rounded-lg bg-gray-200 animate-pulse mb-4" />

            {/* Cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[80px] rounded-xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-secondary-color font-poppins">
      {/* HERO WRAPPER */}
      <section className="bg-main-blue rounded-b-[25px] md:rounded-b-[40px] py-6">
        <div className="autoMid">
          <FilterSection
            search={search}
            setSearch={setSearch}
            selectedProdi={selectedProdi}
            setSelectedProdi={setSelectedProdi}
            selectedTahun={selectedTahun}
            setSelectedTahun={setSelectedTahun}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
          />
          <div className="relative">
            <h2 className="mb-5 md:mb-6 text-2xl sm:text-3xl md:text-[40px] text-white font-semibold border-b-2 md:border-b-3 pb-2">
              SEGERA HADIR
            </h2>

            {upcomingData.length === 0 ? (
              <p className="text-white/60 text-sm py-4">
                Tidak ada pameran dalam waktu dekat.
              </p>
            ) : (
              <CarouselSection
                className="w-full text-white"
                data={upcomingData}
                href={href}
                emblaRef={emblaRef}
              />
            )}
          </div>
        </div>
      </section>

      {/* CATEGORY */}
      <main className="autoMid py-10 space-y-10">
        {categories.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">
            {isAdmin
              ? "Belum ada pameran."
              : "Tidak ada pameran yang sedang berlangsung."}
          </p>
        ) : (
          categories.map((cat) => (
            <CategorySection key={cat} title={cat}>
              {openData
                .filter((item) => item.category === cat)
                .map((project) => (
                  <Link
                    key={project.id}
                    href={`${href}${project.slug}`}
                    className="group block"
                  >
                    <ProjectCard project={project} />
                  </Link>
                ))}
            </CategorySection>
          ))
        )}
      </main>
    </div>
  );
}
