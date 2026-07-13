'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

type MenuItem = {
  title: string;
  link: string;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: 'Tutorial',
    items: [
      { title: 'Panduan Umum', link: '/tutorial/umum' },
      { title: 'Panduan Pengunjung', link: '/tutorial/pengunjung' },
      { title: 'Panduan Admin', link: '/tutorial/admin' },
      { title: 'Panduan Ketua PBL', link: '/tutorial/ketua-pbl' },
      { title: 'Panduan KPS', link: '/tutorial/kps' },
    ],
  },
  {
    label: 'Sumber',
    items: [
      { title: 'FAQs', link: '/faqs' },
      { title: 'Petunjuk', link: '/petunjuk' },
      { title: 'Pelayanan', link: '/pelayanan' },
    ],
  },
  {
    label: 'Hukum',
    items: [
      { title: 'Syarat & Ketentuan', link: '/syarat-ketentuan' },
      { title: 'Kebijakan Privasi', link: '/kebijakan-privasi' },
      { title: 'Hubungi Kami', link: '/hubungi-kami' },
    ],
  },
];

export default function SidebarLainnya() {
  const pathname = usePathname();

  // Grup yang berisi halaman aktif otomatis terbuka duluan
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuGroups.forEach((group) => {
      initial[group.label] = group.items.some((item) => item.link === pathname);
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-full lg:w-[260px] shrink-0">
      <div className="lg:sticky lg:top-28 flex flex-col gap-3">
        {menuGroups.map((group) => {
          const isOpen = openGroups[group.label];
          return (
            <div
              key={group.label}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-5 py-4 font-poppins font-bold text-main-blue tracking-wide"
              >
                <span>{group.label}</span>
                <FiChevronDown
                  className={`text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="px-5 pb-4 flex flex-col gap-1">
                    {group.items.map((item) => {
                      const active = pathname === item.link;
                      return (
                        <li key={item.link}>
                          <Link
                            href={item.link}
                            className={`block py-2 px-3 rounded-lg text-sm font-poppins font-light transition-colors ${
                              active
                                ? 'bg-main-blue text-white font-medium'
                                : 'text-gray-600 hover:bg-secondary-color hover:text-main-blue'
                            }`}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}