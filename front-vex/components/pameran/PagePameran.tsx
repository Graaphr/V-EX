"use client";

import { useMemo, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { GetPameran } from "./apiPameran";

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
  const [emblaRef] = useEmblaCarousel({ align: "start" });

  const [selectedProdi, setSelectedProdi] = useState<ProdiType | null>(null);
  const [selectedTahun, setSelectedTahun] = useState<TahunType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(
    null,
  );
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* FILTER DATA */
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

  // Carousel: startDate antara besok s/d 7 hari ke depan (masih locked)
  const upcomingData = filteredData
    .filter((item) => {
      const start = new Date(item.stats?.startDate);
      return start > today && start <= oneWeekLater;
    })
    .sort(
      (a, b) =>
        new Date(a.stats?.startDate).getTime() -
        new Date(b.stats?.startDate).getTime(),
    )
    .slice(0, 5);

  // Category: sudah dibuka (startDate <= today <= endDate)
  const openData = filteredData.filter((item) => {
    const start = new Date(item.stats?.startDate);
    const end = new Date(item.stats?.endDate);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  });

  // Category hanya dari prodi yang punya pameran terbuka
  const categories = [...new Set(openData.map((i) => i.category))];

  // mengambil data dari API {sudah nyambung dengan API pameran yang ada di route front(data)}
  useEffect(() => {
    async function loadPameran() {
      try {
        const data = await GetPameran(); // Ambil data dari API

        setData(data.pameran || []);
      } catch (error) {
        console.error(error); // Cetak error di console browser
      } finally {
        setLoading(false); // Matikan indikator loading
      }
    }

    loadPameran();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
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
        {categories.map((cat) => (
          <CategorySection key={cat} title={cat}>
            {openData
              .filter((item) => item.category === cat)
              .map((project) => (
                <Link
                  key={project.id}
                  href={`${href}${project.id}`}
                  className="group block"
                >
                  <ProjectCard project={project} />
                </Link>
              ))}
          </CategorySection>
        ))}
      </main>
    </div>
  );
}
