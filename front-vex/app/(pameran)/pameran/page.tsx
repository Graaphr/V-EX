"use client";

import { useState } from "react";

// components
import NavAdmin from "@/components/ui/NavAdmin";
// import PameranPage from "@/app/(pameran)/pameran/page";
import AddPameran from "@/components/pameran/AddPameran";
import PagePameran from "@/components/pameran/PagePameran";

export default function AdminPameranPage() {
  return (
    <div className="w-full">
      <PagePameran />
    </div>
  );
}
