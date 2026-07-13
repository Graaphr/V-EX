"use client";

import { useEffect, useState } from "react";
import { GetModelStan, GetStanTersedia } from "@/components/karya/apiKarya";

interface StanOption {
  id_model: number;
  nama_model: string;
}

interface Props {
  pameranId?: number;
  booth: string; // id_stan — dipakai untuk cari nomor urut (readOnly)
  modelStan: string; // id_model — dipakai untuk value select (edit)
  onChange: (value: string) => void; // mengubah modelStan
  error?: string;
  readOnly?: boolean;
}

const inputClass =
  "w-full p-2.5 px-3 rounded-lg border mt-1.5 focus:outline-none focus:ring-1 transition-all text-sm";

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p className="text-sm font-semibold">
      {text} {required && <span className="text-red-500">*</span>}
    </p>
  );
}

export default function DetailPreview({
  booth,
  modelStan,
  pameranId,
  onChange,
  error,
  readOnly,
}: Props) {
  const [modelList, setModelList] = useState<StanOption[]>([]);
  const [loadingModel, setLoadingModel] = useState(false);

  const [stanNomor, setStanNomor] = useState<number | null>(null);
  const [loadingNomor, setLoadingNomor] = useState(false);

  useEffect(() => {
    if (readOnly) return;

    const fetchModel = async () => {
      setLoadingModel(true);
      try {
        const res = await GetModelStan();
        setModelList(res.data ?? []);
      } catch (err) {
        console.error("Gagal memuat model stan:", err);
      } finally {
        setLoadingModel(false);
      }
    };

    fetchModel();
  }, [readOnly]);

  // Khusus readOnly: cari nomor urut stan berdasarkan pameranId + booth (id_stan)
  useEffect(() => {
    if (!readOnly || !pameranId || !booth) {
      setStanNomor(null);
      return;
    }

    const fetchStanNomor = async () => {
      setLoadingNomor(true);
      try {
        const res = await GetStanTersedia(pameranId);
        const list: { id: number; nomor: number }[] = res.stan ?? [];
        const found = list.find((s) => String(s.id) === String(booth));
        setStanNomor(found ? found.nomor : null);
      } catch (err) {
        console.error("Gagal memuat nomor stan:", err);
        setStanNomor(null);
      } finally {
        setLoadingNomor(false);
      }
    };

    fetchStanNomor();
  }, [readOnly, pameranId, booth]);

  // Select edit dicocokkan berdasarkan modelStan (id_model), BUKAN booth
  const selectedModel = modelList.find(
    (m) => String(m.id_model) === String(modelStan),
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-semibold mt-10 mb-1.5">
        Detail<span className="text-red-500">*</span>
      </p>

      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl w-full h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src={
            selectedModel
              ? `/image/img-${selectedModel.nama_model
                  .toLowerCase()
                  .replace(/\s+/g, "-")}.svg`
              : "/image/img-stan-a.svg"
          }
          alt="booth"
          className="h-full w-full object-contain p-4"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/image/img-stan-a.svg";
          }}
        />
      </div>

      <div>
        <Label text="Pilih Stan" required />
        <p className="text-xs text-gray-400 mt-1">
          Pilih tampilan stan untuk karya kamu
        </p>

        {readOnly ? (
          <div
            className={`${inputClass} border-gray-200 bg-gray-50 text-gray-700`}
          >
            {loadingNomor
              ? "Memuat..."
              : booth
                ? `Stan #${stanNomor ?? booth}`
                : "-"}
          </div>
        ) : loadingModel ? (
          <div className="mt-1.5 h-10 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <select
            value={modelStan ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} ${
              error
                ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:border-main-blue focus:ring-main-blue"
            }`}
          >
            <option value="" disabled>
              -- Pilih Model Stan --
            </option>
            {modelList.map((m) => (
              <option key={m.id_model} value={String(m.id_model)}>
                {m.nama_model}
              </option>
            ))}
          </select>
        )}

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}