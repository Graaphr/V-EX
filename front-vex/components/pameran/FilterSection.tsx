'use client';

import { useState } from 'react';

import SearchBar from '@/components/shared/filter/SearchBar';
import SelectProdi from '@/components/shared/filter/SelectProdi';
import SelectTahun from '@/components/shared/filter/SelectTahun';
import SelectSemester from '@/components/shared/filter/SelectSemester';

import { ProdiType } from '@/components/shared/filter/SelectProdi';
import { TahunType } from '@/components/shared/filter/SelectTahun';
import { SemesterType } from '@/components/shared/filter/SelectSemester';

import { HiAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2';

interface FilterSectionProps {
  search: string;
  setSearch: (v: string) => void;
  selectedProdi?: ProdiType | null;
  setSelectedProdi?: (v: ProdiType | null) => void;
  selectedTahun: TahunType | null;
  setSelectedTahun: (v: TahunType | null) => void;
  selectedSemester: SemesterType | null;
  setSelectedSemester: (v: SemesterType | null) => void;
  hideProdi?: boolean;
  searchPlaceholder?: string;
}

export default function FilterSection({
  search,
  setSearch,
  selectedProdi,
  setSelectedProdi,
  selectedTahun,
  setSelectedTahun,
  selectedSemester,
  setSelectedSemester,
  hideProdi = false,
  searchPlaceholder = 'Cari Pameran...',
}: FilterSectionProps) {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <>
      {/* ================= MAIN ================= */}
      <section className="w-full pt-4 md:pt-[30px] pb-5">
        {/* MOBILE */}
        <div className="flex md:hidden items-center gap-3">
          {/* SEARCH */}
          <div className="flex-1">
            <SearchBar text={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* FILTER BUTTON */}
          <button
            onClick={() => setOpenFilter(true)}
            className="min-w-[50px] h-[40px] bg-white rounded-full shadow-xl/20 flex items-center justify-center active:scale-95 transition
            "
          >
            <HiAdjustmentsHorizontal size={24} className="text-main-blue" />
          </button>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-center justify-between">
          {/* SEARCH */}
          <div className="w-full lg:w-[50%]">
            <SearchBar text={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* FILTERS */}
          <div
            className={`w-full lg:w-[40%] grid gap-3 lg:gap-[30px] ${
              hideProdi ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
            }`}
          >
            {!hideProdi && setSelectedProdi && (
              <SelectProdi selected={selectedProdi ?? null} onChange={setSelectedProdi} />
            )}

            <SelectTahun selected={selectedTahun} onChange={setSelectedTahun} />

            <SelectSemester selected={selectedSemester} onChange={setSelectedSemester} />
          </div>
        </div>
      </section>

      {/* ================= MOBILE FILTER MODAL ================= */}
      <div
        className={`
          fixed inset-0 z-50 md:hidden
          transition-all duration-300
          ${openFilter ? 'visible bg-black/40' : 'invisible bg-black/0'}
        `}
      >
        {/* BACKDROP */}
        <div className="absolute inset-0" onClick={() => setOpenFilter(false)} />

        {/* SHEET */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[30px] p-5 transition-transform duration-300
            ${openFilter ? 'translate-y-0' : 'translate-y-full'}
          `}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold">Filter Pameran</h2>

              <p className="text-sm text-gray-500">Pilih filter yang ingin digunakan</p>
            </div>

            <button
              onClick={() => setOpenFilter(false)}
              className=" w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center
              "
            >
              <HiXMark size={22} />
            </button>
          </div>

          {/* FILTER CONTENT */}
          <div className="flex flex-col gap-4">
            {!hideProdi && setSelectedProdi && (
              <SelectProdi selected={selectedProdi ?? null} onChange={setSelectedProdi} />
            )}

            <SelectTahun selected={selectedTahun} onChange={setSelectedTahun} />

            <SelectSemester selected={selectedSemester} onChange={setSelectedSemester} />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setOpenFilter(false)}
            className="w-full mt-6 h-[50px] rounded-2xl bg-main-blue text-white font-semibold active:scale-95 transition
            "
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </>
  );
}
