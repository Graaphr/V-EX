'use client';

import Link from 'next/link';

import PosterCard from './KaryaPosterCard';
import HeaderSlider from './KaryaHeaderSlider';

import { KaryaItem, PameranItem } from '../../types/karya';

interface KaryaGridProps {
  category: string;
  data: KaryaItem[];
  currentPage: number;
  totalPages: number;
  href: string;
  pameranList: PameranItem[];
  onPrev: () => void;
  onNext: () => void;
}

export default function KaryaGrid({
  category,
  data,
  currentPage,
  totalPages,
  href,
  pameranList,
  onPrev,
  onNext,
}: KaryaGridProps) {
  return (
    <section>
      <HeaderSlider
        title={category}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={onPrev}
        onNext={onNext}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {data.map((karya) => (
          <Link key={karya.id} href={`${href}${karya.id}`}>
            <PosterCard karya={karya} pameranList={pameranList} />
          </Link>
        ))}
      </div>
    </section>
  );
}