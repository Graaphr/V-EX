'use client';

import { useId } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

interface Props {
  preview: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function DetailPoster({ preview, onUpload, error }: Props) {
  const inputId = useId();

  return (
    <div>
      <p className="text-xl font-semibold mt-10 mb-1.5">
        Poster<span className="text-red-500">*</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">Format yang didukung hanya PNG/JPG</p>

      <label
        className={`cursor-pointer h-[410px] md:h-[820px] w-full flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-xl mt-2 overflow-hidden transition-all duration-200 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-main-blue hover:bg-blue-50'
        }`}
      >
        {preview ? (
          <img src={preview} alt="preview poster" className="w-full h-full object-cover pointer-events-none" />
        ) : (
          <div className="text-center text-gray-400 pointer-events-none">
            <FaCloudUploadAlt className="text-5xl mx-auto mb-2" />
            <p className="text-sm font-medium">Klik untuk upload</p>
            <p className="text-xs mt-1">PNG, JPG, JPEG</p>
          </div>
        )}
        <input
          id={inputId}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/jpg"
          onChange={onUpload}
          onClick={(e) => {
            (e.target as HTMLInputElement).value = '';
          }}
        />
      </label>

      {error ? (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      ) : (
        <p className="text-xs text-gray-400 mt-2">Format: PNG, JPG, JPEG.</p>
      )}
    </div>
  );
}
