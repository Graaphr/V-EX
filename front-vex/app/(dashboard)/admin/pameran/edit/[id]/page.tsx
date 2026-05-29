"use client";

import { useState } from "react";

import NavAdmin from "@/components/ui/NavAdmin";
import EditPameran from "@/components/pameran/EditPameran";
import AddPameran from "@/components/pameran/AddPameran";

export default function AdminEditPameran() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      <NavAdmin isFormOpen={isEditOpen} onAddClick={handleEditClick} />

      {isEditOpen ? <AddPameran /> : <EditPameran />}
    </div>
  );
}