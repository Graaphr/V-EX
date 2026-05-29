'use client';

import Link from 'next/link';
import { FaUser, FaBook, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface AddOn {
  onAddClick?: () => void;
  isFormOpen?: boolean;
}

export default function NavAdmin({ onAddClick, isFormOpen }: AddOn) {
  const pathname = usePathname();

  const menuItems = [
    {
      id: 1,
      title: 'Pengguna',
      icon: <FaUser size={17} />,
      link: '/admin/pengguna',
    },
    {
      id: 2,
      title: 'Pameran',
      icon: <FaBook size={17} />,
      link: '/admin/pameran',
    },
    {
      id: 3,
      title: 'Karya',
      icon: <FaImage size={17} />,
      link: '/admin/karya',
    },
  ];

  return (
    <div
      className="fixed z-50 left-1/2 -translate-x-1/2 bottom-0 w-full flex justify-center px-3 pb-3
      "
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
      }}
    >
      <div
        className="bg-main-blue px-3 py-3 flex items-center gap-2 rounded-2xl shadow-lg/20 w-fit
        "
      >
        {/* MENU */}
        {menuItems.map((item) => {
          const isActive = pathname === item.link || pathname.startsWith(item.link + '/');

          return (
            <div key={item.id} className="group relative flex h-10 w-10 items-center justify-center">
              {/* ITEM */}
              <div className="relative h-10 w-10">
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* TOOLTIP */}
                <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-main-blue opacity-0 shadow-lg/40 transition-all duration-200 group-hover:-top-12 group-hover:opacity-100">
                  {item.title}
                </div>
                <Link
                  href={item.link}
                  className={`relative z-10 flex h-full w-full items-center justify-center rounded-full transition
            ${isActive ? 'text-main-blue' : 'text-white border border-white/20 hover:bg-white/10'}
          `}
                >
                  {item.icon}
                </Link>
              </div>
            </div>
          );
        })}

        {/* DIVIDER */}
        <div className="w-px h-6 bg-white/20 mx-1" />

        {/* BUTTON */}
        {/* BUTTON */}
        <div className="group relative flex h-10 w-10 items-center justify-center">
          {/* TOOLTIP */}
          <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-main-blue opacity-0 transition-all duration-200 group-hover:-top-12 group-hover:opacity-100 shadow-lg/40">
            Tambah
          </div>

          <motion.button
            onClick={onAddClick}
            whileTap={{ scale: 0.9 }}
            className="
      relative z-10
      flex h-10 w-10
      items-center justify-center
      rounded-full
      bg-white
      text-main-blue
    "
          >
            <AnimatePresence mode="wait">
              {isFormOpen ? (
                <motion.div
                  key="close"
                  initial={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <FaTimes size={15} />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{
                    rotate: 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotate: -90,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <FaPlus size={15} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
