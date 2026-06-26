
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import EditKarya from '@/components/karya/EditKarya';
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

      {isFormOpen ? <AddKarya /> : <EditKarya id={Number(id)} />}
    </div>
  );
}
