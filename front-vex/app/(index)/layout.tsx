import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "V-EX",
    description: "Virtual Exhibition",
};

export default function IndexLayout({ children }: { children: React.ReactNode }) {
    const userMenu = [
        { title: "BERANDA", subtitle: "UTAMA", link: "/" },
        { title: "PAMERAN", subtitle: "3D BOOTH", link: "/pameran" },
    ];
    return (
        <div>
            <Navbar menuItems={userMenu} />
            {children}
            <Footer />
        </div>


    );
}
