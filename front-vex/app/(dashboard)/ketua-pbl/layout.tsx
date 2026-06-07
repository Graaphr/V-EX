import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import NavKetuaPBL from "@/components/shared/ui/NavKetuaPBL";

export const metadata: Metadata = {
  title: "V-EX | Ketua PBL",
  description: "Virtual Exhibition",
};

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      <Navbar />
      <NavKetuaPBL />
      {children}
    </div>
  );
}
