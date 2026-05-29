"use client";

import { useState } from "react";

import NavAdmin from "@/components/ui/NavAdmin";
import DetailPameran from "@/components/pameran/DetailPameran";
import AddPameran from "@/components/pameran/AddPameran";


export default function AdminDetailPameran() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      {/* NAV ADMIN */}
      <NavAdmin isFormOpen={isEditOpen} onAddClick={handleEditClick} />

      {isEditOpen ? <AddPameran /> : <DetailPameran isLogin={true}/>}
    </div>
  );
}
