import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "V-EX | KPS",
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
      {children}
    </div>
  );
}
