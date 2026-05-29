'use client';

interface Props {
  booth?: string;
  onChange: (value: string) => void;
}

export default function DetailPreview({ booth, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="mb-2 font-medium"> </p>

      <div className="bg-black rounded-md w-full max-w-[420px] h-[260px] mx-auto flex items-center justify-center overflow-hidden">
        <img
          src={`/image/${booth}`}
          alt="booth"
          className="h-full object-contain p-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/image/img-stan1.svg';
          }}
        />
      </div>

      <div>
        <p className="size-xl font-tilt-wrap text-slate-950 font-medium">
          Pilih Stan<span className="text-red-500">*</span>
        </p>

        <select
          value={booth}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-3 bg-gray-500/10 border-main-blue rounded-lg p-2 mt-1"
        >
          <option value="img-stan1.svg">Booth 1</option>
          <option value="img-stan2.svg">Booth 2</option>
          <option value="img-stan3.svg">Booth 3</option>
        </select>
      </div>
    </div>
  );
}
