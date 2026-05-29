'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';

export type SemesterType = { id: number; name: string };

const SemesterList: SemesterType[] = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' },
  { id: 6, name: '6' },
  { id: 7, name: '7' },
  { id: 8, name: '8' },
];

interface SelectSemesterProps {
  selected: SemesterType ;
  onChange: (semester: SemesterType) => void;
}

export default function SelectSemester({ selected, onChange }: SelectSemesterProps) {
  return (
    <div className="w-full max-w-sm">
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-full bg-white py-2 pl-[15px] pr-[30px] text-left text-sm font-poppins shadow-xl/20 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-main-blue/60">
            <span className={`block truncate ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
              {selected ? selected.name : 'Semester'}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[10px]">
              <ChevronDownIcon className="h-5 w-5 text-black" aria-hidden="true" />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="overflow-y-auto no-scrollbar absolute z-10 mt-2 max-h-[400px] w-[80px] overflow-auto rounded-xl bg-white py-1 text-sm shadow-xl/20 ring-1 ring-black/5 focus:outline-none transition data-closed:opacity-0 data-leave:duration-100 data-leave:ease-in"
          >
            {SemesterList.map((semester) => (
              <ListboxOption
                key={semester.id}
                value={semester}
                className="group relative cursor-pointer select-none py-2.5 pl-3 pr-4 text-gray-900 data-focus:bg-gray-400/20 data-focus:text-black"
              >
                {({ selected: isSelected }) => (
                  <>
                    <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                      {semester.name}
                    </span>

                    {isSelected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-main-blue group-data-focus:text-white"></span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
