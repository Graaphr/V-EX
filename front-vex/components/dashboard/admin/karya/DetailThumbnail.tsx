'use client';

interface Props {
  preview: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DetailThumbnail({ preview, onUpload }: Props) {
  return (
    <div>
      <p className="size-xl font-tilt-wrap text-slate-950 font-medium">
        Thumbnail<span className="text-red-500">*</span>
      </p>
      <p className="mb-1 text-[12px] text-gray-600 mt-1">Format yang di dukung hanya PNG/JPG dengan rasio 16:9</p>

      <label className="border-3 bg-gray-500/10 border-main-blue rounded-lg h-[220px] flex items-center justify-center cursor-pointer overflow-hidden">
        {preview ? (
          <img src={preview} className="w-full h-full object-contain p-2" />
        ) : (
          <span className="text-gray-400">Upload</span>
        )}

        <input type="file" className="hidden" onChange={onUpload} />
      </label>
    </div>
  );
}
