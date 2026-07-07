
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import DetailKarya from '@/components/karya/DetailKarya';
import AddKarya from '@/components/karya/AddKarya';
import NavKetuaPBL from '@/components/shared/ui/NavKetuaPBL';

export default function DetailKaryaPage() {
  const { id } = useParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleAddClick = () => {
    setIsFormOpen((prev) => !prev);
  };
  return (
    <div className="w-full">
      <NavKetuaPBL isFormOpen={isFormOpen} onAddClick={handleAddClick} />

      {isFormOpen ? <AddKarya /> : <DetailKarya id={Number(id)} />}
    </div>
  );
}
