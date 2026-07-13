"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token); 
  }, []);

  const userMenu = [
    { title: "BERANDA", subtitle: "UTAMA", link: "/" },
    { title: "PAMERAN", subtitle: "3D BOOTH", link: "/pameran" },
  ];

  return (
    <div>
      <Navbar menuItems={userMenu}  />
      {children}
      <Footer />
    </div>
  );
}
