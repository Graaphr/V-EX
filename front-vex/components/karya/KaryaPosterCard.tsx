"use client";

import Image from "next/image";
import { KaryaItem, PameranItem } from "../../types/karya";

interface PosterCardProps {
  karya: KaryaItem;
  pameranList: PameranItem[];
}

export default function PosterCard({ karya, pameranList }: PosterCardProps) {
  const pameran = pameranList.find((item) => item.id === karya.pameranId);

  return (
    <div className="mt-1 bg-white rounded-xl overflow-hidden hover:scale-102 shadow-md hover:shadow-xl/40 transition duration-300 group">
      <div className="relative aspect-[3/4] w-full">
        {karya.image ? (
          <Image
            src={karya.image}
            alt={karya.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* ✅ Badge terbaik — hanya muncul jika isTerbaik true */}
        {(karya as any).isTerbaik && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">
            ⭐ Terbaik
          </div>
        )}
      </div>

      <div className="p-3 h-[100px] flex flex-col justify-between">
        <h3 className="font-medium text-sm line-clamp-2">{karya.title}</h3>
        <p className="text-xs text-gray-500">{karya.category}</p>
        {pameran && (
          <span className="mt-1 inline-flex w-fit items-center rounded-full bg-blue-300/40 px-3 py-1">
            <p className="font-poppins text-xs font-medium text-main-blue leading-none">
              {pameran.title}
            </p>
          </span>
        )}
      </div>
    </div>
  );
}
