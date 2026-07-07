import type { Metadata } from "next";
import "@/app/globals.css";
import BackToTop from "@/components/shared/ui/BackToTop";

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
      <BackToTop/>
    </div>
  );
}
