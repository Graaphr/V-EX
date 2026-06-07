'use client';

import { KaryaItem } from '../../types/karya';

interface Props {
  form: KaryaItem;
  onChange: (field: keyof KaryaItem, value: string) => void;
}

const inputClass =
  "w-full p-2.5 px-3 rounded-lg border border-gray-300 mt-1.5 focus:outline-none focus:border-main-blue focus:ring-1 focus:ring-main-blue transition-all text-sm";

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p className="text-sm font-semibold">
      {text} {required && <span className="text-red-500">*</span>}
    </p>
  );
}

export default function DetailForm({ form, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Pameran */}
      <div>
        <Label text="Pameran" required />
        <p className="text-xs text-gray-400 mt-1">Pilih Pameran yang tersedia</p>
        <select
          value={form.pameranId}
          onChange={(e) => onChange('pameranId', e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>-- Pilih Pameran --</option>
          <option value="1">TRPL EXPO</option>
          <option value="2">ANIMOTION FEST 2026</option>
          <option value="3">MULTIMEDIA CREATIVE EXPO</option>
        </select>
      </div>

      {/* Judul */}
      <div>
        <Label text="Judul" required />
        <p className="text-xs text-gray-400 mt-1">Masukkan judul PBL</p>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Masukkan judul karya"
          className={inputClass}
        />
      </div>

      {/* Youtube */}
      <div>
        <Label text="Link Youtube" required />
        <p className="text-xs text-gray-400 mt-1">Masukkan link video demo</p>
        <input
          type="text"
          value={form.link}
          onChange={(e) => onChange('link', e.target.value)}
          placeholder="Masukkan link Youtube"
          className={inputClass}
        />
      </div>

      {/* Deskripsi */}
      <div>
        <Label text="Deskripsi Karya" required />
        <p className="text-xs text-gray-400 mt-1">
          Sertakan deskripsi, nama tim PBL dan nama manager proyek.
        </p>
        <textarea
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Masukkan deskripsi karya..."
          className={`${inputClass} h-[420px] resize-none`}
        />
      </div>
    </div>
  );
}