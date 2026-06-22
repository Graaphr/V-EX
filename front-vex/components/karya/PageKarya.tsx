'use client';

import { useEffect, useMemo, useState } from 'react';
import FilterSection from '@/components/pameran/FilterSection';
import KaryaGrid from '@/components/karya/KaryaGrid';
import { KaryaItem, PameranItem } from '@/types/karya';
import { PRODI_OPTIONS } from '@/types/pameran';
import { ProdiType } from '@/components/shared/filter/SelectProdi';
import { TahunType } from '@/components/shared/filter/SelectTahun';
import { SemesterType } from '@/components/shared/filter/SelectSemester';
import { useAuth } from '@/context/AuthContext';

import { GetKarya, GetKaryaAdmin } from './apiKarya';

interface Props {
  href: string;
}

export default function PageKarya({ href }: Props) {
  const { user, loading: authLoading } = useAuth();

  const isAdmin = user?.role === 'Admin';

  const [karyaList, setKaryaList] = useState<KaryaItem[]>([]);
  const [pameranList, setPameranList] = useState<PameranItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProdi, setSelectedProdi] = useState<ProdiType | null>(null);
  const [selectedTahun, setSelectedTahun] = useState<TahunType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(null);

  const [search, setSearch] = useState('');
  const [pages, setPages] = useState<Record<string, number>>({});

  const PER_PAGE = 4;

  // =============================
  // FETCH KARYA
  // =============================
  useEffect(() => {
    // Tunggu auth selesai loading dulu
    if (authLoading) return;

    const fetchKarya = async () => {
      try {
        // Panggil endpoint sesuai role
        const res = isAdmin ? await GetKaryaAdmin() : await GetKarya();
        const data: KaryaItem[] = res.karya ?? [];
        setKaryaList(data);

        const pameranMap = new Map<number, PameranItem>();
        data.forEach((item) => {
          if (item.pameranId && !pameranMap.has(item.pameranId)) {
            pameranMap.set(item.pameranId, {
              id: item.pameranId,
              title: (item as any).pameranTitle ?? `Pameran #${item.pameranId}`,
            });
          }
        });

        setPameranList(Array.from(pameranMap.values()));
      } catch (err) {
        console.error('Gagal memuat karya:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchKarya();
  }, [authLoading, isAdmin]);

  // =============================
  // FILTER
  // =============================
  const filteredData = useMemo(() => {
    return karyaList.filter((item) => {
      const prodi = PRODI_OPTIONS.find((p) => p.kode === item.category);
      const categoryName = prodi?.nama || item.category;
      const keyword = search.toLowerCase();
      const matchSearch = item.title.toLowerCase().includes(keyword) || categoryName.toLowerCase().includes(keyword);
      const matchProdi = !selectedProdi || categoryName === selectedProdi.name;
      const matchTahun = !selectedTahun || item.year === selectedTahun.name;
      const matchSemester = !selectedSemester || item.semester === selectedSemester.name;
      return matchSearch && matchProdi && matchTahun && matchSemester;
    });
  }, [karyaList, search, selectedProdi, selectedTahun, selectedSemester]);

  // =============================
  // GROUP CATEGORY
  // =============================
  const categories = [...new Set(filteredData.map((i) => i.category).filter((c): c is string => !!c))];

  const changePage = (category: string, type: 'next' | 'prev', totalPages: number) => {
    setPages((prev) => {
      const current = prev[category] || 1;
      const nextPage = type === 'next' ? Math.min(current + 1, totalPages) : Math.max(current - 1, 1);
      return { ...prev, [category]: nextPage };
    });
  };

  // Tampilkan loading selama auth atau data belum siap
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-color">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-main-blue border-t-transparent" />
          <p className="font-poppins text-sm text-gray-500">Memuat karya...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-color font-poppins">
      <section className="bg-main-blue rounded-b-[25px] py-6 md:rounded-b-[40px]">
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

      <main className="autoMid space-y-10 py-10">
        {categories.length === 0 ? (
          <p className="py-20 text-center text-sm text-gray-400">Belum ada karya yang tersedia.</p>
        ) : (
          categories.map((cat) => {
            const data = filteredData.filter((item) => item.category === cat);
            const totalPages = Math.ceil(data.length / PER_PAGE);
            const currentPage = pages[cat] || 1;
            const start = (currentPage - 1) * PER_PAGE;
            const currentData = data.slice(start, start + PER_PAGE);
            const prodi = PRODI_OPTIONS.find((p) => p.kode === cat);
            const categoryName = prodi?.nama || cat;

            return (
              <KaryaGrid
                key={cat}
                category={categoryName}
                data={currentData}
                currentPage={currentPage}
                totalPages={totalPages}
                href={href}
                pameranList={pameranList}
                onPrev={() => changePage(cat, 'prev', totalPages)}
                onNext={() => changePage(cat, 'next', totalPages)}
              />
            );
          })
        )}
      </main>
    </div>
  );
}