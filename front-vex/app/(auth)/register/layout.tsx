import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: 'V-EX | Register',
  description: 'Virtual Exhibition',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <div>
      {children}
    </div>
  );
}
