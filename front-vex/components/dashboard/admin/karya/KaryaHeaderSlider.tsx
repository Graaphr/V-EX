'use client';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface HeaderSliderProps {
  title: string;
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function HeaderSlider({ title, currentPage, totalPages, onNext, onPrev }: HeaderSliderProps) {
  const showPagination = totalPages > 1;

  return (
    <div className="flex justify-between items-center mb-4 gap-3">
      <h3 className="font-semibold text-[18px] sm:text-[22px] border-b-2 w-full pb-2">{title}</h3>

      {showPagination && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
          >
            <FiChevronLeft />
          </button>

          <span className="text-sm font-medium min-w-[45px] text-center">
            {currentPage}/{totalPages}
          </span>

          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-40"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
