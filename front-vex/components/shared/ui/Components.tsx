'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '@/public/icon/logo-vex-ok.svg';
import logoWhite from '@/public/icon/logo-vex-white.svg';
import bestTag from '@/public/icon/Medalion.svg';
import favTag from '@/public/icon/Favorite.svg';
import '@/app/globals.css';

interface LinkAkses {
  link: string;
  title?: string;
  subtitle?: String;
  className?: string;
  children?: React.ReactNode;
}

// LOGO BIRU
export function Logo({ ...props }) {
  return (
    <div>
      <Image src={logo} loading="eager" alt="Logo" width={520} height={120} {...props} />
    </div>
  );
}

// LOGO PUTIH
export function LogoWhite({ ...props }) {
  return (
    <div>
      <Image src={logoWhite} loading="eager" alt="Logo" width={400} height={100} className="size-full " {...props} />
    </div>
  );
}

interface dataCard {
  link: string;
  title: string;
  className?: string;
}

// (index)/page.tsx
export function Card({ link, title, className, ...props }: dataCard) {
  return (
    <div className="">
      <Image
        loading="eager"
        src={link}
        alt={title}
        width={100}
        height={100}
        className="object-fill rounded-xl size-full self-start"
        {...props}
      />
    </div>
  );
}
export function BestTag({ ...props }) {
  return <Image src={bestTag} loading="eager" width={100} height={100} alt="Medalion" {...props} />;
}
export function FavTag({ ...props }) {
  return <Image src={favTag} loading="eager" width={100} height={100} alt="fav-icon" {...props} />;
}

// Navbar.tsx
export function TextNav({ link, title, subtitle, className, ...props }: LinkAkses) {
  return (
    <Link
      href={link || '/icon/logo-vex.svg'}
      className={`
        group relative text-18 hover:text-main-blue py-4
        flex flex-col items-start lg:items-center
        font-semibold font-poppins
        transition-all ease-in-out duration-200
        ${className || ''}
      `}
      {...props}
    >
      {title}

      <p
        className="
          flex items-center justify-start lg:justify-center
          group-hover:text-main-blue
          font-light font-poppins text-xs opacity-65
        "
      >
        {subtitle || ''}
        <span className="garis"></span>
      </p>
    </Link>
  );
}

// Footer.tsx
export function LinkAkses({ link, title, className, ...props }: LinkAkses) {
  return (
    <Link href={link || '/icon/logo-vex.svg'} className="hover-text" {...props}>
      {title}
    </Link>
  );
}

// Footer.tsx
export function LinkAksesEks({ link, title, children, className, ...props }: LinkAkses) {
  return (
    <a href={link || '/icon/logo-vex.svg'} className="hover-text" {...props}>
      {title}
      {children}
    </a>
  );
}

// ini harus menggunakan group di parentnya
export function Tooltip({children,} : {children:React.ReactNode;}){
  return (
    <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-main-blue opacity-0 shadow-lg/40 transition-all duration-200 group-hover:-top-12 group-hover:opacity-100">
      {children}
    </div>
  );
}
