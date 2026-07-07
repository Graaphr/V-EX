'use client';

import { useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import axios from "@/lib/axios"

export type SemesterType = { id: number; name: string };

interface SelectSemesterProps {
  selected: SemesterType | null;
  onChange: (semester: SemesterType | null) => void;
}

function getSemester(dateStr: string): 'Ganjil' | 'Genap' {
  const bulan = new Date(dateStr).getMonth() + 1;
  return bulan >= 8 || bulan <= 2 ? 'Ganjil' : 'Genap';
}

export default function SelectSemester({ selected, onChange }: SelectSemesterProps) {
  const [semesterList, setSemesterList] = useState<SemesterType[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res  = await axios.get('/api/pameran');
        const json = res.data;

        const unique = [...new Set<string>(
          (json.pameran ?? []).map((item: any) => getSemester(item.date))
        )];

        const ordered = ['Ganjil', 'Genap'].filter((s) => unique.includes(s));

        setSemesterList(ordered.map((name, index) => ({ id: index + 1, name })));
      } catch (err) {
        console.error('Gagal memuat semester:', err);
      }
    }

    load();
  }, []);

  return (
    <div className="w-full max-w-sm">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-full bg-white py-2 pl-[15px] pr-[30px] text-left text-sm font-poppins shadow-xl/20 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-main-blue/60">
            <span className={`block truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
              {selected ? selected.name : 'Semester'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[10px]">
              {selected ? (
                <XMarkIcon
                  className="h-4 w-4 text-gray-500 hover:text-black pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(null);
                  }}
                />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-black" aria-hidden="true" />
              )}
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="overflow-y-auto no-scrollbar absolute z-10 mt-2 max-h-[400px] w-full rounded-xl bg-white py-1 text-sm shadow-xl/20 ring-1 ring-black/5 focus:outline-none transition data-closed:opacity-0 data-leave:duration-100 data-leave:ease-in"
          >
            {semesterList.map((semester) => (
              <ListboxOption
                key={semester.id}
                value={semester}
                className="group relative cursor-pointer select-none py-2.5 pl-3 pr-4 text-gray-900 data-focus:bg-gray-400/20 data-focus:text-black"
              >
                {({ selected: isSelected }) => (
                  <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                    {semester.name}
                  </span>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}