'use client';

import { useParams } from 'next/navigation';
import EditKarya from '@/components/karya/EditKarya';

export default function DetailPage() {
  const { id } = useParams();

  return <EditKarya id={Number(id)} />;
}
