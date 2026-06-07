"use client";

import '@/app/globals.css';
import Image from 'next/image';
import { useState } from 'react';
import { FaHeart, FaCalendar, FaLock, FaUnlock } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';

export interface ProjectCard {
  id: number;
  bannerImage: string;
  title: string;
  category: string;
  likes: number;
  karya: number;
  date: string;
  stats: {
    startDate: string;
    endDate: string;
  };
}

interface ProjectData {
  project: ProjectCard;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectData) {
  const [hovered, setHovered] = useState(false);

  const today = new Date();
  const startDate = new Date(project.stats?.startDate);
  const endDate = new Date(project.stats?.endDate);
  endDate.setHours(23, 59, 59, 999);
  const isOpen = today >= startDate && today <= endDate;
console.log(project);
console.log(project.stats?.startDate);
console.log(project.stats?.endDate);
  return (
    <div
      className={`relative overflow-hidden cursor-pointer ${className ?? ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-[0px_1px_3px_rgba(0,0,0,1)]">
        <Image
          src={project.bannerImage}
          alt={project.title}
          fill
          unoptimized
          className={`object-cover transition-transform duration-300 ${hovered ? "scale-105" : "scale-100"}`}
        />

        {/* OVERLAY */}
        <div
          className={`absolute inset-0 z-10 bg-gradient-to-t from-main-blue/90 via-white/30 to-transparent transition-opacity duration-300 flex flex-col justify-end p-3 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <FaCalendar className="text-sm" />
              <p className="text-[11px] font-medium">{project.date}</p>
            </div>

            {isOpen ? (
              <span className="flex items-center justify-center bg-green-500 w-6 h-6 rounded-full shadow-md">
                <FaUnlock className="text-white text-[11px]" />
              </span>
            ) : (
              <span className="flex items-center justify-center bg-red-500 w-6 h-6 rounded-full shadow-md">
                <FaLock className="text-white text-[11px]" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="mt-2">
        <h3 className="text-sm font-poppins line-clamp-2">{project.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <FaHeart />
            {project.likes} Likes
          </span>
          <span className="flex items-center gap-1">
            <BsStars />
            {project.karya} Karya
          </span>
        </div>
      </div>
    </div>
  );
}