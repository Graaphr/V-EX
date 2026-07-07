'use client';

import { useParams } from 'next/navigation';
import DetailKarya from '@/components/karya/DetailKarya';

export default function DetailKaryaPage() {
  const { id } = useParams();

  return <DetailKarya id={Number(id)} />;
}
