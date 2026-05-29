'use client';

import Link from 'next/link';
import { FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface AddOn {
  onAddClick?: () => void;
  isFormOpen?: boolean;
}

export default function NavKetuaPBL({ onAddClick, isFormOpen }: AddOn) {
  const pathname = usePathname();

  const menuItems = [
    {
      id: 1,
      icon: <FaImage size={17} />,
      link: '/ketua-pbl/karya',
    },
  ];

  return (
    <div
      className="
        fixed z-50
        left-1/2 -translate-x-1/2
        bottom-0
        w-full
        flex justify-center
        px-3
        pb-3
      "
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
      }}
    >
      <div
        className="
          bg-main-blue
          px-3 py-3
          flex items-center gap-2
          rounded-2xl
          shadow-2xl
          w-fit
        "
      >
        {/* MENU */}
        {menuItems.map((item) => {
          const isActive = pathname === item.link || pathname.startsWith(item.link + '/');

          return (
            <div key={item.id} className="relative w-10 h-10">
              {/* ACTIVE */}
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="
                    absolute inset-0
                    bg-white rounded-full
                  "
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* LINK */}
              <Link
                href={item.link}
                className={`
                  relative z-10
                  w-full h-full
                  flex items-center justify-center
                  rounded-full transition
                  ${isActive ? 'text-main-blue' : 'text-white border border-white/20 hover:bg-white/10'}
                `}
              >
                {item.icon}
              </Link>
            </div>
          );
        })}

        {/* DIVIDER */}
        <div className="w-px h-6 bg-white/20 mx-1" />

        {/* BUTTON */}
        <motion.button
          onClick={onAddClick}
          whileTap={{ scale: 0.9 }}
          className="
            w-10 h-10
            flex items-center justify-center
            bg-white rounded-full
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
  );
}
