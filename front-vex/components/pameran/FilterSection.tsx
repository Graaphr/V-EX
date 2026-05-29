import SearchBar from '@/components/shared/filter/SearchBar';
import SelectProdi from '@/components/shared/filter/SelectProdi';
import SelectTahun from '@/components/shared/filter/SelectTahun';
import SelectSemester from '@/components/shared/filter/SelectSemester';

export default function FilterSection({
  search,
  setSearch,
  selectedProdi,
  setSelectedProdi,
  selectedTahun,
  setSelectedTahun,
  selectedSemester,
  setSelectedSemester,
}: any) {
  return (
    <section className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 pt-4 md:pt-[30px] pb-5 items-stretch lg:items-center justify-between">
      {/* SEARCH */}
      <div className="w-full lg:w-[50%]">
        <SearchBar text="Cari Pameran..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
      </div>

      {/* FILTERS */}
      <div className="w-full lg:w-[40%] grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-[30px]">
        <SelectProdi selected={selectedProdi} onChange={setSelectedProdi} />
        <SelectTahun selected={selectedTahun} onChange={setSelectedTahun} />
        <SelectSemester selected={selectedSemester} onChange={setSelectedSemester} />
      </div>
    </section>
  );
}
