"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  text?: string;
  value:string;
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

export default function SearchBar({ text, value, onChange }: SearchBarProps) {
  return (
    <div className="w-full relative flex items-center text-black">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={text}
        className="w-full p-2 pl-[50px] bg-white rounded-full text-sm border-2 border-transparent shadow-xl/20 focus:outline-none focus:border-main-blue transition-all"
      />

      <FaSearch className="absolute left-4 opacity-80 text-[22px] pointer-events-none" />
    </div>
  );
}
