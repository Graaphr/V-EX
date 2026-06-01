'use client';

import { useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

import ProjectCard from '@/components/shared/ui/ProjectCard';
import  { ProdiType } from '@/components/shared/filter/SelectProdi';
import  { TahunType } from '@/components/shared/filter/SelectTahun';
import  { SemesterType } from '@/components/shared/filter/SelectSemester';

import ALL_EXHIBITIONS from '@/public/data/Pameran.json';

import FilterSection from '@/components/pameran/FilterSection';
import CarouselSection from '@/components/pameran/CarouselSection';
import CategorySection from '@/components/pameran/CategorySection';

interface PameranProps {
  href?: string;
}

export default function PagePameran({ href = '/pameran/' }: PameranProps) {
  const [emblaRef] = useEmblaCarousel({ align: 'start' });

  const [selectedProdi, setSelectedProdi] = useState<ProdiType | null>(null);
  const [selectedTahun, setSelectedTahun] = useState<TahunType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(null);
  const [search, setSearch] = useState('');

  /* FILTER DATA */
  const filteredData = useMemo(() => {
    return ALL_EXHIBITIONS.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchProdi = !selectedProdi || item.category === selectedProdi.name;
      const matchTahun = !selectedTahun || item.date.slice(-4) === selectedTahun.name;

      return matchSearch && matchProdi && matchTahun;
    });
  }, [search, selectedProdi, selectedTahun]);

  /* AUTO CATEGORY */
  const categories = [...new Set(filteredData.map((i) => i.category))];

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
            <CarouselSection
              className="w-full text-white"
              data={filteredData.slice(0, 5)}
              href={href}
              emblaRef={emblaRef}
            />
          </div>
        </div>
      </section>

      {/* CATEGORY */}
      <main className="autoMid py-10 space-y-10">
        {categories.map((cat) => (
          <CategorySection key={cat} title={cat}>
            {filteredData
              .filter((item) => item.category === cat)
              .map((project) => (
                <Link key={project.id} href={`${href}${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              ))}
          </CategorySection>
        ))}
      </main>
    </div>
  );
}
