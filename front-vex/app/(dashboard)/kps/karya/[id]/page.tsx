
'use client';

import { useParams } from 'next/navigation';
import EditKarya from '@/components/karya/EditKarya';

export default function DetailKarya() {
  const { id } = useParams();
  return (
    <div className="w-full">

      <EditKarya id={Number(id)} />
    </div>
  );
}
