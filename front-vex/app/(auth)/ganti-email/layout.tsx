import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: 'V-EX | Ganti Email',
  description: 'Virtual Exhibition',
};

export default function ForgotPasswordLayout({
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
