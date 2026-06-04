import '@/app/globals.css';
import Image from 'next/image';
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
  const today = new Date();

  const startDate = new Date(project.stats.startDate);

  const endDate = new Date(project.stats.endDate);
  endDate.setHours(23, 59, 59, 999);

  const isOpen = today >= startDate && today <= endDate;


  return (
    <div className={`group relative overflow-hidden cursor-pointer ${className}`}>
      {/* IMAGE */}
      <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-[0px_1px_3px_rgba(0,0,0,1)]">
        <Image
          src={project.bannerImage}
          alt={project.title}
          fill
          unoptimized
          className="object-cover transition-transform group-hover:scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-main-blue/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end pb-[10px] p-[20px]">
          {/* CONTENT NON TRANSPARENT */}
          <div className="flex items-center justify-between text-white opacity-100">
            {/* DATE */}
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              <FaCalendar className="text-sm" />
              <p className="text-sm font-medium">{project.date}</p>
            </div>

            {/* STATUS */}
            <div>
              {isOpen ? (
                <span className="flex items-center justify-center bg-green-500 w-8 h-8 rounded-full shadow-md">
                  <FaUnlock className="text-white text-xs" />
                </span>
              ) : (
                <span className="flex items-center justify-center bg-red-500 w-8 h-8 rounded-full shadow-md">
                  <FaLock className="text-white text-xs" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="mt-3">
        <h3 className="text-sm font-base font-poppins line-clamp-2">{project.title}</h3>

        <div className="mt-2 flex items-center gap-4 text-xs">
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
