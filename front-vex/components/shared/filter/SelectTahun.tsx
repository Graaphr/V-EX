'use client';

import { useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import axios from "@/lib/axios"

export type TahunType = {
  id: number;
  name: string;
};

interface SelectTahunProps {
  selected: TahunType | null;
  onChange: (tahun: TahunType | null) => void;
}

export default function SelectTahun({ selected, onChange }: SelectTahunProps) {
  const [tahunList, setTahunList] = useState<TahunType[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res  = await axios.get('/api/pameran');
        const json = res.data;

        const unique = [...new Set<string>(
          (json.pameran ?? []).map((item: any) => item.date.slice(0, 4))
        )]
          .sort((a, b) => Number(b) - Number(a));

        setTahunList(unique.map((name, index) => ({ id: index + 1, name })));
      } catch (err) {
        console.error('Gagal memuat tahun:', err);
      }
    }

    load();
  }, []);

  return (
    <div className="w-full max-w-sm">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          {/* BUTTON */}
          <ListboxButton className="py-2 pl-[15px] pr-[30px] relative w-full cursor-pointer rounded-full bg-white text-left text-sm font-poppins shadow-xl/20 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-main-blue/60">
            <span className={`block truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
              {selected ? selected.name : 'Tahun'}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[10px]">
              {selected ? (
                <XMarkIcon
                  className="h-4 w-4 text-gray-500 hover:text-black pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(null); // ← reset filter
                  }}
                />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-black" />
              )}
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