import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from '@/components/shared/ui/BackToTop';
import SidebarLainnya from "@/components/layout/SidebarLainnya";

export const metadata: Metadata = {
  title: "V-EX | Informasi",
  description: "FAQs, petunjuk, pelayanan, dan informasi lainnya seputar V-EX.",
};

export default function LainnyaLayout({ children }: { children: React.ReactNode }) {
  const userMenu = [
    { title: "BERANDA", subtitle: "UTAMA", link: "/" },
    { title: "PAMERAN", subtitle: "3D BOOTH", link: "/pameran" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar menuItems={userMenu} />

      <main className="flex-1 bg-secondary-color w-full">
        <div className="autoMid px-4 sm:px-6 lg:px-0 py-10 lg:py-16 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Konten utama */}
          <div className="w-full flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
            {children}
          </div>

          {/* Sidebar kanan */}
          <SidebarLainnya />
        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  );
}