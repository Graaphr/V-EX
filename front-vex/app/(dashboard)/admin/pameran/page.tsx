'use client';

import { useState } from 'react';

// components
import NavAdmin from '@/components/ui/NavAdmin';
import AddPameran from '@/components/pameran/AddPameran';
import PagePameran from '@/components/pameran/PagePameran';

export default function AdminPameranPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddClick = () => {
    setIsFormOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      {/* NAV ADMIN */}
      <NavAdmin isFormOpen={isFormOpen} onAddClick={handleAddClick} />

      {/* CONDITIONAL RENDER */}
      {isFormOpen ? <AddPameran /> : <PagePameran href={'/admin/pameran/detail/'} />}
    </div>
  );
}
