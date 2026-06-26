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
import { GetKarya, GetKaryaAdmin, GetKaryaKps } from './apiKarya';

interface Props {
  href: string;
}

export default function PageKarya({ href }: Props) {
  const { user, loading: authLoading } = useAuth();

  const isAdmin = user?.role === 'Admin';
  const isKps   = user?.role === 'KPS';

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
  // FETCH
  // =============================
  useEffect(() => {
    if (authLoading) return;

    const fetchKarya = async () => {
      try {
        const res = isKps
          ? await GetKaryaKps()
          : isAdmin
          ? await GetKaryaAdmin()
          : await GetKarya();

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
  }, [authLoading, isAdmin, isKps]);

  // =============================
  // PAGINATION HELPER
  // =============================
  const changePage = (key: string, type: 'next' | 'prev', totalPages: number) => {
    setPages((prev) => {
      const current = prev[key] || 1;
      const next =
        type === 'next' ? Math.min(current + 1, totalPages) : Math.max(current - 1, 1);
      return { ...prev, [key]: next };
    });
  };

  // =============================
  // DATA KPS — group by pameran
  // =============================
  const karyaByPameran = useMemo(() => {
    if (!isKps) return [];

    const keyword = search.toLowerCase();
    const filtered = karyaList.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        (item.pameranTitle ?? '').toLowerCase().includes(keyword)
    );

    const map = new Map<number, { pameran: PameranItem; karya: KaryaItem[] }>();
    filtered.forEach((item) => {
      if (!item.pameranId) return;
      if (!map.has(item.pameranId)) {
        const found = pameranList.find((p) => p.id === item.pameranId);
        map.set(item.pameranId, {
          pameran: found ?? {
            id: item.pameranId,
            title: item.pameranTitle ?? `Pameran #${item.pameranId}`,
          },
          karya: [],
        });
      }
      map.get(item.pameranId)!.karya.push(item);
    });

    return Array.from(map.values());
  }, [isKps, karyaList, pameranList, search]);

  // =============================
  // DATA NON-KPS — group by category
  // =============================
  const filteredData = useMemo(() => {
    if (isKps) return [];
    return karyaList.filter((item) => {
      const prodi = PRODI_OPTIONS.find((p) => p.kode === item.category);
      const categoryName = prodi?.nama || item.category;
      const keyword = search.toLowerCase();
      const matchSearch =
        item.title.toLowerCase().includes(keyword) ||
        categoryName.toLowerCase().includes(keyword);
      const matchProdi = !selectedProdi || categoryName === selectedProdi.name;
      const matchTahun = !selectedTahun || item.year === selectedTahun.name;
      const matchSemester = !selectedSemester || item.semester === selectedSemester.name;
      return matchSearch && matchProdi && matchTahun && matchSemester;
    });
  }, [isKps, karyaList, search, selectedProdi, selectedTahun, selectedSemester]);

  const categories = [
    ...new Set(filteredData.map((i) => i.category).filter((c): c is string => !!c)),
  ];

  const kpsProdiNama =
    PRODI_OPTIONS.find((p) => p.kode === user?.program_studi)?.nama ||
    user?.program_studi ||
    'Prodi Anda';

  // =============================
  // LOADING
  // =============================
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

  // =============================
  // RENDER KPS
  // =============================
  if (isKps) {
    return (
      <div className="min-h-screen bg-secondary-color font-poppins">
        <section className="bg-main-blue rounded-b-[25px] md:rounded-b-[40px] py-6">
          <div className="autoMid">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 md:pt-[30px] pb-5">
              <div>
                <p className="text-xs font-medium text-blue-200 uppercase tracking-widest mb-1">
                  Karya Mahasiswa
                </p>
                <h1 className="text-xl font-bold text-white">{kpsProdiNama}</h1>
              </div>
              <div className="w-full lg:w-[50%]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari karya atau pameran..."
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </div>
        </section>

        <main className="autoMid space-y-10 py-10">
          {karyaByPameran.length === 0 ? (
            <p className="py-20 text-center text-sm text-gray-400">
              Belum ada karya yang tersedia.
            </p>
          ) : (
            karyaByPameran.map(({ pameran, karya }) => {
              const key = `pameran-${pameran.id}`;
              const totalPages = Math.ceil(karya.length / PER_PAGE);
              const currentPage = pages[key] || 1;
              const start = (currentPage - 1) * PER_PAGE;
              const currentData = karya.slice(start, start + PER_PAGE);

              return (
                <KaryaGrid
                  key={pameran.id}
                  category={pameran.title}
                  data={currentData}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  href={href}
                  pameranList={pameranList}
                  onPrev={() => changePage(key, 'prev', totalPages)}
                  onNext={() => changePage(key, 'next', totalPages)}
                />
              );
            })
          )}
        </main>
      </div>
    );
  }

  // =============================
  // RENDER DEFAULT (Admin / Ketua PBL)
  // =============================
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

      <main className="autoMid space-y-10 py-10">
        {categories.length === 0 ? (
          <p className="py-20 text-center text-sm text-gray-400">
            Belum ada karya yang tersedia.
          </p>
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