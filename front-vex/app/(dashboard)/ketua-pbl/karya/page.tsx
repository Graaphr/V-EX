'use client';

import { useState } from 'react';

import PageKarya from '@/components/dashboard/admin/karya/PageKarya';
import AddKarya from '@/components/dashboard/admin/karya/AddKarya';
import NavKetuaPBL from '@/components/ui/NavKetuaPBL';

export default function KaryaPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleAddClick = () => {
    setIsFormOpen((prev) => !prev);
  };
  return (
    <div className="w-full">
      <NavKetuaPBL isFormOpen={isFormOpen} onAddClick={handleAddClick} />

      {isFormOpen ? <AddKarya /> : <PageKarya href={'/ketua-pbl/karya/'} />}
    </div>
  );
}
