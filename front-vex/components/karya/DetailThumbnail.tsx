'use client';

import { FaCloudUploadAlt } from "react-icons/fa";

interface Props {
  preview: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DetailThumbnail({ preview, onUpload }: Props) {
  return (
    <div>
      <p className="text-xl font-semibold mt-10 mb-1.5">
        Thumbnail<span className="text-red-500">*</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Format yang didukung hanya PNG/JPG dengan rasio 16:9
      </p>

      <label
        htmlFor="file-karya"
        className="cursor-pointer h-[200px] md:h-[320px] w-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 hover:border-main-blue hover:bg-blue-50 rounded-xl mt-2 overflow-hidden transition-all duration-200"
      >
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            <FaCloudUploadAlt className="text-5xl mx-auto mb-2" />
            <p className="text-sm font-medium">Klik untuk upload</p>
            <p className="text-xs mt-1">PNG, JPG, JPEG</p>
          </div>
        )}
        <input
          id="file-karya"
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={onUpload}
        />
      </label>

      <p className="text-xs text-gray-400 mt-2">
        Format: PNG, JPG, JPEG. Rasio 16:9.
      </p>
    </div>
  );
}