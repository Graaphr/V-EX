import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type Props = {
  title: string;
  currentPage?: number;
  totalPages?: number;
  onNext?: () => void;
  onPrev?: () => void;
};

export default function SectionHeader({ title, currentPage, totalPages, onNext, onPrev }: Props) {
  const showPagination = totalPages !== undefined && totalPages > 1;

  return (
    <div className="flex justify-between items-center mb-3 gap-3">
      <h3 className="font-semibold text-[18px] sm:text-[22px] border-b-2 w-full pb-2">{title}</h3>

      {showPagination && (
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onPrev} disabled={currentPage === 1}>
            <FiChevronLeft />
          </button>

          <span>
            {currentPage}/{totalPages}
          </span>

          <button onClick={onNext} disabled={currentPage === totalPages}>
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
