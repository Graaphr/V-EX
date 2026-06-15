"use client";

import { useEffect, useMemo, useState } from "react";
import FilterSection from "@/components/pameran/FilterSection";
import KaryaGrid from "@/components/karya/KaryaGrid";
import { KaryaItem, PameranItem } from "@/types/karya";
import { ProdiType } from "@/components/shared/filter/SelectProdi";
import { TahunType } from "@/components/shared/filter/SelectTahun";
import { SemesterType } from "@/components/shared/filter/SelectSemester";
import url from "@/lib/axios";

interface Props {
  href: string;
  apiUrl: string; // ✅ berbeda per role
}

export default function PageKarya({ href, apiUrl }: Props) {
  const [karyaList, setKaryaList] = useState<KaryaItem[]>([]);
  const [pameranList, setPameranList] = useState<PameranItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProdi, setSelectedProdi] = useState<ProdiType | null>(null);
  const [selectedTahun, setSelectedTahun] = useState<TahunType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [pages, setPages] = useState<Record<string, number>>({});
  const PER_PAGE = 4;

  // =============================
  // FETCH KARYA
  // =============================
  useEffect(() => {
    const fetchKarya = async () => {
      try {
        const res = await url.get(apiUrl);
        const data: KaryaItem[] = res.data.karya ?? [];
        setKaryaList(data);

        // Ekstrak pameran unik dari karya
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
        console.error("Gagal memuat karya:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKarya();
  }, [apiUrl]);

  // =============================
  // FILTER
  // =============================
  const filteredData = useMemo(() => {
    return karyaList.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());
      const matchProdi = !selectedProdi || item.category === selectedProdi.name;
      const matchTahun = !selectedTahun || item.year === selectedTahun.name;
      const matchSemester =
        !selectedSemester || item.semester === selectedSemester.name;
      return matchSearch && matchProdi && matchTahun && matchSemester;
    });
  }, [karyaList, search, selectedProdi, selectedTahun, selectedSemester]);

  const categories = [
    ...new Set(
      filteredData.map((i) => i.category).filter((c): c is string => !!c),
    ),
  ];

  const changePage = (
    category: string,
    type: "next" | "prev",
    totalPages: number,
  ) => {
    setPages((prev) => {
      const current = prev[category] || 1;
      const nextPage =
        type === "next"
          ? Math.min(current + 1, totalPages)
          : Math.max(current - 1, 1);
      return { ...prev, [category]: nextPage };
    });
  };

  if (loading) {
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
        {categories.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-20">
            Belum ada karya yang tersedia.
          </p>
        ) : (
          categories.map((cat) => {
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
                pameranList={pameranList}
                onPrev={() => changePage(cat, "prev", totalPages)}
                onNext={() => changePage(cat, "next", totalPages)}
              />
            );
          })
        )}
      </main>
    </div>
  );
}
