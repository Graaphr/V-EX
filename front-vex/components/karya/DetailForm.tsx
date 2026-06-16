"use client";

import { useEffect, useState } from "react";
import { KaryaItem } from "../../types/karya";
import { GetPameranTersedia } from "@/components/karya/apiKarya";

interface Props {
  form: KaryaItem;
  onChange: (field: keyof KaryaItem, value: string) => void;
  currentPameran?: { id: number; title: string } | null;
}

interface PameranOption {
  id: number;
  title: string;
  isClosedCurrent?: boolean; // ✅ flag eksplisit, bukan dihitung ulang saat render
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

export default function DetailForm({ form, onChange, currentPameran }: Props) {
  const [pameranList, setPameranList] = useState<PameranOption[]>([]);
  const [loadingPameran, setLoadingPameran] = useState(true);

  useEffect(() => {
    const fetchPameran = async () => {
      try {
        const res = await GetPameranTersedia();
        const list: PameranOption[] = res.pameran ?? [];

        if (currentPameran) {
          const sudahAda = list.some((p) => p.id === currentPameran.id);
          // ✅ fix: hanya tandai "closed" jika memang TIDAK ada di list persiapan
          if (!sudahAda) {
            list.unshift({ ...currentPameran, isClosedCurrent: true });
          }
        }

        setPameranList(list);
      } catch (err) {
        console.error("Gagal memuat pameran:", err);
      } finally {
        setLoadingPameran(false);
      }
    };

    fetchPameran();
  }, [currentPameran]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div>
        <Label text="Pameran" required />
        <p className="text-xs text-gray-400 mt-1">
          Pilih Pameran yang tersedia
        </p>

        {loadingPameran ? (
          <div className="mt-1.5 h-10 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <select
            value={form.pameranId ?? ""}
            onChange={(e) => onChange("pameranId", e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              -- Pilih Pameran --
            </option>
            {pameranList.map((p) => (
              <option
                key={p.id}
                value={String(p.id)}
                disabled={p.isClosedCurrent} // ✅ langsung pakai flag, tidak dihitung ulang
              >
                {p.title}
                {p.isClosedCurrent ? " (Sudah dibuka)" : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <Label text="Judul" required />
        <p className="text-xs text-gray-400 mt-1">Masukkan judul PBL</p>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Masukkan judul karya"
          className={inputClass}
        />
      </div>

      <div>
        <Label text="Link Youtube" required />
        <p className="text-xs text-gray-400 mt-1">Masukkan link video demo</p>
        <input
          type="text"
          value={form.link}
          onChange={(e) => onChange("link", e.target.value)}
          placeholder="Masukkan link Youtube"
          className={inputClass}
        />
      </div>

      <div>
        <Label text="Deskripsi Karya" required />
        <p className="text-xs text-gray-400 mt-1">
          Sertakan deskripsi, nama tim PBL dan nama manager proyek.
        </p>
        <textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Masukkan deskripsi karya..."
          className={`${inputClass} h-[420px] resize-none`}
        />
      </div>
    </div>
  );
}
