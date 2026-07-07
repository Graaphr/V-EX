'use client';
import Link from 'next/link';
import React from 'react';
import '@/app/globals.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  link?: string;
  className?: string;
}

export function Button({ children,title, link, className, ...props }: ButtonProps) {

  const style = `
  inline-flex items-center justify-center
  text-white font-bold font-tilt-wrap cursor-pointer
  bg-main-blue transition-all ease-in-out duration-300 
  hover:shadow-[inset_0px_0px_24px_-2px_rgba(255,255,255,0.25)]
  ${className}
  `;

  if (link) {
    return (
      <Link href={link} title={title} className={style}>
        {children}
      </Link>
    );

  }

  return (
    <button title={title} className={style} {...props}>
      {children}
    </button>
  );
}

export function ButtonPutih({ children, link, className = '', ...props }: ButtonProps) {
  const style = `
      inline-flex items-center justify-center
      text-main-blue font-bold font-tilt-wrap cursor-pointer
      bg-white border-main-blue border
      transition-all ease-in-out duration-300
      hover:bg-main-blue hover:text-white hover:border-white
      ${className}
    `;

  if (link) {
    return (
      <Link href={link} className={style}>
        {children}
      </Link>
    );
  }

  return (
    <button className={style} {...props}>
      {children}
    </button>
  );
}
