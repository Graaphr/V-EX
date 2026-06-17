'use client';

import { useEffect, useState } from 'react';
import { GetStanTersedia } from '@/components/karya/apiKarya';

interface StanOption {
  id: number;
  model_stan: string;
}

interface Props {
  booth?: string;
  pameranId?: number;
  onChange: (value: string) => void;
  error?: string;
}

const inputClass = 'w-full p-2.5 px-3 rounded-lg border mt-1.5 focus:outline-none focus:ring-1 transition-all text-sm';

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p className="text-sm font-semibold">
      {text} {required && <span className="text-red-500">*</span>}
    </p>
  );
}

export default function DetailPreview({ booth, pameranId, onChange, error }: Props) {
  const [stanList, setStanList] = useState<StanOption[]>([]);
  const [loadingStan, setLoadingStan] = useState(false);

  const isValidPameranId = !!pameranId && pameranId > 0;

  useEffect(() => {
    if (!isValidPameranId) {
      setStanList([]);
      return;
    }

    const fetchStan = async () => {
      setLoadingStan(true);
      try {
        const res = await GetStanTersedia(pameranId as number);
        setStanList(res.stan ?? []);
      } catch (err) {
        console.error('Gagal memuat stan:', err);
      } finally {
        setLoadingStan(false);
      }
    };

    fetchStan();
  }, [pameranId, isValidPameranId]);

  const selectedStan = stanList.find((s) => String(s.id) === String(booth));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-semibold mt-10 mb-1.5">
        Detail<span className="text-red-500">*</span>
      </p>

      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl w-full h-[300px] flex items-center justify-center overflow-hidden">
        <img
          src={selectedStan ? `/image/${encodeURIComponent(selectedStan.model_stan)}` : '/image/img-stan1.svg'}
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

        {!isValidPameranId ? (
          <p className="mt-1.5 text-xs text-gray-400 italic">Pilih pameran terlebih dahulu</p>
        ) : loadingStan ? (
          <div className="mt-1.5 h-10 animate-pulse rounded-lg bg-gray-100" />
        ) : (
          <select
            value={booth ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} ${
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:border-main-blue focus:ring-main-blue'
            }`}
          >
            <option value="" disabled>
              -- Pilih Stan --
            </option>
            {stanList.map((s) => (
              <option key={s.id} value={String(s.id)}>
                Stan {s.id} — {s.model_stan}
              </option>
            ))}
          </select>
        )}

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
