'use client';

import { KaryaItem } from '../../types/karya';

interface Props {
  form: KaryaItem;

  onChange: (field: keyof KaryaItem, value: string) => void;
}

export default function DetailForm({ form, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Pameran */}
      <div>
        <p className="size-xl font-tilt-wrap text-slate-950 font-medium">
          Pameran<span className="text-red-500">*</span>
        </p>
        <p className="text-[12px] text-gray-600 mt-1">Pilih Pameran yang tersedia</p>

        <select
          value={form.pameranId}
          onChange={(e) => onChange('pameranId', e.target.value)}
          className="w-full border-3 bg-gray-500/10 border-main-blue rounded-lg p-2 mt-1"
        >
          <option value="1">TRPL EXPO</option>
          <option value="2">ANIMOTION FEST 2026</option>
          <option value="3">MULTIMEDIA CREATIVE EXPO</option>
        </select>
      </div>

      {/* Judul */}
      <div>
        <p className="size-xl font-tilt-wrap text-slate-950 font-medium">
          Judul<span className="text-red-500">*</span>
        </p>
        <p className="text-[12px] text-gray-600 mt-1">Masukkan judul PBL</p>
        <input
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full border-3 bg-gray-500/10 border-main-blue rounded-lg p-2 mt-1"
        />
      </div>

      {/* Youtube */}
      <div>
        <p className="size-xl font-tilt-wrap text-slate-950 font-medium">
          Link Youtube<span className="text-red-500">*</span>
        </p>
        <p className="text-[12px] text-gray-600 mt-1">Masukkan link video demo</p>
        <input
          value={form.link}
          onChange={(e) => onChange('link', e.target.value)}
          placeholder="Masukkan link Youtube"
          className="w-full border-3 bg-gray-500/10 border-main-blue rounded-lg p-2 mt-1"
        />
      </div>

      {/* Deskripsi */}
      <div>
        <p className="size-xl font-tilt-wrap text-slate-950 font-medium">
          Deskripi Karya<span className="text-red-500">*</span>
        </p>
        <p className="text-[12px] text-gray-600 mt-1">Sertakan deskripsi, nama tim PBL dan nama manager proyek. </p>

        <textarea
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          className=" w-full border-3 bg-gray-500/10 border-main-blue rounded-lg p-2 mt-1 h-[400px]"
        />
      </div>
    </div>
  );
}
