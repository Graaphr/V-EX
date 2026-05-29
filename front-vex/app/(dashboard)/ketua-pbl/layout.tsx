import type { Metadata } from "next";
import { Geist, Geist_Mono, Tilt_Warp, Poppins } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import NavKetuaPBL from "@/components/ui/NavKetuaPBL";

export const metadata: Metadata = {
  title: "V-EX | Ketua PBL",
  description: "Virtual Exhibition",
};

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userMenu = [
    { title: "BERANDA", subtitle: "UTAMA", link: "/" },
    { title: "PAMERAN", subtitle: "3D BOOTH", link: "/pameran" },
    { title: "DASHBOARD", subtitle: "KETUA PBL", link: "/ketua-pbl/karya" },
  ];
  return (
    <div>
      <Navbar menuItems={userMenu} />
      <NavKetuaPBL />
      {children}
    </div>
  );
}
