'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import ALL_EXHIBITIONS from '@/public/data/Pameran.json';

export type TahunType = {
  id: number;
  name: string;
};

const tahunList: TahunType[] = Array.from(
  new Set(
    ALL_EXHIBITIONS.map(
      (item) => item.date.slice(-4), // ambil 4 digit terakhir
    ),
  ),
)
  .sort((a, b) => Number(b) - Number(a)) // terbaru dulu
  .map((tahun, index) => ({
    id: index + 1,
    name: tahun,
  }));

interface SelectTahunProps {
  selected: TahunType;
  onChange: (tahun: TahunType) => void;
}

export default function SelectTahun({ selected, onChange }: SelectTahunProps) {
  return (
    <div className="w-full max-w-sm">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          {/* BUTTON */}
          <ListboxButton className="py-2 pl-[15px] pr-[30px] relative w-full cursor-pointer rounded-full bg-white text-left text-sm font-poppins shadow-xl/20 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-main-blue/60">
            <span className={`block truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
              {selected ? selected.name : 'Tahun Ajaran'}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[10px]">
              <ChevronDownIcon className="h-5 w-5 text-black" />
            </span>
          </ListboxButton>

          {/* OPTIONS */}
          <ListboxOptions className="overflow-y-auto no-scrollbar absolute z-10 mt-2 w-full max-h-[300px] rounded-xl bg-white py-1 text-sm shadow-xl/20 ring-1 ring-black/5 focus:outline-none">
            {tahunList.map((tahun) => (
              <ListboxOption
                key={tahun.id}
                value={tahun}
                className="cursor-pointer select-none py-2.5 px-4 text-gray-900 data-focus:bg-gray-400/20"
              >
                {tahun.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
