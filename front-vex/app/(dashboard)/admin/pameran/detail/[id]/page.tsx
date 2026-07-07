"use client";

import { useState } from "react";

import NavAdmin from "@/components/shared/ui/NavAdmin";
import DetailPameran from "@/components/pameran/DetailPameran";
import AddPameran from "@/components/pameran/AddPameran";


export default function AdminDetailPameran() {
  const [isFormOpen, setisFormOpen] = useState(false);

  const handleEditClick = () => {
    setisFormOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      {/* NAV ADMIN */}
      <NavAdmin isFormOpen={isFormOpen} onAddClick={handleEditClick} />

      {isFormOpen ? <AddPameran /> : <DetailPameran isLogin={true}/>}
    </div>
  );
}
