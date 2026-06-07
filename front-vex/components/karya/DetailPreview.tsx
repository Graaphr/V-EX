'use client';

const inputClass =
  "w-full p-2.5 px-3 rounded-lg border border-gray-300 mt-1.5 focus:outline-none focus:border-main-blue focus:ring-1 focus:ring-main-blue transition-all text-sm";

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p className="text-sm font-semibold">
      {text} {required && <span className="text-red-500">*</span>}
    </p>
  );
}

interface Props {
  booth?: string;
  onChange: (value: string) => void;
}

export default function DetailPreview({ booth, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-semibold mt-10 mb-1.5">
        Detail<span className="text-red-500">*</span>
      </p>

      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl w-full h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src={`/image/${booth}`}
          alt="booth"
          className="h-full w-full object-contain p-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/image/img-stan1.svg';
          }}
        />
      </div>

      <div>
        <Label text="Pilih Stan" required />
        <p className="text-xs text-gray-400 mt-1">Pilih tampilan stan untuk karya kamu</p>
        <select
          value={booth}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>-- Pilih Stan --</option>
          <option value="img-stan1.svg">Booth 1</option>
          <option value="img-stan2.svg">Booth 2</option>
          <option value="img-stan3.svg">Booth 3</option>
        </select>
      </div>
    </div>
  );
}