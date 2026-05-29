'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import ALL_EXHIBITIONS from '@/public/data/Pameran.json';

export type ProdiType = {
  id: number;
  name: string;
};

const prodiList: ProdiType[] = Array.from(new Set(ALL_EXHIBITIONS.map((item) => item.category))).map(
  (category, index) => ({
    id: index + 1,
    name: category,
  }),
);

interface SelectProdiProps {
  selected: ProdiType;
  onChange: (prodi: ProdiType) => void;
}

export default function SelectProdi({ selected, onChange }: SelectProdiProps) {
  return (
    <div className="w-full max-w-sm">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          {/* button */}
          <ListboxButton className="relative w-full cursor-pointer rounded-full bg-white py-2 pl-[15px] pr-[30px] text-left text-sm font-poppins shadow-xl/20 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-main-blue/60">
            <span className={`block truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
              {selected ? selected.name : 'Program Studi'}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[10px]">
              <ChevronDownIcon className="h-5 w-5 text-black" />
            </span>
          </ListboxButton>

          {/* options */}
          <ListboxOptions
            transition
            className="absolute z-10 mt-2 max-h-[400px] w-[300px] overflow-y-auto no-scrollbar rounded-xl bg-white py-1 text-sm ring-1 ring-black/5 shadow-xl/20 focus:outline-none transition data-closed:opacity-0 data-leave:duration-100 data-leave:ease-in"
          >
            {prodiList.map((prodi) => (
              <ListboxOption
                key={prodi.id}
                value={prodi}
                className="group relative cursor-pointer select-none py-2.5 pl-3 pr-4 text-gray-900 data-focus:bg-gray-400/20 data-focus:text-black"
              >
                {({ selected: isSelected }) => (
                  <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>{prodi.name}</span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
