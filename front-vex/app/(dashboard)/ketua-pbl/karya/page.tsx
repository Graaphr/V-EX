'use client';

import { useState } from 'react';

import PageKarya from '@/components/karya/PageKarya';
import AddKarya from '@/components/karya/AddKarya';
import NavKetuaPBL from '@/components/shared/ui/NavKetuaPBL';

export default function KaryaPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleAddClick = () => {
    setIsFormOpen((prev) => !prev);
  };
  return (
    <div className="w-full">
      <NavKetuaPBL isFormOpen={isFormOpen} onAddClick={handleAddClick} />

      {isFormOpen ? <AddKarya /> : <PageKarya href="/ketua-pbl/karya/" apiUrl="/api/ketua-pbl/karya" />}
    </div>
  );
}
