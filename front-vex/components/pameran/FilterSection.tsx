"use client";

import SearchBar from "@/components/shared/filter/SearchBar";
import SelectProdi from "@/components/shared/filter/SelectProdi";
import SelectTahun from "@/components/shared/filter/SelectTahun";
import SelectSemester from "@/components/shared/filter/SelectSemester";
import { ProdiType } from "@/components/shared/filter/SelectProdi";
import { TahunType } from "@/components/shared/filter/SelectTahun";
import { SemesterType } from "@/components/shared/filter/SelectSemester";

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
  searchPlaceholder = "Cari Pameran...",
}: FilterSectionProps) {
  return (
    <section className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 pt-4 md:pt-[30px] pb-5 items-stretch lg:items-center justify-between">
      {/* SEARCH */}
      <div className="w-full lg:w-[50%]">
        <SearchBar
          text={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div
        className={`w-full lg:w-[40%] grid gap-3 lg:gap-[30px] ${
          hideProdi ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        {!hideProdi && setSelectedProdi && (
          <SelectProdi
            selected={selectedProdi ?? null}
            onChange={setSelectedProdi}
          />
        )}
        <SelectTahun selected={selectedTahun} onChange={setSelectedTahun} />
        <SelectSemester
          selected={selectedSemester}
          onChange={setSelectedSemester}
        />
      </div>
    </section>
  );
}
