// @/components/dashboard/ketua-pbl/karya/KaryaKetuaPBL.tsx
'use client';

import { useMemo, useState } from 'react';
import FilterSection from '@/components/pameran/FilterSection';
import KaryaGrid from '@/components/karya/KaryaGrid';
import { KaryaItem } from '@/types/karya';
import { ProdiType } from '@/components/shared/filter/SelectProdi';
import { TahunType } from '@/components/shared/filter/SelectTahun';
import { SemesterType } from '@/components/shared/filter/SelectSemester';

import ALL_KARYA from '@/public/data/Karya.json';
import ALL_PAMERAN from '@/public/data/Pameran.json';

interface Props {
  href: string;
}

export default function PageKarya({ href  }: Props) {
  const [selectedProdi, setSelectedProdi] = useState<ProdiType | null>(null);
  const [selectedTahun, setSelectedTahun] = useState<TahunType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(null);
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState<Record<string, number>>({});
  const PER_PAGE = 6;

  const changePage = (category: string, type: 'next' | 'prev', totalPages: number) => {
    setPages((prev) => {
      const current = prev[category] || 1;
      const nextPage = type === 'next' ? Math.min(current + 1, totalPages) : Math.max(current - 1, 1);
      return { ...prev, [category]: nextPage };
    });
  };

  const filteredData = useMemo(() => {
    return (ALL_KARYA as KaryaItem[]).filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());

      const matchProdi = !selectedProdi || item.category === selectedProdi.name;
      const matchTahun = !selectedTahun || item.year === selectedTahun.name;
      const matchSemester = !selectedSemester || item.semester === selectedSemester.name;

      return matchSearch && matchProdi && matchTahun && matchSemester;
    });
  }, [search, selectedProdi, selectedTahun, selectedSemester]);

  const categories = [
    ...new Set(filteredData.map((i) => i.category).filter((cat): cat is string => cat !== undefined)),
  ];

  return (
    <div className="min-h-screen bg-secondary-color font-poppins">
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
        </div>
      </section>

      <main className="autoMid py-10 space-y-10">
        {categories
          .filter((cat): cat is string => cat !== undefined)
          .map((cat) => {
            const data = filteredData.filter((item) => item.category === cat);
            const totalPages = Math.ceil(data.length / PER_PAGE);
            const currentPage = pages[cat] || 1;
            const start = (currentPage - 1) * PER_PAGE;
            const currentData = data.slice(start, start + PER_PAGE);

            return (
              <KaryaGrid
                key={cat}
                category={cat}
                data={currentData}
                currentPage={currentPage}
                totalPages={totalPages}
                href={href}
                pameranList={ALL_PAMERAN}
                onPrev={() => changePage(cat, 'prev', totalPages)}
                onNext={() => changePage(cat, 'next', totalPages)}
              />
            );
          })}
      </main>
    </div>
  );
}
