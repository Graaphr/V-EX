import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import NavAdmin from "@/components/shared/ui/NavAdmin";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "V-EX | Admin",
  description: "Virtual Exhibition",
};

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}
