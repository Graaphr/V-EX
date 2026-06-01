"use client";

import { useState } from "react";

import NavAdmin from "@/components/shared/ui/NavAdmin";
import EditPameran from "@/components/pameran/EditPameran";
import AddPameran from "@/components/pameran/AddPameran";

export default function AdminEditPameran() {
  const [isFormOpen, setisFormOpen] = useState(false);

  const handleEditClick = () => {
    setisFormOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      <NavAdmin isFormOpen={isFormOpen} onAddClick={handleEditClick} />

      {isFormOpen ? <AddPameran /> : <EditPameran />}
    </div>
  );
}